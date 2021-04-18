"use strict";

var express = require("express");
var controller = require("./product.controller");
var auth = require("../../auth/auth.service");
var router = express.Router();

// Get a list of products by restaurant id
router.get("/restaurant", auth.isAuthenticated(), controller.index);

// get a product list by serched by product name
router.post(
  "/productname/",
  auth.isAuthenticated(),
  controller.productSerchByName
);

//get a list of products of a restaurant
router.get("/restaurant/:id", auth.isAuthenticated(), controller.index);

//menuItem graph data
router.get("/menuitem/", controller.noOfMenuItem);

//Get a list of products by location id
router.get("/location/:id", auth.isAuthenticated(), controller.byLocation);

//Get a list of products by category id
router.get("/category/:id", auth.isAuthenticated(), controller.byCategory);

//Get a list of products by subcategory id
router.get(
  "/subcategory/:id",
  auth.isAuthenticated(),
  controller.bySubcategory
);

//Get a single Product
router.get("/:id", auth.isAuthenticated(), controller.show);

//get data by filter
router.post("/data/:id", auth.isAuthenticated(), controller.productData);

//Create Product
router.post("/", auth.isAuthenticated(), controller.create);

//Dan getting All of the products (/api/products?location=&store=)
router.get("/", auth.isAuthenticated(), controller.getProduct);

//Update Product
router.put("/:id", auth.isAuthenticated(), controller.upsert);

//Delete a single product
router.delete("/:id", auth.isAuthenticated(), controller.destroy);

//Get a list of product by Sub-Category
router.get("/subcat/:id", auth.isAuthenticated(), controller.bySubCat);

//Dan image uploading for product
router.post("/upload", auth.isAuthenticated(), controller.uploadImage);
//Dan
router.get("/activation/:id", controller.updateproductenable);
//Dan
router.post(
  "/updateproduct/:id",
  auth.isAuthenticated(),
  controller.updateproduct
);
//Bao 2019.8.15
router.get(
  "/locationforproduct/:id",
  auth.isAuthenticated(),
  controller.locationforproduct
);

// === Mobile App ===
//Get a list of products by category id
router.get("/categoryProducts/:id", controller.byCategory2);

//Dan getting All of the products (/api/products?location=&store=)
router.get("/productinfo/:id", controller.show2);

module.exports = router;
