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



exports.GetAlerts = (req, res) => {
   db.query('SELECT * FROM environmentalalerts', (err, results) => {
        if (err) {
          console.error('Error fetching Alerts:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results);
        }
      });
};

exports.GetAlertsbyUserid = (req, res) => {
  const userID = require('./Login');
  db.query('SELECT * FROM environmentalalerts WHERE User_ID ? ',[userID], (err, results) => {
       if (err) {
         console.error('Error fetching Alerts:', err);
         res.status(500).json({ error: 'Internal Server Error' });
       } else {
         res.json(results);
       }
     });
};

exports.GetAlertsbyLocationAndInterest = (req, res) => {
  const userID = require('./Login'); // Assuming this correctly gets the user ID
  db.query('SELECT Interests, Location FROM userprofile WHERE User_ID=?', [userID], async (err, results) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Array to store the results for all users
    const allResults = [];

    // Iterate over each user profile
    for (let i = 0; i < results.length; i++) {
      const resultss = await new Promise((resolve, reject) => {
        // Use database query inside the loop
        db.query('SELECT * FROM environmentalalerts WHERE Location=? AND Interest=?', [results[i].Location, results[i].Interests], (err, alerts) => {
          if (err) {
            console.error(`Error fetching Alerts for User `, err);
            reject(err);
          } else {
            console.log(`Done Give Alerts for User `, alerts);
            resolve(alerts);
          }
        });
      });

      // Store the results for each user, including alert messages
      allResults.push({ alerts: resultss });
    }

    // Handle the results for all users
    console.log('All results:', allResults);
    res.json(allResults);
  });
};



  /*db.query('SELECT * FROM environmentalalerts WHERE User_ID ? ',[userID], (err, results) => {
       if (err) {
         console.error('Error fetching Alerts:', err);
         res.status(500).json({ error: 'Internal Server Error' });
       } else {
         
         res.json(results);
       }
     });*/
    



exports.PostAlerts = (req, res) => {
  const userID = require('./Login');

    const {ALert_ID, User_ID, Alert_Message ,interest,Location } = req.body;
    const Timestamp = new Date();
    db.query('INSERT INTO environmentalalerts (ALert_ID ,User_ID ,Timestamp,ALert_Message,interest,Location) VALUES (?,?,?, ?, ?,?)', [ALert_ID , userID, Timestamp, Alert_Message,interest,Location], (err, result) => {
      if (err) {
        console.error('Error creating Alert:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Alert added successfully', ALert_ID: result.insertId });
      }
    });
};



exports.UpdateAlerts = (req, res) => {
    const ALertid = req.params.id;
    const userID = require('./Login');
    const Timestamp = new Date();

    const {ALert_ID, User_ID, Alert_Message,interest,Location } = req.body;
    db.query('SELECT Description,Location FROM userprofile WHERE User_ID=?', [userID ],(err, results) => {
      if (results[0].Description !=='R') {
        console.log(results);
        res.json(  'You are not allowed to insert data' );
      }

      else{
        db.query('UPDATE environmentalalerts SET User_ID=?, Timestamp=?, Alert_Message=? ,interest=? , Location=? WHERE ALert_ID=?', [userID, Timestamp, Alert_Message,interest,Location,ALertid], (err, result) => {
          if (err) {
            console.error('Error updating alert:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {

            res.json({ message: 'Alert updated successfully', rowsAffected: result.affectedRows });
          }

        });
      }
    });
   
};

exports.DeleteAlerts = (req, res) => {
   const userID = require('./Login');
    const ALertid = req.params.id;
    db.query('SELECT Description,Location FROM userprofile WHERE User_ID=?', [userID ],(err, results) => {
      if (results[0].Description !=='R') {
        console.log(results);
        res.json(  'You are not allowed to insert data' );
      }

      else
      {
        db.query('DELETE FROM environmentalalerts WHERE Alert_ID=?', [ALertid], (err, result) => {
          if (err) {
            console.error('Error deleting Alert:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          }
           else {
            res.json({ message: 'ALert deleted successfully', rowsAffected: result.affectedRows });
          }
        });
      }
    });
   
};