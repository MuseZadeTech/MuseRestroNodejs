'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var settingCtrlStub = {
  index: 'settingCtrl.index',
  show: 'settingCtrl.show',
  create: 'settingCtrl.create',
  upsert: 'settingCtrl.upsert',
  patch: 'settingCtrl.patch',
  destroy: 'settingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var settingIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './setting.controller': settingCtrlStub
});

describe('Setting API Router:', function() {
  it('should return an express router instance', function() {
    settingIndex.should.equal(routerStub);
  });

  describe('GET /y', function() {
    it('should route to setting.controller.index', function() {
      routerStub.get
        .withArgs('/', 'settingCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /y/:id', function() {
    it('should route to setting.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'settingCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /y', function() {
    it('should route to setting.controller.create', function() {
      routerStub.post
        .withArgs('/', 'settingCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /y/:id', function() {
    it('should route to setting.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'settingCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /y/:id', function() {
    it('should route to setting.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'settingCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /y/:id', function() {
    it('should route to setting.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'settingCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
