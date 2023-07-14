import { defineConfig } from "vite";
import { resolve } from "path";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from 'unplugin-auto-import/vite'

const isH5 = process.env.UNI_PLATFORM === "h5";
const isApp = process.env.UNI_PLATFORM === "app";
const WeappTailwindcssDisabled = isH5 || isApp;

import { UnifiedViteWeappTailwindcssPlugin as uvtw } from "weapp-tailwindcss/vite";

// vite 插件配置
const vitePlugins = [
  uni(),
  uvtw({
    disabled: WeappTailwindcssDisabled,
  }),
  AutoImport({
    imports: ["vue", "uni-app", "pinia"],
    dts: "./src/auto-imports.d.ts",
    eslintrc: {
      enabled: true,
    },
  }),
];

// postcss 插件配置
const postcssPlugins = [require("autoprefixer")(), require("tailwindcss")()];
if (!WeappTailwindcssDisabled) {
  postcssPlugins.push(
    require("postcss-rem-to-responsive-pixel")({
      rootValue: 32,
      propList: ["*"],
      transformUnit: "rpx",
    })
  );
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: vitePlugins,
  resolve: {
    alias: {
      "@": resolve(__dirname, "/src"),
    },
  },
  // 假如 postcss.config.js 不起作用，请使用内联 postcss Latset
  css: {
    postcss: {
      plugins: postcssPlugins,
    },
  }
});
