'use strict';

var express = require('express');
var controller = require('./notification.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

// Gets a list of Notifications
router.get('/', controller.index);

// Gets a single Notification from the DB
router.get('/:id', controller.show);

// Creates a new Notification in the DB
router.post('/', controller.create);

// Upserts the given Notification in the DB at the specified ID
router.put('/:id', controller.upsert);

// Gets a list of unread Notifications
router.delete('/:id', controller.destroy);

//get all unread notifications
router.get('/unread/all/:id', auth.isAuthenticated(),controller.unreadNotification);

//update all unread notifications as read
router.get('/all/read', auth.isAuthenticated(),controller.updateNotification);

module.exports = router;
