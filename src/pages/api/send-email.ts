import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Types
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
}

interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

// Service name mapping
const SERVICE_NAMES: Record<string, string> = {
  'full-project': 'Full Project Development',
  'architecture': 'Architecture Review',
  'ai-integration': 'AI Integration',
  'consulting': 'Technical Consulting',
} as const;

// Email regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper functions
const getSMTPConfig = (): SMTPConfig | null => {
  const host = import.meta.env.SMTP_HOST;
  const port = parseInt(import.meta.env.SMTP_PORT || '587');
  const user = import.meta.env.SMTP_USER;
  const pass = import.meta.env.SMTP_PASS;
  const from = import.meta.env.SMTP_FROM;

  if (!host || !user || !pass || !from) {
    return null;
  }

  return { host, port, user, pass, from };
};

const createTransporter = (config: SMTPConfig): Transporter => {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

const generateEmailHTML = (data: ContactFormData, serviceName: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fc;">
      <div style="background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
        <h2 style="color: #1a1a2e; margin-top: 0; border-bottom: 3px solid #667eea; padding-bottom: 15px;">
          Thank You for Reaching Out!
        </h2>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          Hi ${data.name},
        </p>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          Thank you for your interest in my services. I've received your message regarding <strong>${serviceName}</strong> and will get back to you within 24 hours.
        </p>
        
        <div style="margin: 25px 0; background-color: #f8f9fc; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
          <h3 style="color: #1a1a2e; margin-top: 0; font-size: 1rem;">Your Message Details:</h3>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Service:</strong>
            <span style="color: #1a1a2e;"> ${serviceName}</span>
          </div>
          
          ${data.company ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Company:</strong>
            <span style="color: #1a1a2e;"> ${data.company}</span>
          </div>
          ` : ''}
          
          <div>
            <strong style="color: #374151; display: block; margin-bottom: 8px;">Project Details:</strong>
            <div style="color: #1a1a2e; line-height: 1.6;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          In the meantime, feel free to check out my portfolio and previous work.
        </p>
        
        <p style="color: #374151; line-height: 1.6;">
          Best regards,<br>
          <strong>Is It Vritra</strong>
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
          <p style="margin: 0;">This is an automated confirmation email</p>
          <p style="margin: 5px 0 0 0;">Sent on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  `;
};

const generateEmailText = (data: ContactFormData, serviceName: string): string => {
  return `
Thank You for Reaching Out!

Hi ${data.name},

Thank you for your interest in my services. I've received your message regarding ${serviceName} and will get back to you within 24 hours.

Your Message Details:
- Service: ${serviceName}
${data.company ? `- Company: ${data.company}\n` : ''}- Project Details: ${data.message}

In the meantime, feel free to check out my portfolio and previous work.

Best regards,
Is It Vritra

---
This is an automated confirmation email
Sent on ${new Date().toLocaleString()}
  `;
};

const createErrorResponse = (message: string, status: number) => {
  return new Response(
    JSON.stringify({ success: false, message }),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
};

const createSuccessResponse = (message: string) => {
  return new Response(
    JSON.stringify({ success: true, message }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

// Main API handler
export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse and validate form data
    const data = await request.json() as ContactFormData;
    const { name, email, service, message } = data;

    // Validate required fields
    if (!name || !email || !service || !message) {
      return createErrorResponse('Please fill in all required fields.', 400);
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return createErrorResponse('Please enter a valid email address.', 400);
    }

    // Get SMTP configuration
    const smtpConfig = getSMTPConfig();
    if (!smtpConfig) {
      return createErrorResponse('Email service is not configured. Please contact the administrator.', 500);
    }

    // Create and verify transporter
    const transporter = createTransporter(smtpConfig);

    try {
      await transporter.verify();
    } catch (verifyError) {
      throw new Error(`SMTP connection failed: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`);
    }

    // Get service name
    const serviceName = SERVICE_NAMES[service] || service;

    // Send email
    await transporter.sendMail({
      from: smtpConfig.from,
      to: email,
      subject: `Thank you for contacting us - ${serviceName}`,
      html: generateEmailHTML(data, serviceName),
      text: generateEmailText(data, serviceName),
    });

    return createSuccessResponse('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.');

  } catch (error) {
    return createErrorResponse('Sorry, there was an error sending your message. Please try again or email directly at isitvritra@gmail.com.', 500);
  }
};
