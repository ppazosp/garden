import micromorph from "micromorph"
import { FullSlug, RelativeURL, getFullSlug, normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./util"

// adapted from `micromorph`
// https://github.com/natemoo-re/micromorph
const NODE_TYPE_ELEMENT = 1
let announcer = document.createElement("route-announcer")
const isElement = (target: EventTarget | null): target is Element =>
  (target as Node)?.nodeType === NODE_TYPE_ELEMENT
const isLocalUrl = (href: string) => {
  try {
    const url = new URL(href)
    if (window.location.origin === url.origin) {
      return true
    }
  } catch (e) {}
  return false
}

const isSamePage = (url: URL): boolean => {
  const sameOrigin = url.origin === window.location.origin
  const samePath = url.pathname === window.location.pathname
  return sameOrigin && samePath
}

const getOpts = ({ target }: Event): { url: URL; scroll?: boolean } | undefined => {
  if (!isElement(target)) return
  if (target.attributes.getNamedItem("target")?.value === "_blank") return
  const a = target.closest("a")
  if (!a) return
  if ("routerIgnore" in a.dataset) return
  const { href } = a
  if (!isLocalUrl(href)) return
  return { url: new URL(href), scroll: "routerNoscroll" in a.dataset ? false : undefined }
}

function notifyNav(url: FullSlug) {
  const event: CustomEventMap["nav"] = new CustomEvent("nav", { detail: { url } })
  document.dispatchEvent(event)
}

const cleanupFns: Set<(...args: any[]) => void> = new Set()
window.addCleanup = (fn) => cleanupFns.add(fn)

function startLoading() {
  document.querySelector(".navigation-progress")?.remove()
  const loadingBar = document.createElement("div")
  loadingBar.className = "navigation-progress"
  loadingBar.style.width = "0"
  document.body.prepend(loadingBar)

  setTimeout(() => {
    loadingBar.style.width = "80%"
  }, 100)
}

function stopLoading() {
  const loadingBar = document.querySelector(".navigation-progress")
  if (loadingBar) {
    loadingBar.remove()
  }
}

// garden: once the next page is in, fade the old article out, swap, then fade the new one in.
// Text and banner fade together, but the banner only when the image actually changes; old and
// new content are never on screen together. Plain CSS transitions on .center (custom.scss), so
// every browser runs them the same.
const FADE_OUT_MS = 90
function fadeOut(next: Document): Promise<void> {
  const center = document.querySelector(".center")
  if (!center || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return Promise.resolve()
  }
  const banner = (root: Document | Element) =>
    root.querySelector(".page-banner")?.getAttribute("src")
  center.classList.add("nav-out")
  if (banner(center) !== banner(next)) center.classList.add("nav-banner")
  // the fetched page arrives faded too, so its content starts invisible
  next.querySelector(".center")?.classList.add(...center.classList)
  // a little past the transition, so nothing is swapped while still faintly visible
  return new Promise((resolve) => setTimeout(resolve, FADE_OUT_MS + 30))
}

function fadeIn() {
  // two frames, so the new content is painted at opacity 0 before it transitions in
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      document.querySelector(".center")?.classList.remove("nav-out", "nav-banner"),
    ),
  )
}

// garden: start loading a page when a link to it is hovered or touched, so the fade can start
// as soon as it's clicked. Each prefetch is used by one navigation at most.
const prefetched = new Map<string, Promise<string | undefined>>()
const pageKey = (url: URL) => url.origin + url.pathname + url.search

function loadPage(url: URL): Promise<string | undefined> {
  const key = pageKey(url)
  const pending = prefetched.get(key)
  prefetched.delete(key)
  return (
    pending ??
    fetchCanonical(url)
      .then((res) =>
        res.headers.get("content-type")?.startsWith("text/html") ? res.text() : undefined,
      )
      .catch(() => undefined)
  )
}

function prefetch(event: Event) {
  const link = (event.target as Element | null)?.closest?.("a")
  if (!link || link.target || link.hasAttribute("download")) return
  const url = new URL(link.href, window.location.href)
  if (url.origin !== window.location.origin || isSamePage(url)) return
  const key = pageKey(url)
  if (!prefetched.has(key)) prefetched.set(key, loadPage(url))
}

