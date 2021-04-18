'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var cuisineCtrlStub = {
  index: 'cuisineCtrl.index',
  show: 'cuisineCtrl.show',
  create: 'cuisineCtrl.create',
  upsert: 'cuisineCtrl.upsert',
  patch: 'cuisineCtrl.patch',
  destroy: 'cuisineCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var cuisineIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './cuisine.controller': cuisineCtrlStub
});

describe('Cuisine API Router:', function() {
  it('should return an express router instance', function() {
    cuisineIndex.should.equal(routerStub);
  });

  describe('GET /api/cuisines', function() {
    it('should route to cuisine.controller.index', function() {
      routerStub.get
        .withArgs('/', 'cuisineCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/cuisines/:id', function() {
    it('should route to cuisine.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'cuisineCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/cuisines', function() {
    it('should route to cuisine.controller.create', function() {
      routerStub.post
        .withArgs('/', 'cuisineCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/cuisines/:id', function() {
    it('should route to cuisine.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'cuisineCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/cuisines/:id', function() {
    it('should route to cuisine.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'cuisineCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/cuisines/:id', function() {
    it('should route to cuisine.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'cuisineCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
