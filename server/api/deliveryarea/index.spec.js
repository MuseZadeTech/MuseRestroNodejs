'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var deliveryareaCtrlStub = {
  index: 'deliveryareaCtrl.index',
  show: 'deliveryareaCtrl.show',
  create: 'deliveryareaCtrl.create',
  upsert: 'deliveryareaCtrl.upsert',
  patch: 'deliveryareaCtrl.patch',
  destroy: 'deliveryareaCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var deliveryareaIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './deliveryarea.controller': deliveryareaCtrlStub
});

describe('Deliveryarea API Router:', function() {
  it('should return an express router instance', function() {
    deliveryareaIndex.should.equal(routerStub);
  });

  describe('GET /api/deliveryareas', function() {
    it('should route to deliveryarea.controller.index', function() {
      routerStub.get
        .withArgs('/', 'deliveryareaCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/deliveryareas/:id', function() {
    it('should route to deliveryarea.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'deliveryareaCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/deliveryareas', function() {
    it('should route to deliveryarea.controller.create', function() {
      routerStub.post
        .withArgs('/', 'deliveryareaCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/deliveryareas/:id', function() {
    it('should route to deliveryarea.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'deliveryareaCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/deliveryareas/:id', function() {
    it('should route to deliveryarea.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'deliveryareaCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/deliveryareas/:id', function() {
    it('should route to deliveryarea.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'deliveryareaCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
