'use strict';

var express = require('express');
var controller = require('./subcategory.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

// Gets a list of Subcategories by restaurant
router.get('/',  auth.isAuthenticated(),controller.index);

// Gets a list of Subcategories by restaurant
router.get('/category/:id', auth.isAuthenticated(), controller.byCategory);

// Gets a list of Subcategories(Customized Field Name)
router.get('/custom/data/:id', auth.isAuthenticated(), controller.byCategoryId);

// Get a Subcategory from the DB
router.get('/:id', auth.isAuthenticated(),controller.show);

// Create a Subcategory
router.post('/', auth.isAuthenticated(),controller.create);

// Update a Subcategory from the DB
router.put('/:id', auth.isAuthenticated(),controller.upsert);

// Deletes a Subcategory from the DB
router.delete('/:id', auth.isAuthenticated(),controller.destroy);

// get all subcategories of a category
router.get('/by/category/:id', auth.isAuthenticated(),controller.byCatId);
module.exports = router;
