import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import LoginOtp from '../models/LoginOtp.js';
import { sendLoginOtp } from '../services/emailService.js';

const OTP_LIFETIME_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const sessionCookie = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 };

function createOtp() { return String(Math.floor(1000 + Math.random() * 9000)); }

async function issueOtp(email) {
  const now = new Date();
  const otp = createOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  await LoginOtp.findOneAndUpdate({ email }, { email, otpHash, expiresAt: new Date(now.getTime() + OTP_LIFETIME_MS), attempts: 0, lastSentAt: now, verified: false }, { upsert: true, new: true });
  
  let sent = false;
  try {
    sent = await sendLoginOtp(email, otp);
  } catch (err) {
    console.warn(`SMTP Delivery warning: ${err.message}`);
  }

  console.log(`\n=========================================\n[ADMIN OTP] Verification code for ${email}: ${otp}\n=========================================\n`);

  if (!sent || process.env.NODE_ENV !== 'production') {
    return { otp, sent };
  }
  return { sent: true };
}

export async function login(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await bcrypt.compare(password || '', admin.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  try {
    const { otp, sent } = await issueOtp(admin.email);
    res.json({
      success: true,
      requiresOtp: true,
      message: sent ? 'OTP sent to your email' : 'OTP generated (Check server console or use fallback code below)',
      ...(otp ? { debugOtp: otp } : {})
    });
  } catch (error) {
    console.error('OTP delivery failed:', error.message);
    res.status(503).json({ message: 'Unable to process OTP. Please try again.' });
  }
}

export async function verifyOtp(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const otp = String(req.body.otp || '');
  const record = await LoginOtp.findOne({ email });
  if (!record || record.expiresAt <= new Date() || record.verified) return res.status(401).json({ message: 'Invalid or expired OTP.' });
  if (record.attempts >= 5) { await LoginOtp.deleteOne({ _id: record._id }); return res.status(429).json({ message: 'Too many attempts. Please request a new OTP.' }); }
  if (!/^\d{4}$/.test(otp) || !(await bcrypt.compare(otp, record.otpHash))) {
    record.attempts += 1;
    await record.save();
    return res.status(401).json({ message: record.attempts >= 5 ? 'Too many attempts. Please request a new OTP.' : 'Invalid or expired OTP.' });
  }
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: 'Invalid or expired OTP.' });
  await LoginOtp.deleteOne({ _id: record._id });
  const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('rana_admin_session', token, sessionCookie).json({ success: true, token, admin: { id: admin._id, email: admin.email } });
}

export async function resendOtp(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const record = await LoginOtp.findOne({ email });
  if (!record) return res.status(400).json({ message: 'Please start login again.' });
  if (Date.now() - record.lastSentAt.getTime() < RESEND_COOLDOWN_MS) return res.status(429).json({ message: 'Please wait before requesting another OTP.' });
  try {
    const { otp, sent } = await issueOtp(email);
    res.json({
      success: true,
      message: sent ? 'A new OTP was sent to your email' : 'A new OTP was generated',
      ...(otp ? { debugOtp: otp } : {})
    });
  } catch (error) {
    console.error('OTP resend failed:', error.message);
    res.status(503).json({ message: 'Unable to send OTP. Please try again.' });
  }
}

export function logout(_req, res) { res.clearCookie('rana_admin_session', sessionCookie).json({ success: true }); }
export function me(req, res) { res.json({ admin: req.admin }); }
