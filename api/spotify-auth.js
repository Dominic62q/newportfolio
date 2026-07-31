import crypto from 'node:crypto'

const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'

function getRedirectUri(environment) {
  return environment.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5173/callback'
}

export function createSpotifyAuthHandler(environment = process.env) {
  return function spotifyAuthHandler(request, response) {
  if (request.method !== 'GET') {
    response.statusCode = 405
    response.setHeader('Allow', 'GET')
    return response.end('Method not allowed')
  }

  const clientId = environment.SPOTIFY_CLIENT_ID
  if (!clientId) {
    response.statusCode = 500
    return response.end('Spotify client ID is not configured.')
  }

    const state = crypto.randomBytes(24).toString('hex')
    const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: 'user-read-currently-playing',
      redirect_uri: getRedirectUri(environment),
    state,
  })

    response.setHeader(
      'Set-Cookie',
      `spotify_oauth_state=${state}; HttpOnly; Path=/; SameSite=Lax; Max-Age=600`,
    )
    response.statusCode = 302
    response.setHeader('Location', `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`)
    return response.end()
  }
}

export default createSpotifyAuthHandler()
