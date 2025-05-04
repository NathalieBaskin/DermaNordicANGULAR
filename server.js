const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200'
}));//
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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

// API-endpoints för produkter
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Produkt hittades inte' });
    }
    res.json(row);
  });
});

app.post('/api/products', (req, res) => {
  const { name, description, price, imageUrl, hoverImageUrl, category } = req.body;

  db.run(
    `INSERT INTO products (name, description, price, imageUrl, hoverImageUrl, category)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, imageUrl, hoverImageUrl, category],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Hämta den nyligen tillagda produkten
      db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
});

app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Produkt hittades inte' });
    }
    res.json({ message: 'Produkt borttagen' });
  });
});

app.get('/api/products/category/:category', (req, res) => {
  const category = req.params.category;
  const excludeId = req.query.excludeId;

  let query = 'SELECT * FROM products WHERE category = ?';
  let params = [category];

  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Lägg till några standardprodukter om tabellen är tom
db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
  if (err) {
    console.error('Fel vid kontroll av produkter:', err);
    return;
  }

  if (row.count === 0) {
    const initialProducts = [
      { name: 'Facial Cleanser', description: 'Gentle daily cleanser', price: 250, imageUrl: 'assets/products/cleanser.png', hoverImageUrl: 'assets/products/cleanser-product.jpg', category: 'Skin' },
      { name: 'Moisturizer', description: 'Hydrating face cream', price: 350, imageUrl: 'assets/products/moisturizer.png', hoverImageUrl: 'assets/products/moisturizer-product.jpg', category: 'Skin' },
      { name: 'Sunscreen', description: 'SPF 50 protection', price: 200, imageUrl: 'assets/products/sunscreen-product.jpeg', hoverImageUrl: 'assets/products/sunscreen.jpg', category: 'Skin' },
      { name: 'Serum', description: 'Anti-aging formula', price: 450, imageUrl: 'assets/products/serum-product.png', hoverImageUrl: 'assets/products/serum.jpg', category: 'Skin' },
      { name: 'Eye Cream', description: 'Reduces dark circles', price: 300, imageUrl: 'assets/products/eyecream-product.png', hoverImageUrl: 'assets/products/eyecream.jpg', category: 'Skin' },
      { name: 'Face Mask', description: 'Hydrating sheet mask', price: 50, imageUrl: 'assets/products/facemask-product.png', hoverImageUrl: 'assets/products/facemask.jpeg', category: 'Skin' },
      { name: 'Toner', description: 'Balancing toner', price: 180, imageUrl: 'assets/products/toner-product.png', hoverImageUrl: 'assets/products/toner.jpg', category: 'Skin' },
      { name: 'Exfoliator', description: 'Gentle scrub', price: 220, imageUrl: 'assets/products/exfoliator-product.png', hoverImageUrl: 'assets/products/exfoliator.jpg', category: 'Skin' }
    ];

    const stmt = db.prepare('INSERT INTO products (name, description, price, imageUrl, hoverImageUrl, category) VALUES (?, ?, ?, ?, ?, ?)');
    initialProducts.forEach(product => {
      stmt.run([product.name, product.description, product.price, product.imageUrl, product.hoverImageUrl, product.category]);
    });
    stmt.finalize();

    console.log('Standardprodukter har lagts till i databasen');
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
