# Certificates Folder

Upload your certificate images here.

## File Structure:

For each certificate, you need:
1. **Certificate image** - Your certificate as JPG/PNG (e.g., `aws-certificate.jpg`)

## Example:
```
certificates/
  ├── aws-certificate.jpg
  ├── python-certificate.jpg
  └── security-certificate.jpg
```

## Update Certificate Info:

Edit `/src/components/Certificates.js` and update the `documents` array with your certificate details:

```javascript
{
  id: 1,
  title: 'Your Certificate Name',
  issuer: 'Issuing Organization',
  date: '2024',
  type: 'certificate',
  image: '/certificates/your-certificate.jpg'
}
```

## Tips:
- Use clear, high-resolution images (at least 1200px wide)
- JPG or PNG formats work best
- Images will be downloadable and viewable in full screen
- Use descriptive filenames matching your certificate titles
