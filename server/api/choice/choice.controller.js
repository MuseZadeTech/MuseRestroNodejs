/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/dishoptions              ->  index
 * POST    /api/dishoptions              ->  create
 * GET     /api/dishoptions/:id          ->  show
 * PUT     /api/dishoptions/:id          ->  upsert
 * PATCH   /api/dishoptions/:id          ->  patch
 * DELETE  /api/dishoptions/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Choice from './choice.model';
import storeType from '../storeType/storeType.model';
var mongoose = require("mongoose");

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of dishoptions
export function index(req, res) {
  // return DishOption.find({},{__v:false}).exec()
  //   .then(respondWithResult(res))
  //   .catch(handleError(res));
    var id = req.query.store;
    var store_id = mongoose.Types.ObjectId(id);
    Choice.aggregate([
      {
        $match:{ 'restaurantID': store_id}
      },
      {
        $lookup:
        {
          from: 'storetypes',
          localField: "restaurantID",
          foreignField: "_id",
          as: "storetype"
        }
      }
    ])
   // return Store.find({ user_id: mongoose.Types.ObjectId(req.params.id) }).populate('store_type_id')
    .then(data=>res.json(data))
    .catch(err=>res.json(err))
  }

// Gets a single dishoption from the DB
export function show(req, res) {
  return Choice.findById(req.params.id,'-__v').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new dishoption in the DB
export function create(req, res) {
  return Choice.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given dishoption in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Choice.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing dishoption in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Choice.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a dishoption from the DB
export function destroy(req, res) {
  return Choice.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function updateActivation(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  return Choice.findOne({_id:id})
    .then(choice=>{
         var enable = !choice.enable;
         Choice.findOneAndUpdate({_id:id},{enable:enable})
        .then(choice=>{res.json(choice)})})
}

export function getStoreDishOptions(req, res) {
  var store_id = req.params.id;
  // store_id = mongoose.Types.ObjectId(store_id);
  Choice.find({"restaurantID": store_id})
  .then(choice=>{
    res.json(choice)
  }).catch(err=>res.json(err));
} 