// Forked from @quartz-community/search 1.0.0: line search icon.
import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types"
import { classNames } from "@quartz-community/utils"
import style from "./styles/search.scss"
// @ts-expect-error - inline script imported as string by esbuild loader
import script from "./scripts/search.inline.ts"

export type SearchField = "title" | "content" | "tags"

export interface SearchOptions {
  enablePreview: boolean
  fieldPriority: SearchField[]
}

const defaultOptions: SearchOptions = {
  enablePreview: true,
  fieldPriority: ["title", "content", "tags"],
}

export default ((userOpts?: Partial<SearchOptions>) => {
  const Search: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }
    const searchPlaceholder = "Search for something..."

    return (
      <div class={classNames(displayClass, "search")}>
        <button class="search-button" aria-label="Search" aria-expanded="false">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <title>Search</title>
            <g class="search-path" fill="none">
              <path
                d="M17 17L21 21"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
          <p>Search</p>
        </button>
        <div class="search-container">
          <div class="search-space">
            <input
              autocomplete="off"
              class="search-bar"
              name="search"
              type="text"
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
            />
            <div
              class="search-layout"
              data-preview={opts.enablePreview}
              data-field-priority={JSON.stringify(opts.fieldPriority)}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  Search.afterDOMLoaded = script
  Search.css = style

  return Search
}) satisfies QuartzComponentConstructor
