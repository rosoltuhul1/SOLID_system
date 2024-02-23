const express = require('express');
/*const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;*/
const db = require('../database.js');

//////////////////////////////
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, World!\n');
});


////////////////////////////////


exports.GetUser = (req, res) => {
 //   console.log("we are here ");
   db.query('SELECT * FROM user', (err, results) => {
        if (err) {
          console.error('Error fetching users:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results);
        }
      });
};
exports.PostUser = (req, res) => {
    const { User_ID,Username, Password, Email } = req.body;

    db.query('INSERT INTO user (User_ID , Username, Password, Email) VALUES (?,?, ?, ?)', [User_ID , Username, Password, Email], (err, result) => {
      if (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'User created successfully', userId: result.insertId });
      }
    });
};
exports.UpdateUser = (req, res) => {
    const userId = req.params.id;
    const { User_ID,Username, Password, Email } = req.body;

    db.query('UPDATE user SET Username=?, Password=?, Email=? WHERE User_ID=?', [Username, Password, Email, userId], (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'User updated successfully', rowsAffected: result.affectedRows });
      }
    });
};
exports.DeleteUser = (req, res) => {
    const userId = req.params.id;

    db.query('DELETE FROM user WHERE User_ID=?', [userId], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'User deleted successfully', rowsAffected: result.affectedRows });
      }
    });
};
/*
// Define a route to fetch all users
app.get('/users', (req, res) => {
  // Query to fetch all users
  const query = 'SELECT * FROM user';
  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
        console.log(results);
      res.json(results);
    }
  });
});*/
/*
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
*/