# Dominic Amuah Portfolio

Personal portfolio for Dominic Amuah, built with React, Vite, Tailwind CSS v4, Framer Motion, and `shadcn/ui`.

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Framer Motion
- `shadcn/ui`
- EmailJS for the contact form

## Development

From the `portfolio/` directory:

```bash
npm install
npm run dev
```

Verify the production build with:

```bash
npm run build
```

## Environment Variables

The contact form requires EmailJS credentials.

Create a local `.env` file in `portfolio/` using `.env.example` as a reference:

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

If these values are missing, the contact form UI will still render but sending messages will fail.

### Spotify Now Playing

The portfolio includes an optional Now Playing widget backed by Spotify's `GET /me/player/currently-playing` endpoint. Spotify authorization requires the `user-read-currently-playing` scope.

Add these server-only values to `.env` locally and to Vercel project environment variables:

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

Never prefix these variables with `VITE_`: the client secret and refresh token must not be bundled into the browser. The widget stays hidden when Spotify is not configured, when playback is paused, or when Spotify is temporarily unavailable.

Spotify recommends Authorization Code with PKCE for single-page apps; because this portfolio uses a secure server endpoint for a single owner's playback, the server-side Authorization Code flow is suitable for storing the refresh token securely.

To create the refresh token locally, start the app and open `http://127.0.0.1:5173/api/spotify-auth`. Approve the requested Spotify permission, copy the refresh token shown on the local callback page into `.env`, and restart Vite. Do not commit `.env` or share the refresh token.

## Main Content Areas

- Hero and developer positioning
- About
- Projects
- Stack
- Experience
- Capabilities
- Contact

## Deployment

This app is configured as a standard Vite static site and can be deployed to platforms like Vercel.

Before deploying:

1. Set the `VITE_EMAILJS_*` environment variables in the hosting platform.
2. Confirm the resume file exists at `public/documents/Dominic-Amuah-Resume.pdf`.
3. Run `npm run build` locally to verify the production bundle.
