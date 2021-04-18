/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tags    tax          ->  index
 * POST    /api/tags              ->  create
 * GET     /api/tags/:id          ->  show
 * PUT     /api/tags/:id          ->  upsert
 * PATCH   /api/tags/:id          ->  patch
 * DELETE  /api/tags/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import News from './news.model';

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

// Gets a list of Tags
export function index(req, res) {
  return News.find({'restaurantID':req.params.id},{__v:false}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}



// Gets a single News from the DB
export function show(req, res) {
  return News.findById(req.params.id,{__v:false}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new News in the DB
export function create(req, res) {
  return News.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given News in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return News.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Deletes a News from the DB
export function destroy(req, res) {
  return News.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
