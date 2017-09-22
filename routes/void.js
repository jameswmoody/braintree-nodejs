const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const gateway = require('../lib/gateway');

/* GET void page. */
router.get('/', function(req, res) {
  res.render('void', { title: 'Braintree Node.js Integration' });
});

/* POST void form */
router.post('/', function(req, res) {
  const transactionId = req.body.transactionId;

  gateway.transaction.void(transactionId, function (err, result) {
    console.log(result);
    if (result.success) {
      res.render('void', {
        title: 'Braintree Node.js Integration',
        message: 'Void was successful!',
        result: JSON.stringify(result, null, '    ')
      });
    } else {
      res.render('void', {
        errors: result.errors.deepErrors(),
        title: 'Braintree Node.js Integration'
      });
    }
  });
});

module.exports = router;
