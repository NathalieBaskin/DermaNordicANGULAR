const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./bookings.db');

app.post('/api/bookings', (req, res) => {
  const { treatmentName, treatmentPrice, date, time, therapist, firstName, lastName, email } = req.body;
  db.run(`INSERT INTO bookings (treatmentName, treatmentPrice, date, time, therapist, firstName, lastName, email)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [treatmentName, treatmentPrice, date, time, therapist, firstName, lastName, email],
          function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.get('/api/available-times', (req, res) => {
  const { date, therapist } = req.query;
  db.all(`SELECT time FROM bookings WHERE date = ? AND therapist = ?`, [date, therapist], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const bookedTimes = rows.map(row => row.time);
    const allTimes = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
    const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));
    res.json({ availableTimes, bookedTimes });
  });
});

app.get('/api/fully-booked-dates', (req, res) => {
  const allTimes = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
  const totalSlots = allTimes.length * 2; // Assuming 2 therapists
  db.all(`
    SELECT date, COUNT(*) as booked_slots
    FROM bookings
    GROUP BY date
    HAVING booked_slots = ?
  `, [totalSlots], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const fullyBookedDates = rows.map(row => row.date);
    res.json(fullyBookedDates);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
