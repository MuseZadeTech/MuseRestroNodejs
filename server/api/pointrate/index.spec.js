'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var pointrateCtrlStub = {
  index: 'pointrateCtrl.index',
  show: 'pointrateCtrl.show',
  create: 'pointrateCtrl.create',
  upsert: 'pointrateCtrl.upsert',
  patch: 'pointrateCtrl.patch',
  destroy: 'pointrateCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var pointrateIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './pointrate.controller': pointrateCtrlStub
});

describe('Pointrate API Router:', function() {
  it('should return an express router instance', function() {
    pointrateIndex.should.equal(routerStub);
  });

  describe('GET /api/pointrates', function() {
    it('should route to pointrate.controller.index', function() {
      routerStub.get
        .withArgs('/', 'pointrateCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/pointrates/:id', function() {
    it('should route to pointrate.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'pointrateCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/pointrates', function() {
    it('should route to pointrate.controller.create', function() {
      routerStub.post
        .withArgs('/', 'pointrateCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/pointrates/:id', function() {
    it('should route to pointrate.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'pointrateCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/pointrates/:id', function() {
    it('should route to pointrate.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'pointrateCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/pointrates/:id', function() {
    it('should route to pointrate.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'pointrateCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
