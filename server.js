// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 1337;
const ejs = require('./node_modules/ejs')

// Set the view engine to EJS
app.engine('ejs',ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './'));

// Serve static files like CSS
app.use(express.static(path.join(__dirname, './')));

// Connect to SQLite database
const db = new sqlite3.Database('./mydb.db');

// Home route to render the search page
app.get('/', (req, res) => {
    res.render('Proteinkomplexe', { results: [], query: '', page: 1, totalPages: 1 });
});

// Search API with pagination
app.get('/search', (req, res) => {
    const query = req.query.q ? `%${req.query.q}%` : '%';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql = `SELECT * FROM complexinfo WHERE name LIKE ? or complexid LIKE ? LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as total FROM complexinfo WHERE name LIKE ? or complexid LIKE ?`;

    db.all(sql, [query, query, limit, offset], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.get(countSql, [query, query], (err, countResult) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const totalRows = countResult.total;
            const totalPages = Math.ceil(totalRows / limit);

            res.render('Proteinkomplexe', {
                results,
                query: req.query.q || '',
                page,
                totalPages
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});