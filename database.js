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

  // Lägg till en ny tabell för produkter
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    imageUrl TEXT,
    hoverImageUrl TEXT,
    category TEXT
  )`);
});

module.exports = db;
