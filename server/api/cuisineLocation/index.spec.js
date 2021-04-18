'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var cuisineLocationCtrlStub = {
  index: 'cuisineLocationCtrl.index',
  show: 'cuisineLocationCtrl.show',
  create: 'cuisineLocationCtrl.create',
  upsert: 'cuisineLocationCtrl.upsert',
  patch: 'cuisineLocationCtrl.patch',
  destroy: 'cuisineLocationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var cuisineLocationIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './cuisineLocation.controller': cuisineLocationCtrlStub
});

describe('CuisineLocation API Router:', function() {
  it('should return an express router instance', function() {
    cuisineLocationIndex.should.equal(routerStub);
  });

  describe('GET /api/cuisineLocations', function() {
    it('should route to cuisineLocation.controller.index', function() {
      routerStub.get
        .withArgs('/', 'cuisineLocationCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/cuisineLocations/:id', function() {
    it('should route to cuisineLocation.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'cuisineLocationCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/cuisineLocations', function() {
    it('should route to cuisineLocation.controller.create', function() {
      routerStub.post
        .withArgs('/', 'cuisineLocationCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/cuisineLocations/:id', function() {
    it('should route to cuisineLocation.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'cuisineLocationCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/cuisineLocations/:id', function() {
    it('should route to cuisineLocation.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'cuisineLocationCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/cuisineLocations/:id', function() {
    it('should route to cuisineLocation.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'cuisineLocationCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
