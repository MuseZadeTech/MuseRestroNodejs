'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCuisineLocation;

describe('CuisineLocation API:', function() {
  describe('GET /api/cuisineLocations', function() {
    var cuisineLocations;

    beforeEach(function(done) {
      request(app)
        .get('/api/cuisineLocations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          cuisineLocations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      cuisineLocations.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/cuisineLocations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/cuisineLocations')
        .send({
          name: 'New CuisineLocation',
          info: 'This is the brand new cuisineLocation!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCuisineLocation = res.body;
          done();
        });
    });

    it('should respond with the newly created cuisineLocation', function() {
      newCuisineLocation.name.should.equal('New CuisineLocation');
      newCuisineLocation.info.should.equal('This is the brand new cuisineLocation!!!');
    });
  });

  describe('GET /api/cuisineLocations/:id', function() {
    var cuisineLocation;

    beforeEach(function(done) {
      request(app)
        .get(`/api/cuisineLocations/${newCuisineLocation._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          cuisineLocation = res.body;
          done();
        });
    });

    afterEach(function() {
      cuisineLocation = {};
    });

    it('should respond with the requested cuisineLocation', function() {
      cuisineLocation.name.should.equal('New CuisineLocation');
      cuisineLocation.info.should.equal('This is the brand new cuisineLocation!!!');
    });
  });

  describe('PUT /api/cuisineLocations/:id', function() {
    var updatedCuisineLocation;

    beforeEach(function(done) {
      request(app)
        .put(`/api/cuisineLocations/${newCuisineLocation._id}`)
        .send({
          name: 'Updated CuisineLocation',
          info: 'This is the updated cuisineLocation!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCuisineLocation = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCuisineLocation = {};
    });

    it('should respond with the updated cuisineLocation', function() {
      updatedCuisineLocation.name.should.equal('Updated CuisineLocation');
      updatedCuisineLocation.info.should.equal('This is the updated cuisineLocation!!!');
    });

    it('should respond with the updated cuisineLocation on a subsequent GET', function(done) {
      request(app)
        .get(`/api/cuisineLocations/${newCuisineLocation._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let cuisineLocation = res.body;

          cuisineLocation.name.should.equal('Updated CuisineLocation');
          cuisineLocation.info.should.equal('This is the updated cuisineLocation!!!');

          done();
        });
    });
  });

  describe('PATCH /api/cuisineLocations/:id', function() {
    var patchedCuisineLocation;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/cuisineLocations/${newCuisineLocation._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched CuisineLocation' },
          { op: 'replace', path: '/info', value: 'This is the patched cuisineLocation!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCuisineLocation = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCuisineLocation = {};
    });

    it('should respond with the patched cuisineLocation', function() {
      patchedCuisineLocation.name.should.equal('Patched CuisineLocation');
      patchedCuisineLocation.info.should.equal('This is the patched cuisineLocation!!!');
    });
  });

  describe('DELETE /api/cuisineLocations/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/cuisineLocations/${newCuisineLocation._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when cuisineLocation does not exist', function(done) {
      request(app)
        .delete(`/api/cuisineLocations/${newCuisineLocation._id}`)
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
