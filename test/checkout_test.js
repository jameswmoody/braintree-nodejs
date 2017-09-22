'use strict';

const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;

const PORT = process.env.PORT || '3000';
const api = supertest('http://localhost:' + PORT);
const gateway = require('../lib/gateway');

describe('Checkout index page', function () {
  it('responds with 200', function (done) {
    api.get('/').expect(200, done);
  });

  // it.skip('generates a client token', function (done) {
  //   api.get('/').end(function (err, res) {
  //     expect(res.text).to.match(/var token = \'[\w=]+\';/);
  //     done();
  //   });
  // });

  it('includes the checkout form', function (done) {
    api.get('/').end(function (err, res) {
      expect(res.text).to.match(/<form id="checkout-form"/);
      done();
    });
  });

  it('includes the dropin div', function (done) {
    api.get('/').end(function (err, res) {
      expect(res.text).to.match(/<div id="dropin-container"/);
      done();
    });
  });

  it('includes the amount field', function (done) {
    api.get('/').end(function (err, res) {
      expect(res.text).to.match(/<label for="amount/);
      expect(res.text).to.match(/<input class="dropin-form-field" type="text" name="amount"/);
      done();
    });
  });
});

describe('Transaction create', function () {
  it('creates a transaction and renders transaction show', function (done) {
    api.post('/checkout')
      .send({amount: '10.00', payment_method_nonce: 'fake-valid-nonce'})
      .expect(200, done);
  });

  context('when the transaction is not successful', function () {
    context('when braintree returns an error', function () {
      it('renders checkout page if transaction is not created', function (done) {
        api.post('/checkout')
          .send({amount: 'not_a_valid_amount', payment_method_nonce: 'not_a_valid_nonce'})
          .end(function (err, res) {
            var req = api.get('/');

            req.end(function (err, res) {
              expect(res.text).to.contain('Drop-In v3 Transaction');
              done();
            });
          });
      });

      it('displays errors', function (done) {
        api.post('/checkout')
          .send({amount: 'not_a_valid_amount', payment_method_nonce: 'not_a_valid_nonce'})
          .end(function (err, res) {
            expect(res.text).to.contain('Amount is an invalid format.');
            done();
          });
      });
    });
  });
});
