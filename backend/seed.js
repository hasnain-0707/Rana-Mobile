import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDatabase } from './config/db.js';
import Admin from './models/Admin.js';

await connectDatabase();
const email = (process.env.ADMIN_EMAIL || 'ranasadiq758567@gmail.com').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || 'rana@67#Sadiq$75&';
const passwordHash = process.env.ADMIN_PASSWORD_HASH || await bcrypt.hash(password, 12);

await Admin.findOneAndUpdate({ email }, { email, password: passwordHash }, { upsert: true, new: true });
console.log(`Admin user synchronized: ${email}`);
process.exit(0);
