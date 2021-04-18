'use strict';

var express = require('express');
var controller = require('./accountdetail.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

//get all accoountdetails of a single user
router.get('/', auth.isAuthenticated(),controller.index);

//get a single account details by its document id
router.get('/:id', auth.isAuthenticated(),controller.show);

//create an account detail document
router.post('/', auth.isAuthenticated(),controller.create);

//update an account detail
router.put('/:id', auth.isAuthenticated(),controller.upsert);

//deleting an account detail document
router.delete('/:id', auth.isAuthenticated(),controller.destroy);

module.exports = router;
