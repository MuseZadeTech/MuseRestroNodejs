'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newPointrate;

describe('Pointrate API:', function() {
  describe('GET /api/pointrates', function() {
    var pointrates;

    beforeEach(function(done) {
      request(app)
        .get('/api/pointrates')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          pointrates = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      pointrates.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/pointrates', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/pointrates')
        .send({
          name: 'New Pointrate',
          info: 'This is the brand new pointrate!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPointrate = res.body;
          done();
        });
    });

    it('should respond with the newly created pointrate', function() {
      newPointrate.name.should.equal('New Pointrate');
      newPointrate.info.should.equal('This is the brand new pointrate!!!');
    });
  });

  describe('GET /api/pointrates/:id', function() {
    var pointrate;

    beforeEach(function(done) {
      request(app)
        .get(`/api/pointrates/${newPointrate._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          pointrate = res.body;
          done();
        });
    });

    afterEach(function() {
      pointrate = {};
    });

    it('should respond with the requested pointrate', function() {
      pointrate.name.should.equal('New Pointrate');
      pointrate.info.should.equal('This is the brand new pointrate!!!');
    });
  });

  describe('PUT /api/pointrates/:id', function() {
    var updatedPointrate;

    beforeEach(function(done) {
      request(app)
        .put(`/api/pointrates/${newPointrate._id}`)
        .send({
          name: 'Updated Pointrate',
          info: 'This is the updated pointrate!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPointrate = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPointrate = {};
    });

    it('should respond with the updated pointrate', function() {
      updatedPointrate.name.should.equal('Updated Pointrate');
      updatedPointrate.info.should.equal('This is the updated pointrate!!!');
    });

    it('should respond with the updated pointrate on a subsequent GET', function(done) {
      request(app)
        .get(`/api/pointrates/${newPointrate._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let pointrate = res.body;

          pointrate.name.should.equal('Updated Pointrate');
          pointrate.info.should.equal('This is the updated pointrate!!!');

          done();
        });
    });
  });

  describe('PATCH /api/pointrates/:id', function() {
    var patchedPointrate;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/pointrates/${newPointrate._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Pointrate' },
          { op: 'replace', path: '/info', value: 'This is the patched pointrate!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPointrate = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPointrate = {};
    });

    it('should respond with the patched pointrate', function() {
      patchedPointrate.name.should.equal('Patched Pointrate');
      patchedPointrate.info.should.equal('This is the patched pointrate!!!');
    });
  });

  describe('DELETE /api/pointrates/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/pointrates/${newPointrate._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pointrate does not exist', function(done) {
      request(app)
        .delete(`/api/pointrates/${newPointrate._id}`)
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
