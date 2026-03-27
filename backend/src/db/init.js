require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const pool = require('./pool');

const schema = `
-- Users
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  university  VARCHAR(200),
  role        VARCHAR(20) NOT NULL DEFAULT 'participant'
                CHECK (role IN ('admin','organizer','participant','judge')),
  status      VARCHAR(20) NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','pending','deactivated')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  category     VARCHAR(50) DEFAULT 'Open',
  status       VARCHAR(30) NOT NULL DEFAULT 'Upcoming'
                 CHECK (status IN ('Active','Upcoming','Draft','Completed','Registration Open','Registration Full','Event Over')),
  start_date   TIMESTAMPTZ,
  end_date     TIMESTAMPTZ,
  location     VARCHAR(200),
  image_url    TEXT,
  prize        VARCHAR(100),
  max_teams    INT DEFAULT 50,
  organizer_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  captain_id  INT REFERENCES users(id) ON DELETE SET NULL,
  event_id    INT REFERENCES events(id) ON DELETE CASCADE,
  members     INT DEFAULT 2 CHECK (members BETWEEN 1 AND 6),
  tier        VARCHAR(30) DEFAULT 'Junior'
                CHECK (tier IN ('Junior','Senior','Professional')),
  status      VARCHAR(30) DEFAULT 'Registered'
                CHECK (status IN ('Registered','Submitted','Evaluated')),
  score       NUMERIC(5,2),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members (junction)
CREATE TABLE IF NOT EXISTS team_members (
  id       SERIAL PRIMARY KEY,
  team_id  INT REFERENCES teams(id) ON DELETE CASCADE,
  user_id  INT REFERENCES users(id) ON DELETE CASCADE,
  role     VARCHAR(20) DEFAULT 'member' CHECK (role IN ('captain','member')),
  UNIQUE(team_id, user_id)
);

-- Abstracts / Submissions
CREATE TABLE IF NOT EXISTS abstracts (
  id           SERIAL PRIMARY KEY,
  team_id      INT REFERENCES teams(id) ON DELETE CASCADE,
  event_id     INT REFERENCES events(id) ON DELETE CASCADE,
  project_name VARCHAR(200) NOT NULL,
  description  TEXT,
  file_url     TEXT,
  category     VARCHAR(100),
  status       VARCHAR(30) DEFAULT 'Pending'
                 CHECK (status IN ('Pending','Under Review','Approved','Rejected','Evaluated')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Scores / Evaluations
CREATE TABLE IF NOT EXISTS scores (
  id                  SERIAL PRIMARY KEY,
  abstract_id         INT REFERENCES abstracts(id) ON DELETE CASCADE,
  team_id             INT REFERENCES teams(id) ON DELETE CASCADE,
  judge_id            INT REFERENCES users(id) ON DELETE SET NULL,
  innovation_score    NUMERIC(4,2) DEFAULT 0,
  technical_score     NUMERIC(4,2) DEFAULT 0,
  business_score      NUMERIC(4,2) DEFAULT 0,
  presentation_score  NUMERIC(4,2) DEFAULT 0,
  weighted_score      NUMERIC(5,2) GENERATED ALWAYS AS (
    (innovation_score * 0.30) +
    (technical_score  * 0.30) +
    (business_score   * 0.20) +
    (presentation_score * 0.20)
  ) STORED,
  comments            TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Settings (key-value store for admin settings)
CREATE TABLE IF NOT EXISTS settings (
  key    VARCHAR(100) PRIMARY KEY,
  value  TEXT NOT NULL
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('maintenance_mode',       'false'),
  ('auto_approve_organizers','false'),
  ('email_notifications',    'true'),
  ('public_leaderboard',     'true'),
  ('allow_registrations',    'true'),
  ('two_factor_auth',        'false')
ON CONFLICT (key) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_status    ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category  ON events(category);
CREATE INDEX IF NOT EXISTS idx_teams_event      ON teams(event_id);
CREATE INDEX IF NOT EXISTS idx_abstracts_team   ON abstracts(team_id);
CREATE INDEX IF NOT EXISTS idx_scores_team      ON scores(team_id);
`;

async function init() {
  const client = await pool.connect();
  try {
    await client.query(schema);
    console.log('✅ Database schema initialized successfully');
  } catch (err) {
    console.error('❌ Schema init error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

init();
