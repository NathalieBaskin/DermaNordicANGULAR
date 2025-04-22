const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200'
}));//
app.use(bodyParser.json());

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

app.get('/api/fully-booked-dates', (req, res) => {
  console.log('Received request for fully booked dates');
  db.all(`SELECT DISTINCT date FROM bookings
          GROUP BY date
          HAVING COUNT(DISTINCT time) >= 6`, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Sending response:', rows);
    res.json(rows.map(row => row.date));
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

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
