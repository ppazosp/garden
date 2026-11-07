import fs from "fs"
import path from "path"
import type { Element, Root } from "hast"
import { visit } from "unist-util-visit"
import type { QuartzEmitterPlugin, QuartzTransformerPlugin } from "../quartz/plugins/types"
import type { FilePath } from "../quartz/util/path"

// Puts the linked site's favicon before every external link. Icons are fetched once per host
// at build time and served from /static/favicons, so readers never request a third party.

const dir = "static/favicons"
const icons = new Map<string, Promise<Buffer | null>>()

function fetchIcon(host: string): Promise<Buffer | null> {
  let icon = icons.get(host)
  if (!icon) {
    // Google answers 404 (with a generic globe) for sites without a favicon; those get none
    icon = fetch(`https://www.google.com/s2/favicons?domain=${host}&sz=64`, {
      signal: AbortSignal.timeout(5000),
    })
      .then(async (res) => (res.ok ? Buffer.from(await res.arrayBuffer()) : null))
      .catch(() => null)
    icons.set(host, icon)
  }
  return icon
}

// The icon already says "external", so the link loses crawl-links' arrow
// (set as a raw `class` property, not hast's `className`).
function dropArrow(link: Element) {
  link.children = link.children.filter(
    (child) => !(child.type === "element" && child.properties?.class === "external-icon"),
  )
}

// mailto: links have no site to take a favicon from
function envelope(): Element {
  const line = (d: string): Element => ({
    type: "element",
    tagName: "path",
    properties: { d },
    children: [],
  })
  return {
    type: "element",
    tagName: "svg",
    properties: {
      className: ["link-favicon"],
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ariaHidden: "true",
    },
    children: [line("M3 5h18v14H3z"), line("m3 6 9 7 9-7")],
  }
}

function hostOf(href: unknown): string | null {
  if (typeof href === "string" && href.startsWith("mailto:")) return "mailto"
  if (typeof href !== "string" || !/^https?:\/\//.test(href)) return null
  try {
    return new URL(href).hostname
  } catch {
    return null
  }
}

// Runs after crawl-links, which marks external links and appends its arrow icon.
export const LinkFavicons: QuartzTransformerPlugin = () => ({
  name: "LinkFavicons",
  htmlPlugins: () => [
    () => async (tree: Root) => {
      const links: [Element, string][] = []
      visit(tree, "element", (node) => {
        const classes = node.properties?.className
        const host = hostOf(node.properties?.href)
        if (node.tagName === "a" && host && Array.isArray(classes) && classes.includes("external")) {
          links.push([node, host])
        }
      })

      for (const [link, host] of links) {
        if (host === "mailto") {
          dropArrow(link)
          link.children.unshift(envelope())
          continue
        }
        if (!(await fetchIcon(host))) continue
        dropArrow(link)
        link.children.unshift({
          type: "element",
          tagName: "img",
          properties: {
            className: ["link-favicon"],
            src: `/${dir}/${host}.png`,
            alt: "",
            width: 16,
            height: 16,
            loading: "lazy",
            decoding: "async",
          },
          children: [],
        })
      }
    },
  ],
})

export const LinkFaviconImages: QuartzEmitterPlugin = () => ({
  name: "LinkFaviconImages",
  async *emit(ctx) {
    await fs.promises.mkdir(path.join(ctx.argv.output, dir), { recursive: true })
    for (const [host, icon] of icons) {
      const data = await icon
      if (!data) continue
      const dest = path.join(ctx.argv.output, dir, `${host}.png`) as FilePath
      await fs.promises.writeFile(dest, data)
      yield dest
    }
  },
})
