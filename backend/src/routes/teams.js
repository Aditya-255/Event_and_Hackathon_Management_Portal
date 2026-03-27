const router = require('express').Router();
const pool   = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/teams
router.get('/', authenticate, async (req, res) => {
  const { event_id, status } = req.query;
  let q = `
    SELECT t.*, u.name AS captain_name, e.title AS event_title
    FROM teams t
    LEFT JOIN users u ON u.id = t.captain_id
    LEFT JOIN events e ON e.id = t.event_id
    WHERE 1=1
  `;
  const params = [];
  if (event_id) { params.push(event_id); q += ` AND t.event_id = $${params.length}`; }
  if (status)   { params.push(status);   q += ` AND t.status = $${params.length}`; }
  if (req.user.role === 'participant') {
    params.push(req.user.id);
    q += ` AND t.captain_id = $${params.length}`;
  }
  q += ' ORDER BY t.created_at DESC';
  try {
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/teams/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT t.*, u.name AS captain_name, e.title AS event_title
      FROM teams t
      LEFT JOIN users u ON u.id = t.captain_id
      LEFT JOIN events e ON e.id = t.event_id
      WHERE t.id = $1
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Team not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/teams/register
router.post('/register', authenticate, authorize('participant', 'admin'), async (req, res) => {
  const { event_id, team_name, members, tier } = req.body;
  if (!event_id || !team_name) return res.status(400).json({ error: 'event_id and team_name are required' });
  try {
    const evRes = await pool.query('SELECT id, status, max_teams FROM events WHERE id = $1', [event_id]);
    if (!evRes.rows.length) return res.status(404).json({ error: 'Event not found' });
    const ev = evRes.rows[0];
    if (!['Active', 'Registration Open'].includes(ev.status))
      return res.status(400).json({ error: 'Event is not open for registration' });
    const countRes = await pool.query('SELECT COUNT(*) FROM teams WHERE event_id = $1', [event_id]);
    if (parseInt(countRes.rows[0].count) >= ev.max_teams)
      return res.status(400).json({ error: 'Event is full' });
    const { rows } = await pool.query(
      `INSERT INTO teams (name, captain_id, event_id, members, tier) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [team_name, req.user.id, event_id, members || 2, tier || 'Junior']
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/teams/:id  (update status/score by organizer/admin)
router.put('/:id', authenticate, authorize('admin', 'organizer'), async (req, res) => {
  const { name, status, score, members, tier } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE teams SET name=COALESCE($1,name), status=COALESCE($2,status),
       score=COALESCE($3,score), members=COALESCE($4,members), tier=COALESCE($5,tier),
       updated_at=NOW() WHERE id=$6 RETURNING *`,
      [name, status, score, members, tier, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Team not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/teams/:id
router.delete('/:id', authenticate, authorize('admin', 'organizer'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM teams WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Team deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
