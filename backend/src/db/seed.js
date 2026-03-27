require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const pool = require('./pool');
const bcrypt = require('bcryptjs');

async function seed() {
  const client = await pool.connect();
  try {
    const hash = (pw) => bcrypt.hashSync(pw, 10);

    // Seed users
    await client.query(`
      INSERT INTO users (name, email, password, university, role, status) VALUES
        ('Admin User',       'admin@eventhub.com',       $1, 'EventHub HQ',   'admin',       'active'),
        ('Aditya Patel',     'organizer@eventhub.com',   $2, 'RK University',  'organizer',   'active'),
        ('Rahul Sharma',     'participant@eventhub.com', $3, 'Code Club',      'participant', 'active'),
        ('Priya Mehta',      'judge@eventhub.com',       $4, 'Tech Inc.',      'judge',       'active'),
        ('Karan Singh',      'karan@rku.edu',            $5, 'RK University',  'participant', 'active'),
        ('Sneha Joshi',      'sneha@design.co',          $6, 'Design Co.',     'organizer',   'active')
      ON CONFLICT (email) DO NOTHING
    `, [hash('admin123'), hash('organizer123'), hash('participant123'), hash('judge123'), hash('pass123'), hash('pass123')]);

    // Seed events
    await client.query(`
      INSERT INTO events (title, description, category, status, start_date, end_date, location, image_url, prize, max_teams, organizer_id)
      SELECT
        'Spring Hackathon 2026',
        '48-hour competitive coding event for all skill levels. Build innovative solutions to real-world problems.',
        'Tech', 'Active',
        NOW() + INTERVAL '5 days', NOW() + INTERVAL '7 days',
        'RKU Main Campus, Rajkot',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
        '₹95,000', 50, u.id
      FROM users u WHERE u.email = 'organizer@eventhub.com'
      ON CONFLICT DO NOTHING
    `);

    await client.query(`
      INSERT INTO events (title, description, category, status, start_date, end_date, location, image_url, prize, max_teams, organizer_id)
      SELECT
        'Winter Ideathon 2025',
        'Pitch your startup idea to a panel of investors and industry experts.',
        'Open', 'Completed',
        NOW() - INTERVAL '60 days', NOW() - INTERVAL '58 days',
        'Innovation Hub, Ahmedabad',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
        '₹50,000', 30, u.id
      FROM users u WHERE u.email = 'organizer@eventhub.com'
      ON CONFLICT DO NOTHING
    `);

    await client.query(`
      INSERT INTO events (title, description, category, status, start_date, end_date, location, image_url, prize, max_teams, organizer_id)
      SELECT
        'AI/ML Summit 2026',
        'Solve cutting-edge machine learning challenges with real datasets.',
        'AI/ML', 'Upcoming',
        NOW() + INTERVAL '30 days', NOW() + INTERVAL '32 days',
        'Tech Park, Surat',
        'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800',
        '₹1,20,000', 40, u.id
      FROM users u WHERE u.email = 'organizer@eventhub.com'
      ON CONFLICT DO NOTHING
    `);

    // Seed teams for Spring Hackathon
    const evRes = await client.query(`SELECT id FROM events WHERE title = 'Spring Hackathon 2026' LIMIT 1`);
    const capRes = await client.query(`SELECT id FROM users WHERE email = 'participant@eventhub.com' LIMIT 1`);
    if (evRes.rows.length && capRes.rows.length) {
      const eventId = evRes.rows[0].id;
      const capId   = capRes.rows[0].id;

      await client.query(`
        INSERT INTO teams (name, captain_id, event_id, members, tier, status, score) VALUES
          ('Innovators Hub', $1, $2, 4, 'Senior',       'Evaluated', 98.5),
          ('Code Crafters',  $1, $2, 3, 'Professional', 'Evaluated', 95.0),
          ('Data Miners',    $1, $2, 4, 'Senior',       'Evaluated', 92.2),
          ('Campus Fix',     $1, $2, 2, 'Junior',       'Evaluated', 89.0),
          ('Byte Me',        $1, $2, 3, 'Junior',       'Submitted', 85.5)
        ON CONFLICT DO NOTHING
      `, [capId, eventId]);
    }

    console.log('✅ Database seeded successfully');
    console.log('');
    console.log('Demo credentials:');
    console.log('  Admin:       admin@eventhub.com       / admin123');
    console.log('  Organizer:   organizer@eventhub.com   / organizer123');
    console.log('  Participant: participant@eventhub.com / participant123');
    console.log('  Judge:       judge@eventhub.com       / judge123');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
