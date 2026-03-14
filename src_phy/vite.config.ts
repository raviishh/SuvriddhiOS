import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    resolve: {
        alias: {
            react: "preact/compat",
            "react-dom": "preact/compat",
        },
    },
    plugins: [preact(), tailwindcss(), {
        name: "unity-webgl-mime",
        configureServer(server) {
            server.middlewares.use((_req, res, next) => {
                if (_req.url?.endsWith(".data")) {
                    res.setHeader("Content-Type", "application/octet-stream");
                }
                next();
            });
        },
    }],
});
