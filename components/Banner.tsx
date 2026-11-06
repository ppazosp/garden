import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { classNames } from "@quartz-community/utils"
import style from "./styles/banner.scss"

interface BannerOptions {
  // site-absolute path used when a page has no `banner` frontmatter; null disables the fallback
  defaultBanner: string | null
}

const defaultOptions: BannerOptions = {
  defaultBanner: "/static/library.webp",
}

export default ((userOpts?: Partial<BannerOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }
  const Banner: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const frontmatter = fileData.frontmatter as { banner?: string } | undefined
    const banner = frontmatter?.banner ?? opts.defaultBanner
    if (!banner || banner === "none") {
      return null
    }
    const src = banner.startsWith("/") || banner.startsWith("http") ? banner : `/${banner}`
    return <img class={classNames(displayClass, "page-banner")} src={src} alt="" />
  }

  Banner.css = style

  return Banner
}) satisfies QuartzComponentConstructor
