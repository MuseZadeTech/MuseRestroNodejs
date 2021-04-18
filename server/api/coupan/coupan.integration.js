'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCoupan;

describe('Coupan API:', function() {
  describe('GET /api/coupans', function() {
    var coupans;

    beforeEach(function(done) {
      request(app)
        .get('/api/coupans')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          coupans = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      coupans.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/coupans', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/coupans')
        .send({
          name: 'New Coupan',
          info: 'This is the brand new coupan!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCoupan = res.body;
          done();
        });
    });

    it('should respond with the newly created coupan', function() {
      newCoupan.name.should.equal('New Coupan');
      newCoupan.info.should.equal('This is the brand new coupan!!!');
    });
  });

  describe('GET /api/coupans/:id', function() {
    var coupan;

    beforeEach(function(done) {
      request(app)
        .get(`/api/coupans/${newCoupan._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          coupan = res.body;
          done();
        });
    });

    afterEach(function() {
      coupan = {};
    });

    it('should respond with the requested coupan', function() {
      coupan.name.should.equal('New Coupan');
      coupan.info.should.equal('This is the brand new coupan!!!');
    });
  });

  describe('PUT /api/coupans/:id', function() {
    var updatedCoupan;

    beforeEach(function(done) {
      request(app)
        .put(`/api/coupans/${newCoupan._id}`)
        .send({
          name: 'Updated Coupan',
          info: 'This is the updated coupan!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCoupan = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCoupan = {};
    });

    it('should respond with the updated coupan', function() {
      updatedCoupan.name.should.equal('Updated Coupan');
      updatedCoupan.info.should.equal('This is the updated coupan!!!');
    });

    it('should respond with the updated coupan on a subsequent GET', function(done) {
      request(app)
        .get(`/api/coupans/${newCoupan._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let coupan = res.body;

          coupan.name.should.equal('Updated Coupan');
          coupan.info.should.equal('This is the updated coupan!!!');

          done();
        });
    });
  });

  describe('PATCH /api/coupans/:id', function() {
    var patchedCoupan;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/coupans/${newCoupan._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Coupan' },
          { op: 'replace', path: '/info', value: 'This is the patched coupan!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCoupan = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCoupan = {};
    });

    it('should respond with the patched coupan', function() {
      patchedCoupan.name.should.equal('Patched Coupan');
      patchedCoupan.info.should.equal('This is the patched coupan!!!');
    });
  });

  describe('DELETE /api/coupans/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/coupans/${newCoupan._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when coupan does not exist', function(done) {
      request(app)
        .delete(`/api/coupans/${newCoupan._id}`)
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
