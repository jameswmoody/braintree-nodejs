'use strict';

const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;

const PORT = process.env.PORT || '3000';
const api = supertest('http://localhost:' + PORT);
const gateway = require('../lib/gateway');

describe('Void page', function () {
  it('responds with 200', function (done) {
    api.get('/void').expect(200, done);
  });

  it('includes the void form', function (done) {
    api.get('/void').end(function (err, res) {
      expect(res.text).to.match(/<form id="void-form"/);
      done();
    });
  });

  it('includes transaction id field', function (done) {
    api.get('/void').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="transactionId"/);
      done();
    });
  });
});

describe('Void transaction', function() {
  it('voids transaction and renders void page', function() {
    gateway.transaction.sale({
      amount: '10.00',
      paymentMethodNonce: 'fake-valid-nonce',
      options: {
        submitForSettlement: true
      }
    }, function (err, result) {
      const transaction = result.transaction;
      
      api.post('/void')
      .send({transactionId: transaction.id})
      .end(function (err, res) {
        expect(200, done)
        .expect(res.text).to.contain('Void was successful!');
        done();
      });
    });
  });
});
