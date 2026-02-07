# Documents Folder

Upload your resume PDF here.

## File Structure:

You need:
1. **Resume PDF** - Your resume file (e.g., `Dominic-Amuah-Resume.pdf`)

## Example:
```
documents/
  └── Dominic-Amuah-Resume.pdf
```

## Update Resume Info:

Edit `/src/components/Certificates.js` and update the resume entry in the `documents` array:

```javascript
{
  id: 4,
  title: 'Professional Resume',
  issuer: 'Your Name',
  date: '2026',
  type: 'resume',
  file: '/documents/Your-Name-Resume.pdf'
}
```

## Tips:
- Keep resume filename professional
- Update the date to current year
- PDF format ensures compatibility across all devices
- Resume will be downloadable with a dedicated button
