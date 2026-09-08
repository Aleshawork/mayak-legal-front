import { defineConfig } from 'vite'
import { resolve, join } from 'path'
import { existsSync } from 'fs'

const pages = [
  'about', 'property', 'build', 'reports', 'faq', 'blog',
  'contacts', 'legal', 'pay', 'privacy', 'terms', 'offer', 'cookie'
]

function mpaSlashless() {
  const rewrite = (req) => {
    const raw = req.url || '/'
    const [pathname, query = ''] = raw.split('?')
    if (!pathname || pathname === '/' || pathname.includes('.') || pathname.endsWith('/')) return
    const slug = pathname.replace(/^\/+|\/+$/g, '')
    if (!pages.includes(slug)) return
    const indexFile = join(process.cwd(), slug, 'index.html')
    if (existsSync(indexFile)) {
      req.url = `/${slug}/${query ? `?${query}` : ''}`
    }
  }
  return {
    name: 'mpa-slashless',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req)
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req)
        next()
      })
    }
  }
}

// Object Storage website не отдаёт CORS. Vite вешает crossorigin на CSS/JS —
// браузер тогда не применяет стили (cssRules=0), хотя файл 200 OK.
function stripAssetCrossorigin() {
  return {
    name: 'strip-asset-crossorigin',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html
          .replace(/<script([^>]*?)\s+crossorigin(?:="[^"]*")?/g, '<script$1')
          .replace(/<link([^>]*?rel="stylesheet"[^>]*?)\s+crossorigin(?:="[^"]*")?/g, '<link$1')
          .replace(/<link([^>]*?)\s+crossorigin(?:="[^"]*")?([^>]*?rel="stylesheet")/g, '<link$1$2')
      }
    }
  }
}

export default defineConfig({
  appType: 'mpa',
  publicDir: 'public',
  plugins: [mpaSlashless(), stripAssetCrossorigin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries([
        ['main', resolve(__dirname, 'index.html')],
        ...pages.map((name) => [name, resolve(__dirname, `${name}/index.html`)])
      ])
    }
  },
  server: { port: 5173 }
})
