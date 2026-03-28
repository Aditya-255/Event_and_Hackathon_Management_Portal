const router = require('express').Router();
const pool   = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/events
router.get('/', async (req, res) => {
  const { category, status, search } = req.query;
  let q = `
    SELECT e.*, u.name AS organizer_name,
      (SELECT COUNT(*) FROM teams t WHERE t.event_id = e.id) AS teams_count
    FROM events e
    LEFT JOIN users u ON u.id = e.organizer_id
    WHERE 1=1
  `;
  const params = [];
  if (category && category !== 'All') { params.push(category); q += ` AND e.category = $${params.length}`; }
  if (status   && status   !== 'All') { params.push(status);   q += ` AND e.status = $${params.length}`; }
  if (search) {
    params.push(`%${search}%`);
    q += ` AND (e.title ILIKE $${params.length} OR e.description ILIKE $${params.length})`;
  }
  q += ' ORDER BY e.created_at DESC';
  try {
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid event ID' });
  try {
    const { rows } = await pool.query(`
      SELECT e.*, u.name AS organizer_name,
        (SELECT COUNT(*) FROM teams t WHERE t.event_id = e.id) AS teams_count
      FROM events e
      LEFT JOIN users u ON u.id = e.organizer_id
      WHERE e.id = $1
    `, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/events
router.post('/', authenticate, authorize('admin', 'organizer'), async (req, res) => {
  const { title, description, category, status, start_date, end_date, location, image_url, prize, max_teams } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  if (title.trim().length < 3) return res.status(400).json({ error: 'Title must be at least 3 characters' });
  if (max_teams && (max_teams < 1 || max_teams > 500)) return res.status(400).json({ error: 'max_teams must be between 1 and 500' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO events (title,description,category,status,start_date,end_date,location,image_url,prize,max_teams,organizer_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [title.trim(), description || null, category || 'Open', status || 'Draft',
       start_date || null, end_date || null, location || null, image_url || null,
       prize || null, max_teams || 50, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/events/:id
router.put('/:id', authenticate, authorize('admin', 'organizer'), async (req, res) => {
  const { title, description, category, status, start_date, end_date, location, image_url, prize, max_teams } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE events SET title=$1,description=$2,category=$3,status=$4,start_date=$5,end_date=$6,
       location=$7,image_url=$8,prize=$9,max_teams=$10,updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [title, description || null, category, status,
       start_date || null, end_date || null, location || null, image_url || null,
       prize || null, max_teams || 50, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/events/:id
router.delete('/:id', authenticate, authorize('admin', 'organizer'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
