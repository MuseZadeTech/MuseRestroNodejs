'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newOrdertrack;

describe('Ordertrack API:', function() {
  describe('GET /api/ordertracks', function() {
    var ordertracks;

    beforeEach(function(done) {
      request(app)
        .get('/api/ordertracks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ordertracks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ordertracks.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/ordertracks', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ordertracks')
        .send({
          name: 'New Ordertrack',
          info: 'This is the brand new ordertrack!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newOrdertrack = res.body;
          done();
        });
    });

    it('should respond with the newly created ordertrack', function() {
      newOrdertrack.name.should.equal('New Ordertrack');
      newOrdertrack.info.should.equal('This is the brand new ordertrack!!!');
    });
  });

  describe('GET /api/ordertracks/:id', function() {
    var ordertrack;

    beforeEach(function(done) {
      request(app)
        .get(`/api/ordertracks/${newOrdertrack._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          ordertrack = res.body;
          done();
        });
    });

    afterEach(function() {
      ordertrack = {};
    });

    it('should respond with the requested ordertrack', function() {
      ordertrack.name.should.equal('New Ordertrack');
      ordertrack.info.should.equal('This is the brand new ordertrack!!!');
    });
  });

  describe('PUT /api/ordertracks/:id', function() {
    var updatedOrdertrack;

    beforeEach(function(done) {
      request(app)
        .put(`/api/ordertracks/${newOrdertrack._id}`)
        .send({
          name: 'Updated Ordertrack',
          info: 'This is the updated ordertrack!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedOrdertrack = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOrdertrack = {};
    });

    it('should respond with the updated ordertrack', function() {
      updatedOrdertrack.name.should.equal('Updated Ordertrack');
      updatedOrdertrack.info.should.equal('This is the updated ordertrack!!!');
    });

    it('should respond with the updated ordertrack on a subsequent GET', function(done) {
      request(app)
        .get(`/api/ordertracks/${newOrdertrack._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let ordertrack = res.body;

          ordertrack.name.should.equal('Updated Ordertrack');
          ordertrack.info.should.equal('This is the updated ordertrack!!!');

          done();
        });
    });
  });

  describe('PATCH /api/ordertracks/:id', function() {
    var patchedOrdertrack;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/ordertracks/${newOrdertrack._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Ordertrack' },
          { op: 'replace', path: '/info', value: 'This is the patched ordertrack!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedOrdertrack = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedOrdertrack = {};
    });

    it('should respond with the patched ordertrack', function() {
      patchedOrdertrack.name.should.equal('Patched Ordertrack');
      patchedOrdertrack.info.should.equal('This is the patched ordertrack!!!');
    });
  });

  describe('DELETE /api/ordertracks/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/ordertracks/${newOrdertrack._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ordertrack does not exist', function(done) {
      request(app)
        .delete(`/api/ordertracks/${newOrdertrack._id}`)
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
