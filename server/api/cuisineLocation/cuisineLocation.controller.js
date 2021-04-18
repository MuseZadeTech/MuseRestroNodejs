/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/cuisineLocations              ->  index
 * POST    /api/cuisineLocations              ->  create
 * GET     /api/cuisineLocations/:id          ->  show
 * PUT     /api/cuisineLocations/:id          ->  upsert
 * PATCH   /api/cuisineLocations/:id          ->  patch
 * DELETE  /api/cuisineLocations/:id          ->  destroy
 */

'use strict';

import { applyPatch } from 'fast-json-patch';
import CuisineLocation from './cuisineLocation.model';
import Location from '../location/location.model';

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
      applyPatch(entity, patches, /*validate*/ true);
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
        .then(() => res.status(204).end());
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

// Gets a list of CuisineLocations
export function index(req, res) {
  return CuisineLocation.find({},{__v:false}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single CuisineLocation from the DB
export function show(req, res) {
  return CuisineLocation.findById(req.params.id,{'__v':false}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new CuisineLocation in the DB
export function create(req, res) {
  return CuisineLocation.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given CuisineLocation in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return CuisineLocation.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing CuisineLocation in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return CuisineLocation.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a CuisineLocation from the DB
export function destroy(req, res) {
  return CuisineLocation.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function locationsByCuisine(req, res) {
  console.log('sdfg'+JSON.stringify(req.body));
 CuisineLocation.find({'cuisineId':{"$in":req.body.cuisineId}},{}).exec(function (err, Cuisinelocation) {
   if (err) {
     return handleError(res);
   }
   if (Cuisinelocation.length==0) {
     return res.status(200).send({message:'No Cuisinelocation found matching this criteria.'});
   }
   return res.json(Cuisinelocation);
 });
}
