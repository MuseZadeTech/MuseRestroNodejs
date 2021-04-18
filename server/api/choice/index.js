'use strict';

var express = require('express');
var controller = require('./choice.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

router.post('/', auth.isAuthenticated(),controller.create);
router.get('/', auth.isAuthenticated(),controller.index);
router.get('/:id', auth.isAuthenticated(),controller.show);
//cusine list on restaurant id basis (id from token)
// router.get('/restaurant/cusine/', auth.hasRole('Owner'), controller.particularRestaurantCusine);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.patch('/:id', auth.isAuthenticated(),controller.patch);
router.delete('/:id', auth.isAuthenticated(),controller.destroy);
router.get('/activation/:id', auth.isAuthenticated(),controller.updateActivation);
router.get('/store/:id', auth.isAuthenticated(),controller.getStoreDishOptions);
module.exports = router;
