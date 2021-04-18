"use strict";

var express = require("express");
var controller = require("./coupan.controller");
var auth = require("../../auth/auth.service");
var router = express.Router();

// get all coupans
router.get("/", auth.isAuthenticated(), controller.index);

// get single coupan
router.get("/single/:id", auth.isAuthenticated(), controller.singleCoupan);

// get all coupans of a location
router.get("/:id", auth.isAuthenticated(), controller.show);

// creates coupan
router.post("/", auth.isAuthenticated(), controller.create);

// update coupan
router.put("/:id", auth.isAuthenticated(), controller.upsert);

// delete coupan
router.delete("/:id", auth.isAuthenticated(), controller.destroy);

// get  valid coupan for user applcable or not
router.get(
  "/validcoupon/bycurrenttimestamp/:id",
  auth.isAuthenticated(),
  controller.vaildCoupanData
);
//router.get("/validcoupon/bycurrenttimestamp/:id", controller.vaildCoupanData);
//router.post('/timestamp/', controller.create1);

router.get(
  "/activation/:id",
  auth.isAuthenticated(),
  controller.activationUpdate
);
module.exports = router;
