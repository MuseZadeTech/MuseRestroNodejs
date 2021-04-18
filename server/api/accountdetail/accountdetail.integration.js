'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newAccountdetail;

describe('Accountdetail API:', function() {
  describe('GET /api/accountdetails', function() {
    var accountdetails;

    beforeEach(function(done) {
      request(app)
        .get('/api/accountdetails')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          accountdetails = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      accountdetails.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/accountdetails', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/accountdetails')
        .send({
          name: 'New Accountdetail',
          info: 'This is the brand new accountdetail!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newAccountdetail = res.body;
          done();
        });
    });

    it('should respond with the newly created accountdetail', function() {
      newAccountdetail.name.should.equal('New Accountdetail');
      newAccountdetail.info.should.equal('This is the brand new accountdetail!!!');
    });
  });

  describe('GET /api/accountdetails/:id', function() {
    var accountdetail;

    beforeEach(function(done) {
      request(app)
        .get(`/api/accountdetails/${newAccountdetail._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          accountdetail = res.body;
          done();
        });
    });

    afterEach(function() {
      accountdetail = {};
    });

    it('should respond with the requested accountdetail', function() {
      accountdetail.name.should.equal('New Accountdetail');
      accountdetail.info.should.equal('This is the brand new accountdetail!!!');
    });
  });

  describe('PUT /api/accountdetails/:id', function() {
    var updatedAccountdetail;

    beforeEach(function(done) {
      request(app)
        .put(`/api/accountdetails/${newAccountdetail._id}`)
        .send({
          name: 'Updated Accountdetail',
          info: 'This is the updated accountdetail!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedAccountdetail = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAccountdetail = {};
    });

    it('should respond with the updated accountdetail', function() {
      updatedAccountdetail.name.should.equal('Updated Accountdetail');
      updatedAccountdetail.info.should.equal('This is the updated accountdetail!!!');
    });

    it('should respond with the updated accountdetail on a subsequent GET', function(done) {
      request(app)
        .get(`/api/accountdetails/${newAccountdetail._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let accountdetail = res.body;

          accountdetail.name.should.equal('Updated Accountdetail');
          accountdetail.info.should.equal('This is the updated accountdetail!!!');

          done();
        });
    });
  });

  describe('PATCH /api/accountdetails/:id', function() {
    var patchedAccountdetail;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/accountdetails/${newAccountdetail._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Accountdetail' },
          { op: 'replace', path: '/info', value: 'This is the patched accountdetail!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedAccountdetail = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedAccountdetail = {};
    });

    it('should respond with the patched accountdetail', function() {
      patchedAccountdetail.name.should.equal('Patched Accountdetail');
      patchedAccountdetail.info.should.equal('This is the patched accountdetail!!!');
    });
  });

  describe('DELETE /api/accountdetails/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/accountdetails/${newAccountdetail._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when accountdetail does not exist', function(done) {
      request(app)
        .delete(`/api/accountdetails/${newAccountdetail._id}`)
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
