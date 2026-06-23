// ============================================
// CreadX Backend — server.js
// Express + MySQL2, deployed on Render
// ============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { requireAuth, requireRole } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- CORS ----------
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://creadx-admin-agent-system.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// ---------- DB Pool ----------
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ============================================
// AUTH
// ============================================

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'email, password and role are required' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND role = ? LIMIT 1',
      [email, role]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is disabled' });
    }

    // SECURITY FIX: plaintext fallback removed. bcrypt compare ONLY.
    const isMatch = await bcrypt.compare(password, user.password_hash).catch(() => false);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// GET /admin/metrics — dashboard KPI cards
app.get('/admin/metrics', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query(`SELECT COUNT(*) AS totalUsers FROM users`);
    const [[{ totalAgents }]] = await pool.query(
      `SELECT COUNT(*) AS totalAgents FROM agent_profiles`
    );
    const [[{ totalBookings }]] = await pool.query(`SELECT COUNT(*) AS totalBookings FROM bookings`);
    const [[{ totalRevenue }]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS totalRevenue FROM commissions WHERE is_paid = TRUE`
    );
    const [[{ pendingAgents }]] = await pool.query(
      `SELECT COUNT(*) AS pendingAgents FROM agent_profiles WHERE status = 'pending'`
    );

    res.json({ totalUsers, totalAgents, totalBookings, totalRevenue, pendingAgents });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /admin/agents — list all agents with status
app.get('/admin/agents', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ap.id, ap.user_id, ap.business_name, ap.city, ap.service_type,
             ap.status, ap.average_rating, u.email, u.full_name, u.is_active
      FROM agent_profiles ap
      JOIN users u ON ap.user_id = u.id
      ORDER BY ap.id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('List agents error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /admin/agents/:id/status — approve/reject/suspend agent
app.put('/admin/agents/:id/status', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected' | 'suspended' | 'pending'
    const allowed = ['approved', 'rejected', 'suspended', 'pending'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
    }

    const [result] = await pool.query(
      `UPDATE agent_profiles SET status = ? WHERE id = ?`,
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({ message: `Agent status updated to ${status}` });
  } catch (error) {
    console.error('Update agent status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /admin/bookings — all bookings with joins
app.get('/admin/bookings', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.id, b.status, b.scheduled_date,
             cu.full_name AS customer_name, cu.email AS customer_email,
             ap.business_name AS agent_name
      FROM bookings b
      JOIN users cu ON b.customer_id = cu.id
      JOIN agent_profiles ap ON b.agent_id = ap.id
      ORDER BY b.scheduled_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('List bookings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /admin/users — list all users
app.get('/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, full_name, email, role, is_active
      FROM users
      ORDER BY id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /admin/revenue — revenue stats from real DB
app.get('/admin/revenue', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [monthly] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
             SUM(amount) AS revenue,
             SUM(CASE WHEN is_paid THEN amount ELSE 0 END) AS paidRevenue
      FROM commissions
      GROUP BY month
      ORDER BY month ASC
    `);
    const [[totals]] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS totalRevenue,
             COALESCE(SUM(CASE WHEN is_paid THEN amount ELSE 0 END), 0) AS paidRevenue,
             COALESCE(SUM(CASE WHEN NOT is_paid THEN amount ELSE 0 END), 0) AS unpaidRevenue
      FROM commissions
    `);
    res.json({ totals, monthly });
  } catch (error) {
    console.error('Revenue error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---- Packages CRUD (admin) ----

// GET /admin/packages
app.get('/admin/packages', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM packages ORDER BY created_at DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /admin/packages
app.post('/admin/packages', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, description, destination, price, duration_days, max_capacity, images, is_active } = req.body;
    if (!name || !destination || price == null || !duration_days) {
      return res.status(400).json({ error: 'name, destination, price and duration_days are required' });
    }

    const [result] = await pool.query(
      `INSERT INTO packages (name, description, destination, price, duration_days, max_capacity, images, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        destination,
        price,
        duration_days,
        max_capacity || 10,
        images ? JSON.stringify(images) : null,
        is_active === undefined ? true : !!is_active
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Package created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /admin/packages/:id
app.put('/admin/packages/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, description, destination, price, duration_days, max_capacity, images, is_active } = req.body;

    const [result] = await pool.query(
      `UPDATE packages SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        destination = COALESCE(?, destination),
        price = COALESCE(?, price),
        duration_days = COALESCE(?, duration_days),
        max_capacity = COALESCE(?, max_capacity),
        images = COALESCE(?, images),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        name || null,
        description || null,
        destination || null,
        price ?? null,
        duration_days || null,
        max_capacity || null,
        images ? JSON.stringify(images) : null,
        is_active === undefined ? null : !!is_active,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({ message: 'Package updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /admin/packages/:id
app.delete('/admin/packages/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [result] = await pool.query(`DELETE FROM packages WHERE id = ?`, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// AGENT ROUTES (all scoped to the logged-in agent via JWT)
// ============================================

// Small helper: resolve agent_profiles.id from the JWT user id
async function getAgentProfileId(userId) {
  const [rows] = await pool.query('SELECT id FROM agent_profiles WHERE user_id = ?', [userId]);
  return rows.length ? rows[0].id : null;
}

// GET /agent/dashboard — dynamic, replaces the old hardcoded /agent/dashboard/4
app.get('/agent/dashboard', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const [agentRows] = await pool.query(
      'SELECT * FROM agent_profiles WHERE user_id = ?', [req.user.id]
    );
    if (!agentRows.length) return res.status(404).json({ error: 'Agent profile not found' });
    const agent = agentRows[0];

    const [trips] = await pool.query(`
      SELECT b.id, b.status, b.scheduled_date, u.full_name as customer_name
      FROM bookings b JOIN users u ON b.customer_id = u.id
      WHERE b.agent_id = ? ORDER BY b.scheduled_date ASC LIMIT 10
    `, [agent.id]);

    res.json({ agentName: agent.business_name, rating: agent.average_rating, upcomingTrips: trips });
  } catch (error) {
    console.error('Agent dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /agent/bookings — agent's own bookings
app.get('/agent/bookings', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const agentId = await getAgentProfileId(req.user.id);
    if (!agentId) return res.status(404).json({ error: 'Agent profile not found' });

    const [rows] = await pool.query(`
      SELECT b.id, b.status, b.scheduled_date, u.full_name AS customer_name, u.email AS customer_email
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      WHERE b.agent_id = ?
      ORDER BY b.scheduled_date DESC
    `, [agentId]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /agent/bookings — agent creates a booking
app.post('/agent/bookings', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const agentId = await getAgentProfileId(req.user.id);
    if (!agentId) return res.status(404).json({ error: 'Agent profile not found' });

    const { customer_id, scheduled_date, status } = req.body;
    if (!customer_id || !scheduled_date) {
      return res.status(400).json({ error: 'customer_id and scheduled_date are required' });
    }

    const [result] = await pool.query(
      `INSERT INTO bookings (agent_id, customer_id, scheduled_date, status) VALUES (?, ?, ?, ?)`,
      [agentId, customer_id, scheduled_date, status || 'requested']
    );

    res.status(201).json({ id: result.insertId, message: 'Booking created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /agent/offers — available packages for agent to browse
app.get('/agent/offers', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM packages WHERE is_active = TRUE ORDER BY created_at DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /agent/earnings — agent's commission summary
app.get('/agent/earnings', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const agentId = await getAgentProfileId(req.user.id);
    if (!agentId) return res.status(404).json({ error: 'Agent profile not found' });

    const [[totals]] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS totalEarned,
             COALESCE(SUM(CASE WHEN is_paid THEN amount ELSE 0 END), 0) AS totalPaid,
             COALESCE(SUM(CASE WHEN NOT is_paid THEN amount ELSE 0 END), 0) AS totalPending
      FROM commissions WHERE agent_id = ?
    `, [agentId]);

    const [history] = await pool.query(`
      SELECT c.id, c.amount, c.is_paid, c.created_at, c.paid_at, b.scheduled_date
      FROM commissions c
      JOIN bookings b ON c.booking_id = b.id
      WHERE c.agent_id = ?
      ORDER BY c.created_at DESC
    `, [agentId]);

    res.json({ totals, history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /agent/profile
app.get('/agent/profile', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ap.*, u.full_name, u.email
      FROM agent_profiles ap
      JOIN users u ON ap.user_id = u.id
      WHERE ap.user_id = ?
    `, [req.user.id]);

    if (!rows.length) return res.status(404).json({ error: 'Agent profile not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /agent/profile
app.put('/agent/profile', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const { business_name, city, service_type } = req.body;

    const [result] = await pool.query(
      `UPDATE agent_profiles SET
        business_name = COALESCE(?, business_name),
        city = COALESCE(?, city),
        service_type = COALESCE(?, service_type)
       WHERE user_id = ?`,
      [business_name || null, city || null, service_type || null, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- Leads CRUD (agent) ----

// GET /agent/leads
app.get('/agent/leads', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const agentId = await getAgentProfileId(req.user.id);
    if (!agentId) return res.status(404).json({ error: 'Agent profile not found' });

    const [rows] = await pool.query(
      `SELECT * FROM leads WHERE agent_id = ? ORDER BY created_at DESC`,
      [agentId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /agent/leads
app.post('/agent/leads', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const agentId = await getAgentProfileId(req.user.id);
    if (!agentId) return res.status(404).json({ error: 'Agent profile not found' });

    const { customer_name, customer_email, customer_phone, status, notes } = req.body;
    if (!customer_name) {
      return res.status(400).json({ error: 'customer_name is required' });
    }

    const [result] = await pool.query(
      `INSERT INTO leads (agent_id, customer_name, customer_email, customer_phone, status, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [agentId, customer_name, customer_email || null, customer_phone || null, status || 'new', notes || null]
    );

    res.status(201).json({ id: result.insertId, message: 'Lead created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /agent/leads/:id
app.put('/agent/leads/:id', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const agentId = await getAgentProfileId(req.user.id);
    if (!agentId) return res.status(404).json({ error: 'Agent profile not found' });

    const { customer_name, customer_email, customer_phone, status, notes } = req.body;

    const [result] = await pool.query(
      `UPDATE leads SET
        customer_name = COALESCE(?, customer_name),
        customer_email = COALESCE(?, customer_email),
        customer_phone = COALESCE(?, customer_phone),
        status = COALESCE(?, status),
        notes = COALESCE(?, notes)
       WHERE id = ? AND agent_id = ?`,
      [customer_name || null, customer_email || null, customer_phone || null, status || null, notes || null, req.params.id, agentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ message: 'Lead updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
app.listen(PORT, () => {
  console.log(`CreadX backend running on port ${PORT}`);
});