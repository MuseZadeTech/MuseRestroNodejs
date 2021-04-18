'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newLocation;

describe('Location API:', function() {
  describe('GET /api/locations', function() {
    var locations;

    beforeEach(function(done) {
      request(app)
        .get('/api/locations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          locations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      locations.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/locations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/locations')
        .send({
          name: 'New Location',
          info: 'This is the brand new location!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newLocation = res.body;
          done();
        });
    });

    it('should respond with the newly created location', function() {
      newLocation.name.should.equal('New Location');
      newLocation.info.should.equal('This is the brand new location!!!');
    });
  });

  describe('GET /api/locations/:id', function() {
    var location;

    beforeEach(function(done) {
      request(app)
        .get(`/api/locations/${newLocation._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          location = res.body;
          done();
        });
    });

    afterEach(function() {
      location = {};
    });

    it('should respond with the requested location', function() {
      location.name.should.equal('New Location');
      location.info.should.equal('This is the brand new location!!!');
    });
  });

  describe('PUT /api/locations/:id', function() {
    var updatedLocation;

    beforeEach(function(done) {
      request(app)
        .put(`/api/locations/${newLocation._id}`)
        .send({
          name: 'Updated Location',
          info: 'This is the updated location!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedLocation = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLocation = {};
    });

    it('should respond with the updated location', function() {
      updatedLocation.name.should.equal('Updated Location');
      updatedLocation.info.should.equal('This is the updated location!!!');
    });

    it('should respond with the updated location on a subsequent GET', function(done) {
      request(app)
        .get(`/api/locations/${newLocation._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let location = res.body;

          location.name.should.equal('Updated Location');
          location.info.should.equal('This is the updated location!!!');

          done();
        });
    });
  });

  describe('PATCH /api/locations/:id', function() {
    var patchedLocation;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/locations/${newLocation._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Location' },
          { op: 'replace', path: '/info', value: 'This is the patched location!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedLocation = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedLocation = {};
    });

    it('should respond with the patched location', function() {
      patchedLocation.name.should.equal('Patched Location');
      patchedLocation.info.should.equal('This is the patched location!!!');
    });
  });

  describe('DELETE /api/locations/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/locations/${newLocation._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when location does not exist', function(done) {
      request(app)
        .delete(`/api/locations/${newLocation._id}`)
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
