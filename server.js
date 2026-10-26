// Minimal production server for Azure App Service (Linux, Node).
// Serves the Vite build from ./dist under BASE_PATH, with SPA fallback,
// a health endpoint, and proxy-aware behaviour (Google Cloud Load Balancer).
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = resolve(fileURLToPath(new URL('./dist', import.meta.url)))
const PORT = process.env.PORT || 8080
const BASE = `/${(process.env.BASE_PATH ?? '/react-dashboard-layout-integration').replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '')
// "" for root hosting, otherwise e.g. "/react-dashboard-layout-integration"

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
}

function send(res, status, headers, body) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers })
  res.end(body)
}

function sendFile(req, res, file) {
  const ext = extname(file)
  const hashed = file.includes(`${sep}assets${sep}`)
  res.writeHead(200, {
    ...SECURITY_HEADERS,
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  if (req.method === 'HEAD') return res.end()
  createReadStream(file).pipe(res)
}

createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, { Allow: 'GET, HEAD' }, 'Method Not Allowed')
  }

  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    return send(res, 400, {}, 'Bad Request')
  }

  // Health probe for App Service / load balancer (path independent of BASE_PATH)
  if (pathname === '/healthz') {
    return send(res, 200, { 'Content-Type': 'text/plain' }, 'ok')
  }

  // Redirect "/" and "/base" to "/base/"
  if (BASE && (pathname === '/' || pathname === BASE)) {
    res.writeHead(301, { Location: `${BASE}/` })
    return res.end()
  }
  if (BASE && !pathname.startsWith(`${BASE}/`)) {
    return send(res, 404, { 'Content-Type': 'text/plain' }, 'Not Found')
  }

  const relative = pathname.slice(BASE.length) || '/'
  const target = normalize(join(DIST, relative))
  if (target !== DIST && !target.startsWith(DIST + sep)) {
    return send(res, 403, {}, 'Forbidden')
  }

  if (existsSync(target) && statSync(target).isFile()) {
    return sendFile(req, res, target)
  }
  // Missing file with an extension -> real 404; otherwise SPA fallback
  if (extname(relative)) {
    return send(res, 404, { 'Content-Type': 'text/plain' }, 'Not Found')
  }
  sendFile(req, res, join(DIST, 'index.html'))
}).listen(PORT, () => {
  console.log(`Serving ${DIST} at base "${BASE || '/'}" on port ${PORT}`)
})
