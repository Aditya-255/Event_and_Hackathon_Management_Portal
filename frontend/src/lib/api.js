import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
};

// ── Events ────────────────────────────────────────────
export const eventsAPI = {
  getAll:   (params) => api.get('/events', { params }),
  getOne:   (id)     => api.get(`/events/${id}`),
  create:   (data)   => api.post('/events', data),
  update:   (id, d)  => api.put(`/events/${id}`, d),
  delete:   (id)     => api.delete(`/events/${id}`),
};

// ── Teams ─────────────────────────────────────────────
export const teamsAPI = {
  getAll:   (params) => api.get('/teams', { params }),
  getOne:   (id)     => api.get(`/teams/${id}`),
  register: (data)   => api.post('/teams/register', data),
  delete:   (id)     => api.delete(`/teams/${id}`),
};

// ── Abstracts ─────────────────────────────────────────
export const abstractsAPI = {
  getAll:      (params) => api.get('/abstracts', { params }),
  submit:      (data)   => api.post('/abstracts', data),
  updateStatus:(id, s)  => api.put(`/abstracts/${id}/status`, { status: s }),
};

// ── Scores ────────────────────────────────────────────
export const scoresAPI = {
  getByTeam: (teamId) => api.get(`/scores/team/${teamId}`),
  submit:    (data)   => api.post('/scores', data),
};

// ── Leaderboard ───────────────────────────────────────
export const leaderboardAPI = {
  global:   ()        => api.get('/leaderboard'),
  byEvent:  (eventId) => api.get(`/leaderboard/event/${eventId}`),
};

// ── Admin ─────────────────────────────────────────────
export const adminAPI = {
  getUsers:   (params) => api.get('/admin/users', { params }),
  updateUser: (id, d)  => api.put(`/admin/users/${id}`, d),
  deleteUser: (id)     => api.delete(`/admin/users/${id}`),
  getStats:   ()       => api.get('/admin/stats'),
};

export default api;
