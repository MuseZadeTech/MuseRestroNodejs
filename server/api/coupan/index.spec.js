'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var coupanCtrlStub = {
  index: 'coupanCtrl.index',
  show: 'coupanCtrl.show',
  create: 'coupanCtrl.create',
  upsert: 'coupanCtrl.upsert',
  patch: 'coupanCtrl.patch',
  destroy: 'coupanCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var coupanIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './coupan.controller': coupanCtrlStub
});

describe('Coupan API Router:', function() {
  it('should return an express router instance', function() {
    coupanIndex.should.equal(routerStub);
  });

  describe('GET /api/coupans', function() {
    it('should route to coupan.controller.index', function() {
      routerStub.get
        .withArgs('/', 'coupanCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/coupans/:id', function() {
    it('should route to coupan.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'coupanCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/coupans', function() {
    it('should route to coupan.controller.create', function() {
      routerStub.post
        .withArgs('/', 'coupanCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/coupans/:id', function() {
    it('should route to coupan.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'coupanCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/coupans/:id', function() {
    it('should route to coupan.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'coupanCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/coupans/:id', function() {
    it('should route to coupan.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'coupanCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
