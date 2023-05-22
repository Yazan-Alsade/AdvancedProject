const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../dbConn/databse');


module.exports.SignUp= async (req, res) => {
    const { username, email, password } = req.body;
  
    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Insert the user into the database
        const sql =  'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        const values = [username, email, hashedPassword];
  
        connection.query(sql, values, (err) => {
          if (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(200).json({ message: 'User created successfully' });
          }
        });
      }
    });
  };

  module.exports.logIN= async (req, res) =>{
    
    const { email, password } = req.body;
  
    // Check if the useremail exists in the database
    const sql = 'SELECT * FROM users WHERE email = ?';
    const values = [email];
  
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (results.length === 0) {
        res.status(401).json({ error: 'Invalid email or password' });
      } else {
        const user = results[0];
  
        // Compare the password
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else if (result) {
            res.status(200).json({ message: 'Login successful' });
          } else {
            res.status(401).json({ error: 'Invalid email or password' });
          }
        });
      }
    });
};

  