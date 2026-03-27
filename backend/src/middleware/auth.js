const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

// Verify JWT and attach user to req
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await pool.query(
      'SELECT id, name, email, role, status, university FROM users WHERE id = $1',
      [decoded.id]
    );
    if (!rows.length) return res.status(401).json({ error: 'User not found' });
    if (rows[0].status === 'deactivated') return res.status(403).json({ error: 'Account deactivated' });
    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired, please login again' });
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based access control
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: `Access denied. Required role: ${roles.join(' or ')}` });
  }
  next();
};

module.exports = { authenticate, authorize };
