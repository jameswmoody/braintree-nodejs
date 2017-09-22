const express = require('express');
const router = express.Router();
const braintree = require('braintree');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Braintree Node.js Integration' });
});

module.exports = router;
