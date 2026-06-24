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
