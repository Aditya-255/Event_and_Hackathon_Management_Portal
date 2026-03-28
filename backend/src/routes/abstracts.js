const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const pool   = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../../uploads/abstracts');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['.pdf', '.ppt', '.pptx', '.doc', '.docx'];
    ok.includes(path.extname(file.originalname).toLowerCase()) ? cb(null, true) : cb(new Error('Only PDF/PPT/DOC files allowed'));
  },
});

// GET /api/abstracts
router.get('/', authenticate, async (req, res) => {
  const { event_id, status, team_id } = req.query;
  let q = `
    SELECT a.*, t.name AS team_name, e.title AS event_title
    FROM abstracts a
    LEFT JOIN teams t ON t.id = a.team_id
    LEFT JOIN events e ON e.id = a.event_id
    WHERE 1=1
  `;
  const params = [];
  if (event_id) { params.push(event_id); q += ` AND a.event_id = $${params.length}`; }
  if (status)   { params.push(status);   q += ` AND a.status = $${params.length}`; }
  if (team_id)  { params.push(team_id);  q += ` AND a.team_id = $${params.length}`; }
  if (req.user.role === 'participant') {
    params.push(req.user.id);
    q += ` AND t.captain_id = $${params.length}`;
  }
  q += ' ORDER BY a.created_at DESC';
  try {
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/abstracts/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.*, t.name AS team_name, e.title AS event_title
      FROM abstracts a
      LEFT JOIN teams t ON t.id = a.team_id
      LEFT JOIN events e ON e.id = a.event_id
      WHERE a.id = $1
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Abstract not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/abstracts
router.post('/', authenticate, authorize('participant', 'admin', 'organizer'), upload.single('file'), async (req, res) => {
  const { team_id, event_id, project_name, description, category } = req.body;
  if (!team_id || !event_id || !project_name)
    return res.status(400).json({ error: 'team_id, event_id and project_name are required' });
  const file_url = req.file ? `/uploads/abstracts/${req.file.filename}` : null;
  try {
    const { rows } = await pool.query(
      `INSERT INTO abstracts (team_id, event_id, project_name, description, file_url, category)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [team_id, event_id, project_name, description || null, file_url, category || 'Open']
    );
    await pool.query(`UPDATE teams SET status='Submitted', updated_at=NOW() WHERE id=$1`, [team_id]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/abstracts/:id/status
router.put('/:id/status', authenticate, authorize('admin', 'organizer', 'judge'), async (req, res) => {
  const { status } = req.body;
  const valid = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Evaluated'];
  if (!status) return res.status(400).json({ error: 'Status is required' });
  if (!valid.includes(status)) return res.status(400).json({ error: `Invalid status. Must be one of: ${valid.join(', ')}` });
  try {
    const { rows } = await pool.query(
      `UPDATE abstracts SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Abstract not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/abstracts/:id
router.delete('/:id', authenticate, authorize('admin', 'organizer'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM abstracts WHERE id=$1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Abstract not found' });
    res.json({ message: 'Abstract deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
