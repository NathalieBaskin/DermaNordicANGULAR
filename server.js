const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./bookings.db');

app.post('/api/bookings', (req, res) => {
  const { treatment, price, date, time, therapist, firstName, lastName, email } = req.body;
  db.run(`INSERT INTO bookings (treatment, price, date, time, therapist, firstName, lastName, email)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [treatment, price, date, time, therapist, firstName, lastName, email],
          function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.get('/api/available-times', (req, res) => {
  const { date } = req.query;
  db.all(`SELECT time FROM bookings WHERE date = ?`, [date], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const bookedTimes = rows.map(row => row.time);
    const allTimes = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
    const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));
    res.json({ availableTimes });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
