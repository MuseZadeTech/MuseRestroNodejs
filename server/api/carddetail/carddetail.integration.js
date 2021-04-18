'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCarddetail;

describe('Carddetail API:', function() {
  describe('GET /y', function() {
    var carddetails;

    beforeEach(function(done) {
      request(app)
        .get('/y')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          carddetails = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      carddetails.should.be.instanceOf(Array);
    });
  });

  describe('POST /y', function() {
    beforeEach(function(done) {
      request(app)
        .post('/y')
        .send({
          name: 'New Carddetail',
          info: 'This is the brand new carddetail!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCarddetail = res.body;
          done();
        });
    });

    it('should respond with the newly created carddetail', function() {
      newCarddetail.name.should.equal('New Carddetail');
      newCarddetail.info.should.equal('This is the brand new carddetail!!!');
    });
  });

  describe('GET /y/:id', function() {
    var carddetail;

    beforeEach(function(done) {
      request(app)
        .get(`/y/${newCarddetail._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          carddetail = res.body;
          done();
        });
    });

    afterEach(function() {
      carddetail = {};
    });

    it('should respond with the requested carddetail', function() {
      carddetail.name.should.equal('New Carddetail');
      carddetail.info.should.equal('This is the brand new carddetail!!!');
    });
  });

  describe('PUT /y/:id', function() {
    var updatedCarddetail;

    beforeEach(function(done) {
      request(app)
        .put(`/y/${newCarddetail._id}`)
        .send({
          name: 'Updated Carddetail',
          info: 'This is the updated carddetail!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCarddetail = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCarddetail = {};
    });

    it('should respond with the updated carddetail', function() {
      updatedCarddetail.name.should.equal('Updated Carddetail');
      updatedCarddetail.info.should.equal('This is the updated carddetail!!!');
    });

    it('should respond with the updated carddetail on a subsequent GET', function(done) {
      request(app)
        .get(`/y/${newCarddetail._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let carddetail = res.body;

          carddetail.name.should.equal('Updated Carddetail');
          carddetail.info.should.equal('This is the updated carddetail!!!');

          done();
        });
    });
  });

  describe('PATCH /y/:id', function() {
    var patchedCarddetail;

    beforeEach(function(done) {
      request(app)
        .patch(`/y/${newCarddetail._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Carddetail' },
          { op: 'replace', path: '/info', value: 'This is the patched carddetail!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCarddetail = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCarddetail = {};
    });

    it('should respond with the patched carddetail', function() {
      patchedCarddetail.name.should.equal('Patched Carddetail');
      patchedCarddetail.info.should.equal('This is the patched carddetail!!!');
    });
  });

  describe('DELETE /y/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/y/${newCarddetail._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when carddetail does not exist', function(done) {
      request(app)
        .delete(`/y/${newCarddetail._id}`)
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
