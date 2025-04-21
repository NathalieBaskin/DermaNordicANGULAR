const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bookings.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    treatment TEXT,
    price TEXT,
    date TEXT,
    time TEXT,
    therapist TEXT,
    firstName TEXT,
    lastName TEXT,
    email TEXT
  )`);
});

db.close();
