'use strict';

var express = require('express');
var controller = require('./tag.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

//Gets a list of Tags by location id
router.get('/all/:id', auth.isAuthenticated(),controller.index);

// Gets a list of tags(Customized Field Name)
router.get('/custom/data/:id', auth.isAuthenticated(),controller.byLocation);

//Gets a single tag by id
router.get('/:id', auth.isAuthenticated(),controller.show);

//Create a tag
router.post('/' ,auth.isAuthenticated(),controller.create);

//Dan get list all tags
router.get('/', auth.isAuthenticated(),controller.getTags);
//Dan activation changed
router.get('/activation/:id', auth.isAuthenticated(),controller.updatedActivation);

//Update a tag
router.put('/:id' ,auth.isAuthenticated(),controller.upsert);

//Delete a tag
router.delete('/:id', auth.isAuthenticated(),controller.destroy);
router.get('/product/data', auth.isAuthenticated(),controller.getTagsForProduct);

module.exports = router;
