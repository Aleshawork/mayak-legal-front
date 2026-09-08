import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  appType: 'mpa',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html'),
        property: resolve(__dirname, 'property/index.html'),
        build: resolve(__dirname, 'build/index.html'),
        reports: resolve(__dirname, 'reports/index.html'),
        faq: resolve(__dirname, 'faq/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        contacts: resolve(__dirname, 'contacts/index.html'),
        legal: resolve(__dirname, 'legal/index.html'),
        pay: resolve(__dirname, 'pay/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        offer: resolve(__dirname, 'offer/index.html'),
        cookie: resolve(__dirname, 'cookie/index.html')
      }
    }
  },
  server: { port: 5173 }
})
