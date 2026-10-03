import jwt from 'jsonwebtoken';

export function protect(req, res, next) {
  const token = req.cookies?.rana_admin_session || (req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null);
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
