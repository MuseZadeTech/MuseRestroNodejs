"use strict";

var express = require("express");
var controller = require("./location.controller");
var auth = require("../../auth/auth.service");
var router = express.Router();

//Gets all locations..2019.6.22
router.get(
  "/restaurant/:id",
  auth.isAuthenticated(),
  controller.getofalllocations
);
// Gets a single Location from the DB
//router.get('/:id',controller.show);
//updated by Dan 2019.6.22
router.get("/:id", auth.isAuthenticated(), controller.getOneOfLocation);

// get all locations few details
router.get(
  "/all/restaurant/list",
  auth.isAuthenticated(),
  controller.listOfAllrestaurant
);

//get all locations all details
router.get(
  "/get/all/restaurant/list",
  auth.isAuthenticated(),
  controller.getlistOfAllrestaurant
);

//get locations based on restaurantType
router.post(
  "/by/restaurant/type",
  auth.isAuthenticated(),
  controller.LocationByRestoType
);

// router.post('/by/filter',controller.getByFilter);

// get all categories with their products
router.get(
  "/all/category/data/:id",
  auth.isAuthenticated(),
  controller.categoryData
);

//Get all categories and Subcategories of a location
//as well as location info
router.get(
  "/cat/subcat/:id",
  auth.isAuthenticated(),
  controller.locCatAndSubCat
);

// Get all location of a restaurant
router.get(
  "/all/data/:id",
  auth.isAuthenticated(),
  controller.allLocationRestaurant
);

//location count by restaurent id
router.get(
  "/all/countdata/:id",
  auth.isAuthenticated(),
  controller.allLocationRestaurantCount
);

//Create a location
router.post("/", auth.isAuthenticated(), controller.create);

//Update a location
//router.put('/:id',controller.upsert);
//updated 2019 .6.22 by Dan
router.post("/:id", auth.isAuthenticated(), controller.updatedlocation);

//Delete a Location
router.delete("/:id", auth.isAuthenticated(), controller.destroy);

//*****************list of restaurant*************************************************

//Map Location restaurant as per user lat&long
router.post("/map/distance", auth.isAuthenticated(), controller.mapDistance);

// mapping all location data basis on distance
router.post(
  "/all/map/distance",
  auth.isAuthenticated(),
  controller.allDataMapDistance
);

// 10 top Rated Restaurantlist
router.get(
  "/toprated/restaurant/list",
  auth.isAuthenticated(),
  controller.topRatedRestaurantlist
);

// all top Rated Restaurantlist all
router.get(
  "/toprated/all/restaurant/list",
  auth.isAuthenticated(),
  controller.allTopRatedRestaurantlist
);

//**10 restaurant list on newly added  basis
router.get(
  "/newlyadded/restaurant/list",
  auth.isAuthenticated(),
  controller.restaurantlistOncreatedOrder
);

//**all restaurant list on newly added  basis
router.get(
  "/newlyadded/all/restaurant/list",
  auth.isAuthenticated(),
  controller.allRestaurantlistOncreatedOrder
);

//******************************************************************************************

//add deliveryInfo with pincode
router.post(
  "/add/deliveryinfo/data/",
  auth.isAuthenticated(),
  controller.deliveryInfo
);
//new app apis restaurant (location list with restaurant info) before home to show
router.get(
  "/list/restaurant/info/:id",
  auth.isAuthenticated(),
  controller.locationListHome
);

//activation update by Dan 2019.6.22
router.get(
  "/activation/:id",
  auth.isAuthenticated(),
  controller.activationUpdate
);

// === Mobile App ===
// Gets all locations
router.get("/alllocations/:id", controller.getalllocations);
//Single Location Info 4/12/20
router.get("/locationinfo/:id", controller.getSingleLocation);
// Get Avilable Categories for Location
router.get("/locationcategories/:id", controller.locCatSubCat);
// Get Avilable Products for Location
router.get("/locationproducts/:id", controller.locProducts);

module.exports = router;
