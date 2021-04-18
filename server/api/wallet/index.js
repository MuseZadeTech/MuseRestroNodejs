'use strict';

var express = require('express'); 
var controller = require('./wallet.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

// Gets a list of Wallets
router.get('/',  auth.isAuthenticated(),controller.index);

// Gets a list of Wallets
router.get('/restaurant/all',  auth.isAuthenticated(),controller.allRestaurantTransaction);

// Gets a single Wallet from the DB
router.get('/:id',  auth.isAuthenticated(),controller.show);

//Creates a new Wallet in the DB
router.post('/', controller.create);

// Upserts the given Wallet in the DB at the specified ID
router.put('/:id',  auth.isAuthenticated(),controller.upsert);

//get collection of all locations of a restaurant 
router.get('/collection/details/:restaurantId',  controller.orderCollection);//auth.isAuthenticated(),

//get a restaurant owner wallet info
router.get('/restaurant/owner/:id',  auth.isAuthenticated(),controller.restaurantOwnerWalletInfo);

//get a list of filtered wallet transaction for restaurant owner
router.post('/filtered',  auth.isAuthenticated(),controller.filterdTransaction);

//get all charges total where status is credited
router.get('/admin/all/commission/', auth.isAuthenticated(), controller.totalCharge);

module.exports = router;
