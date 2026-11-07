import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { classNames, formatDate, resolveRelative } from "@quartz-community/utils"
import style from "./styles/recentCards.scss"

interface Options {
  limit: number
  // slugs that aren't posts (the home page, project pages)
  exclude: string[]
}

const defaultOptions: Options = { limit: 3, exclude: ["index"] }

type Page = QuartzComponentProps["allFiles"][number]

const published = (page: Page) => page.dates?.published ?? page.dates?.created

// The latest posts as a row of cards, so they're the first thing on the home page.
export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }
  const RecentCards: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const posts = allFiles
      .filter(
        (page) =>
          page.slug &&
          !opts.exclude.includes(page.slug) &&
          !page.slug.startsWith("tags/") &&
          published(page),
      )
      .sort((a, b) => published(b)!.getTime() - published(a)!.getTime())
      .slice(0, opts.limit)
    if (posts.length === 0) return null

    return (
      <nav class={classNames(displayClass, "recent-cards")} aria-label="Recent posts">
        {posts.map((page) => {
          const date = published(page)!
          return (
            <a class="recent-card" href={resolveRelative(fileData.slug!, page.slug!)}>
              <time datetime={date.toISOString()}>{formatDate(date, cfg.locale)}</time>
              <span class="recent-card-title">{page.frontmatter?.title}</span>
              {page.description && <span class="recent-card-desc">{page.description}</span>}
            </a>
          )
        })}
      </nav>
    )
  }

  RecentCards.css = style
  return RecentCards
}) satisfies QuartzComponentConstructor<Options>
