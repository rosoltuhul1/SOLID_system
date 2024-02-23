const express = require('express');
/*const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;*/
const db = require('../database.js');
//////////////////////////////
const http = require('http');

//////////////////////////


////////////////////////////////////////////////
exports.GetUserprofile = (req, res) => {
    db.query('SELECT * FROM userprofile', (err, results) => {
         if (err) {
           console.error('Error fetching user profiles:', err);
           res.status(500).json({ error: 'Internal Server Error' });
         } else {
           res.json(results);
         }
       });
  };
  
  exports.GetUserprofileByProfileID = (req, res) => {
    const ProfileID = req.params.id;
    db.query('SELECT * FROM userprofile WHERE Profile_ID=?',[ProfileID], (err, results) => {
         if (err) {
           console.error('Error fetching user profiles:', err);
           res.status(500).json({ error: 'Internal Server Error' });
         } else {
           res.json(results);
         }
       });
  };
////////////////////user profile////////////////////
exports.GetUserprofile = (req, res) => {
    db.query('SELECT * FROM userprofile', (err, results) => {
         if (err) {
           console.error('Error fetching user profiles:', err);
           res.status(500).json({ error: 'Internal Server Error' });
         } else {
           res.json(results);
         }
       });
  };
  
  exports.GetUserprofileByProfileID = (req, res) => {
    const ProfileID = req.params.id;
    db.query('SELECT * FROM userprofile WHERE Profile_ID=?',[ProfileID], (err, results) => {
         if (err) {
           console.error('Error fetching user profiles:', err);
           res.status(500).json({ error: 'Internal Server Error' });
         } else {
           res.json(results);
         }
       });
  };
  
  exports.Postprofile = (req, res) => {
    const userID = require('./Login');
    const ProfileID = req.params.id;
    const { Score_ID,Score_Value } = req.body;
    const Timestamp = new Date();

      const { Profile_ID, User_ID, Description, Location, Interests } = req.body;
   db.query('INSERT INTO userprofile (Profile_ID, User_ID, Description, Location, Interests) VALUES (?,?,?,?,?)', [ProfileID, userID, Description, Location, Interests], (err, result) => {
      if (err) {
        console.error('Error creating userprofile:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {

        db.query('INSERT INTO sustainabilityscore (Score_ID , User_ID, Timestamp, Score_Value) VALUES (?,?, ?, ?)', [ Score_ID, userID,Timestamp, 0], (err, result) => {
          if (err) {
            console.error('Error creating sustainabilityscore:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else 
          {
           
            res.json({ message: 'sustainabilityscore created successfully', ScoreId: result.insertId });
            
          }
          
        });

        res.json({ message: 'userprofile created successfully'});
       
      }
    });
   
   };
  
   exports.Deleteprofile = (req, res) => {
    const userID = require('./Login');
    const ProfileID = req.params.id;
    db.query('DELETE FROM userprofile WHERE Profile_ID=?', [ProfileID], (err, result) => {
      if (err) {
        console.error('Error deleting userprofile:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'userprofile deleted successfully', rowsAffected: result.affectedRows });
      }
    });
  };
  
  exports.DeleteprofileByUser = (req, res) => {
    const userID = require('./Login');
    const ProfileID = req.params.id;
    db.query('DELETE FROM userprofile WHERE User_ID=?', [userID], (err, result) => {
      if (err) {
        console.error('Error deleting userprofile:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'userprofile deleted successfully', rowsAffected: result.affectedRows });
      }
    });
  };
  
   exports.UpdateProfile= (req, res) => {
    const userID = require('./Login');
    const ProfileID = req.params.id;
    const { Profile_ID, User_ID, Description, Location, Interests} = req.body;
      db.query('UPDATE userprofile SET User_ID=?, Description=?, Location=?, Interests=? WHERE Profile_ID =?', [userID,Description ,Location, Interests, ProfileID], (err, result) => {
        if (err) {
          console.error('Error updating userprofile:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ message: 'userprofile updated successfully', rowsAffected: result.affectedRows });
        }
      });
  };
  