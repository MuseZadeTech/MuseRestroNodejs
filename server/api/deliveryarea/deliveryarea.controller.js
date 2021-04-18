/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/deliveryareas              ->  index
 * POST    /api/deliveryareas              ->  create
 * GET     /api/deliveryareas/:id          ->  show
 * PUT     /api/deliveryareas/:id          ->  upsert
 * PATCH   /api/deliveryareas/:id          ->  patch
 * DELETE  /api/deliveryareas/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Deliveryarea from './deliveryarea.model';

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

// Gets a list of Deliveryareas
export function index(req, res) {
  return Deliveryarea.find({},{__v:false}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Deliveryarea from the DB
export function show(req, res) {
  return Deliveryarea.findById(req.params.id,{'__v':false}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Deliveryarea in the DB
export function create(req, res) {
  //creating delivery area instance
  let deliveryarea = new Deliveryarea(req.body);
  deliveryarea.restaurantID = req.user._id;
  //save delivery area instance
  deliveryarea.save(function (err) {
    if (err) {
      //error handling
      return handleError(res);
    }
    else {
      //sending response
      res.json(deliveryarea);
    }
  })
}

// Upserts the given Deliveryarea in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Deliveryarea.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Deletes a Deliveryarea from the DB
export function destroy(req, res) {
  return Deliveryarea.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
