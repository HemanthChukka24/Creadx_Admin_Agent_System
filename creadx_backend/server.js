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
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { requireAuth, requireRole } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 5000;
const nodemailer = require('nodemailer');

// In-memory OTP store { email: { code, expiresAt, name } }
// Simple and works fine for MVP — no DB table needed
const otpStore = new Map();

// Email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// ---------- CORS ----------
app.use(cors({
  origin: [
    'https://creadx-admin-agent-system.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(express.json());

// ---------- Static file serving ----------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Keep-alive (prevents Render free tier sleeping) ----------
setInterval(() => {
  https.get('https://creadx-admin-agent-system.onrender.com/health', () => {});
}, 10 * 60 * 1000);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ---------- DB Pool ----------
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ---------- Multer (image uploads) ----------
const uploadDir = path.join(__dirname, 'uploads/packages');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `pkg-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase())
             && allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Images only: jpg, png, webp'));
  },
});

// ---------- Helper ----------
async function getAgentProfileId(userId) {
  const [rows] = await pool.query('SELECT id FROM agent_profiles WHERE user_id = ?', [userId]);
  return rows.length ? rows[0].id : null;
}

// ============================================
// AUTH
// ============================================

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

    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    if (!user.is_active) return res.status(403).json({ error: 'Account is disabled' });

    const isMatch = await bcrypt.compare(password, user.password_hash).catch(() => false);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// ─── STEP 1: Send OTP to email ───────────────────────────────
app.post('/auth/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'email and name are required' });
    }

    // Check if email already registered
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing.length) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store in memory
    otpStore.set(email, { code, expiresAt, name });

    // Send email
    await transporter.sendMail({
      from: `"CreadX Platform" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Your CreadX Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0f172a; font-size: 24px; margin: 0;">CreadX</h1>
            <p style="color: #64748b; margin: 4px 0 0;">Tourism Management Platform</p>
          </div>
          <div style="background: white; border-radius: 8px; padding: 24px; border: 1px solid #e2e8f0;">
            <p style="color: #0f172a; font-size: 16px; margin: 0 0 8px;">Hi ${name},</p>
            <p style="color: #475569; font-size: 14px; margin: 0 0 24px;">
              Use the code below to verify your email and create your agent account.
              This code expires in <strong>10 minutes</strong>.
            </p>
            <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <p style="color: #64748b; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
              <p style="color: #0f172a; font-size: 40px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: monospace;">${code}</p>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`OTP sent to ${email}`);
    res.json({ success: true, message: 'Verification code sent to your email.' });

  } catch (error) {
    console.error('Send OTP error:', error.message);
    res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
  }
});

// ─── STEP 2: Verify OTP ──────────────────────────────────────
app.post('/auth/verify-otp', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'email and code are required' });
  }

  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'Code has expired. Please request a new one.' });
  }
  if (record.code !== code.toString().trim()) {
    return res.status(400).json({ error: 'Incorrect code. Please try again.' });
  }

  // Mark as verified (keep in store for password step)
  otpStore.set(email, { ...record, verified: true });
  res.json({ success: true, message: 'Email verified successfully.' });
});

