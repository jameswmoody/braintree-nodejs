const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const gateway = require('../lib/gateway');

/* GET refund page. */
router.get('/', function(req, res) {
  res.render('refund', { title: 'Braintree Node.js Integration' });
});

/* POST refund form*/
router.post('/', function(req, res) {
  console.log('post');
  const transactionId = req.body.transactionId;
  const amount = req.body.amount;

  const result = gateway.transaction.refund(transactionId, amount, function (err, result) {
    if (result.success) {
      res.render('refund', {
        title: 'Braintree Node.js Integration',
        message: 'Refund was successful!',
        result: JSON.stringify(result, null, '    ')
      });
    } else {
      res.render('refund', {
        errors: result.errors.deepErrors(),
        title: 'Braintree Node.js Integration'
      });
    }
  });
});

module.exports = router;
