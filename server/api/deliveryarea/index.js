'use strict';

var express = require('express');
var controller = require('./deliveryarea.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

// Gets a list of Deliveryareas
router.get('/',auth.isAuthenticated(),controller.index);

// Gets a single Deliveryarea from the DB
router.get('/:id', auth.isAuthenticated(),controller.show);

// Creates a new Deliveryarea in the DB
router.post('/',  auth.hasRole('Admin'),controller.create);

// Upserts the given Deliveryarea in the DB at the specified ID
router.put('/:id', auth.hasRole('Admin'), controller.upsert);

// Deletes a Deliveryarea from the DB
router.delete('/:id',  auth.hasRole('Admin'),controller.destroy);

module.exports = router;
