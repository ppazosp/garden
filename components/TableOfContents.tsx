// Forked from @quartz-community/table-of-contents 1.0.0: chevron icon, honours displayClass
// (so it can be desktop-only), and drops the unused legacy layout.
import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types"
import { classNames } from "@quartz-community/utils"
import style from "./styles/toc.scss"
// @ts-expect-error - inline script imported as string by esbuild loader
import script from "./scripts/toc.inline.ts"
import OverflowListFactory from "./OverflowList"

interface TocEntry {
  slug: string
  depth: number
  text: string
}

let numTocs = 0
export default (() => {
  const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory()
  const TableOfContents: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const { toc, collapseToc } = fileData as { toc?: TocEntry[]; collapseToc?: boolean }
    if (!toc) {
      return null
    }

    const id = `toc-${numTocs++}`
    return (
      <div class={classNames(displayClass, "toc")}>
        <button
          type="button"
          class={collapseToc ? "collapsed toc-header" : "toc-header"}
          aria-controls={id}
          aria-expanded={!collapseToc}
        >
          <h3>Table of Contents</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="fold"
          >
            <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" />
          </svg>
        </button>
        <OverflowList id={id} class={collapseToc ? "collapsed toc-content" : "toc-content"}>
          {toc.map((entry) => (
            <li key={entry.slug} class={`depth-${entry.depth}`}>
              <a href={`#${entry.slug}`} data-for={entry.slug}>
                {entry.text}
              </a>
            </li>
          ))}
        </OverflowList>
      </div>
    )
  }

  TableOfContents.css = style
  TableOfContents.afterDOMLoaded = script + "\n" + overflowListAfterDOMLoaded

  return TableOfContents
}) satisfies QuartzComponentConstructor
