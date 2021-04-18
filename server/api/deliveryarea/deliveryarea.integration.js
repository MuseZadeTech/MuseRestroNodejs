'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newDeliveryarea;

describe('Deliveryarea API:', function() {
  describe('GET /api/deliveryareas', function() {
    var deliveryareas;

    beforeEach(function(done) {
      request(app)
        .get('/api/deliveryareas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          deliveryareas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      deliveryareas.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/deliveryareas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/deliveryareas')
        .send({
          name: 'New Deliveryarea',
          info: 'This is the brand new deliveryarea!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDeliveryarea = res.body;
          done();
        });
    });

    it('should respond with the newly created deliveryarea', function() {
      newDeliveryarea.name.should.equal('New Deliveryarea');
      newDeliveryarea.info.should.equal('This is the brand new deliveryarea!!!');
    });
  });

  describe('GET /api/deliveryareas/:id', function() {
    var deliveryarea;

    beforeEach(function(done) {
      request(app)
        .get(`/api/deliveryareas/${newDeliveryarea._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          deliveryarea = res.body;
          done();
        });
    });

    afterEach(function() {
      deliveryarea = {};
    });

    it('should respond with the requested deliveryarea', function() {
      deliveryarea.name.should.equal('New Deliveryarea');
      deliveryarea.info.should.equal('This is the brand new deliveryarea!!!');
    });
  });

  describe('PUT /api/deliveryareas/:id', function() {
    var updatedDeliveryarea;

    beforeEach(function(done) {
      request(app)
        .put(`/api/deliveryareas/${newDeliveryarea._id}`)
        .send({
          name: 'Updated Deliveryarea',
          info: 'This is the updated deliveryarea!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDeliveryarea = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDeliveryarea = {};
    });

    it('should respond with the updated deliveryarea', function() {
      updatedDeliveryarea.name.should.equal('Updated Deliveryarea');
      updatedDeliveryarea.info.should.equal('This is the updated deliveryarea!!!');
    });

    it('should respond with the updated deliveryarea on a subsequent GET', function(done) {
      request(app)
        .get(`/api/deliveryareas/${newDeliveryarea._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let deliveryarea = res.body;

          deliveryarea.name.should.equal('Updated Deliveryarea');
          deliveryarea.info.should.equal('This is the updated deliveryarea!!!');

          done();
        });
    });
  });

  describe('PATCH /api/deliveryareas/:id', function() {
    var patchedDeliveryarea;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/deliveryareas/${newDeliveryarea._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Deliveryarea' },
          { op: 'replace', path: '/info', value: 'This is the patched deliveryarea!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDeliveryarea = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDeliveryarea = {};
    });

    it('should respond with the patched deliveryarea', function() {
      patchedDeliveryarea.name.should.equal('Patched Deliveryarea');
      patchedDeliveryarea.info.should.equal('This is the patched deliveryarea!!!');
    });
  });

  describe('DELETE /api/deliveryareas/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/deliveryareas/${newDeliveryarea._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when deliveryarea does not exist', function(done) {
      request(app)
        .delete(`/api/deliveryareas/${newDeliveryarea._id}`)
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
