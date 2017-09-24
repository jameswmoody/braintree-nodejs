const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const gateway = require('../lib/gateway');

/* GET submerchant create page. */
router.get('/', function(req, res) {
  res.render('submerchant', { title: 'Braintree Node.js Integration' });
});

router.post('/', function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dateOfBirth = req.body.dateOfBirth;
  const email = req.body.email;
  const phone = req.body.phone;
  const city = req.body.city;
  const state = req.body.state;
  const streetAddress = req.body.streetAddress;
  const postalCode = req.body.postalCode;
  const businesName = req.body.businesName;
  const accountNumber = req.body.accountNumber;
  const routingNumber = req.body.routingNumber;
  const tosAccepted = req.body.tosAccepted;

  merchantAccountParams = {
    individual: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      dateOfBirth: dateOfBirth,
      address: {
        streetAddress: streetAddress,
        locality: city,
        region: state,
        postalCode: postalCode
      }
    },
    business: {
      dbaName: businesName,
      address: {
        streetAddress: streetAddress,
        locality: city,
        region: state,
        postalCode: postalCode
      }
    },
    funding: {
      descriptor: businesName,
      destination: braintree.MerchantAccount.FundingDestination.Bank,
      email: email,
      mobilePhone: phone,
      accountNumber: accountNumber,
      routingNumber: routingNumber
    },
    tosAccepted: tosAccepted,
    masterMerchantAccountId: "jameswmoodycom",
    id: firstName + "_" + lastName + "_instant"
  };

  gateway.merchantAccount.create(merchantAccountParams, function (err, result) {
    if (result.success) {
      res.render('submerchant', {
        title: 'Braintree Node.js Integration',
        message: 'Submerchant was created successfully!',
        result: JSON.stringify(result, null, '    ')
      });
    } else {
      res.render('submerchant', {
        errors: result.errors.deepErrors(),
        title: 'Braintree Node.js Integration'
      });
    }
  });
});

module.exports = router;
