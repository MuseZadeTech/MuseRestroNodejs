'use strict';

var express = require('express');
var controller = require('./cuisineLocation.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

//get all locations based on multiple cuisineId
router.post('/by/cuisins', controller.locationsByCuisine);


module.exports = router;
