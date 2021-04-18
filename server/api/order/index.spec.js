'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var orderCtrlStub = {
  index: 'orderCtrl.index',
  show: 'orderCtrl.show',
  create: 'orderCtrl.create',
  upsert: 'orderCtrl.upsert',
  patch: 'orderCtrl.patch',
  destroy: 'orderCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var orderIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './order.controller': orderCtrlStub
});

describe('Order API Router:', function() {
  it('should return an express router instance', function() {
    orderIndex.should.equal(routerStub);
  });

  describe('GET /api/orders', function() {
    it('should route to order.controller.index', function() {
      routerStub.get
        .withArgs('/', 'orderCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/orders/:id', function() {
    it('should route to order.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'orderCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/orders', function() {
    it('should route to order.controller.create', function() {
      routerStub.post
        .withArgs('/', 'orderCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/orders/:id', function() {
    it('should route to order.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'orderCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/orders/:id', function() {
    it('should route to order.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'orderCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/orders/:id', function() {
    it('should route to order.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'orderCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
