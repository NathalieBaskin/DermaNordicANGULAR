const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bookings.db');

// Skapa tabeller om de inte finns
db.serialize(() => {
  // Skapa bookings-tabell
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    treatment TEXT,
    price REAL,
    date TEXT,
    time TEXT,
    therapist TEXT,
    firstName TEXT,
    lastName TEXT,
    email TEXT
  )`);

  // Skapa products-tabell med similarProducts-kolumn
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    imageUrl TEXT,
    hoverImageUrl TEXT,
    category TEXT
  )`);

  // Kontrollera om similarProducts-kolumnen finns, lägg till om den inte finns
  db.all("PRAGMA table_info(products)", (err, rows) => {
    if (err) {
      console.error("Fel vid kontroll av tabellstruktur:", err);
      return;
    }

    console.log("Tabellstruktur:", rows);

    // Om similarProducts-kolumnen inte finns, lägg till den
    const hasSimilarProductsColumn = rows.some(row => row.name === 'similarProducts');
    if (!hasSimilarProductsColumn) {
      db.run("ALTER TABLE products ADD COLUMN similarProducts TEXT", (err) => {
        if (err) {
          console.error("Fel vid tillägg av similarProducts-kolumn:", err);
        } else {
          console.log("similarProducts-kolumn tillagd till products-tabellen");
        }
      });
    } else {
      console.log("similarProducts-kolumn finns redan i products-tabellen");
    }
  });
});

module.exports = db;
