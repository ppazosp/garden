import { h } from "preact"
import type { QuartzEmitterPlugin } from "../quartz/plugins/types"

// Satoshi is self-hosted and only discovered once the stylesheet is parsed; preloading the
// upright face lets text render in it sooner. The italic face stays lazy (few pages use it).
export const FontPreload: QuartzEmitterPlugin = () => ({
  name: "FontPreload",
  async *emit() {},
  externalResources: () => ({
    additionalHead: [
      h("link", {
        rel: "preload",
        href: "/static/fonts/Satoshi-Variable.woff2",
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous",
      }),
    ],
  }),
})
