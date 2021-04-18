/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/pointrates              ->  index
 * POST    /api/pointrates              ->  create
 * GET     /api/pointrates/:id          ->  show
 * PUT     /api/pointrates/:id          ->  upsert
 * PATCH   /api/pointrates/:id          ->  patch
 * DELETE  /api/pointrates/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Pointrate from './pointrate.model';

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

// Gets a list of Pointrates
export function index(req, res) {
  return Pointrate.find({'restaurantID':req.params.id},{}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Pointrate from the DB
export function show(req, res) {
  return Pointrate.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Pointrate in the DB
export function create(req, res) {
  return Pointrate.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Pointrate in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Pointrate.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Pointrate from the DB
export function destroy(req, res) {
  return Pointrate.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

