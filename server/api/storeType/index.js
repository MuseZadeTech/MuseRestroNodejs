"use strict";

var express = require("express");
var controller = require("./storeType.controller");
var auth = require("../../auth/auth.service");
var router = express.Router();

//router.post("/", auth.isAuthenticated(), controller.create);
//router.get("/", auth.isAuthenticated(), controller.index);
router.get("/store_count/:id", auth.isAuthenticated(), controller.getnum);
router.post("/", auth.isAuthenticated(), controller.create);
router.get("/", auth.isAuthenticated(), controller.index);
router.post(
  "/add-store-owner",
  auth.isAuthenticated(),
  controller.createStoreOwner
);
// router.get('/store-owner/:storeTypeId', controller.getStoreOwner);
router.get(
  "/store-owner/:storeType",
  auth.isAuthenticated(),
  controller.getStoreOwner
);
router.get(
  "/store-owner/:storeType/:storeOwnerIndex",
  auth.isAuthenticated(),
  controller.getEditStoreOwner
);
router.post(
  "/store-owner/update-store-owner",
  auth.isAuthenticated(),
  controller.updateStoreOwner
);

router.get(
  "/activation/:id",
  auth.isAuthenticated(),
  controller.updateactivation
);

//2019.6.24 updated by Dan
router.get(
  "/adminStoreDashboard/:id",
  auth.isAuthenticated(),
  controller.getStoreDashboard
);

module.exports = router;
