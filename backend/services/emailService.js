import nodemailer from 'nodemailer';

let transporter;
function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  transporter ||= nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
}

export async function sendLoginOtp(email, otp) {
  const mailer = getTransporter();
  if (!mailer) return false;
  await mailer.sendMail({
    from: `Rana Mobile Shop <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Rana Mobile Shop - Your Login OTP',
    text: `Your Rana Mobile Shop login verification code is ${otp}. It expires in 5 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#0f172a"><div style="background:#0f172a;padding:24px;color:#fff"><strong>Rana Mobile Shop</strong></div><div style="padding:32px;border:1px solid #e2e8f0"><p>Your login verification code is:</p><div style="font-size:38px;letter-spacing:12px;font-weight:700;color:#2563eb">${otp}</div><p>This OTP will expire in <strong>5 minutes</strong> and can be used only once.</p><p style="color:#64748b;font-size:13px">If you did not request this login, you can safely ignore this email.</p></div></div>`
  });
  return true;
}
