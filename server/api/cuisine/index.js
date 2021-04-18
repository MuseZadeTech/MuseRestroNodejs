'use strict';

var express = require('express');
var controller = require('./cuisine.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

router.post('/', auth.hasRole('Owner'), controller.create);
router.get('/', controller.index);
router.get('/:id', controller.show);
//cusine list on restaurant id basis (id from token)
// router.get('/restaurant/cusine/', auth.hasRole('Owner'), controller.particularRestaurantCusine);
router.put('/:id', auth.hasRole('Owner'), controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', auth.hasRole('Owner'), controller.destroy);

module.exports = router;
