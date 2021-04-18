"use strict";

var express = require("express");
var controller = require("./store.controller");
var auth = require("../../auth/auth.service");
var router = express.Router();

//router.post("/", controller.create);
router.get("/", auth.isAuthenticated(), controller.index);
router.post("/add-store", auth.isAuthenticated(), controller.create);
// router.get('/store-owner/:storeTypeId', controller.getStoreOwner);
router.get(
  "/store/:storeType",
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
//2019.8.8 by bao;
router.get(
  "/store-owner/:id",
  auth.isAuthenticated(),
  controller.getstoreownerinfo
);
// === Mobile App ===
router.get("/storeInfo/:id", controller.getstoreinfo);

module.exports = router;
