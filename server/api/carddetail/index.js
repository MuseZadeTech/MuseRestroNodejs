'use strict';

var express = require('express');
var controller = require('./carddetail.controller');

var router = express.Router();
// Gets a list of Carddetails
router.get('/', controller.index);

// Gets a single Carddetail from the DB
router.get('/:id', controller.show);

// Creates a new Carddetail in the DB
router.post('/', controller.create);

// Upserts the given Carddetail in the DB at the specified ID
router.put('/:id', controller.upsert);

// Deletes a Carddetail from the DB
router.delete('/:id', controller.destroy);

module.exports = router;
