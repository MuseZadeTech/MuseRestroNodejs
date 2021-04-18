'use strict';

var express = require('express');
var controller = require('./message.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();
  
//******************AUTH REQUIRED****************************//
//**********************************************************//
// post a message
router.post('/', auth.isAuthenticated(),controller.create);

// to get number of unread messages for seller flag should be 1 and for user 0 
router.get('/counts/', auth.isAuthenticated(), controller.count);
 
// mark all unread messages of a single id  to true  
router.get('/mark/read', auth.isAuthenticated(), controller.markRead);

/**************************   User Access  *****************************/
// get a single thread of messages between owner to manager
router.get('/owner/manager/:id/:pageno', auth.isAuthenticated(), controller.singleThreadChat);

/**************************   Seller Access  *****************************/
// updating count by seller
router.get('/update/byseller/:flag', auth.isAuthenticated(), controller.updateCount);

// get a list of managers chat page info for a restaurant owner
// restaurant owner chat page with manager
router.get('/managers/list', auth.isAuthenticated(), controller.managersInfo);

// get chat page info of owner
router.get('/owners/list', auth.isAuthenticated(), controller.ownerInfo);

// get a list of admins chat page info for a restaurant owner
// restaurant owner chat page with admin
router.get('/admins/list', auth.isAuthenticated(), controller.adminsInfo);

// get a list of unread messages
router.get('/unread/list', auth.isAuthenticated(), controller.unreadMessages);

// mark all unread messages of a single id  to true  
router.get('/single/thread/read/:id', auth.isAuthenticated(), controller.singleThreadMarkRead);

// get count of all unread messages
router.get('/total/unread/count', auth.isAuthenticated(), controller.allUnreadMessagescount);

// restaurant owner chat page with manager
router.get('/managers/list/by/user', auth.isAuthenticated(), controller.managersChatListByUser);

// restaurant user chat page with manager
router.get('/users/list/by/manager', auth.isAuthenticated(), controller.userChatListByManager);

// restaurant owner chat list by admin
router.get('/owner/list/by/admin', auth.isAuthenticated(), controller.ownerChatListByAdmin);

// restaurant owner chat list by admin
router.get('/owner/search/by/admin/:key', auth.isAuthenticated(), controller.singleOwnerChatListByAdminSearch);

module.exports = router;
