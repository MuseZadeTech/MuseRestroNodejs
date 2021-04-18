'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newSubcategory;

describe('Subcategory API:', function() {
  describe('GET /api/subcategories', function() {
    var subcategorys;

    beforeEach(function(done) {
      request(app)
        .get('/api/subcategories')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          subcategorys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      subcategorys.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/subcategories', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/subcategories')
        .send({
          name: 'New Subcategory',
          info: 'This is the brand new subcategory!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newSubcategory = res.body;
          done();
        });
    });

    it('should respond with the newly created subcategory', function() {
      newSubcategory.name.should.equal('New Subcategory');
      newSubcategory.info.should.equal('This is the brand new subcategory!!!');
    });
  });

  describe('GET /api/subcategories/:id', function() {
    var subcategory;

    beforeEach(function(done) {
      request(app)
        .get(`/api/subcategories/${newSubcategory._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          subcategory = res.body;
          done();
        });
    });

    afterEach(function() {
      subcategory = {};
    });

    it('should respond with the requested subcategory', function() {
      subcategory.name.should.equal('New Subcategory');
      subcategory.info.should.equal('This is the brand new subcategory!!!');
    });
  });

  describe('PUT /api/subcategories/:id', function() {
    var updatedSubcategory;

    beforeEach(function(done) {
      request(app)
        .put(`/api/subcategories/${newSubcategory._id}`)
        .send({
          name: 'Updated Subcategory',
          info: 'This is the updated subcategory!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedSubcategory = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSubcategory = {};
    });

    it('should respond with the updated subcategory', function() {
      updatedSubcategory.name.should.equal('Updated Subcategory');
      updatedSubcategory.info.should.equal('This is the updated subcategory!!!');
    });

    it('should respond with the updated subcategory on a subsequent GET', function(done) {
      request(app)
        .get(`/api/subcategories/${newSubcategory._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let subcategory = res.body;

          subcategory.name.should.equal('Updated Subcategory');
          subcategory.info.should.equal('This is the updated subcategory!!!');

          done();
        });
    });
  });

  describe('PATCH /api/subcategories/:id', function() {
    var patchedSubcategory;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/subcategories/${newSubcategory._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Subcategory' },
          { op: 'replace', path: '/info', value: 'This is the patched subcategory!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedSubcategory = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedSubcategory = {};
    });

    it('should respond with the patched subcategory', function() {
      patchedSubcategory.name.should.equal('Patched Subcategory');
      patchedSubcategory.info.should.equal('This is the patched subcategory!!!');
    });
  });

  describe('DELETE /api/subcategories/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/subcategories/${newSubcategory._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when subcategory does not exist', function(done) {
      request(app)
        .delete(`/api/subcategories/${newSubcategory._id}`)
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
