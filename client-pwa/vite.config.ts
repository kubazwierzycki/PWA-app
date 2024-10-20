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
            registerType: 'autoUpdate',
            manifest: {
                name: "CoGame - Your personal boardgames center",
                short_name: "CoGame",
                description: "Unlock the full potential of your board game collection with our all-in-one companion app! Seamlessly connect with your BoardGameGeek account to manage your collection, rank games with a quick comparison tool, and enhance your game nights with custom timers and scorekeeping. Use our wizard feature to find the best games for any occasion, ensuring every play session is a win. Perfect for board game enthusiasts looking to take their hobby to the next level!",
                start_url: "/",
                display: "minimal-ui",
                background_color: "#ffffff",
                theme_color: "#304064",
                icons: [
                    {
                        src: "/icons/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            workbox: {
                // workbox settings
            },
        }),
    ],
});
