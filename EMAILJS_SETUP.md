# EmailJS Setup Instructions

Your contact form is now configured to send emails directly to `dominicquainoo62@gmail.com`. Follow these steps to complete the setup:

## 1. Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

## 2. Add an Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Connect your `dominicquainoo62@gmail.com` account
5. Copy the **Service ID** (looks like `service_xxxxxxx`)

## 3. Create an Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template structure:

```
Subject: Portfolio Contact: {{subject}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. Copy the **Template ID** (looks like `template_xxxxxxx`)

## 4. Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (looks like a long string)
3. Copy it

## 5. Update Your Code

Open `src/components/Contact.js` and replace these lines (around line 28-30):

```javascript
const serviceId = 'service_YOUR_SERVICE_ID'; // Replace with your Service ID
const templateId = 'template_YOUR_TEMPLATE_ID'; // Replace with your Template ID
const publicKey = 'YOUR_PUBLIC_KEY'; // Replace with your Public Key
```

With your actual credentials:

```javascript
const serviceId = 'service_abc123'; // Your actual Service ID
const templateId = 'template_xyz456'; // Your actual Template ID
const publicKey = 'your_actual_public_key'; // Your actual Public Key
```

## 6. Test Your Form

1. Save the changes
2. Refresh your website
3. Fill out the contact form
4. Click "Send Message"
5. Check your email at `dominicquainoo62@gmail.com`

## Troubleshooting

- **Emails not arriving**: Check your EmailJS dashboard for error logs
- **"Failed to send" error**: Verify your Service ID, Template ID, and Public Key are correct
- **Email in spam**: Add your EmailJS sending address to your contacts

## Free Tier Limits

- 200 emails per month
- Rate limit: 2 emails per second
- If you need more, upgrade to a paid plan

---

**Note**: Keep your EmailJS credentials private. Don't commit them to public repositories if you plan to make your code open source. Consider using environment variables for production.
