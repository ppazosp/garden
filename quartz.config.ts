import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "ppazosp",
    pageTitleSuffix: " | garden.ppazosp.dev",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "garden.ppazosp.dev",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "published",
    theme: {
      fontOrigin: "local",
      cdnCaching: false,
      typography: {
        header: "Satoshi",
        body: "Satoshi",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#f5f2eb",
          lightgray: "#e8e4dc",
          gray: "#9a9a9a",
          darkgray: "#4a4a4a",
          dark: "#2c2c2c",
          secondary: "#5a5a5a",
          tertiary: "#7a7a7a",
          highlight: "rgba(0, 0, 0, 0.05)",
          textHighlight: "#f0e6c880",
        },
        darkMode: {
          light: "#1a1a1a",
          lightgray: "#2e2e2e",
          gray: "#7a7a7a",
          darkgray: "#c8c8c8",
          dark: "#e0e0e0",
          secondary: "#a0a0a0",
          tertiary: "#8a8a8a",
          highlight: "rgba(255, 255, 255, 0.05)",
          textHighlight: "#3a3a3a80",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Plugin.CustomOgImages(), // disabled: CustomOgImages fetches fonts remotely regardless of fontOrigin: "local"
    ],
  },
}

export default config
