import { defineConfig } from 'vite';

const proxy = {
  '/api': {
    target: 'https://rsa-api-phi.vercel.app',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
};

export default defineConfig({
  server: { proxy },
  preview: { proxy },
});
