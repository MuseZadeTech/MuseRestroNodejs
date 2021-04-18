'use strict';

var express = require('express');
var controller = require('./favourite.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

//get a list of favourite products of a user
router.get('/', auth.isAuthenticated(), controller.index);

//get a single fav product by id
router.get('/:id', auth.isAuthenticated(), controller.show);

//post a favourite
router.post('/', auth.isAuthenticated(), controller.create);

//delete a single  favourite
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

//check whether a product is favourite or not 
router.post('/check/product', auth.isAuthenticated(), controller.checkFavourite);
//jeet
//get a list of favourites of particular productId and locationId basis
router.post('/user/fav/location/product', auth.isAuthenticated(), controller.favListProduct);
//get a list of favourites of particular location and user id basis
router.get('/user/fav/list/:location', auth.isAuthenticated(), controller.favListOfUser);

//for app side new api created by app requirement
router.delete('/deleteby/product/location/', auth.isAuthenticated(), controller.deletByProductIdAndLocation);

module.exports = router;
