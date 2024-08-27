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

    const sql = `SELECT * FROM complexinfo WHERE name LIKE ? or complexid LIKE ? or organismus LIKE ? LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as total FROM complexinfo WHERE name LIKE ? or complexid LIKE ? or organismus LIKE ?`;

    db.all(sql, [query, query, query, limit, offset], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.get(countSql, [query, query, query], (err, countResult) => {
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

//New Page to examine all information according to a specific proteincomplex
app.get('/entries/:id', async (req, res) => {
    const id = req.params.id;
    console.log('Complex ID:', id);
    try {
        db.get(`
            SELECT complexinfo.*, untereinheiten.*, funktion.*, publikation.*
            FROM complexinfo
            JOIN untereinheiten ON complexinfo.sub_id = untereinheiten.subid
            JOIN funktion ON complexinfo.fun_id = funktion.funid
            JOIN publikation ON complexinfo.pub_id = publikation.pubid
            WHERE complexinfo.complexid = ?
        `, [id], (err, details) => {
            if (err) {
                console.error('Fehler bei der Datenbankabfrage:', err);
                res.status(500).send('Serverfehler');
            } else if (details) {
                console.log('Details =', details);
                res.render('entries', { details });
            } else {
                res.status(404).send('Eintrag nicht gefunden');
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Serverfehler');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});