// ─── STEP 3: Complete registration (after OTP verified) ──────
app.post('/auth/register-agent', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Must have a verified OTP
    const record = otpStore.get(email);
    if (!record || !record.verified) {
      return res.status(403).json({ error: 'Email not verified. Please complete OTP verification first.' });
    }

    const name = record.name;

    // Double-check email not already registered
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing.length) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password and create user
    const password_hash = await bcrypt.hash(password, 10);

    const [userResult] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, is_active)
       VALUES (?, ?, ?, 'agent', true)`,
      [name, email, password_hash]
    );

    const userId = userResult.insertId;

    // Create agent profile (status: pending — needs admin approval)
    await pool.query(
      `INSERT INTO agent_profiles
         (user_id, business_name, city, service_type, identity_document_url, status)
       VALUES (?, ?, 'Not set', 'General', 'pending_upload', 'pending')`,
      [userId, name]
    );

    // Clean up OTP store
    otpStore.delete(email);

    // Send welcome email
    transporter.sendMail({
      from: `"CreadX Platform" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Welcome to CreadX — Account Under Review',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #0f172a;">Welcome, ${name}! 🎉</h1>
          <p style="color: #475569;">Your CreadX agent account has been created successfully.</p>
          <p style="color: #475569;">Our admin team will review your profile and activate it shortly. You'll be able to log in once approved.</p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">— The CreadX Team</p>
        </div>
      `,
    }).catch(err => console.error('Welcome email failed:', err.message));

    res.status(201).json({
      success: true,
      message: 'Account created! An admin will review and approve your profile.',
    });

  } catch (error) {
    console.error('Register agent error:', error.message);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});
// POST /auth/register-agent
app.post('/auth/register-agent', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }

    // Check if email already exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing.length) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert into users table
    const [userResult] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, is_active)
       VALUES (?, ?, ?, 'agent', true)`,
      [name, email, password_hash]
    );

    const userId = userResult.insertId;

    // Insert into agent_profiles table
    // identity_document_url is NOT NULL so we use 'pending_upload' as placeholder
    await pool.query(
      `INSERT INTO agent_profiles
         (user_id, business_name, city, service_type, identity_document_url, status)
       VALUES (?, ?, 'Not set', 'General', 'pending_upload', 'pending')`,
      [userId, name]
    );

    res.status(201).json({
      success: true,
      message: 'Agent profile created successfully! Please wait for admin approval before logging in.'
    });

  } catch (error) {
    console.error('Register agent error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});
// ============================================
// ADMIN ROUTES
// ============================================

app.get('/admin/metrics', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [[users]]       = await pool.query('SELECT COUNT(*) as count FROM users');
    const [[agents]]      = await pool.query("SELECT COUNT(*) as count FROM agent_profiles WHERE status = 'approved'");
    const [[bookings]]    = await pool.query('SELECT COUNT(*) as count FROM bookings');
    const [[commissions]] = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM commissions');

    res.json({
      totalUsers:     Number(users.count),
      activeAgents:   Number(agents.count),
      bookingsCount:  Number(bookings.count),
      totalRevenue:   Number(commissions.total),
      conversionRate: '—',
      uptime:         '99.9%',
    });
  } catch (err) {
    console.error('Metrics error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/agents', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ap.id, ap.user_id, ap.business_name, ap.city, ap.service_type,
             ap.status, ap.average_rating, u.email, u.full_name, u.is_active
      FROM agent_profiles ap
      JOIN users u ON ap.user_id = u.id
      ORDER BY ap.id DESC
    `);
    res.json({ agents: rows });
  } catch (error) {
    console.error('List agents error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/admin/agents/:id/status', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['approved', 'rejected', 'suspended', 'pending'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
    }
    const [result] = await pool.query(
      'UPDATE agent_profiles SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Agent not found' });
    res.json({ message: `Agent status updated to ${status}` });
  } catch (error) {
    console.error('Update agent status error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/admin/bookings', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [bookings] = await pool.query(`
      SELECT b.*,
             u.full_name  AS agent_name,
             c.full_name  AS customer_name
      FROM bookings b
      LEFT JOIN agent_profiles ap ON b.agent_id = ap.id
      LEFT JOIN users u ON ap.user_id = u.id
      LEFT JOIN users c ON b.customer_id = c.id
      ORDER BY b.scheduled_date DESC
    `);
    res.json({ bookings });
  } catch (err) {
    console.error('Admin bookings error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, full_name, email, role, is_active, created_at
      FROM users
      ORDER BY id DESC
    `);
    res.json({ users: rows });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: error.message });
  }
});

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
      SELECT
        COALESCE(SUM(amount), 0)                                    AS totalRevenue,
        COALESCE(SUM(CASE WHEN is_paid     THEN amount ELSE 0 END), 0) AS totalCommissions,
        COALESCE(SUM(CASE WHEN NOT is_paid THEN amount ELSE 0 END), 0) AS unpaidRevenue
      FROM commissions
    `);
    res.json({
      totalRevenue:      Number(totals.totalRevenue),
      totalCommissions:  Number(totals.totalCommissions),
      monthlyData: monthly.map(m => ({
        month:      m.month,
        platform:   Number(m.revenue),
        commission: Number(m.paidRevenue),
      })),
    });
  } catch (error) {
    console.error('Revenue error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---- Packages CRUD ----

app.get('/admin/packages', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM packages ORDER BY created_at DESC');
    res.json({ packages: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/admin/packages/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM packages WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Package not found' });
    res.json({ package: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Image upload — must come BEFORE POST /admin/packages
app.post('/admin/packages/upload-image',
  requireAuth, requireRole('admin'),
  upload.single('image'),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `${process.env.BACKEND_URL}/uploads/packages/${req.file.filename}`;
    res.json({ url });
  }
);

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
        is_active === undefined ? true : !!is_active,
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Package created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/admin/packages/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, description, destination, price, duration_days, max_capacity, images, is_active } = req.body;
    const [result] = await pool.query(
      `UPDATE packages SET
        name          = COALESCE(?, name),
        description   = COALESCE(?, description),
        destination   = COALESCE(?, destination),
        price         = COALESCE(?, price),
        duration_days = COALESCE(?, duration_days),
        max_capacity  = COALESCE(?, max_capacity),
        images        = COALESCE(?, images),
        is_active     = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        name          || null,
        description   || null,
        destination   || null,
        price         ?? null,
        duration_days || null,
        max_capacity  || null,
        images        ? JSON.stringify(images) : null,
        is_active === undefined ? null : !!is_active,
        req.params.id,
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Package not found' });
    res.json({ message: 'Package updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/admin/packages/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM packages WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Package not found' });
    res.json({ message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// AGENT ROUTES
// ============================================

app.get('/agent/dashboard', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const [agentRows] = await pool.query(
      'SELECT * FROM agent_profiles WHERE user_id = ?', [req.user.id]
    );
    if (!agentRows.length) return res.status(404).json({ error: 'Agent profile not found' });
    const agent = agentRows[0];

    const [trips] = await pool.query(`
      SELECT b.id, b.status, b.scheduled_date, b.end_date,
             b.destination_title, b.travelers,
             u.full_name AS customer_name
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      WHERE b.agent_id = ?
        AND b.status IN ('requested', 'confirmed')
      ORDER BY b.scheduled_date ASC
      LIMIT 10
    `, [agent.id]);

    const [[activeCount]] = await pool.query(
      `SELECT COUNT(*) as count FROM bookings WHERE agent_id = ? AND status IN ('requested','confirmed')`,
      [agent.id]
    );
    const [[leadsCount]] = await pool.query(
      `SELECT COUNT(*) as count FROM leads WHERE agent_id = ? AND status IN ('new','contacted')`,
      [agent.id]
    );
    const [[earningsSum]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM commissions WHERE agent_id = ?`,
      [agent.id]
    );

    res.json({
      agentName:      agent.business_name,
      rating:         agent.average_rating,
      status:         agent.status,
      activeBookings: Number(activeCount.count),
      pendingLeads:   Number(leadsCount.count),
      totalEarnings:  Number(earningsSum.total),
      upcomingTrips:  trips,
    });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/agent/bookings', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const [agentRows] = await pool.query(
      'SELECT * FROM agent_profiles WHERE user_id = ?', [req.user.id]
    );
    if (!agentRows.length) return res.status(404).json({ error: 'Agent not found' });
    const agent = agentRows[0];

    const [bookings] = await pool.query(`
      SELECT b.id, b.status, b.scheduled_date, b.end_date,
             b.destination_title, b.travelers,
             u.full_name  AS customer_name,
             u.email      AS customer_email
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      WHERE b.agent_id = ?
      ORDER BY b.scheduled_date DESC
    `, [agent.id]);

    res.json({ bookings });
  } catch (err) {
    console.error('Bookings error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/agent/bookings', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const [agentRows] = await pool.query(
      'SELECT * FROM agent_profiles WHERE user_id = ?', [req.user.id]
    );
    if (!agentRows.length) return res.status(404).json({ error: 'Agent not found' });
    const agent = agentRows[0];

    const { customer_id, destination_title, scheduled_date, end_date, travelers } = req.body;
    await pool.query(`
      INSERT INTO bookings (agent_id, customer_id, destination_title, scheduled_date, end_date, travelers, status)
      VALUES (?, ?, ?, ?, ?, ?, 'requested')
    `, [agent.id, customer_id, destination_title, scheduled_date, end_date, travelers || 1]);

    res.status(201).json({ message: 'Booking created' });
  } catch (err) {
    console.error('Create booking error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/agent/offers', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM packages WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    res.json({ packages: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/agent/earnings', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const [agentRows] = await pool.query(
      'SELECT * FROM agent_profiles WHERE user_id = ?', [req.user.id]
    );
    if (!agentRows.length) return res.status(404).json({ error: 'Agent not found' });
    const agent = agentRows[0];

    const [commissions] = await pool.query(`
      SELECT c.id, c.booking_id, c.amount, c.is_paid, c.created_at, c.paid_at,
             b.destination_title AS package_name,
             u.full_name         AS customer_name
      FROM commissions c
      LEFT JOIN bookings b ON c.booking_id = b.id
      LEFT JOIN users u    ON b.customer_id = u.id
      WHERE c.agent_id = ?
      ORDER BY c.created_at DESC
    `, [agent.id]);

    const total  = commissions.reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const paid   = commissions.filter(c => c.is_paid).reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const unpaid = total - paid;

    res.json({ total, paid, unpaid, commissions });
  } catch (err) {
    console.error('Earnings error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/agent/profile', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ap.*, u.full_name, u.email
      FROM agent_profiles ap
      JOIN users u ON ap.user_id = u.id
      WHERE ap.user_id = ?
    `, [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Agent profile not found' });
    res.json({ agent: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/agent/profile', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const { business_name, city, service_type } = req.body;
    const [result] = await pool.query(
      `UPDATE agent_profiles SET
        business_name = COALESCE(?, business_name),
        city          = COALESCE(?, city),
        service_type  = COALESCE(?, service_type)
       WHERE user_id = ?`,
      [business_name || null, city || null, service_type || null, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Agent profile not found' });
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- Leads CRUD ----

app.get('/agent/leads', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const agentId = await getAgentProfileId(req.user.id);
    if (!agentId) return res.status(404).json({ error: 'Agent profile not found' });
    const [rows] = await pool.query(
      'SELECT * FROM leads WHERE agent_id = ? ORDER BY created_at DESC',
      [agentId]
    );
    res.json({ leads: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/agent/leads', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const agentId = await getAgentProfileId(req.user.id);
    if (!agentId) return res.status(404).json({ error: 'Agent profile not found' });
    const { customer_name, customer_email, customer_phone, status, notes } = req.body;
    if (!customer_name) return res.status(400).json({ error: 'customer_name is required' });
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

app.put('/agent/leads/:id', requireAuth, requireRole('agent'), async (req, res) => {
  try {
    const agentId = await getAgentProfileId(req.user.id);
    if (!agentId) return res.status(404).json({ error: 'Agent profile not found' });
    const { customer_name, customer_email, customer_phone, status, notes } = req.body;
    const [result] = await pool.query(
      `UPDATE leads SET
        customer_name  = COALESCE(?, customer_name),
        customer_email = COALESCE(?, customer_email),
        customer_phone = COALESCE(?, customer_phone),
        status         = COALESCE(?, status),
        notes          = COALESCE(?, notes)
       WHERE id = ? AND agent_id = ?`,
      [customer_name || null, customer_email || null, customer_phone || null,
       status || null, notes || null, req.params.id, agentId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
app.listen(PORT, () => {
  console.log(`CreadX backend running on port ${PORT}`);
});