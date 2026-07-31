const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_PLAYBACK_URL =
  'https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode'

let cachedAccessToken = null
let accessTokenExpiresAt = 0
let activeRefreshToken = null

function sendJson(response, status, body) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate=5')
  response.end(JSON.stringify(body))
}

function sendNoContent(response) {
  response.statusCode = 204
  response.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate=5')
  response.end()
}

function getArtists(item) {
  if (item.type === 'episode') return item.show?.name || 'Spotify episode'
  return item.artists?.map((artist) => artist.name).join(', ') || 'Unknown artist'
}

function normalizeTrack(playback) {
  const item = playback.item
  if (!item || !playback.is_playing) return null

  const isEpisode = item.type === 'episode'
  const imageUrl = isEpisode ? item.images?.[0]?.url : item.album?.images?.[0]?.url

  return {
    name: item.name,
    artist: getArtists(item),
    imageUrl: imageUrl || null,
    url: item.external_urls?.spotify || null,
    type: item.type,
    progressMs: playback.progress_ms ?? null,
    durationMs: item.duration_ms ?? null,
  }
}

async function getAccessToken(environment) {
  if (cachedAccessToken && Date.now() < accessTokenExpiresAt - 60_000) {
    return cachedAccessToken
  }

  const refreshToken = activeRefreshToken || environment.SPOTIFY_REFRESH_TOKEN
  const tokenResponse = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${environment.SPOTIFY_CLIENT_ID}:${environment.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!tokenResponse.ok) {
    const tokenError = await tokenResponse.json().catch(() => ({}))
    console.error('Spotify token refresh failed:', tokenResponse.status, tokenError.error)
    throw new Error('Spotify token refresh failed')
  }

  const token = await tokenResponse.json()
  cachedAccessToken = token.access_token
  accessTokenExpiresAt = Date.now() + (token.expires_in || 3600) * 1000
  if (token.refresh_token) activeRefreshToken = token.refresh_token
  return cachedAccessToken
}

export function createSpotifyNowPlayingHandler(environment = process.env) {
  return async function spotifyNowPlayingHandler(request, response) {
    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET')
      return sendJson(response, 405, { error: 'Method not allowed' })
    }

    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = environment

    // Keep the widget silent until the owner has completed Spotify setup.
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
      return sendJson(response, 404, { available: false })
    }

    try {
      const accessToken = await getAccessToken({
        SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET,
        SPOTIFY_REFRESH_TOKEN,
      })
      const playbackResponse = await fetch(SPOTIFY_PLAYBACK_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (playbackResponse.status === 204) return sendNoContent(response)
      if (!playbackResponse.ok) {
        console.error('Spotify playback request failed:', playbackResponse.status)
        return sendJson(response, 502, { available: false })
      }

      const track = normalizeTrack(await playbackResponse.json())
      if (!track) return sendNoContent(response)

      return sendJson(response, 200, { available: true, isPlaying: true, track })
    } catch {
      return sendJson(response, 502, { available: false })
    }
  }
}

export default createSpotifyNowPlayingHandler()
