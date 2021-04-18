"use strict";

// import jsonpatch from 'fast-json-patch';
import Store from "./store.model";
import StoreType from "../storeType/storeType.model";
import User from "../user/user.model";
import { userChat } from "../message/message.controller";
//ObjectId = require('mongodb').ObjectID;
var mongoose = require("mongoose");
var mkdirp = require("mkdirp");

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function respondWithEditResult(res, statusCode, index) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity.storeOwners[index]);
    }
    return null;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

// Creates a new store in the DB
export async function create(req, res) {
  var data = {};
  var email = req.body.store_owner.emailAddress;
  var storeName = req.body.store_owner.storeName;
  var name = req.body.store_owner.storeOwnerName;
  var contactNumber = req.body.store_owner.phone;
  var password = req.body.store_owner.password;
  var country = req.body.store_owner.city;
  var postalCode = req.body.store_owner.postalCode;
  var state = req.body.store_owner.state;
  var street = req.body.store_owner.streetAddress;
  var storeName = req.body.store_owner.storeName;
  var store_type_id = req.body.store_owner.store_type_id;

  data["email"] = email;
  data["name"] = name;
  data["contactNumber"] = contactNumber;
  data["password"] = password;
  data["country"] = country;
  data["postalCode"] = postalCode;
  data["state"] = state;
  data["street"] = street;
  data["restaurantName"] = storeName;
  data["storeName"] = storeName;
  data["store_type_id"] = store_type_id;
  data["role"] = "Owner";
  var id = mongoose.Types.ObjectId(store_type_id);
  var user_id = "";
  await User.create(data)
    .then(user => {
      data["user_id"] = user._id;
      Store.create(data)
        .then(store => res.json("success!"))
        .catch(err => res.json(err));

      StoreType.findOne({ _id: id }).then(storetype => {
        mkdirp(
          //`${__dirname}/../../../../react-admin/public/public/Stores/${storetype.storeTypeName}/${storeName}/App/Carousel/`,
          `${__dirname}/../../../../react-admin/public/public/Stores/${storetype.storeTypeID}/${user._id}/App/Carousel/`,
          function(err) {
            if (err) console.error(err);
            else console.log("Carousel Folder Created!");
          }
        );

        mkdirp(
          //`${__dirname}/../../../../react-admin/public/public/Stores/${storetype.storeTypeName}/${storeName}/App/Category/`,
          `${__dirname}/../../../../react-admin/public/public/Stores/${storetype.storeTypeID}/${user._id}/App/Category/`,
          function(err) {
            if (err) console.error(err);
            else console.log("Category Folder Created!");
          }
        );

        mkdirp(
          //`${__dirname}/../../../../react-admin/public/public/Stores/${storetype.storeTypeName}/${storeName}/App/Products/`,
          `${__dirname}/../../../../react-admin/public/public/Stores/${storetype.storeTypeID}/${user._id}/App/Products/`,
          function(err) {
            if (err) console.error(err);
            else console.log("Product Folder Created!");
          }
        );
      });
    })
    .catch(err => res.json(err));
}

// Gets a list of StoreTypes
export function index(req, res) {
  return Store.find({}, { __v: false })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Create store owner record on storeTypes collection
export function createStoreOwner(req, res) {
  // 2019.5.29 updated;
  return Store.findOne({ storeTypeName: req.body.store_owner.store }, function(
    err,
    store_type
  ) {
    var count = store_type.storeOwners.length;
    store_type.storeOwners[count] = req.body.store_owner.storeOwnerName;
    //console.log(store_type.storeOwners);
    store
      .update(
        { storeTypeName: req.body.store_owner.store },
        { storeOwners: store_type.storeOwners }
      )
      .then(res => console.log("success"))
      .catch(error => console.log("error"));
  });
}

//Get a store owner list by store type
export async function getStoreOwner(req, res) {
  var store = Store.findOne({ storeTypeName: req.params.store });
  //console.log(store);
}

//Get a store owner for edit
export function getEditStoreOwner(req, res) {
  //ObjectId = require('mongodb').ObjectID;

  var user_id = req.params.storeOwnerIndex;
  var user_id = mongoose.Types.ObjectId(user_id);
  //user_id = ObjectId(user_id);console.log(uer_id);
  Store.aggregate([
    {
      $match: { user_id: user_id }
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user"
      }
    }
  ])
    .exec()
    .then(data => res.json({ data: data }))
    .catch(err => res.json({ data: "data don't exist" }));
}

//Update a store owner
export function updateStoreOwner(req, res) {
  console.log(req.body);
  var user_id = req.body.store_owner.user_id;
  var user_id = mongoose.Types.ObjectId(user_id);
  var name = req.body.store_owner.name;
  var phone = req.body.store_owner.phone;
  var address = req.body.store_owner.address;
  var email = req.body.store_owner.email;
  var password = req.body.store_owner.password;
  var status = req.body.store_owner.state;
  var country = req.body.store_owner.country;
  var postalCode = req.body.store_owner.postal_code;
  var activation = req.body.status;
  var storeName = req.body.store_owner.storeName;
  var _id = req.body.store_owner._id;
  _id = mongoose.Types.ObjectId(_id);
  Store.update(
    { _id: _id },
    {
      storeName: storeName,
      activation: activation
    }
  ).then(store => {
    console.log("success");
  });

  User.update(
    { _id: user_id },
    {
      name: name,
      contactNumber: phone,
      street: address,
      state: status,
      postalCode: postalCode,
      email: email,
      country: country
    }
  )
    .then(user => res.json("success"))
    .catch(err => res.json("error"));
}

//2019.8.8 by Bao; Get store owner info such as store type and store name etc;
export function getstoreownerinfo(req, res) {
  Store.aggregate([
    {
      $match: { user_id: mongoose.Types.ObjectId(req.params.id) }
    },
    {
      $lookup: {
        from: "storetypes",
        localField: "store_type_id",
        foreignField: "_id",
        as: "storetype"
      }
    }
  ])
    // return Store.find({ user_id: mongoose.Types.ObjectId(req.params.id) }).populate('store_type_id')
    .then(data => res.json(data))
    .catch(err => res.json(err));
}

// === Mobile App ===
// Get Store Info (store type,store name, active)
export function getstoreinfo(req, res) {
  Store.aggregate([
    {
      $match: { user_id: mongoose.Types.ObjectId(req.params.id) }
    },
    {
      $lookup: {
        from: "storetypes",
        localField: "store_type_id",
        foreignField: "_id",
        as: "storetype"
      }
    },
    {
      $project: {
        _id: 0,
        storeName: 1,
        activation: 1,
        "storetype.storeTypeName": 1,
        "storetype._id": 1
      }
    }
  ])
    .then(data => res.json(data))
    .catch(err => res.json(err));
}
