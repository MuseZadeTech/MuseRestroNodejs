'use strict';

var express = require('express');
var controller = require('./chat.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

// Gets a list of Bookingtables  restaurant Id
router.get('/restaurant/:id',controller.index);
//Gets a single Bookingtable by id
router.get('/:id',controller.show);

//Create a Bookingtable
router.post('/', controller.create);

//Update a Bookingtable
router.put('/:id',controller.upsert);

//Delete a Bookingtable
router.delete('/:id',controller.destroy);

module.exports = router;