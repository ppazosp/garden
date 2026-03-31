const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const currentTheme = localStorage.getItem("theme") ?? userPref
document.documentElement.setAttribute("saved-theme", currentTheme)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const switchTheme = () => {
    const newTheme =
      document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  const themeChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? "dark" : "light"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
    const handleClick = (e: Event) => {
      const mouseEvent = e as MouseEvent
      const applyTheme = () => switchTheme()

      if (!document.startViewTransition) {
        applyTheme()
        return
      }

      const rect = (mouseEvent.currentTarget as HTMLElement).getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      document.documentElement.style.setProperty("--x", `${x}px`)
      document.documentElement.style.setProperty("--y", `${y}px`)
      document.documentElement.style.setProperty("--end-radius", `${endRadius}px`)

      const newTheme =
        document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
      document.documentElement.setAttribute(
        "data-theme-transition",
        newTheme === "dark" ? "to-dark" : "to-light",
      )

      document.startViewTransition(() => applyTheme())
    }

    darkmodeButton.addEventListener("click", handleClick)
    window.addCleanup(() => darkmodeButton.removeEventListener("click", handleClick))
  }

  // Listen for changes in prefers-color-scheme
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))
})
