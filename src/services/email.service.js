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

const getBaseTemplate = (title, subtitle, content, footerText = "") => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
            body { font-family: 'Outfit', sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { background: #2D37A4; padding: 40px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; text-transform: uppercase; }
            .content { padding: 40px; }
            .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
            .badge { display: inline-block; padding: 4px 12px; background: #e0f2fe; color: #0369a1; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; }
            .info-card { background: #f1f5f9; border-radius: 12px; padding: 24px; margin: 20px 0; border: 1px solid #e2e8f0; }
            .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 4px; }
            .value { font-size: 15px; font-weight: 600; color: #1e293b; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${title}</h1>
                <p style="margin-top: 10px; opacity: 0.9; font-size: 14px;">${subtitle}</p>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} @gohilinfotech. All rights reserved. <br/>
                ${footerText}
            </div>
        </div>
    </body>
    </html>
  `;
};

const sendAdmissionEmail = async (to, patientName, departmentName, admissionDate) => {
  if (!to) return;
  try {
    const content = `
      <p style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 20px;">Dear ${patientName},</p>
      <div class="badge">Registration Confirmed</div>
      <p>This is to confirm your official admission into our clinical facility. Our dedicated medical team is committed to providing you with high-fidelity healthcare and support during your recovery.</p>
      
      <div class="info-card">
        <div style="margin-bottom: 16px;">
          <span class="label">Assigned Department</span>
          <span class="value">${departmentName}</span>
        </div>
        <div>
          <span class="label">Admission Timestamp</span>
          <span class="value">${new Date(admissionDate).toLocaleString()}</span>
        </div>
      </div>

      <p style="font-size: 13px; color: #64748b; font-style: italic;">
        Please note: Your medical records will be updated in real-time. Contact your ward nurse for any immediate assistance.
      </p>
    `;
    const html = getBaseTemplate("CLINICAL ADMISSION", "Patient Registry Initialization", content);
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject: `[HOSPITAL] Admission Confirmed: ${patientName}`,
      html
    });
    return true;
  } catch (error) {
    console.error("❌ Admission email failure:", error);
    return false;
  }
};

const sendDischargeEmail = async (to, patientName, dischargeDate) => {
  if (!to) return;
  try {
    const content = `
      <p style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 20px;">Dear ${patientName},</p>
      <div class="badge" style="background: #ecfdf5; color: #059669;">Discharge Complete</div>
      <p>Your clinical treatment has been successfully completed. We wish you a healthy and robust recovery at home.</p>
      
      <div class="info-card">
        <div>
          <span class="label">Discharge Timestamp</span>
          <span class="value">${new Date(dischargeDate).toLocaleString()}</span>
        </div>
      </div>

      <p>Your medical reports and discharge summary have been synchronized with your patient portal for future reference.</p>
    `;
    const html = getBaseTemplate("CLINICAL DISCHARGE", "Patient Registry Finalized", content);
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject: `[HOSPITAL] Discharge Complete: ${patientName}`,
      html
    });
    return true;
  } catch (error) {
    console.error("❌ Discharge email failure:", error);
    return false;
  }
};

const sendReadmissionEmail = async (to, patientName, departmentName) => {
  if (!to) return;
  try {
    const content = `
      <p style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 20px;">Dear ${patientName},</p>
      <div class="badge" style="background: #eff6ff; color: #2563eb;">Registry Reactivated</div>
      <p>Your clinical record has been reactivated. You have been re-admitted to the ${departmentName} for continued medical supervision.</p>
      
      <div class="info-card">
        <div>
          <span class="label">Re-admission Timestamp</span>
          <span class="value">${new Date().toLocaleString()}</span>
        </div>
      </div>
    `;
    const html = getBaseTemplate("CLINICAL RE-ADMISSION", "Patient Registry Reactivation", content);
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject: `[HOSPITAL] Re-admission Notice: ${patientName}`,
      html
    });
    return true;
  } catch (error) {
    console.error("❌ Re-admission email failure:", error);
    return false;
  }
};

const sendCredentials = async (to, name, password, role) => {
  try {
    const recipients = Array.isArray(to) ? to.join(', ') : to;
    const content = `
        <p class="welcome-text" style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 20px;">Greetings, ${name}</p>
        <p>Your institutional access node has been successfully provisioned. You can now access your dedicated dashboard using the credentials provided below.</p>
        <div class="badge">${role.replace('_', ' ')} ACCESS</div>
        <div class="info-card">
            <div style="margin-bottom: 16px;">
                <span class="label">Access Identifier</span>
                <span class="value">${Array.isArray(to) ? to[0] : to}</span>
            </div>
            <div>
                <span class="label">Encrypted Passphrase</span>
                <span class="value" style="color: #ef4444;">${password}</span>
            </div>
        </div>
        <div style="text-align: center; margin-top: 40px;">
            <a href="http://localhost:3000/auth/login" style="display: inline-block; padding: 14px 32px; background: #2D37A4; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600;">Access Infrastructure</a>
        </div>
    `;
    const html = getBaseTemplate("ACCOUNT PROVISIONED", "Secure Infrastructure Access", content);
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: recipients,
      subject: `[CORE REGISTRY] Account Provisioned: ${role.replace('_', ' ')} Access`,
      html
    });
    return true;
  } catch (error) {
    console.error("❌ Credentials email failure:", error);
    return false;
  }
};

const sendResetLink = async (to, name, resetLink) => {
  try {
    const content = `
        <p class="welcome-text" style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 20px;">Hello, ${name}</p>
        <p>A request was initiated to reset your institutional access passcode. If you did not initiate this request, please contact your system administrator immediately.</p>
        <div style="text-align: center; margin-top: 40px;">
            <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background: #2D37A4; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600;">Reconfigure Passcode</a>
        </div>
    `;
    const html = getBaseTemplate("RECOVER ACCESS TOKEN", "Identity Verification Protocol", content);
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject: `[SECURITY] Passcode Reconfiguration Requested`,
      html
    });
    return true;
  } catch (error) {
    console.error("❌ Reset link email failure:", error);
    return false;
  }
};

module.exports = {
  sendCredentials,
  sendResetLink,
  sendAdmissionEmail,
  sendDischargeEmail,
  sendReadmissionEmail
};
