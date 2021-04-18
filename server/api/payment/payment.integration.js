'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newPayment;

describe('Payment API:', function() {
  describe('GET /api/payments', function() {
    var payments;

    beforeEach(function(done) {
      request(app)
        .get('/api/payments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          payments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      payments.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/payments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/payments')
        .send({
          name: 'New Payment',
          info: 'This is the brand new payment!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPayment = res.body;
          done();
        });
    });

    it('should respond with the newly created payment', function() {
      newPayment.name.should.equal('New Payment');
      newPayment.info.should.equal('This is the brand new payment!!!');
    });
  });

  describe('GET /api/payments/:id', function() {
    var payment;

    beforeEach(function(done) {
      request(app)
        .get(`/api/payments/${newPayment._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          payment = res.body;
          done();
        });
    });

    afterEach(function() {
      payment = {};
    });

    it('should respond with the requested payment', function() {
      payment.name.should.equal('New Payment');
      payment.info.should.equal('This is the brand new payment!!!');
    });
  });

  describe('PUT /api/payments/:id', function() {
    var updatedPayment;

    beforeEach(function(done) {
      request(app)
        .put(`/api/payments/${newPayment._id}`)
        .send({
          name: 'Updated Payment',
          info: 'This is the updated payment!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPayment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPayment = {};
    });

    it('should respond with the updated payment', function() {
      updatedPayment.name.should.equal('Updated Payment');
      updatedPayment.info.should.equal('This is the updated payment!!!');
    });

    it('should respond with the updated payment on a subsequent GET', function(done) {
      request(app)
        .get(`/api/payments/${newPayment._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let payment = res.body;

          payment.name.should.equal('Updated Payment');
          payment.info.should.equal('This is the updated payment!!!');

          done();
        });
    });
  });

  describe('PATCH /api/payments/:id', function() {
    var patchedPayment;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/payments/${newPayment._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Payment' },
          { op: 'replace', path: '/info', value: 'This is the patched payment!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPayment = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPayment = {};
    });

    it('should respond with the patched payment', function() {
      patchedPayment.name.should.equal('Patched Payment');
      patchedPayment.info.should.equal('This is the patched payment!!!');
    });
  });

  describe('DELETE /api/payments/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/payments/${newPayment._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when payment does not exist', function(done) {
      request(app)
        .delete(`/api/payments/${newPayment._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
