/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/cuisines              ->  index
 * POST    /api/cuisines              ->  create
 * GET     /api/cuisines/:id          ->  show
 * PUT     /api/cuisines/:id          ->  upsert
 * PATCH   /api/cuisines/:id          ->  patch
 * DELETE  /api/cuisines/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Cuisine from './cuisine.model';

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

// Gets a list of Cuisines
export function index(req, res) {
  return Cuisine.find({},{__v:false}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Cuisine from the DB
export function show(req, res) {
  return Cuisine.findById(req.params.id,'-__v').exec()

    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// export function particularRestaurantCusine(req, res) {
//   Cuisine.find({'restaurantID':req.user._id}).exec(function(err,cusineInfo){
//     if(err){
//       return handleError(err)
//     }
//     if(!cusineInfo){
//       res.status(200).send({message:"No Cuisine is found to that restaurant"})
//     }
//     else{
//       res.send(cusineInfo)
//     }
//   })
// }

// Creates a new Cuisine in the DB
export function create(req, res) {
  return Cuisine.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Cuisine in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Cuisine.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Cuisine in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Cuisine.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Cuisine from the DB
export function destroy(req, res) {
  return Cuisine.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
