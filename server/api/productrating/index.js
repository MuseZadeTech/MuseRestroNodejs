'use strict';

var express = require('express');
var controller = require('./productrating.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();
router.get('/', controller.index);

// Gets a single Productrating from the DB
router.get('/:id', controller.show);

//creating product rating
router.post('/',controller.create);

// Upserts the given Productrating in the DB at the specified ID
router.put('/:id', controller.upsert);

// Deletes a Productrating from the DB
router.delete('/:id', controller.destroy);

//Get average rating of a single product
router.get('/product/:id', controller.productRating);

//get rating by productId and orderId
router.post('/rating/by/product/order', auth.isAuthenticated(),controller.ratingByProductOrder);
module.exports = router;
