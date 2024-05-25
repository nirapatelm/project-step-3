const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'nishu1830!',
  database: 'coconuts_movie_rental',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Could not connect to the database server: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Fetch all movies
app.get('/api/movies', (req, res) => {
  const query = 'SELECT * FROM movies';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

// Add a new movie
app.post('/api/movies', (req, res) => {
  const { title, releaseYear, rating, availability } = req.body;
  const query = 'INSERT INTO movies (movieID, title, releaseYear, rating, availability) VALUES (UUID(), ?, ?, ?, ?)';
  db.query(query, [title, releaseYear, rating, availability], (err, result) => {
    if (err) {
      console.error('Error adding movie: ' + err.stack);
      res.status(500).send('Error adding movie');
      return;
    }
    res.send('Movie added successfully');
  });
});

// Update a movie
app.put('/api/movies/:id', (req, res) => {
  const movieID = req.params.id;
  const { title, releaseYear, rating, availability } = req.body;
  const query = 'UPDATE movies SET title = ?, releaseYear = ?, rating = ?, availability = ? WHERE movieID = ?';
  db.query(query, [title, releaseYear, rating, availability, movieID], (err, result) => {
    if (err) {
      console.error('Error updating movie: ' + err.stack);
      res.status(500).send('Error updating movie');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Movie not found');
      return;
    }
    res.send('Movie updated successfully');
  });
});

// Delete a movie
app.delete('/api/movies/:id', (req, res) => {
  const movieID = req.params.id;
  const query = 'DELETE FROM movies WHERE movieID = ?';
  db.query(query, [movieID], (err, result) => {
    if (err) {
      console.error('Error deleting movie: ' + err.stack);
      res.status(500).send('Error deleting movie');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Movie not found');
      return;
    }
    res.send('Movie deleted successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
