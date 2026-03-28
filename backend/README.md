# EventHub Backend API

Node.js + Express REST API with PostgreSQL.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your DB credentials
node src/db/init.js   # Create tables
node src/db/seed.js   # Seed demo data
node server.js        # Start server
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | JWT | Get current user |
| GET | /api/events | Public | List events |
| POST | /api/events | Organizer/Admin | Create event |
| GET | /api/teams | JWT | List teams |
| POST | /api/teams/register | Participant | Register team |
| POST | /api/abstracts | Participant | Submit abstract |
| POST | /api/scores | Judge/Admin | Submit scores |
| GET | /api/leaderboard | Public | Global leaderboard |
| GET | /api/admin/stats | Admin | Dashboard stats |

## Demo Credentials

- Admin: `admin@eventhub.com` / `admin123`
- Organizer: `organizer@eventhub.com` / `organizer123`
- Participant: `participant@eventhub.com` / `participant123`
