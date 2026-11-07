// Forked from @quartz-community/explorer 1.0.0: line menu and chevron icons.
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import OverflowListFactory from "./OverflowList"
import { classNames } from "@quartz-community/utils"
import style from "./styles/explorer.scss"
// @ts-expect-error - Inline script loaded as text by esbuild plugin
import script from "./scripts/explorer.inline.ts"

interface FileTrieNode {
  slugSegment?: string
  slugSegments?: string[]
  displayName?: string
  isFolder: boolean
  data: Record<string, unknown> | null
  children: FileTrieNode[]
}

export interface ExplorerOptions {
  title?: string
  folderDefaultState: "collapsed" | "open"
  folderClickBehavior: "collapse" | "link"
  useSavedState: boolean
  sortFn?: (a: FileTrieNode, b: FileTrieNode) => number
  filterFn?: (node: FileTrieNode) => boolean
  mapFn?: (node: FileTrieNode) => FileTrieNode
  order?: Array<"filter" | "map" | "sort">
}

const defaultOptions: ExplorerOptions = {
  folderDefaultState: "collapsed",
  folderClickBehavior: "link",
  useSavedState: true,
  mapFn: (node: FileTrieNode) => {
    return node
  },
  sortFn: (a: FileTrieNode, b: FileTrieNode) => {
    if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
      return (a.displayName || "").localeCompare(b.displayName || "", undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }

    if (!a.isFolder && b.isFolder) {
      return 1
    }
    return -1
  },
  filterFn: (node: FileTrieNode) => node.slugSegment !== "tags",
  order: ["filter", "map", "sort"],
}

let numExplorers = 0

function concatenateResources(...resources: (string | undefined)[]): string {
  return resources.filter((r): r is string => !!r).join("\n")
}

export default ((userOpts?: Partial<ExplorerOptions>) => {
  const opts: ExplorerOptions = { ...defaultOptions, ...userOpts }
  const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory()

  const ExplorerComponent: QuartzComponent = (props: QuartzComponentProps) => {
    const displayClass = (props as { displayClass?: "mobile-only" | "desktop-only" }).displayClass
    const id = `explorer-${numExplorers++}`
    const title = opts.title ?? "Explorer"

    return (
      <div
        class={classNames(displayClass, "explorer", "nav-files-container")}
        data-behavior={opts.folderClickBehavior}
        data-collapsed={opts.folderDefaultState}
        data-savestate={opts.useSavedState}
        data-data-fns={JSON.stringify({
          order: opts.order,
          sortFn: opts.sortFn?.toString(),
          filterFn: opts.filterFn?.toString(),
          mapFn: opts.mapFn?.toString(),
        })}
      >
        <button
          type="button"
          class="explorer-toggle mobile-explorer hide-until-loaded"
          data-mobile={true}
          aria-controls={id}
          aria-label={title}
        >
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
            class="lucide-menu"
          >
            <path d="M4 5L16 5" />
            <path d="M4 12L20 12" />
            <path d="M4 19L12 19" />
          </svg>
          {/* shown instead of the menu icon while the mobile panel is open */}
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
            class="lucide-x"
          >
            <path d="M5 5L19 19" />
            <path d="M19 5L5 19" />
          </svg>
        </button>
        <button
          type="button"
          class="title-button explorer-toggle desktop-explorer"
          data-mobile={false}
          aria-expanded={true}
        >
          <h2>{title}</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
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
        <div id={id} class="explorer-content" aria-expanded={false} role="group">
          <p class="mobile-panel-title">{props.cfg?.pageTitle}</p>
          <OverflowList class="explorer-ul" />
        </div>
        <template id="template-file">
          <li>
            <a href="#" class="nav-file-title tree-item-self"></a>
          </li>
        </template>
        <template id="template-folder">
          <li>
            <div class="folder-container nav-folder-title tree-item-self">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="folder-icon nav-folder-collapse-indicator collapse-icon"
              >
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" />
              </svg>
              <div>
                <button class="folder-button">
                  <span class="folder-title"></span>
                </button>
              </div>
            </div>
            <div class="folder-outer">
              <ul class="content tree-item-children"></ul>
            </div>
          </li>
        </template>
      </div>
    )
  }

  ExplorerComponent.css = style
  ExplorerComponent.afterDOMLoaded = concatenateResources(script, overflowListAfterDOMLoaded)
  return ExplorerComponent
}) satisfies QuartzComponentConstructor
