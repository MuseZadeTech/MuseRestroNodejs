'use strict';
//currently not using this model
var express = require('express');
var controller = require('./payment.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

router.get('/', auth.hasRole('Admin'),controller.index);

router.get('/:id', auth.hasRole('Admin'),controller.show);

router.get('/restaurant/history',auth.isAuthenticated(),controller.restaurantPayments);

//Create a payment
router.post('/', auth.isAuthenticated(),controller.create);

//cancel a transaction,update amount,update status
router.put('/:id',auth.isAuthenticated(),controller.upsert);

//All payments of a seller(restaurant Admin)
router.get('/all/:id', auth.hasRole('Admin'),controller.allPayments);

//Get seller wallet balance
router.get('/wallet/:id', auth.isAuthenticated(),controller.walletBalance);

//All pending status 
router.get('/witdraw/pending', auth.hasRole('Admin'),controller.pendingWithdrawStatus);

module.exports = router;
