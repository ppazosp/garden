import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { classNames, resolveRelative } from "@quartz-community/utils"
import style from "./styles/related.scss"

// A post lists its related posts by hand in frontmatter, and they render as one quiet line
// under a separator at the end of the post ("Related: A · B"):
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
      <p class={classNames(displayClass, "related-posts")}>
        Related:{" "}
        {pages.map((page, i) => (
          <>
            {i > 0 && " · "}
            <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
              {(page.frontmatter?.title as string | undefined) ?? page.slug}
            </a>
          </>
        ))}
      </p>
    )
  }

  Related.css = style

  return Related
}) satisfies QuartzComponentConstructor
