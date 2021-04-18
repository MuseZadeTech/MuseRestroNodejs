/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ordertracks              ->  index
 * POST    /api/ordertracks              ->  create
 * GET     /api/ordertracks/:id          ->  show
 * PUT     /api/ordertracks/:id          ->  upsert
 * PATCH   /api/ordertracks/:id          ->  patch
 * DELETE  /api/ordertracks/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Ordertrack from './ordertrack.model';
import Order from '../order/order.model';

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

// Gets a list of Ordertracks
export function index(req, res) {
  return Ordertrack.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Ordertrack from the DB
export function show(req, res) {
  return Ordertrack.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Ordertrack in the DB
export function create(req, res) {
  return Ordertrack.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Ordertrack in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Ordertrack.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}



// Deletes a Ordertrack from the DB
export function destroy(req, res) {
  return Ordertrack.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
//*******************order assigned to partcular deliveryboy**
export function orderAssignedToDeliveryby(req,res){
  //get all orders of a delivery boy
  Order.find({'deliveryBy':req.user._id},{}).exec(function(err,deliveryInfo){
    if(err){
      //error occoured
      return handleError(res)
    }
    if(deliveryInfo.length==0){
      //while no order found
      return res.status(404).send({message:"not assigned any order"})
    }
    else{
      //sending response
      res.send(deliveryInfo)
    }
  })
}