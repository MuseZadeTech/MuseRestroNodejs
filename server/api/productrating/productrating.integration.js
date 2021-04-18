'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductrating;

describe('Productrating API:', function() {
  describe('GET /api/productratings', function() {
    var productratings;

    beforeEach(function(done) {
      request(app)
        .get('/api/productratings')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          productratings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      productratings.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/productratings', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/productratings')
        .send({
          name: 'New Productrating',
          info: 'This is the brand new productrating!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductrating = res.body;
          done();
        });
    });

    it('should respond with the newly created productrating', function() {
      newProductrating.name.should.equal('New Productrating');
      newProductrating.info.should.equal('This is the brand new productrating!!!');
    });
  });

  describe('GET /api/productratings/:id', function() {
    var productrating;

    beforeEach(function(done) {
      request(app)
        .get(`/api/productratings/${newProductrating._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          productrating = res.body;
          done();
        });
    });

    afterEach(function() {
      productrating = {};
    });

    it('should respond with the requested productrating', function() {
      productrating.name.should.equal('New Productrating');
      productrating.info.should.equal('This is the brand new productrating!!!');
    });
  });

  describe('PUT /api/productratings/:id', function() {
    var updatedProductrating;

    beforeEach(function(done) {
      request(app)
        .put(`/api/productratings/${newProductrating._id}`)
        .send({
          name: 'Updated Productrating',
          info: 'This is the updated productrating!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductrating = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductrating = {};
    });

    it('should respond with the updated productrating', function() {
      updatedProductrating.name.should.equal('Updated Productrating');
      updatedProductrating.info.should.equal('This is the updated productrating!!!');
    });

    it('should respond with the updated productrating on a subsequent GET', function(done) {
      request(app)
        .get(`/api/productratings/${newProductrating._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let productrating = res.body;

          productrating.name.should.equal('Updated Productrating');
          productrating.info.should.equal('This is the updated productrating!!!');

          done();
        });
    });
  });

  describe('PATCH /api/productratings/:id', function() {
    var patchedProductrating;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/productratings/${newProductrating._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Productrating' },
          { op: 'replace', path: '/info', value: 'This is the patched productrating!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductrating = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductrating = {};
    });

    it('should respond with the patched productrating', function() {
      patchedProductrating.name.should.equal('Patched Productrating');
      patchedProductrating.info.should.equal('This is the patched productrating!!!');
    });
  });

  describe('DELETE /api/productratings/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/productratings/${newProductrating._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when productrating does not exist', function(done) {
      request(app)
        .delete(`/api/productratings/${newProductrating._id}`)
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
