import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs-extra";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-extension-files",
      buildStart: () => {
        // Ensure dist directory exists
        fs.ensureDirSync("dist");
      },
      writeBundle: () => {
        // Move popup.html to dist/
        const popupSrc = "dist/src/popup.html";
        const popupDest = "dist/popup.html";
        if (fs.existsSync(popupSrc)) {
          fs.moveSync(popupSrc, popupDest, { overwrite: true });
          fs.removeSync("dist/src");
          console.log("Moved popup.html to dist and removed dist/src");
        }

        // Copy manifest.json from src
        fs.copyFileSync("src/manifest.json", "dist/manifest.json");

        // Copy icons directory from src/assets/icons to dist/assets/icons
        if (fs.existsSync("src/assets/icons")) {
          fs.ensureDirSync("dist/assets/icons");
          fs.copySync("src/assets/icons", "dist/assets/icons", {
            overwrite: true,
          });
        } else {
          console.warn("src/assets/icons directory not found, skipping...");
        }

        // Copy _locales directory
        if (fs.existsSync("_locales")) {
          fs.copySync("_locales", "dist/_locales", { overwrite: true });
        } else {
          console.warn("_locales directory not found, skipping...");
        }

        // Copy utils/script.js to dist/utils/script.js
        if (fs.existsSync("src/utils/script.js")) {
          fs.ensureDirSync("dist/utils");
          fs.copyFileSync("src/utils/script.js", "dist/utils/script.js");
        } else {
          console.warn("src/utils/script.js not found, skipping...");
        }

        // Cleanup: Remove dist/src if it exists
        if (fs.existsSync("dist/src")) {
          fs.removeSync("dist/src");
          console.log("Removed dist/src directory");
        }

        console.log("Copied manifest, icons, locales, and utils to dist.");
      },
    },
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup.html"),
        background: resolve(__dirname, "src/background/background.js"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@utils": resolve(__dirname, "src/utils"),
      "@types": resolve(__dirname, "src/types"),
      "@styles": resolve(__dirname, "src/styles"),
      "@assets": resolve(__dirname, "src/assets"),
    },
  },
  publicDir: "src/assets",
  copyPublicDir: true,
});
