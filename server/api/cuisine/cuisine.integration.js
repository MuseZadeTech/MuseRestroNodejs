'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCuisine;

describe('Cuisine API:', function() {
  describe('GET /api/cuisines', function() {
    var cuisines;

    beforeEach(function(done) {
      request(app)
        .get('/api/cuisines')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          cuisines = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      cuisines.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/cuisines', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/cuisines')
        .send({
          name: 'New Cuisine',
          info: 'This is the brand new cuisine!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCuisine = res.body;
          done();
        });
    });

    it('should respond with the newly created cuisine', function() {
      newCuisine.name.should.equal('New Cuisine');
      newCuisine.info.should.equal('This is the brand new cuisine!!!');
    });
  });

  describe('GET /api/cuisines/:id', function() {
    var cuisine;

    beforeEach(function(done) {
      request(app)
        .get(`/api/cuisines/${newCuisine._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          cuisine = res.body;
          done();
        });
    });

    afterEach(function() {
      cuisine = {};
    });

    it('should respond with the requested cuisine', function() {
      cuisine.name.should.equal('New Cuisine');
      cuisine.info.should.equal('This is the brand new cuisine!!!');
    });
  });

  describe('PUT /api/cuisines/:id', function() {
    var updatedCuisine;

    beforeEach(function(done) {
      request(app)
        .put(`/api/cuisines/${newCuisine._id}`)
        .send({
          name: 'Updated Cuisine',
          info: 'This is the updated cuisine!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCuisine = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCuisine = {};
    });

    it('should respond with the updated cuisine', function() {
      updatedCuisine.name.should.equal('Updated Cuisine');
      updatedCuisine.info.should.equal('This is the updated cuisine!!!');
    });

    it('should respond with the updated cuisine on a subsequent GET', function(done) {
      request(app)
        .get(`/api/cuisines/${newCuisine._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let cuisine = res.body;

          cuisine.name.should.equal('Updated Cuisine');
          cuisine.info.should.equal('This is the updated cuisine!!!');

          done();
        });
    });
  });

  describe('PATCH /api/cuisines/:id', function() {
    var patchedCuisine;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/cuisines/${newCuisine._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Cuisine' },
          { op: 'replace', path: '/info', value: 'This is the patched cuisine!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCuisine = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCuisine = {};
    });

    it('should respond with the patched cuisine', function() {
      patchedCuisine.name.should.equal('Patched Cuisine');
      patchedCuisine.info.should.equal('This is the patched cuisine!!!');
    });
  });

  describe('DELETE /api/cuisines/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/cuisines/${newCuisine._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when cuisine does not exist', function(done) {
      request(app)
        .delete(`/api/cuisines/${newCuisine._id}`)
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
