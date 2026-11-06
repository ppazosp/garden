// Forked from @quartz-community/breadcrumbs 1.0.0: chevron icon instead of the text spacer.
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { classNames } from "@quartz-community/utils"
import { resolveRelative, simplifySlug } from "@quartz-community/utils"
import { FileTrieNode } from "../quartz/util/fileTrie"
import type { FullSlug } from "../quartz/util/path"
import style from "./styles/breadcrumbs.scss"

type CrumbData = {
  displayName: string
  path: string
}

export interface BreadcrumbOptions {
  /** Name of first crumb */
  rootName: string
  /** Whether to display the current page in the breadcrumbs */
  showCurrentPage: boolean
}

const defaultOptions: BreadcrumbOptions = {
  rootName: "Home",
  showCurrentPage: true,
}

type TrieData = { slug: string; title: string; filePath: string }

function trieFromAllFiles(allFiles: QuartzComponentProps["allFiles"]): FileTrieNode<TrieData> {
  const trie = new FileTrieNode<TrieData>([])
  for (const file of allFiles as Array<{
    slug?: string
    filePath?: string
    frontmatter?: { title?: string }
  }>) {
    if (file.frontmatter) {
      trie.add({
        slug: file.slug!,
        title: file.frontmatter.title ?? "",
        // virtual pages (tags, folders) have no source file
        filePath: file.filePath ?? file.slug!,
      })
    }
  }
  return trie
}

export default ((opts?: Partial<BreadcrumbOptions>) => {
  const options: BreadcrumbOptions = { ...defaultOptions, ...opts }
  const Breadcrumbs: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
    ctx,
  }: QuartzComponentProps) => {
    const typedCtx = (ctx ?? {}) as { breadcrumbTrie?: FileTrieNode<TrieData> }
    typedCtx.breadcrumbTrie ??= trieFromAllFiles(allFiles)
    const slug = fileData.slug as string
    const pathNodes = typedCtx.breadcrumbTrie.ancestryChain(slug.split("/"))
    if (!pathNodes) {
      return null
    }

    const crumbs: CrumbData[] = pathNodes.map((node, idx) => ({
      displayName: idx === 0 ? options.rootName : node.displayName,
      path:
        idx === pathNodes.length - 1
          ? ""
          : resolveRelative(slug as FullSlug, simplifySlug(node.slug)),
    }))

    if (!options.showCurrentPage) {
      crumbs.pop()
    }

    return (
      <nav class={classNames(displayClass, "breadcrumb-container")} aria-label="breadcrumbs">
        {crumbs.map((crumb, index) => (
          <div class="breadcrumb-element">
            <a href={crumb.path}>{crumb.displayName}</a>
            {index !== crumbs.length - 1 && (
              <svg
                class="breadcrumb-spacer"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            )}
          </div>
        ))}
      </nav>
    )
  }
  Breadcrumbs.css = style

  return Breadcrumbs
}) satisfies QuartzComponentConstructor
