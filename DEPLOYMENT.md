# Deployment Checklist

## ✅ Before You Deploy

### 1. Upload Required Images
Place these files in `/public/`:
- [ ] `my-photo.jpg` - Your profile photo (recommended: 600x750px)
- [ ] `project1.jpg` - Reflect Blog screenshot
- [ ] `project2.jpg` - Domemily Fashion screenshot
- [ ] `project3.jpg` - InnerPieces screenshot
- [ ] `project4.jpg` - StudyHub screenshot

### 2. Upload Certificates
Place these files in `/public/certificates/`:
- [ ] `professional-foundations-certificate.jpg`
- [ ] `backend-web-development-certificate.jpg`
- [ ] `cybersecurity-certificate.jpg`

### 3. Upload Resume
Place this file in `/public/documents/`:
- [ ] `Dominic-Amuah-Resume.pdf`

### 4. Test Locally
```bash
npm start
```
- [ ] All images load correctly
- [ ] All links work (GitHub, LinkedIn)
- [ ] Contact form submits successfully
- [ ] Certificates and resume download properly
- [ ] Navigation scrolls smoothly
- [ ] Responsive design works on mobile

### 5. Build Test
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] Check build/static folder size

## 🚀 Deploy to Vercel

### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables (see below)
5. Click "Deploy"

### Environment Variables on Vercel
Add these in Project Settings → Environment Variables:

```
REACT_APP_EMAILJS_SERVICE_ID = service_r1skdtn
REACT_APP_EMAILJS_TEMPLATE_ID = template_28eybuh
REACT_APP_EMAILJS_PUBLIC_KEY = DdMIsqYEDB8ssBKB-
```

## 📝 After Deployment

### 1. Update URLs
Once you have your Vercel URL (e.g., `dominic-portfolio.vercel.app`), update:
- [ ] `public/index.html` - Change `https://dominicamuah.com/` to your actual URL

### 2. Test Production Site
- [ ] Test contact form sends emails to dominicquainoo62@gmail.com
- [ ] All sections load properly
- [ ] All downloads work
- [ ] SEO meta tags appear in page source
- [ ] Mobile responsiveness

### 3. Add Custom Domain (Optional)
In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

### 4. Monitor
- [ ] Check Vercel Analytics
- [ ] Test on multiple devices/browsers
- [ ] Ask friends to test the contact form

## 🔧 Troubleshooting

**Contact form not working?**
- Verify environment variables are set on Vercel
- Check EmailJS dashboard for errors
- Ensure template variables match: `from_name`, `from_email`, `message`

**Images not loading?**
- Ensure images are in `/public/` folder
- Check file names match exactly (case-sensitive)
- Redeploy if images were added after initial deployment

**Build fails?**
- Run `npm run build` locally first
- Check for console errors
- Ensure all dependencies are installed

## 📊 Performance Tips

- Images should be optimized (use tools like TinyPNG)
- Recommended image sizes:
  - Profile photo: 600x750px, <200KB
  - Project screenshots: 1200x800px, <300KB each
  - Certificates: 1920x1080px, <500KB each

## 🎉 You're Ready!

Once all checklist items are complete, your portfolio is ready for deployment!

**Deployment Command:**
```bash
vercel --prod
```

Your portfolio will be live at: `https://your-project-name.vercel.app`
