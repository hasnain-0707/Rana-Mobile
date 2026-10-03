import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

export async function autoSeedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn('[AutoSeed] ADMIN_EMAIL and ADMIN_PASSWORD are required; skipping admin seed.');
      return;
    }

    const existing = await Admin.findOne({ email }).select('+password');
    const hashedPassword = await bcrypt.hash(password, 12);

    if (!existing) {
      await Admin.create({ email, password: hashedPassword });
      console.log(`[AutoSeed] Created admin account: ${email}`);
    } else {
      const matches = await bcrypt.compare(password, existing.password);
      if (!matches) {
        existing.password = hashedPassword;
        await existing.save();
        console.log(`[AutoSeed] Synchronized password for admin account: ${email}`);
      }
    }
  } catch (err) {
    console.error('[AutoSeed] Error auto-seeding admin user:', err.message);
  }
}
