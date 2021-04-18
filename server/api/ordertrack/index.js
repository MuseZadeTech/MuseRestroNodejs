'use strict';

var express = require('express');
var controller = require('./ordertrack.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// Gets a list of Ordertracks
router.get('/', controller.index);

// Gets a single Ordertrack from the DB
router.get('/:id', controller.show);

// Creates a new Ordertrack in the DB
router.post('/', controller.create);

// Upserts the given Ordertrack in the DB at the specified ID
router.put('/:id', controller.upsert);

// Deletes a Ordertrack from the DB
router.delete('/:id', controller.destroy);

//order assigned to particular deliveryboy
router.get('/delivery/assigned/', auth.isAuthenticated(), controller.orderAssignedToDeliveryby);

module.exports = router;
