const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(bodyParser.json());

// Befintliga bokningsrelaterade endpoints
app.post('/api/bookings', (req, res) => {
  const { treatmentName, treatmentPrice, date, time, therapist, firstName, lastName, email } = req.body;

  db.run(`INSERT INTO bookings (treatment, price, date, time, therapist, firstName, lastName, email)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [treatmentName, treatmentPrice, date, time, therapist, firstName, lastName, email],
          function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

app.get('/api/available-times', (req, res) => {
  const { date, therapist } = req.query;
  const allTimes = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

  db.all(`SELECT time FROM bookings WHERE date = ? AND therapist = ?`,
          [date, therapist], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const bookedTimes = rows.map(row => row.time);
    const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));
    res.json(availableTimes);
  });
});

app.get('/api/fully-booked-dates', (req, res) => {
  console.log('Received request for fully booked dates');

  db.all(`SELECT DISTINCT date FROM bookings
          GROUP BY date
          HAVING COUNT(DISTINCT time) >= 6`, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('Fullbokade datum från databasen:', rows);
    const dates = rows.map(row => row.date);
    console.log('Skickar fullbokade datum:', dates);
    res.json(dates);
  });
});

// Nya produktrelaterade endpoints
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      return res.status(500).json({"error": err.message});
    }
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({"error": err.message});
    }
    if (!row) {
      return res.status(404).json({"error": "Product not found"});
    }
    res.json(row);
  });
});

app.post('/api/products', (req, res) => {
  const { name, description, price, imageUrl, hoverImageUrl, category } = req.body;
  db.run(`INSERT INTO products (name, description, price, imageUrl, hoverImageUrl, category)
          VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, imageUrl, hoverImageUrl, category],
    function(err) {
      if (err) {
        return res.status(500).json({"error": err.message});
      }
      res.json({
        "message": "success",
        "data": { id: this.lastID, ...req.body }
      });
  });
});

app.put('/api/products/:id', (req, res) => {
  const { name, description, price, imageUrl, hoverImageUrl, category } = req.body;
  db.run(`UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ?, hoverImageUrl = ?, category = ?
          WHERE id = ?`,
    [name, description, price, imageUrl, hoverImageUrl, category, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({"error": err.message});
      }
      res.json({
        message: "success",
        data: { id: req.params.id, ...req.body }
      });
  });
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', req.params.id, function(err) {
    if (err) {
      return res.status(500).json({"error": err.message});
    }
    if (this.changes === 0) {
      return res.status(404).json({"error": "Product not found"});
    }
    res.json({"message":"deleted", changes: this.changes});
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
