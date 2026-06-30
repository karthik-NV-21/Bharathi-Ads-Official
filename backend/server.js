const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware to parse JSON and allow React to talk to this server
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 image uploads

// 1. Create MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',       // Your MySQL host (usually localhost)
    user: 'root',            // Your MySQL username
    password: 'password',    // YOUR MYSQL PASSWORD HERE
    database: 'bharathi_ads',// The database name we created
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- PORTRAIT API ENDPOINTS ---

// Get all portraits
app.get('/api/portraits', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM portraits ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch portraits' });
    }
});

// Add a new portrait
app.post('/api/portraits', async (req, res) => {
    const { title, price, category, description, image } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO portraits (title, price, category, description, image_data) VALUES (?, ?, ?, ?, ?)',
            [title, price, category, description, image]
        );
        res.json({ id: result.insertId, message: 'Portrait added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add portrait' });
    }
});

// Delete a portrait
app.delete('/api/portraits/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM portraits WHERE id = ?', [req.params.id]);
        res.json({ message: 'Portrait deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete portrait' });
    }
});

// Update a portrait
app.put('/api/portraits/:id', async (req, res) => {
    const { title, price, category, description, image } = req.body;
    try {
        await pool.query(
            'UPDATE portraits SET title = ?, price = ?, category = ?, description = ?, image_data = ? WHERE id = ?',
            [title, price, category, description, image, req.params.id]
        );
        res.json({ message: 'Portrait updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update portrait' });
    }
});


// --- ADMIN AUTH ENDPOINTS ---

// Signup Admin
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        res.json({ user: { id: result.insertId, name, email } });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Signup failed' });
        }
    }
});

// Login Admin
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            res.json({ user: rows[0] });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
    console.log(`Make sure MySQL is running and connected!`);
});