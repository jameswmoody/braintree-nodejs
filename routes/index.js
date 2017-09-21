var express = require('express');
var router = express.Router();
var braintree = require('braintree');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Braintree Node.js Integration' });
});

module.exports = router;
