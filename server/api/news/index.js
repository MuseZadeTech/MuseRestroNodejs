'use strict';

var express = require('express');
var controller = require('./news.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

// Gets a list of newss  restaurant Id
router.get('/restaurant/:id',controller.index);
//Gets a single news by id
router.get('/:id',controller.show);

//Create a news
router.post('/',controller.create);

//Update a news
router.put('/:id',controller.upsert);

//Delete a news
router.delete('/:id',controller.destroy);

module.exports = router;