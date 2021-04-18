'use strict';

var express = require('express');
var controller = require('./loyalty.controller');
var auth  = require('../../auth/auth.service');
var router = express.Router();

// get all loyalty
router.get('/', auth.isAuthenticated(),controller.index);
router.post('/', auth.isAuthenticated(),controller.create);
router.get('/activation/:id', auth.isAuthenticated(),controller.loyaltyEnableUpdate);
router.get('/rewardEnable/:id', auth.isAuthenticated(),controller.rewardEnableUpdate);
module.exports = router;