let isNavigating = false
let p: DOMParser
async function _navigate(url: URL, isBack: boolean = false) {
  isNavigating = true
  startLoading()
  p = p || new DOMParser()
  const contents = await loadPage(url)
  if (!contents) {
    window.location.assign(url)
    return
  }

  const html = p.parseFromString(contents, "text/html")
  await fadeOut(html)

  // notify about to nav
  const event: CustomEventMap["prenav"] = new CustomEvent("prenav", { detail: {} })
  document.dispatchEvent(event)

  // cleanup old
  cleanupFns.forEach((fn) => fn())
  cleanupFns.clear()

  normalizeRelativeURLs(html, url)

  let title = html.querySelector("title")?.textContent
  if (title) {
    document.title = title
  } else {
    const h1 = document.querySelector("h1")
    title = h1?.innerText ?? h1?.textContent ?? url.pathname
  }
  if (announcer.textContent !== title) {
    announcer.textContent = title
  }
  announcer.dataset.persist = ""
  html.body.appendChild(announcer)

  // garden: the fetched page has the explorer as the server renders it: list empty (it's built
  // client-side) and not collapsed. Carry the current list and open/closed state over, or the
  // menu blinks empty, and on narrow screens slides open and shut, on every navigation.
  const oldExplorers = document.querySelectorAll(".explorer")
  html.querySelectorAll(".explorer").forEach((explorer, i) => {
    const old = oldExplorers[i]
    if (!old) return
    explorer.classList.toggle("collapsed", old.classList.contains("collapsed"))
    const expanded = old.getAttribute("aria-expanded")
    if (expanded !== null) explorer.setAttribute("aria-expanded", expanded)
    const ul = explorer.querySelector(".explorer-ul")
    const oldUl = old.querySelector(".explorer-ul")
    if (ul && oldUl) ul.replaceChildren(...[...oldUl.childNodes].map((n) => n.cloneNode(true)))
  })

  document.querySelector(".navigation-progress")?.remove()
  micromorph(document.body, html.body)

  // scroll into place and add history
  if (!isBack) {
    if (url.hash) {
      const el = document.getElementById(decodeURIComponent(url.hash.substring(1)))
      el?.scrollIntoView()
    } else {
      window.scrollTo({ top: 0 })
    }
  }
  fadeIn()

  // now, patch head, re-executing scripts
  const elementsToRemove = document.head.querySelectorAll(":not([data-persist])")
  elementsToRemove.forEach((el) => el.remove())
  const elementsToAdd = html.head.querySelectorAll(":not([data-persist])")
  elementsToAdd.forEach((el) => document.head.appendChild(el))

  // delay setting the url until now
  // at this point everything is loaded so changing the url should resolve to the correct addresses
  if (!isBack) {
    history.pushState({}, "", url)
  }

  notifyNav(getFullSlug(window))
  delete announcer.dataset.persist
}

async function navigate(url: URL, isBack: boolean = false) {
  if (isNavigating) return
  isNavigating = true
  try {
    await _navigate(url, isBack)
  } catch (e) {
    console.error(e)
    window.location.assign(url)
  } finally {
    stopLoading()
    isNavigating = false
  }
}

window.spaNavigate = navigate

function createRouter() {
  if (typeof window !== "undefined") {
    window.addEventListener("click", async (event) => {
      const { url } = getOpts(event) ?? {}
      // dont hijack behaviour, just let browser act normally
      if (!url || event.ctrlKey || event.metaKey) return
      event.preventDefault()

      if (isSamePage(url) && url.hash) {
        const el = document.getElementById(decodeURIComponent(url.hash.substring(1)))
        el?.scrollIntoView()
        history.pushState({}, "", url)
        return
      }

      navigate(url, false)
    })

    window.addEventListener("pointerover", prefetch, { passive: true })
    window.addEventListener("touchstart", prefetch, { passive: true })

    window.addEventListener("popstate", (event) => {
      const { url } = getOpts(event) ?? {}
      if (window.location.hash && window.location.pathname === url?.pathname) return
      navigate(new URL(window.location.toString()), true)
      return
    })
  }

  return new (class Router {
    go(pathname: RelativeURL) {
      const url = new URL(pathname, window.location.toString())
      return navigate(url, false)
    }

    back() {
      return window.history.back()
    }

    forward() {
      return window.history.forward()
    }
  })()
}

createRouter()
notifyNav(getFullSlug(window))

if (!customElements.get("route-announcer")) {
  const attrs = {
    "aria-live": "assertive",
    "aria-atomic": "true",
    style:
      "position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px",
  }

  customElements.define(
    "route-announcer",
    class RouteAnnouncer extends HTMLElement {
      constructor() {
        super()
      }
      connectedCallback() {
        for (const [key, value] of Object.entries(attrs)) {
          this.setAttribute(key, value)
        }
      }
    },
  )
}
