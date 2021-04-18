'use strict';

var express = require('express');
var controller = require('./pointrate.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

//get a list of Pointrate
router.get('/restaurant/:id', auth.isAuthenticated(),controller.index);

//get a single pointrate
router.get('/:id', auth.isAuthenticated(),controller.show);

//post a pointrate
router.post('/', auth.isAuthenticated(),controller.create);

//update a pointrate
router.put('/:id', auth.isAuthenticated(),controller.upsert);

//delete a pointrate
router.delete('/:id',auth.isAuthenticated(), controller.destroy);

module.exports = router;
