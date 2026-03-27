const router = require('express').Router();
const pool   = require('../db/pool');

// GET /api/leaderboard  — global (all evaluated teams)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        ROW_NUMBER() OVER (ORDER BY t.score DESC NULLS LAST) AS rank,
        t.id, t.name AS team, t.score, t.members, t.tier AS track,
        e.title AS event,
        COALESCE(ROUND(t.score * 4.5)::INT, 0) AS pts
      FROM teams t
      LEFT JOIN events e ON e.id = t.event_id
      WHERE t.status = 'Evaluated' AND t.score IS NOT NULL
      ORDER BY t.score DESC NULLS LAST
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/leaderboard/event/:eventId
router.get('/event/:eventId', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        ROW_NUMBER() OVER (ORDER BY t.score DESC NULLS LAST) AS rank,
        t.id, t.name AS team, t.score, t.members, t.tier AS track,
        e.title AS event,
        COALESCE(ROUND(t.score * 4.5)::INT, 0) AS pts
      FROM teams t
      LEFT JOIN events e ON e.id = t.event_id
      WHERE t.event_id = $1 AND t.status = 'Evaluated' AND t.score IS NOT NULL
      ORDER BY t.score DESC NULLS LAST
    `, [req.params.eventId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
