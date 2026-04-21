const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: process.env.MAIL_ENCRYPTION === 'ssl',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

/**
 * Generate a professional HTML template for credentials
 */
const getCredentialTemplate = (name, email, password, role) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Provisioned</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
            body { 
                font-family: 'Outfit', sans-serif; 
                line-height: 1.6; 
                color: #1e293b; 
                margin: 0; 
                padding: 0; 
                background-color: #f8fafc; 
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background: #ffffff; 
                border-radius: 16px; 
                overflow: hidden; 
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header { 
                background: #0D7CFF; 
                padding: 40px 20px; 
                text-align: center; 
                color: white; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px; 
                font-weight: 700; 
                letter-spacing: -0.025em;
                text-transform: uppercase;
            }
            .content { 
                padding: 40px; 
            }
            .welcome-text {
                font-size: 18px;
                font-weight: 600;
                color: #0f172a;
                margin-bottom: 20px;
            }
            .credential-card {
                background: #f1f5f9;
                border-radius: 12px;
                padding: 24px;
                margin: 30px 0;
                border: 1px solid #e2e8f0;
            }
            .credential-item {
                margin-bottom: 16px;
            }
            .credential-item:last-child {
                margin-bottom: 0;
            }
            .label {
                font-size: 11px;
                font-weight: 700;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                display: block;
                margin-bottom: 4px;
            }
            .value {
                font-size: 15px;
                font-weight: 600;
                color: #1e293b;
                font-family: 'Courier New', Courier, monospace;
            }
            .badge {
                display: inline-block;
                padding: 4px 12px;
                background: #e0f2fe;
                color: #0369a1;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .footer { 
                background: #f8fafc; 
                padding: 24px; 
                text-align: center; 
                font-size: 12px; 
                color: #94a3b8; 
                border-top: 1px solid #e2e8f0;
            }
            .button {
                display: inline-block;
                padding: 14px 32px;
                background: #0D7CFF;
                color: white !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                margin-top: 20px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>HOSPITAL MANAGEMENT SYSTEM</h1>
                <p style="margin-top: 10px; opacity: 0.9; font-size: 14px;">Secure Infrastructure Access Provisioned</p>
            </div>
            <div class="content">
                <p class="welcome-text">Greetings, ${name}</p>
                <p>Your institutional access node has been successfully provisioned. You can now access your dedicated dashboard using the encrypted credentials provided below.</p>
                
                <div class="badge">${role.replace('_', ' ')} ACCESS</div>

                <div class="credential-card">
                    <div class="credential-item">
                        <span class="label">Access Identifier (Username)</span>
                        <span class="value">${email}</span>
                    </div>
                    <div class="credential-item">
                        <span class="label">Encrypted Passphrase</span>
                        <span class="value" style="color: #ef4444;">${password}</span>
                    </div>
                </div>

                <p style="font-size: 13px; color: #64748b; font-style: italic;">
                    * Security Notice: Please update your passphrase upon your first initialization to ensure maximum infrastructure security.
                </p>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="http://localhost:3000/auth/login" class="button">Access Infrastructure</a>
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} @gohilinfotech. All rights reserved. <br/>
                Confidentiality Notice: This document is intended only for the designated recipient.
            </div>
        </div>
    </body>
    </html>
  `;
};

const sendCredentials = async (to, name, password, role) => {
  try {
    const recipients = Array.isArray(to) ? to.join(', ') : to;
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: recipients,
      subject: `[CORE REGISTRY] Account Provisioned: ${role.replace('_', ' ')} Access`,
      html: getCredentialTemplate(name, Array.isArray(to) ? to[0] : to, password, role),
    });
    console.log(`📧 Dispatch successful to ${recipients}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Dispatch failure to ${to}:`, error);
    return false;
  }
};

module.exports = {
  sendCredentials
};
