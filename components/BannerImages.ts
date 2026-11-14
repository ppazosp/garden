import fs from "fs"
import path from "path"
import sharp from "sharp"
import type { QuartzEmitterPlugin } from "../quartz/plugins/types"
import type { FilePath } from "../quartz/util/path"
import { bannerOgVariant, bannerUrl, bannerVariant, bannerWidths, ogImageSize } from "./Banner"

// Writes the resized copies the Banner component offers in its srcset, so a full-size banner
// (~400KB) is only downloaded by screens that need it, plus the cropped JPEG that Head uses as
// the page's og:image.
export const BannerImages: QuartzEmitterPlugin = () => ({
  name: "BannerImages",
  async *emit(ctx, content) {
    const urls = new Set<string>()
    for (const [, file] of content) {
      const url = bannerUrl(file.data.frontmatter as { banner?: string } | undefined)
      if (url) urls.add(url)
    }

    for (const url of urls) {
      // /static/* comes from quartz/static, anything else from the content folder
      const source = url.startsWith("/static/")
        ? path.join("quartz", url)
        : path.join(ctx.argv.directory, url)
      if (bannerVariant(url, bannerWidths[0]) === null || !fs.existsSync(source)) continue

      for (const width of bannerWidths) {
        const dest = path.join(ctx.argv.output, bannerVariant(url, width)!) as FilePath
        await fs.promises.mkdir(path.dirname(dest), { recursive: true })
        await sharp(source).resize({ width }).webp({ quality: 75 }).toFile(dest)
        yield dest
      }

      const og = path.join(ctx.argv.output, bannerOgVariant(url)!) as FilePath
      await sharp(source)
        .resize({ ...ogImageSize, fit: "cover", position: "centre" })
        .flatten({ background: "#f5f2eb" })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(og)
      yield og
    }
  },
})
