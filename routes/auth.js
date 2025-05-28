import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// TEMP: Store in .env in production
const ADMIN_EMAIL = 'admin@unscripted.in';
const ADMIN_PASSWORD = 'Admin123';
const JWT_SECRET = 'supersecretjwtkey';

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

export default router;
