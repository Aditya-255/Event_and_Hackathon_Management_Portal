const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool   = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

// GET /api/admin/users
router.get('/users', async (req, res) => {
  const { role, status, search } = req.query;
  let q = `SELECT id, name, email, university, role, status, created_at FROM users WHERE 1=1`;
  const params = [];
  if (role   && role   !== 'All') { params.push(role.toLowerCase());   q += ` AND role = $${params.length}`; }
  if (status && status !== 'All') { params.push(status.toLowerCase()); q += ` AND status = $${params.length}`; }
  if (search) {
    params.push(`%${search}%`);
    q += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
  }
  q += ' ORDER BY created_at DESC';
  try {
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/users  (create user)
router.post('/users', async (req, res) => {
  const { name, email, university, role, status, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password required' });
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name,email,password,university,role,status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,name,email,university,role,status,created_at`,
      [name, email, hashed, university || null, role || 'participant', status || 'active']
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
  const { name, email, university, role, status, password } = req.body;
  try {
    let q, params;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      q = `UPDATE users SET name=$1,email=$2,university=$3,role=$4,status=$5,password=$6,updated_at=NOW()
           WHERE id=$7 RETURNING id,name,email,university,role,status`;
      params = [name, email, university, role, status?.toLowerCase(), hashed, req.params.id];
    } else {
      q = `UPDATE users SET name=$1,email=$2,university=$3,role=$4,status=$5,updated_at=NOW()
           WHERE id=$6 RETURNING id,name,email,university,role,status`;
      params = [name, email, university, role, status?.toLowerCase(), req.params.id];
    }
    const { rows } = await pool.query(q, params);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  // Prevent admin from deleting themselves
  if (parseInt(req.params.id) === req.user.id)
    return res.status(400).json({ error: 'Cannot delete your own account' });
  try {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/stats
router.get('/stats', async (_req, res) => {
  try {
    const [users, events, teams, abstracts] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS total,
                  COUNT(*) FILTER (WHERE status='active')::int AS active,
                  COUNT(*) FILTER (WHERE status='pending')::int AS pending FROM users`),
      pool.query(`SELECT COUNT(*)::int AS total,
                  COUNT(*) FILTER (WHERE status='Active')::int AS active FROM events`),
      pool.query(`SELECT COUNT(*)::int AS total FROM teams`),
      pool.query(`SELECT COUNT(*)::int AS total,
                  COUNT(*) FILTER (WHERE status='Pending')::int AS pending FROM abstracts`),
    ]);
    res.json({
      users:     users.rows[0],
      events:    events.rows[0],
      teams:     teams.rows[0],
      abstracts: abstracts.rows[0],
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/settings
router.get('/settings', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT key, value FROM settings');
    const settings = Object.fromEntries(rows.map(r => [r.key, r.value === 'true']));
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/settings
router.put('/settings', async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await pool.query(
        `INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`,
        [key, String(value)]
      );
    }
    res.json({ message: 'Settings updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
