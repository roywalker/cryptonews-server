const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/', (req, res) => {
  // adds a new user
});

router.delete('/', (req, res) => {
  // deletes a user
});

router.put('/', (req, res) => {
  // updates user password
});

module.exports = router;
