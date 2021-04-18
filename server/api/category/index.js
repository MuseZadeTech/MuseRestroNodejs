"use strict";
//enableAllCategoryList
var express = require("express");
var controller = require("./category.controller");
var auth = require("../../auth/auth.service");
const multer = require("multer");
const uuidv4 = require("uuid/v4");
const path = require("path");
var router = express.Router();
var upload = multer({ dest: "/" });

// Gets a list of Categories of a single restaurant
router.get("/restaurant/:id", auth.isAuthenticated(), controller.index);

//menuItem GRAPH
router.get("/menuitem/", auth.isAuthenticated(), controller.noOfMenuItem);

//Get Category by location Id
//router.get('/location/:id', controller.byLocation);

//Get Category by category id
router.get("/:id", controller.show);

// Creates a new Category in the DB
router.post("/", auth.isAuthenticated(), controller.create);

// Update a Category
router.put("/:id", auth.isAuthenticated(), controller.upsert);

// Delete a Category
router.delete("/:id", auth.isAuthenticated(), controller.destroy);

//Custom search by category name
router.post("/by/name", auth.isAuthenticated(), controller.customCategory);

//Front-end
//Get all Categories by location id
router.get("/all/:id", auth.isAuthenticated(), controller.byLocAllCat);

//all category list that is enabled by location id
router.get(
  "/all/enable/categorylist/bylocation/:id",
  auth.isAuthenticated(),
  controller.enableAllCategoryList
);

//all category list that is enabled by restaurant id
router.get(
  "/all/enable/categorylist/byrestaurant/:id",
  auth.isAuthenticated(),
  controller.allCategoryListByrestaurant
);
//new apis added for new user app on restaurant basis
router.get(
  "/location/home/:id",
  auth.isAuthenticated(),
  controller.allCategoryForHome
);
//Added by Dan:2019.7.4
router.post("/location/:id", auth.isAuthenticated(), controller.getCategories);
//Dan
router.get(
  "/locationforcategory/:id",
  auth.isAuthenticated(),
  controller.getLocationForCategory
);
//Added by Dan
router.get(
  "/activation/:id",
  auth.isAuthenticated(),
  controller.updateCategoryEnable
);
//Dan  creating category
router.post("/location", auth.isAuthenticated(), controller.createCategory);
//Dan  updating category
router.post(
  "/location/update/:id",
  auth.isAuthenticated(),
  controller.updateCategory
);
//Dan uploading image
router.post("/upload", auth.isAuthenticated(), controller.uploadImageCategory);

// === Mobile App ===

module.exports = router;
