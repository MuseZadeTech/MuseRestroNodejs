/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /y              ->  index
 * POST    /y              ->  create
 * GET     /y/:id          ->  show
 * PUT     /y/:id          ->  upsert
 * PATCH   /y/:id          ->  patch
 * DELETE  /y/:id          ->  destroy
 */

'use strict';
///dfghjkjhfdfghjkvg ggggggggg dddddddd
import jsonpatch from 'fast-json-patch';
import Carddetail from './carddetail.model';

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

// Gets a list of Carddetails
export function index(req, res) {
  return Carddetail.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Carddetail from the DB
export function show(req, res) {
  return Carddetail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Carddetail in the DB
export function create(req, res) {
  return Carddetail.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Carddetail in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Carddetail.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}



// Deletes a Carddetail from the DB
export function destroy(req, res) {
  return Carddetail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
