import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createSpotifyNowPlayingHandler } from './api/spotify-now-playing.js'
import { createSpotifyAuthHandler } from './api/spotify-auth.js'
import { createSpotifyCallbackHandler } from './api/spotify-callback.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function localSpotifyApi(environment) {
  const handler = createSpotifyNowPlayingHandler(environment)
  const authHandler = createSpotifyAuthHandler(environment)
  const callbackHandler = createSpotifyCallbackHandler(environment)

  return {
    name: 'local-spotify-api',
    configureServer(server) {
      server.middlewares.use('/api/spotify-now-playing', (request, response, next) => {
        if (request.method !== 'GET') return next()
        handler(request, response).catch(next)
      })
      server.middlewares.use('/api/spotify-auth', (request, response, next) => {
        authHandler(request, response, next)
      })
      server.middlewares.use('/api/spotify-callback', (request, response, next) => {
        callbackHandler(request, response).catch(next)
      })
      server.middlewares.use('/callback', (request, response, next) => {
        if (request.method !== 'GET') return next()
        request.url = `/api/spotify-callback${request.url}`
        callbackHandler(request, response).catch(next)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), localSpotifyApi(environment)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Split stable vendor dependencies into cacheable chunks so app code
          // changes do not invalidate them on redeploy.
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('framer-motion') || id.includes('motion')) return 'motion'
            if (id.includes('react')) return 'vendor-react'
            return 'vendor'
          },
        },
      },
    },
  }
})
