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

  // Ändra SQL-frågan för att hitta datum där alla tider är bokade
  // Anta att det finns 6 tillgängliga tider per dag
  db.all(`SELECT DISTINCT date FROM bookings
          GROUP BY date
          HAVING COUNT(DISTINCT time) >= 6`, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    // Logga resultatet för felsökning
    console.log('Fullbokade datum från databasen:', rows);

    // Skicka tillbaka datumen som en array av strängar
    const dates = rows.map(row => row.date);
    console.log('Skickar fullbokade datum:', dates);

    res.json(dates);
  });
});
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
