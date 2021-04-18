'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var accountdetailCtrlStub = {
  index: 'accountdetailCtrl.index',
  show: 'accountdetailCtrl.show',
  create: 'accountdetailCtrl.create',
  upsert: 'accountdetailCtrl.upsert',
  patch: 'accountdetailCtrl.patch',
  destroy: 'accountdetailCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var accountdetailIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './accountdetail.controller': accountdetailCtrlStub
});

describe('Accountdetail API Router:', function() {
  it('should return an express router instance', function() {
    accountdetailIndex.should.equal(routerStub);
  });

  describe('GET /api/accountdetails', function() {
    it('should route to accountdetail.controller.index', function() {
      routerStub.get
        .withArgs('/', 'accountdetailCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/accountdetails/:id', function() {
    it('should route to accountdetail.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'accountdetailCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/accountdetails', function() {
    it('should route to accountdetail.controller.create', function() {
      routerStub.post
        .withArgs('/', 'accountdetailCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/accountdetails/:id', function() {
    it('should route to accountdetail.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'accountdetailCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/accountdetails/:id', function() {
    it('should route to accountdetail.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'accountdetailCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/accountdetails/:id', function() {
    it('should route to accountdetail.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'accountdetailCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
