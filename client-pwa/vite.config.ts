import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        base: "/",
        server: {
            proxy: {
                "/xmlapi2": "https://boardgamegeek.com",
                '/api': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                },
            },
            watch: {
                usePolling: true,
            },
            host: env.VITE_HOST, // needed for the Docker Container port mapping to work
            strictPort: true, 
            port: 5137, // you can replace this port with any port
        },
        plugins: [
            react(),
            VitePWA({
                registerType: 'autoUpdate',
                manifest: {
                    name: "CoGame",
                    short_name: "CoGame",
                    description: "Unlock the full potential of your board game collection with our all-in-one companion app! Seamlessly connect with your BoardGameGeek account to manage your collection, rank games with a quick comparison tool, and enhance your game nights with custom timers and scorekeeping. Use our wizard feature to find the best games for any occasion, ensuring every play session is a win. Perfect for board game enthusiasts looking to take their hobby to the next level!",
                    start_url: "/",
                    display: "minimal-ui",
                    background_color: "#ffffff",
                    theme_color: "#3C3C3C",
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
                    categories: ["games", "entertainment", "social"],
                    orientation: "natural",
                    shortcuts: [
                        {
                            "name": "Collection",
                            "description": "View your boardgames collection",
                            "url": "/boardgames/collection",
                            "icons": [
                                {
                                    "src": "icons/tasks/collection.png",
                                    "sizes": "320x320"
                                }
                            ]
                        },
                        {
                            "name": "Create playroom",
                            "description": "Create a playroom for your game",
                            "url": "/play/create",
                            "icons": [
                                {
                                    "src": "icons/tasks/create.png",
                                    "sizes": "320x320"
                                }
                            ]
                        },
                        {
                            "name": "Join playroom",
                            "description": "Join existing playroom",
                            "url": "/play/join",
                            "icons": [
                                {
                                    "src": "icons/tasks/join.png",
                                    "sizes": "320x320"
                                }
                            ]
                        }
                    ]
                },
                workbox: {
                    // workbox settings
                },
            }),
        ],
    }
});
