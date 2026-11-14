import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { classNames, resolveRelative } from "@quartz-community/utils"
import style from "./styles/related.scss"

// A post lists its related posts by hand in frontmatter, and they render as a short list after
// the body:
//
//   related:
//     - leave-no-state-behind
//     - "[[anatomy-of-a-self-improving-agent]]"   (wikilink form also works, for Obsidian)
//
// An entry that matches no page fails the build, so a renamed post can't leave a dead link.

type Page = QuartzComponentProps["allFiles"][number]

/** "[[posts/foo|Foo]]", "foo.md" and "foo" all name the page whose slug ends in "foo". */
function entrySlug(entry: string): string {
  return entry
    .trim()
    .replace(/^\[\[|\]\]$/g, "")
    .split("|")[0]
    .replace(/\.md$/, "")
    .trim()
}

function findPage(allFiles: Page[], wanted: string): Page | undefined {
  return (
    allFiles.find((page) => page.slug === wanted) ??
    allFiles.find((page) => page.slug?.endsWith(`/${wanted}`))
  )
}

// "Aug 17, 2026", the same format as the explorer. Uses the date Quartz resolved (frontmatter
// `published` or `date`, else `created`), read as a calendar date like the explorer does.
function formatPostDate(page: Page): string | null {
  const date = page.dates?.published ?? page.dates?.created
  if (!date) return null
  const d = new Date(date)
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toLocaleDateString(
    "en-US",
    { timeZone: "UTC", year: "numeric", month: "short", day: "2-digit" },
  )
}

export default (() => {
  const Related: QuartzComponent = ({ fileData, allFiles, displayClass }: QuartzComponentProps) => {
    const listed = (fileData.frontmatter as { related?: unknown } | undefined)?.related
    const entries = (Array.isArray(listed) ? listed : listed ? [listed] : []).map((e) =>
      entrySlug(String(e)),
    )
    if (entries.length === 0) return null

    const pages = entries.map((wanted) => {
      const page = findPage(allFiles, wanted)
      if (!page) {
        throw new Error(`Related: "${wanted}" in ${fileData.slug} does not match any page`)
      }
      return page
    })

    return (
      <section class={classNames(displayClass, "related-posts")}>
        <h3>Related posts</h3>
        <ul>
          {pages.map((page) => {
            const frontmatter = (page.frontmatter ?? {}) as Record<string, unknown>
            const date = formatPostDate(page)
            const description = (frontmatter.description as string | undefined) ?? page.description
            return (
              <li>
                <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                  <span class="related-title">{(frontmatter.title as string) ?? page.slug}</span>
                  {date && <time class="related-date">{date}</time>}
                </a>
                {description && <p class="related-description">{description}</p>}
              </li>
            )
          })}
        </ul>
      </section>
    )
  }

  Related.css = style

  return Related
}) satisfies QuartzComponentConstructor
