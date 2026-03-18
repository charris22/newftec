import { app } from '@azure/functions';

// Email template for customer inquiries
function buildEmailHtml({ customer_name, customer_email, customer_phone, message, services_of_interest, urgency }) {
  const serviceLabels = {
    'cloud-migration': 'Cloud Migration',
    'ai-solutions': 'AI & Automation',
    'modern-apps': 'App Modernization',
    'data-analytics': 'Data & Analytics',
    'devops': 'DevOps',
    'security': 'Security & Compliance',
    'general': 'General Inquiry'
  };

  const servicesHtml = services_of_interest?.length 
    ? services_of_interest.map(s => serviceLabels[s] || s).join(', ')
    : 'Not specified';

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 20px; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .field { margin-bottom: 16px; }
    .field-label { font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .field-value { margin-top: 4px; padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb; }
    .message-box { white-space: pre-wrap; }
    .urgency-high { border-left: 4px solid #ef4444; }
    .footer { padding: 16px 20px; background: #f3f4f6; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .badge-services { background: #dbeafe; color: #1d4ed8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤖 New Inquiry via AI Assistant</h1>
    </div>
    <div class="content${urgency === 'high' ? ' urgency-high' : ''}">
      <div class="field">
        <div class="field-label">Customer Name</div>
        <div class="field-value">${escapeHtml(customer_name)}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${escapeHtml(customer_email)}">${escapeHtml(customer_email)}</a></div>
      </div>
      ${customer_phone ? `
      <div class="field">
        <div class="field-label">Phone</div>
        <div class="field-value"><a href="tel:${escapeHtml(customer_phone)}">${escapeHtml(customer_phone)}</a></div>
      </div>
      ` : ''}
      <div class="field">
        <div class="field-label">Services of Interest</div>
        <div class="field-value">
          ${services_of_interest?.map(s => `<span class="badge badge-services">${serviceLabels[s] || s}</span>`).join(' ') || 'Not specified'}
        </div>
      </div>
      <div class="field">
        <div class="field-label">Message</div>
        <div class="field-value message-box">${escapeHtml(message)}</div>
      </div>
    </div>
    <div class="footer">
      This message was sent via the NEWFTEC AI Assistant. Reply directly to respond to the customer.
    </div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.http('send-contact', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      };
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };

    try {
      const body = await request.json();
      const { 
        customer_name, 
        customer_email, 
        customer_phone,
        subject,
        message, 
        services_of_interest,
        urgency = 'normal'
      } = body;

      // Validate required fields
      if (!customer_name || !customer_email || !message) {
        return {
          status: 400,
          headers: corsHeaders,
          jsonBody: { 
            success: false, 
            error: 'Missing required fields: customer_name, customer_email, and message are required' 
          }
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer_email)) {
        return {
          status: 400,
          headers: corsHeaders,
          jsonBody: { success: false, error: 'Invalid email address format' }
        };
      }

      // Get SendGrid API key
      const sendgridApiKey = process.env.SENDGRID_API_KEY;
      if (!sendgridApiKey) {
        context.log('SendGrid API key not configured');
        return {
          status: 500,
          headers: corsHeaders,
          jsonBody: { success: false, error: 'Email service not configured' }
        };
      }

      // Build email content
      const ownerEmail = process.env.OWNER_EMAIL || 'info@newftec.com';
      const fromEmail = process.env.FROM_EMAIL || 'noreply@newftec.com';
      
      const emailSubject = subject || `[AI Assistant] New inquiry from ${customer_name}`;
      const emailHtml = buildEmailHtml({ 
        customer_name, 
        customer_email, 
        customer_phone,
        message, 
        services_of_interest,
        urgency 
      });

      // Send email via SendGrid API
      const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: ownerEmail }]
          }],
          from: {
            email: fromEmail,
            name: 'NEWFTEC AI Assistant'
          },
          reply_to: {
            email: customer_email,
            name: customer_name
          },
          subject: emailSubject,
          content: [
            {
              type: 'text/html',
              value: emailHtml
            }
          ]
        })
      });

      if (!sendgridResponse.ok) {
        const errorText = await sendgridResponse.text();
        context.log(`SendGrid error: ${sendgridResponse.status} - ${errorText}`);
        return {
          status: 500,
          headers: corsHeaders,
          jsonBody: { success: false, error: 'Failed to send email' }
        };
      }

      context.log(`Email sent successfully for ${customer_email}`);

      return {
        status: 200,
        headers: corsHeaders,
        jsonBody: { 
          success: true, 
          message: 'Your message has been sent to the NEWFTEC team. They will respond to you shortly.' 
        }
      };

    } catch (error) {
      context.log(`Error in send-contact: ${error.message}`);
      return {
        status: 500,
        headers: corsHeaders,
        jsonBody: { success: false, error: 'An unexpected error occurred' }
      };
    }
  }
});
