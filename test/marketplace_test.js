'use strict';

const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;

const PORT = process.env.PORT || '3000';
const api = supertest('http://localhost:' + PORT);
const gateway = require('../lib/gateway');

describe('Marketplace page', function () {
  it('responds with 200', function (done) {
    api.get('/marketplace').expect(200, done);
  });

  // it.skip('generates a client token', function (done) {
  //   api.get('/').end(function (err, res) {
  //     expect(res.text).to.match(/var token = \'[\w=]+\';/);
  //     done();
  //   });
  // });

  it('includes the checkout form', function (done) {
    api.get('/marketplace').end(function (err, res) {
      expect(res.text).to.match(/<form id="marketplace-form"/);
      done();
    });
  });

  it('includes the first name field', function (done) {
    api.get('/marketplace').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="firstName"/);
      done();
    });
  });

  it('includes the last name field', function (done) {
    api.get('/marketplace').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="lastName"/);
      done();
    });
  });

  it('includes the city field', function (done) {
    api.get('/marketplace').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="city"/);
      done();
    });
  });

  it('includes the state field', function (done) {
    api.get('/marketplace').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="state"/);
      done();
    });
  });

  it('includes the street address field', function (done) {
    api.get('/marketplace').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="streetAddress"/);
      done();
    });
  });

  it('includes the postal code field', function (done) {
    api.get('/marketplace').end(function (err, res) {
      expect(res.text).to.match(/<div id="postalCode" class="hosted-field"/);
      done();
    });
  });

  it('includes the email field', function (done) {
    api.get('/marketplace').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="email"/);
      done();
    });
  });

  it('includes the amount field', function (done) {
    api.get('/marketplace').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="amount"/);
      done();
    });
  });

  it('includes the service fee field', function (done) {
    api.get('/marketplace').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="serviceFee"/);
      done();
    });
  });


});

describe('Transaction create', function () {
  it('creates a transaction and renders transaction show', function (done) {
    api.post('/marketplace')
      .send({
        amount: '10.00',
        service_fee_amount: '2.00',
        payment_method_nonce: 'fake-valid-nonce',
        merchant_account_id: 'Marvin_Gaye_instant'
      })
      .expect(200, done);
  });

  context('when the transaction is not successful', function () {
    context('when braintree returns an error', function () {
      it('renders checkout page if transaction is not created', function (done) {
        api.post('/marketplace')
          .send({
            amount: 'not_a_valid_amount',
            service_fee_amount: '2.00',
            merchant_account_id: 'Marvin_Gaye_instant',
            payment_method_nonce: 'not_a_valid_nonce'
          })
          .end(function (err, res) {
            expect(res.text).to.contain('Marketplace Transaction');
            done();
          });
      });

      it('displays errors', function (done) {
        api.post('/marketplace')
          .send({
            amount: 'not_a_valid_amount',
            service_fee_amount: '2.00',
            merchant_account_id: 'Marvin_Gaye_instant',
            payment_method_nonce: 'not_a_valid_nonce'
          })
          .end(function (err, res) {
            expect(res.text).to.contain('Amount is an invalid format.');
            done();
          });
      });
    });
  });
});
