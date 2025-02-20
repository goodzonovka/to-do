import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        host: process.env.HOST || '127.0.0.1', // Проксирование требует 127.0.0.1
        port: process.env.PORT ? Number(process.env.PORT) : 3000, // Проксирование через порт 3000
        strictPort: true, // Гарантирует, что сервер запускается на заданном порту
        allowedHosts: ['testing.goodzonovka.com'], // Добавляем разрешенный хост
    },
});
