import { defineConfig } from "vite";
import minifyHTML from "rollup-plugin-minify-html-literals";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    (minifyHTML as any).default(),
    // visualizer(), // last
  ],
  css: {
    preprocessorOptions: {
      less: {},
    },
  },
  build: {
    lib: {
      entry: "src/main.ts", // TS 入口文件
      name: "TheLargeDict", // 全局变量名
      formats: ["iife"], // 输出 IIFE 格式
      fileName: () => `the_large_dict.js`,
    },
  },
  dev: {},
});
