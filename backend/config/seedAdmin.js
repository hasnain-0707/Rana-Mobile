import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

export async function autoSeedAdmin() {
  try {
    const envEmail = (process.env.ADMIN_EMAIL || 'ranasadiq758567@gmail.com').trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD || 'rana@67#Sadiq$75&';

    const defaultEmails = Array.from(new Set([
      envEmail,
      'ranasadiq758567@gmail.com',
      'ranasadiq@758567',
      'admin@ranamobile.com'
    ]));

    for (const email of defaultEmails) {
      const existing = await Admin.findOne({ email }).select('+password');
      const hashedPassword = await bcrypt.hash(envPassword, 12);

      if (!existing) {
        await Admin.create({ email, password: hashedPassword });
        console.log(`[AutoSeed] Created admin account: ${email}`);
      } else {
        const matches = await bcrypt.compare(envPassword, existing.password);
        if (!matches) {
          existing.password = hashedPassword;
          await existing.save();
          console.log(`[AutoSeed] Synchronized password for admin account: ${email}`);
        }
      }
    }
  } catch (err) {
    console.error('[AutoSeed] Error auto-seeding admin user:', err.message);
  }
}
