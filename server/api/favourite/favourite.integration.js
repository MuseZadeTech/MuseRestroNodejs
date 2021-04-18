'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newFavourite;

describe('Favourite API:', function() {
  describe('GET /y', function() {
    var favourites;

    beforeEach(function(done) {
      request(app)
        .get('/y')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          favourites = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      favourites.should.be.instanceOf(Array);
    });
  });

  describe('POST /y', function() {
    beforeEach(function(done) {
      request(app)
        .post('/y')
        .send({
          name: 'New Favourite',
          info: 'This is the brand new favourite!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFavourite = res.body;
          done();
        });
    });

    it('should respond with the newly created favourite', function() {
      newFavourite.name.should.equal('New Favourite');
      newFavourite.info.should.equal('This is the brand new favourite!!!');
    });
  });

  describe('GET /y/:id', function() {
    var favourite;

    beforeEach(function(done) {
      request(app)
        .get(`/y/${newFavourite._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          favourite = res.body;
          done();
        });
    });

    afterEach(function() {
      favourite = {};
    });

    it('should respond with the requested favourite', function() {
      favourite.name.should.equal('New Favourite');
      favourite.info.should.equal('This is the brand new favourite!!!');
    });
  });

  describe('PUT /y/:id', function() {
    var updatedFavourite;

    beforeEach(function(done) {
      request(app)
        .put(`/y/${newFavourite._id}`)
        .send({
          name: 'Updated Favourite',
          info: 'This is the updated favourite!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedFavourite = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFavourite = {};
    });

    it('should respond with the updated favourite', function() {
      updatedFavourite.name.should.equal('Updated Favourite');
      updatedFavourite.info.should.equal('This is the updated favourite!!!');
    });

    it('should respond with the updated favourite on a subsequent GET', function(done) {
      request(app)
        .get(`/y/${newFavourite._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let favourite = res.body;

          favourite.name.should.equal('Updated Favourite');
          favourite.info.should.equal('This is the updated favourite!!!');

          done();
        });
    });
  });

  describe('PATCH /y/:id', function() {
    var patchedFavourite;

    beforeEach(function(done) {
      request(app)
        .patch(`/y/${newFavourite._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Favourite' },
          { op: 'replace', path: '/info', value: 'This is the patched favourite!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedFavourite = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedFavourite = {};
    });

    it('should respond with the patched favourite', function() {
      patchedFavourite.name.should.equal('Patched Favourite');
      patchedFavourite.info.should.equal('This is the patched favourite!!!');
    });
  });

  describe('DELETE /y/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/y/${newFavourite._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when favourite does not exist', function(done) {
      request(app)
        .delete(`/y/${newFavourite._id}`)
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
