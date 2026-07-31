function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key, value]) => key && value)
      .map(([key, ...value]) => [key, value.join('=')]),
  )
}

function getRedirectUri(environment) {
  return environment.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5173/callback'
}

function sendHtml(response, status, body) {
  response.statusCode = status
  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.end(body)
}

export function createSpotifyCallbackHandler(environment = process.env) {
  return async function spotifyCallbackHandler(request, response) {
  if (request.method !== 'GET') return sendHtml(response, 405, '<h1>Method not allowed</h1>')

  const url = new URL(request.url, 'http://127.0.0.1')
  const error = url.searchParams.get('error')
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const cookies = parseCookies(request.headers.cookie)

  if (error) return sendHtml(response, 400, `<h1>Spotify authorization was not completed</h1><p>${error}</p>`)
  if (!code || !state || state !== cookies.spotify_oauth_state) {
    return sendHtml(response, 400, '<h1>Spotify authorization could not be verified</h1><p>Please restart the setup from the local app.</p>')
  }

  const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = environment
  if (!clientId || !clientSecret) {
    return sendHtml(response, 500, '<h1>Spotify credentials are not configured</h1>')
  }

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: getRedirectUri(environment),
      }),
    })

    if (!tokenResponse.ok) {
      return sendHtml(response, 502, '<h1>Spotify token exchange failed</h1><p>Check the redirect URI and try again.</p>')
    }

    const token = await tokenResponse.json()
    if (!token.refresh_token) {
      return sendHtml(response, 502, '<h1>Spotify did not return a refresh token</h1><p>Try authorizing again.</p>')
    }

    response.setHeader('Set-Cookie', 'spotify_oauth_state=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0')
    return sendHtml(
      response,
      200,
      `<!doctype html><html><head><meta charset="utf-8"><title>Spotify connected</title><style>body{font-family:system-ui,sans-serif;max-width:720px;margin:64px auto;padding:0 24px;line-height:1.5;color:#171717}code{display:block;background:#f3f3f3;padding:16px;border-radius:12px;overflow-wrap:anywhere}strong{color:#15803d}</style></head><body><h1><strong>Spotify connected.</strong></h1><p>Copy this refresh token into your local <code>.env</code> file as <code>SPOTIFY_REFRESH_TOKEN=...</code>. Do not publish or share it.</p><code>${token.refresh_token}</code><p>After saving it, restart Vite and return to the portfolio.</p></body></html>`,
    )
  } catch {
    return sendHtml(response, 502, '<h1>Spotify connection failed</h1><p>Try the authorization flow again.</p>')
  }
  }
}

export default createSpotifyCallbackHandler()
