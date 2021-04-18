/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/store-type              ->  index
 * POST    /api/store-type              ->  create
 * GET     /api/store-type/:id          ->  show
 * PUT     /api/store-type/:id          ->  upsert
 * PATCH   /api/store-type/:id          ->  patch
 * DELETE  /api/store-type/:id          ->  destroy
 */

"use strict";

// import jsonpatch from 'fast-json-patch';
import StoreType from "./storeType.model";
import User from "../user/user.model";
import Store from "../store/store.model";
import Order from "../order/order.model";
import { userChat } from "../message/message.controller";

var mongoose = require("mongoose");
var mkdirp = require("mkdirp");

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return res.send("err");
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

// Creates a new StoreType in the DB
export function create(req, res) {
  console.log(req.body);
  return StoreType.create(req.body)
    .then(storetype => {
      mkdirp(
        //"../react-admin/public/public/Stores/" + req.body.storeTypeName,
        "../react-admin/public/public/Stores/" + req.body.storeTypeID,
        function(err) {
          if (err) console.error(err);
          else console.log("StoreType Folder Created!");
        }
      );
      return res.json(storetype);
    })
    .then(storetype => res.json(storetype))
    .catch(err => res.json(err));
}

// Gets a list of StoreTypes
export function index(req, res) {
  return StoreType.find({}, { __v: false })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getnum(req, res) {
  var id = req.params.id;
  //console.log(req.params.id);
  return Store.find({ store_type_id: id })
    .then(store => {
      var count = Object.keys(store).length;
      //console.log(count);
      return res.json(count);
    })
    .catch(handleError(res));
}

// Create store owner record on storeTypes collection
export function createStoreOwner(req, res) {
  //console.log("req.body.store_owner");
  // 2019.5.29 updated;
  return StoreType.findOne(
    { storeTypeName: req.body.store_owner.storeType },
    function(err, store_type) {
      var count = store_type.storeOwners.length;
      store_type.storeOwners[count] = req.body.store_owner.storeOwnerName;
      //console.log(store_type.storeOwners);
      StoreType.update(
        { storeTypeName: req.body.store_owner.storeType },
        { storeOwners: store_type.storeOwners }
      )
        .then(res => console.log("success"))
        .catch(error => console.log("error"));
    }
  );
}

//Get a store owner list by store type
export function getStoreOwner(req, res) {
  StoreType.findOne({ storeTypeName: req.params.storeType })
    .then(storetype => {
      if (storetype) {
        var stortype_id = storetype._id;

        return Store.aggregate([
          {
            $match: { store_type_id: stortype_id }
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
          .catch(err => res.json("erro"));
      } else {
        return res.send("Owners don't exist!");
      }
    })
    .catch(err => console.log("error"));
}

//Get a store owner for edit
export function getEditStoreOwner(req, res) {
  // return StoreType.findOne({ storeTypeName: req.params.storeType })
  //   .then(respondWithEditResult(res, 201, req.params.storeOwnerIndex))
  //   .catch(handleError(res));
}

//Update a store owner
export function updateStoreOwner(req, res) {
  return StoreType.findOneAndUpdate(
    {
      storeTypeName: req.body.storeTypeName,
      "storeOwners.storeName": req.body.storeName
    },
    {
      "storeOwners.$.storeOwnerName": req.body.updateStoreOwner.storeOwnerName,
      "storeOwners.$.phone": req.body.updateStoreOwner.phone,
      "storeOwners.$.emailAddress": req.body.updateStoreOwner.emailAddress,
      "storeOwners.$.password": req.body.updateStoreOwner.password,
      "storeOwners.$.streetAddress": req.body.updateStoreOwner.streetAddress,
      "storeOwners.$.city": req.body.updateStoreOwner.city,
      "storeOwners.$.state": req.body.updateStoreOwner.state,
      "storeOwners.$.postalCode": req.body.updateStoreOwner.postalCode
    },
    {
      setDefaultsOnInsert: true
    }
  )
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function updateactivation(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  //console.log(id);
  return Store.findOne({ _id: id }).then(store => {
    var activation = !store.activation;
    Store.findOneAndUpdate({ _id: id }, { activation: activation }).then(
      store => {
        res.json(store);
      }
    );
  });
}

//2019.6.24 updated by Dan
export function getStoreDashboard(req, res) {
  var id = req.params.id;
  Store.find({ store_type_id: id }).then(store => {
    var storetype = [];
    var date = new Date();
    var month = date.getMonth() + 1;
    //console.log(month);
    store.map((value, index) => {
      storetype.push(mongoose.Types.ObjectId(value._id));
    });
    Order.find({ restaurantID: { $in: storetype }, month: month }).then(
      order => {
        console.log("order length", order.length);
        console.log("store length", store.length);
        res.json({ store: storetype.length, order: order.length });
      }
    );
  });
}
