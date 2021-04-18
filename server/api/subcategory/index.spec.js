'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var subcategoryCtrlStub = {
  index: 'subcategoryCtrl.index',
  show: 'subcategoryCtrl.show',
  create: 'subcategoryCtrl.create',
  upsert: 'subcategoryCtrl.upsert',
  patch: 'subcategoryCtrl.patch',
  destroy: 'subcategoryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var subcategoryIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './subcategory.controller': subcategoryCtrlStub
});

describe('Subcategory API Router:', function() {
  it('should return an express router instance', function() {
    subcategoryIndex.should.equal(routerStub);
  });

  describe('GET /api/subcategories', function() {
    it('should route to subcategory.controller.index', function() {
      routerStub.get
        .withArgs('/', 'subcategoryCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/subcategories/:id', function() {
    it('should route to subcategory.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'subcategoryCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/subcategories', function() {
    it('should route to subcategory.controller.create', function() {
      routerStub.post
        .withArgs('/', 'subcategoryCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/subcategories/:id', function() {
    it('should route to subcategory.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'subcategoryCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/subcategories/:id', function() {
    it('should route to subcategory.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'subcategoryCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/subcategories/:id', function() {
    it('should route to subcategory.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'subcategoryCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
