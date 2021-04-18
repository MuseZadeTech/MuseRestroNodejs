'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ordertrackCtrlStub = {
  index: 'ordertrackCtrl.index',
  show: 'ordertrackCtrl.show',
  create: 'ordertrackCtrl.create',
  upsert: 'ordertrackCtrl.upsert',
  patch: 'ordertrackCtrl.patch',
  destroy: 'ordertrackCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ordertrackIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './ordertrack.controller': ordertrackCtrlStub
});

describe('Ordertrack API Router:', function() {
  it('should return an express router instance', function() {
    ordertrackIndex.should.equal(routerStub);
  });

  describe('GET /api/ordertracks', function() {
    it('should route to ordertrack.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ordertrackCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/ordertracks/:id', function() {
    it('should route to ordertrack.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ordertrackCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/ordertracks', function() {
    it('should route to ordertrack.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ordertrackCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/ordertracks/:id', function() {
    it('should route to ordertrack.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'ordertrackCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/ordertracks/:id', function() {
    it('should route to ordertrack.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'ordertrackCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/ordertracks/:id', function() {
    it('should route to ordertrack.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ordertrackCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
