"use strict";

var express = require("express");
var controller = require("./setting.controller");
var auth = require("../../auth/auth.service");

var router = express.Router();

// Gets a list of Settings
router.get("/", auth.hasRole("Owner"), controller.index);

// Gets a single Setting from the DB based on restaurent iD
router.get("/:id", auth.isAuthenticated(), controller.show);

// Creates a new Setting in the DB
router.post("/", auth.hasRole("Owner"), controller.create);

// Upserts the given Setting in the DB at the specified ID
router.put("/:id", auth.hasRole("Owner"), controller.upsert);

// Deletes a Setting from the DB
router.delete("/:id", auth.hasRole("Owner"), controller.destroy);

// Gets a single Setting from the DB based on location
router.get("/loyalty/:id", auth.isAuthenticated(), controller.loyalty);
//setting careousel image upload. 2019.8.24 bao
router.post("/upload", auth.isAuthenticated(), controller.carouselImageUpload);
//editing app theme state tax. 2019.9.12
router.post("/:id", auth.isAuthenticated(), controller.update);
router.get("/activation/:id", auth.isAuthenticated(), controller.activation);

// === Mobile App ===
// Gets Settings by Store ID
router.get("/storesetting/:id", controller.StoreSettings);
// Avilable Sales Tax for Store ID
router.get("/salestax/:id", controller.getAllSalesTax);
// Get Avilable City Tax for Location 4/12/20
router.get("/locationtax/:id", controller.getCityTax);

module.exports = router;
