const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const gateway = require('../lib/gateway');

/* GET marketplace page. */
router.get('/', function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    console.log(response.clientToken);
    res.render('marketplace', { title: 'Braintree Node.js Integration', clientToken: response.clientToken });
  });
});

router.post('/', function(req, res) {
  // Payment Variables
  const merchantAccountId = req.body.merchantAccountId;
  const nonce = req.body.nonce;
  const amount = req.body.amount;
  const serviceFee = req.body.serviceFee;

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
    merchantAccountId: merchantAccountId,
    amount: amount,
    serviceFeeAmount: serviceFee,
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
      res.render('marketplace', {
        errors: result.errors.deepErrors(),
        title: 'Braintree Node.js Integration'
      });
    }
  });
});

module.exports = router;
