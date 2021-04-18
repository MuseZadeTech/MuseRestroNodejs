'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var carddetailCtrlStub = {
  index: 'carddetailCtrl.index',
  show: 'carddetailCtrl.show',
  create: 'carddetailCtrl.create',
  upsert: 'carddetailCtrl.upsert',
  patch: 'carddetailCtrl.patch',
  destroy: 'carddetailCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var carddetailIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './carddetail.controller': carddetailCtrlStub
});

describe('Carddetail API Router:', function() {
  it('should return an express router instance', function() {
    carddetailIndex.should.equal(routerStub);
  });

  describe('GET /y', function() {
    it('should route to carddetail.controller.index', function() {
      routerStub.get
        .withArgs('/', 'carddetailCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /y/:id', function() {
    it('should route to carddetail.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'carddetailCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /y', function() {
    it('should route to carddetail.controller.create', function() {
      routerStub.post
        .withArgs('/', 'carddetailCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /y/:id', function() {
    it('should route to carddetail.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'carddetailCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /y/:id', function() {
    it('should route to carddetail.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'carddetailCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /y/:id', function() {
    it('should route to carddetail.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'carddetailCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
