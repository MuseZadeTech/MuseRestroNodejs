'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newSetting;

describe('Setting API:', function() {
  describe('GET /y', function() {
    var settings;

    beforeEach(function(done) {
      request(app)
        .get('/y')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          settings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      settings.should.be.instanceOf(Array);
    });
  });

  describe('POST /y', function() {
    beforeEach(function(done) {
      request(app)
        .post('/y')
        .send({
          name: 'New Setting',
          info: 'This is the brand new setting!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newSetting = res.body;
          done();
        });
    });

    it('should respond with the newly created setting', function() {
      newSetting.name.should.equal('New Setting');
      newSetting.info.should.equal('This is the brand new setting!!!');
    });
  });

  describe('GET /y/:id', function() {
    var setting;

    beforeEach(function(done) {
      request(app)
        .get(`/y/${newSetting._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          setting = res.body;
          done();
        });
    });

    afterEach(function() {
      setting = {};
    });

    it('should respond with the requested setting', function() {
      setting.name.should.equal('New Setting');
      setting.info.should.equal('This is the brand new setting!!!');
    });
  });

  describe('PUT /y/:id', function() {
    var updatedSetting;

    beforeEach(function(done) {
      request(app)
        .put(`/y/${newSetting._id}`)
        .send({
          name: 'Updated Setting',
          info: 'This is the updated setting!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedSetting = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSetting = {};
    });

    it('should respond with the updated setting', function() {
      updatedSetting.name.should.equal('Updated Setting');
      updatedSetting.info.should.equal('This is the updated setting!!!');
    });

    it('should respond with the updated setting on a subsequent GET', function(done) {
      request(app)
        .get(`/y/${newSetting._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let setting = res.body;

          setting.name.should.equal('Updated Setting');
          setting.info.should.equal('This is the updated setting!!!');

          done();
        });
    });
  });

  describe('PATCH /y/:id', function() {
    var patchedSetting;

    beforeEach(function(done) {
      request(app)
        .patch(`/y/${newSetting._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Setting' },
          { op: 'replace', path: '/info', value: 'This is the patched setting!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedSetting = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedSetting = {};
    });

    it('should respond with the patched setting', function() {
      patchedSetting.name.should.equal('Patched Setting');
      patchedSetting.info.should.equal('This is the patched setting!!!');
    });
  });

  describe('DELETE /y/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/y/${newSetting._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when setting does not exist', function(done) {
      request(app)
        .delete(`/y/${newSetting._id}`)
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
