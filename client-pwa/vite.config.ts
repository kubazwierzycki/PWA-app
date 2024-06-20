import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/xmlapi2": "https://boardgamegeek.com",
        },
    },
    plugins: [
        react(),
        VitePWA({
            manifest: {
                // manifest settings
            },
            workbox: {
                // workbox settings
            },
        }),
    ],
});
