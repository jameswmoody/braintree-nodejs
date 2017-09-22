const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const gateway = require('../lib/gateway');

router.post('/', function(req, res, next) {
  // Payment Variables
  const nonce = req.body.nonce;
  const amount = req.body.amount;

  // Customer Variables
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const streetAddress = req.body.streetAddress;
  const city = req.body.city;
  const state = req.body.state;
  const country = req.body.country;

  // Transaction Option Variables
  const submitForSettlement = req.body.submitForSettlement;
  const vault = req.body.vault;
  const skipAtf = req.body.skipAtf;
  const skipAvs = req.body.skipAvs;
  const skipCvv = req.body.skipCvv;

  const newTransaction = gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonce,
    customer: {
      firstName: firstName,
      lastName: lastName,
      email: email
    },
    billing: {
      firstName: firstName,
      lastName: lastName,
      streetAddress: streetAddress,
      locality: city,
      region: state,
      countryCodeAlpha2: country
    },
    options: {
      submitForSettlement: true,
      storeInVaultOnSuccess: vault,
      skipAdvancedFraudChecking: skipAtf,
      skipAvs: skipAvs,
      skipCvv: skipCvv
    }
  }, function (err, result) {
    if (result.success || result.transaction) {
      res.render('show', {
        transaction: result.transaction,
        result: JSON.stringify(result, null, '    '),
        title: 'Braintree Node.js Integration'
      });
    } else {
      transactionErrors = result.errors.deepErrors();
      console.log(transactionErrors);
      res.render('index', {
        errors: transactionErrors,
        title: 'Braintree Node.js Integration'
      });
    }
  });
});

module.exports = router;
