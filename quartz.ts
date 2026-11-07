import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import type { FullPageLayout } from "./quartz/cfg"
import type { BuildCtx } from "./quartz/util/ctx"
import type { ProcessedContent } from "./quartz/plugins/vfile"
import * as Component from "./quartz/components"
import * as Plugin from "./.quartz/plugins"
import { TableOfContentsTransformer } from "@quartz-community/table-of-contents"
import Banner from "./components/Banner"
import { BannerImages } from "./components/BannerImages"
import Breadcrumbs from "./components/Breadcrumbs"
import Darkmode from "./components/Darkmode"
import Explorer from "./components/Explorer"
import Footer from "./components/Footer"
import { FontPreload } from "./components/FontPreload"
import Graph from "./components/Graph"
import RecentCards from "./components/RecentCards"
import { LinkFaviconImages, LinkFavicons } from "./components/LinkFavicons"
import ReaderMode from "./components/ReaderMode"
import Search from "./components/Search"
import TableOfContents from "./components/TableOfContents"

// The page layout lives here rather than in quartz.config.yaml because most of it uses the
// forked components in ./components (own icons, theme-switch animation).

// One instance per component, shared across layouts: each instance ships its own client
// script, and two explorers or TOCs would each bind the same toggle and cancel out.
const search = Search()
const darkmode = Darkmode()
const explorer = Explorer()

const left = (withReaderMode: boolean) => [
  Plugin.PageTitle(),
  Component.MobileOnly(Plugin.Spacer()),
  Component.Flex({
    components: [
      { Component: search, grow: true },
      { Component: darkmode },
      ...(withReaderMode ? [{ Component: ReaderMode() }] : []),
    ],
  }),
  explorer,
]

const footer = [Footer({ links: {} })]

// pages that aren't posts: kept out of the recent-post cards
const notPosts = ["index", "agrex", "gitisle"]

const content: Partial<FullPageLayout> = {
  beforeBody: [
    Banner(),
    Component.ConditionalRender({
      component: Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: RecentCards({ limit: 3, exclude: notPosts }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Plugin.ArticleTitle(),
    Plugin.ContentMeta(),
    Plugin.TagList(),
  ],
  left: left(true),
  right: [Graph(), Component.DesktopOnly(TableOfContents()), Plugin.Backlinks()],
  afterBody: [],
  footer,
}

// folder and tag listings
const list: Partial<FullPageLayout> = {
  beforeBody: [Banner(), Plugin.ArticleTitle(), Plugin.ContentMeta()],
  left: left(false),
  right: [],
  afterBody: [],
  footer,
}

// Quartz 5 renders 404 in its bare "minimal" frame; keep the centred column instead.
const notFound: Partial<FullPageLayout> = {
  frame: "default",
  beforeBody: [],
  left: [],
  right: [],
  afterBody: [],
  footer,
}

const layoutOverrides = { byPageType: { content, folder: list, tag: list, "404": notFound } }

const config = await loadQuartzConfig(undefined, layoutOverrides)

// The table-of-contents plugin is not in quartz.config.yaml: a YAML plugin registers its stock
// component, and Quartz ships every registered component's script, which would double-bind the
// forked TOC. Only its transformer is needed, in its usual slot right after GFM.
const gfm = config.plugins.transformers.findIndex((t) => t.name === "GitHubFlavoredMarkdown")
if (gfm === -1) throw new Error("quartz.ts: GitHubFlavoredMarkdown transformer not found")
config.plugins.transformers.splice(gfm + 1, 0, TableOfContentsTransformer())

// Favicons go on links once crawl-links has marked which ones are external.
const crawlLinks = config.plugins.transformers.findIndex((t) => t.name === "LinkProcessing")
if (crawlLinks === -1) throw new Error("quartz.ts: LinkProcessing transformer not found")
config.plugins.transformers.splice(crawlLinks + 1, 0, LinkFavicons())

config.plugins.emitters.push(BannerImages(), FontPreload(), LinkFaviconImages())

// Quartz 5 hands generated pages (tag listings) to ContentIndex too, dated "now", so they
// crowded posts out of the RSS feed and showed up in search. Index real notes only, as in v4.
const contentIndex = config.plugins.emitters.find((e) => e.name === "ContentIndex")
if (!contentIndex) throw new Error("quartz.ts: ContentIndex emitter not found")
const { emit, partialEmit } = contentIndex
const realPages = (ctx: BuildCtx, content: ProcessedContent[]) =>
  content.filter((entry) => !ctx.virtualPages.includes(entry))
contentIndex.emit = (ctx, content, resources) =>
  emit.call(contentIndex, ctx, realPages(ctx, content), resources)
if (partialEmit) {
  contentIndex.partialEmit = (ctx, content, resources, changes) =>
    partialEmit.call(contentIndex, ctx, realPages(ctx, content), resources, changes)
}

export default config
export const layout = await loadQuartzLayout(layoutOverrides)
