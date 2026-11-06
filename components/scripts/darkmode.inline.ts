const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const currentTheme = localStorage.getItem("theme") ?? userPref
document.documentElement.setAttribute("saved-theme", currentTheme)

const syncBodyThemeClass = (theme: "light" | "dark") => {
  document.body?.classList.remove("theme-dark", "theme-light")
  document.body?.classList.add(`theme-${theme}`)
}

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

const setupDarkmode = () => {
  // Sync body class with current theme on setup (runs after DOM is ready)
  const currentSavedTheme =
    (document.documentElement.getAttribute("saved-theme") as "light" | "dark") ?? "light"
  syncBodyThemeClass(currentSavedTheme)

  const switchTheme = () => {
    const newTheme =
      document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    syncBodyThemeClass(newTheme)
    emitThemeChangeEvent(newTheme)
  }

  const themeChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? "dark" : "light"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    syncBodyThemeClass(newTheme)
    emitThemeChangeEvent(newTheme)
  }

  // Reveal the new theme as a circle growing from (or shrinking into) the toggle.
  const handleClick = (e: Event) => {
    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const root = document.documentElement
    root.style.setProperty("--x", `${x}px`)
    root.style.setProperty("--y", `${y}px`)
    root.style.setProperty("--end-radius", `${endRadius}px`)
    const newTheme = root.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    root.setAttribute("data-theme-transition", newTheme === "dark" ? "to-dark" : "to-light")

    document.startViewTransition(switchTheme)
  }

  for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
    darkmodeButton.addEventListener("click", handleClick)
    window.addCleanup(() => darkmodeButton.removeEventListener("click", handleClick))
  }

  // Listen for changes in prefers-color-scheme
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))
}

document.addEventListener("nav", setupDarkmode)
document.addEventListener("render", setupDarkmode)
