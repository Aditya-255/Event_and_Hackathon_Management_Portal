const router = require('express').Router();
const pool   = require('../db/pool');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/scores/team/:teamId
router.get('/team/:teamId', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT s.*, u.name AS judge_name, a.project_name
      FROM scores s
      LEFT JOIN users u ON u.id = s.judge_id
      LEFT JOIN abstracts a ON a.id = s.abstract_id
      WHERE s.team_id = $1
      ORDER BY s.created_at DESC
    `, [req.params.teamId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/scores
router.post('/', authenticate, authorize('admin', 'organizer', 'judge'), async (req, res) => {
  const { abstract_id, team_id, innovation_score, technical_score, business_score, presentation_score, comments } = req.body;
  if (!abstract_id || !team_id) return res.status(400).json({ error: 'abstract_id and team_id are required' });

  // Validate score range 0-10
  const scores = [innovation_score, technical_score, business_score, presentation_score];
  if (scores.some(s => s === undefined || s === null)) return res.status(400).json({ error: 'All four scores are required' });
  if (scores.some(s => isNaN(s) || s < 0 || s > 10)) return res.status(400).json({ error: 'Scores must be between 0 and 10' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO scores (abstract_id, team_id, judge_id, innovation_score, technical_score, business_score, presentation_score, comments)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [abstract_id, team_id, req.user.id, innovation_score, technical_score, business_score, presentation_score, comments]
    );

    // Update team score and status
    const score = rows[0].weighted_score;
    await pool.query(
      `UPDATE teams SET score=$1, status='Evaluated', updated_at=NOW() WHERE id=$2`,
      [score, team_id]
    );
    await pool.query(
      `UPDATE abstracts SET status='Evaluated', updated_at=NOW() WHERE id=$1`,
      [abstract_id]
    );

    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
