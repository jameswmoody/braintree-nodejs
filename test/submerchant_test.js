'use strict';

const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;

const PORT = process.env.PORT || '3000';
const api = supertest('http://localhost:' + PORT);
const gateway = require('../lib/gateway');

describe('Submerchant page', function () {
  it('responds with 200', function (done) {
    api.get('/submerchant').expect(200, done);
  });

  it('includes the submerchant form', function (done) {
    api.get('/submerchant').end(function (err, res) {
      expect(res.text).to.match(/<form id="submerchant-form"/);
      done();
    });
  });

  it('includes first name field', function (done) {
    api.get('/submerchant').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="firstName"/);
      done();
    });
  });

  it('includes last name field', function (done) {
    api.get('/submerchant').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="lastName"/);
      done();
    });
  });

  it('includes DOB field', function (done) {
    api.get('/submerchant').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="dateOfBirth"/);
      done();
    });
  });

  it('includes email field', function (done) {
    api.get('/submerchant').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="email"/);
      done();
    });
  });

  it('includes phone field', function (done) {
    api.get('/submerchant').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="phone"/);
      done();
    });
  });

  it('includes address fields', function (done) {
    api.get('/submerchant').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="city"/);
      expect(res.text).to.match(/<input class="form-field" type="text" name="state"/);
      expect(res.text).to.match(/<input class="form-field" type="text" name="streetAddress"/);
      expect(res.text).to.match(/<input class="form-field" type="text" name="postalCode"/);
      done();
    });
  });

  it('includes business fields', function (done) {
    api.get('/submerchant').end(function (err, res) {
      expect(res.text).to.match(/<input class="form-field" type="text" name="businesName"/);
      expect(res.text).to.match(/<input class="form-field" type="text" name="accountNumber"/);
      expect(res.text).to.match(/<input class="form-field" type="text" name="routingNumber"/);
      done();
    });
  });
});

describe('Submerchant errors', function() {
  it('returns errors with invalid input', function() {
    api.post('/submerchant')
      .send()
      .end(function (err, res) {
        expect(res.text).to.contain('Individual first name is required.');
        expect(res.text).to.contain('Individual last name is required.');
        expect(res.text).to.contain('Individual date of birth is required.');
        expect(res.text).to.contain('Individual street address is required.');
        expect(res.text).to.contain('Individual postal code is required.');
        expect(res.text).to.contain('Individual locality is required.');
        expect(res.text).to.contain('Individual region is required.');
        expect(res.text).to.contain('Funding routing number is required.');
        expect(res.text).to.contain('Funding account number is required.');
        done();
      });
  });
});
