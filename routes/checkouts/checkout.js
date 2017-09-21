var express = require('express');
var router = express.Router();
var braintree = require('braintree');
var dotenv = require('dotenv').config();

router.post('/', function(req, res, next) {
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BT_MERCHANT_ID,
    publicKey: process.env.BT_PUBLIC_KEY,
    privateKey: process.env.BT_PRIVATE_KEY
  });

  var nonceFromTheClient = req.body.paymentMethodNonce;
  var newTransaction = gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});

module.exports = router;
