# Dominic Amuah - Professional Portfolio

Full-stack developer portfolio built with React, showcasing projects, experience, and skills.

## 🚀 Tech Stack

- **React** 19.2.4
- **Tailwind CSS** 4.1.18
- **EmailJS** for contact form
- **Create React App**

## 📦 Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your EmailJS credentials to .env

# Start development server
npm start
```

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`

Launches the test runner in the interactive watch mode.

## 🌐 Deployment to Vercel

### 1. Prepare Your Project

Before deployment, ensure you have:
- All images uploaded to `/public/` folder
- Your resume PDF in `/public/documents/`
- Certificates in `/public/certificates/`

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables in project settings:
   - `REACT_APP_EMAILJS_SERVICE_ID`
   - `REACT_APP_EMAILJS_TEMPLATE_ID`
   - `REACT_APP_EMAILJS_PUBLIC_KEY`
5. Click "Deploy"

### 3. Add Environment Variables on Vercel

Go to your project settings → Environment Variables and add:

```
REACT_APP_EMAILJS_SERVICE_ID = service_r1skdtn
REACT_APP_EMAILJS_TEMPLATE_ID = template_28eybuh
REACT_APP_EMAILJS_PUBLIC_KEY = DdMIsqYEDB8ssBKB-
```

## 📁 Project Structure

```
my-portfolio/
├── public/
│   ├── certificates/          # Certificate images (JPG)
│   ├── documents/            # Resume PDF
│   ├── my-photo.jpg          # Profile photo
│   ├── project1-4.jpg        # Project screenshots
│   └── github-icon.svg       # GitHub icon
├── src/
│   ├── components/           # React components
│   └── index.css             # Tailwind + custom styles
└── vercel.json               # Vercel configuration
```

## 📝 Required Files Before Deployment

Upload these files to `/public/`:
- `my-photo.jpg` - Your profile photo
- `project1.jpg` - Reflect Blog screenshot
- `project2.jpg` - Domemily Fashion screenshot
- `project3.jpg` - InnerPieces screenshot
- `project4.jpg` - StudyHub screenshot
- `certificates/professional-foundations-certificate.jpg`
- `certificates/backend-web-development-certificate.jpg`
- `certificates/cybersecurity-certificate.jpg`
- `documents/Dominic-Amuah-Resume.pdf`

## ✨ Features

- 📱 Fully responsive design
- 🎨 Modern dark theme with accent colors
- 📧 Working contact form with EmailJS
- 🔗 Social media integration
- 📄 Downloadable resume and certificates
- ⬆️ Smooth scrolling and back-to-top button
- 🔍 SEO optimized with meta tags

## 📧 Contact Form Setup

The contact form uses EmailJS. Your credentials are already configured in `.env`.

## 👤 Author

**Dominic Amuah**
- Email: dominicquainoo62@gmail.com
- LinkedIn: [dominic-amuah-bb116428b](https://www.linkedin.com/in/dominic-amuah-bb116428b/)
- GitHub: [Dominic62q](https://github.com/Dominic62q)
- Location: Accra, Ghana

---

Built with ❤️ using React and Tailwind CSS
