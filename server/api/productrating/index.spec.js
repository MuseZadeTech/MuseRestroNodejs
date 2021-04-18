'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var productratingCtrlStub = {
  index: 'productratingCtrl.index',
  show: 'productratingCtrl.show',
  create: 'productratingCtrl.create',
  upsert: 'productratingCtrl.upsert',
  patch: 'productratingCtrl.patch',
  destroy: 'productratingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var productratingIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './productrating.controller': productratingCtrlStub
});

describe('Productrating API Router:', function() {
  it('should return an express router instance', function() {
    productratingIndex.should.equal(routerStub);
  });

  describe('GET /api/productratings', function() {
    it('should route to productrating.controller.index', function() {
      routerStub.get
        .withArgs('/', 'productratingCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/productratings/:id', function() {
    it('should route to productrating.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'productratingCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/productratings', function() {
    it('should route to productrating.controller.create', function() {
      routerStub.post
        .withArgs('/', 'productratingCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/productratings/:id', function() {
    it('should route to productrating.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'productratingCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/productratings/:id', function() {
    it('should route to productrating.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'productratingCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/productratings/:id', function() {
    it('should route to productrating.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'productratingCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
