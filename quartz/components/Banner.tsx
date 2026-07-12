import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/banner.scss"

interface BannerOptions {
  // site-absolute path used when a page has no `banner` frontmatter; null disables the fallback
  defaultBanner: string | null
}

const defaultOptions: BannerOptions = {
  defaultBanner: "/static/adam.jpg",
}

export default ((userOpts?: Partial<BannerOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }
  const Banner: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const banner = fileData.frontmatter?.banner ?? opts.defaultBanner
    if (!banner || banner === "none") {
      return null
    }
    const src = banner.startsWith("/") || banner.startsWith("http") ? banner : `/${banner}`
    return <img class={classNames(displayClass, "page-banner")} src={src} alt="" />
  }

  Banner.css = style

  return Banner
}) satisfies QuartzComponentConstructor
