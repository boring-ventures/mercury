# Email Configuration Setup

This document explains how to set up and use the email functionality for the Mercury Platform registration system.

## Overview

The Mercury Platform automatically sends confirmation emails to users when they submit registration requests. The email system uses:

- **Email Service**: Resend (https://resend.com)
- **Template Type**: HTML email templates with inline CSS
- **Language**: Spanish (all emails are in Spanish)
- **Styling**: Matches Mercury Platform brand colors and design

## Setup Instructions

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. In your Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Give it a name (e.g., "Mercury Platform")
4. Copy the generated API key

### 3. Configure Domain (Recommended)

1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `mercury.com`)
3. Configure the DNS records as shown
4. Verify the domain

### 4. Environment Variables

Add these variables to your `.env.local` file:

```bash
# Email Configuration (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
```

**Important Notes:**

- Replace `your-resend-api-key` with your actual Resend API key
- Replace `noreply@yourdomain.com` with your verified domain
- If you don't have a custom domain, you can use `onboarding@resend.dev` for testing

## Email Template Features

### Registration Confirmation Email

The registration confirmation email includes:

- **Professional Design**: Matches Mercury Platform branding
- **Complete Request Details**: All submitted company and contact information
- **Request ID**: Unique identifier for tracking
- **Status Information**: Clear verification process status
- **Next Steps**: 3-step process explanation
- **Support Information**: Contact details with request ID reference
- **Responsive Design**: Works on desktop and mobile devices

### Email Content (Spanish)

The email contains:

- ✅ Success confirmation message
- 📋 Complete company information
- 👤 Contact details
- 🆔 Unique request ID
- 📅 Submission timestamp
- 📞 Support contact information

## Technical Implementation

### API Integration

The email is sent automatically when:

1. A registration request is successfully created
2. All required data is validated
3. Database records are saved

### Error Handling

- Email failures don't affect registration success
- Errors are logged for debugging
- Users still receive success confirmation in the UI

### Template Structure

```
src/lib/email-templates.ts
├── generateRegistrationConfirmationEmail()
├── activityLabels (Spanish translations)
├── formatDate (ES locale)
└── Complete HTML template with inline CSS
```

## Testing

### Development Testing

1. Use Resend's development/testing API key
2. Send emails to your own email address
3. Check the email content and formatting

### Production Testing

1. Use a verified domain
2. Test with different email providers
3. Verify spam folder delivery
4. Test mobile responsiveness

## Email Content Example

**Subject:** `Solicitud de Registro Recibida - Mercury Platform (ID: REQ_12345)`

**Content:**

- Header with Mercury logo and branding
- Success message in prominent styling
- Complete request details in organized tables
- Step-by-step next steps explanation
- Support contact information
- Professional footer

## Troubleshooting

### Common Issues

1. **Email not sending**

   - Check API key validity
   - Verify domain configuration
   - Check Resend dashboard for errors

2. **Emails going to spam**

   - Set up proper domain verification
   - Configure SPF, DKIM, and DMARC records
   - Use a reputation-verified domain

3. **Template not displaying correctly**
   - Check HTML syntax
   - Verify inline CSS formatting
   - Test across different email clients

### Logs and Debugging

- Check server logs for email sending errors
- Monitor Resend dashboard for delivery status
- Use Resend's webhook system for delivery tracking

## Customization

### Modifying Email Content

To modify the email template:

1. Edit `src/lib/email-templates.ts`
2. Update the HTML structure or content
3. Modify CSS styles for visual changes
4. Test thoroughly across email clients

### Adding New Email Templates

1. Create new template functions in `email-templates.ts`
2. Import and use in relevant API routes
3. Follow the same HTML structure pattern
4. Maintain brand consistency

## Support

For email-related issues:

- Check Resend documentation: https://resend.com/docs
- Review server logs for detailed error messages
- Contact support with specific error details and request IDs
