'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var walletCtrlStub = {
  index: 'walletCtrl.index',
  show: 'walletCtrl.show',
  create: 'walletCtrl.create',
  upsert: 'walletCtrl.upsert',
  patch: 'walletCtrl.patch',
  destroy: 'walletCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var walletIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './wallet.controller': walletCtrlStub
});

describe('Wallet API Router:', function() {
  it('should return an express router instance', function() {
    walletIndex.should.equal(routerStub);
  });

  describe('GET /api/wallets', function() {
    it('should route to wallet.controller.index', function() {
      routerStub.get
        .withArgs('/', 'walletCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/wallets/:id', function() {
    it('should route to wallet.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'walletCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/wallets', function() {
    it('should route to wallet.controller.create', function() {
      routerStub.post
        .withArgs('/', 'walletCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/wallets/:id', function() {
    it('should route to wallet.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'walletCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/wallets/:id', function() {
    it('should route to wallet.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'walletCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/wallets/:id', function() {
    it('should route to wallet.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'walletCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
