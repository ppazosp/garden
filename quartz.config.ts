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
          light: "#f7f8f3",
          lightgray: "#e0e3d0",
          gray: "#a4ad7c",
          darkgray: "#4a5030",
          dark: "#292c19",
          secondary: "#5c643a",
          tertiary: "#757f4a",
          highlight: "rgba(117, 127, 74, 0.1)",
          textHighlight: "#cdd2b380",
        },
        darkMode: {
          light: "#1a1d0f",
          lightgray: "#343820",
          gray: "#757f4a",
          darkgray: "#cdd2b3",
          dark: "#f7f8f3",
          secondary: "#a4ad7c",
          tertiary: "#757f4a",
          highlight: "rgba(117, 127, 74, 0.15)",
          textHighlight: "#4a503080",
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
