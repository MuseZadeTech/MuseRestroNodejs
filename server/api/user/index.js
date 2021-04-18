"use strict";

import { Router } from "express";
import * as controller from "./user.controller";
var auth = require("../../auth/auth.service");

var router = new Router();

//get verification
router.get(
  "/contact/verify",
  auth.isAuthenticated(),
  controller.contactNoVerify
);
// all user added on restaurant basis
router.get("/per/plateform/:id", controller.allUserPlateform);

//all active staff of particular location
router.get("/all/active/staff/:locationId", controller.allActivStaff);

//make account active
router.post("/activate", auth.isAuthenticated(), controller.accountActivation);

// Get User Info(By Admin)
router.get("/data/:id", auth.isAuthenticated(), controller.userData);

//Get list of users
router.get("/", controller.index); //auth.hasRole('Admin')

//user point count
router.get("/points", auth.isAuthenticated(), controller.userPoints);

//get an entity info by token
router.get("/me", auth.isAuthenticated(), controller.me);

//get all active staff of a restaurant
router.get("/all/staff", auth.isAuthenticated(), controller.allStaff);

//Change a users password
router.post(
  "/password/update/",
  auth.isAuthenticated(),
  controller.changePassword
);

//update an entity
router.put("/:id/", auth.isAuthenticated(), controller.upsert);

router.put("/update/me/", auth.isAuthenticated(), controller.updateMe);
//get a single entity
router.get("/:id/", controller.show);

//Registration
router.post("/", controller.create);

//*****forget password with template*****

//sending reset password OTP
router.post("/password/otp/", controller.templateforgetpassword);

//verify forget password
router.post(
  "/password/verification/",
  auth.isAuthenticated(),
  controller.otpVerification
);

//for reset password
router.post(
  "/password/reset/",
  auth.isAuthenticated(),
  controller.ResetPassword
);

//to delete newAddress
router.delete(
  "/address/:index",
  auth.isAuthenticated(),
  controller.deleteAddress
);

//to add newAddress
router.post("/add/address", auth.isAuthenticated(), controller.addAddress);

//to update newAddress
router.put(
  "/update/address/:index",
  auth.isAuthenticated(),
  controller.updateAddress
);

//get new adresss
router.get(
  "/newaddress/address/",
  auth.isAuthenticated(),
  controller.getaddress
);

//Save new Account Details
router.post(
  "/add/accountdetails",
  auth.isAuthenticated(),
  controller.addNewAccountDetail
);

//Update new Account Details
router.put(
  "/update/accountdetails/:index",
  auth.isAuthenticated(),
  controller.updateNewAccountDetail
);

//delete a single new Account Details
router.delete(
  "/delete/accountdetails/:id",
  auth.isAuthenticated(),
  controller.deleteNewAccountDetail
);

//All restaurent  list
router.get("/restaurant/list", controller.restaurantList);

//Verify seller by admin
router.put(
  "/seller/verify/:id",
  auth.hasRole("Admin"),
  controller.verifySeller
);

//get a restaurant info by id
router.get("/restaurant/:id", controller.restaurantBasicInfo);

//to get total order product user category
router.get(
  "/countdata/total/data",
  auth.hasRole("Owner"),
  controller.countdata
);

//to get total order product user category
router.get(
  "/countdata/total/data/location/:id",
  auth.hasRole("Manager"),
  controller.locationCountData
);

//**********************payment section***************
// //stripe payment****working properly**************
// router.post('/stripe/card/info', auth.isAuthenticated(),controller.accCreateAndTrans);

// //payment via stripe
// router.post('/stripe/payment', auth.isAuthenticated(),controller.stripePayment);

// get a list of counts(products,category,order,user) of a restaurant

router.get(
  "/countdata/total/data",
  auth.isAuthenticated(),
  controller.countdata
);

// to get total order product user category
router.get(
  "/restaurant/manager/:restaurant",
  auth.isAuthenticated(),
  controller.restaurantManagers
);

// get a restaurant info by id
router.get("/owner/list", auth.isAuthenticated(), controller.ownerList);

// deactivate an owner account
router.put(
  "/owner/deactivate/:id",
  auth.isAuthenticated(),
  controller.ownerDeactivate
);

// get all staffs of a location
router.get(
  "/location/staff/:locationId",
  auth.isAuthenticated(),
  controller.locationStaff
);

// get a verifyToken
router.get("/verify/token", auth.isAuthenticated(), controller.verifyToken);

//get a list of newly added managers
router.get(
  "/new/manager",
  auth.isAuthenticated(),
  controller.newlyAddedManagers
);
//*******************

// Social Media Auth
router.post("/auth/facebook", controller.facebook);

//get facebook registration info
router.post("/auth/facebook/info", controller.facebookinfo);

//registration/login via google
router.post("/auth/google/", controller.google);

//get google registrration info
router.post("/auth/google/info", controller.googleinfo);

//*******payment through stripe 5 apis *********
//first time payement by card detail or card saved(optional)
router.post(
  "/stripe/card/info",
  auth.isAuthenticated(),
  controller.accCreateAndTrans
);
//first time payment
router.post(
  "/stripe/payment",
  auth.isAuthenticated(),
  controller.stripePayment
);
//saved card informations
router.get("/card/info/data/:userId", controller.allcardInfo);
//saved card payments
router.post(
  "/savedcard/stripe/payment",
  auth.isAuthenticated(),
  controller.savedCardstripePayment
);
//delete saved card
router.post("/savedcard/delete/", controller.deleteSavedCard);
//**********************************************************************
//profile pic upload user app
router.post("/upload/to/cloud", controller.uoloadFile);

router.post("/update-password/:id", controller.updatepassword);

router.post("/update-email/:id", controller.updateemail);

//staff manage 2019.6.22 updated by Dan
router.get("/staff/all/:id", auth.isAuthenticated(), controller.getAllstaff);
//updated 2019.6.22 by Dan
router.post("/staff/add", auth.isAuthenticated(), controller.addofstaff);
//updated 2019.6.22 by Dan
//updating staff
router.post(
  "/staff/edit/:id",
  auth.isAuthenticated(),
  controller.updatedofstaff
);
//Dan user activation updating
router.get(
  "/activation/:id",
  auth.isAuthenticated(),
  controller.updateActivation
);

//Dan Get all the managers
router.get(
  "/managers/all/:id",
  auth.isAuthenticated(),
  controller.getmanagerslist
);

// === Mobile App ===
// User Registration
router.post("/registration/", controller.createNewUser);

// Get a Single entity
router.get("/userinfo/:id/", controller.userinfo);

module.exports = router;
