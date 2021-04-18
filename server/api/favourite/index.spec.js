'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var favouriteCtrlStub = {
  index: 'favouriteCtrl.index',
  show: 'favouriteCtrl.show',
  create: 'favouriteCtrl.create',
  upsert: 'favouriteCtrl.upsert',
  patch: 'favouriteCtrl.patch',
  destroy: 'favouriteCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var favouriteIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './favourite.controller': favouriteCtrlStub
});

describe('Favourite API Router:', function() {
  it('should return an express router instance', function() {
    favouriteIndex.should.equal(routerStub);
  });

  describe('GET /y', function() {
    it('should route to favourite.controller.index', function() {
      routerStub.get
        .withArgs('/', 'favouriteCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /y/:id', function() {
    it('should route to favourite.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'favouriteCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /y', function() {
    it('should route to favourite.controller.create', function() {
      routerStub.post
        .withArgs('/', 'favouriteCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /y/:id', function() {
    it('should route to favourite.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'favouriteCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /y/:id', function() {
    it('should route to favourite.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'favouriteCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /y/:id', function() {
    it('should route to favourite.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'favouriteCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
