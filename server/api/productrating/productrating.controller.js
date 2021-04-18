/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/productratings              ->  index
 * POST    /api/productratings              ->  create
 * GET     /api/productratings/:id          ->  show
 * PUT     /api/productratings/:id          ->  upsert
 * PATCH   /api/productratings/:id          ->  patch
 * DELETE  /api/productratings/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Productrating from './productrating.model';
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

// Gets a list of Productratings
export function index(req, res) {
  return Productrating.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Productrating from the DB
export function show(req, res) {
  return Productrating.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


//creating product rating
export function create(req, res) {
  let productrating = new Productrating(req.body);
  console.log("productrating"+JSON.stringify(productrating))
  productrating.save(function(err){
    if(err){
      return handleError(res);
    }
    else{
      Order.findById(req.body.order).exec(function(err,ratingdata){
        if(err){
          return handleError(res);
        }
        else{
          console.log("gggggggggggggg"+JSON.stringify(ratingdata))
          let obj={
            rating:productrating.rating,
            createdAt:productrating.createdAt,
            product:productrating.product,
            comment:productrating.comment
          }
          ratingdata.productRating.push(obj);
          ratingdata.save(function(err){
            if(err){
              return handleError(res);
            }
             return res.json(productrating);
          })
        }
      })
    }
  })
}

// Upserts the given Productrating in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Productrating.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Productrating from the DB
export function destroy(req, res) {
  return Productrating.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


//Get average rating of a single product
export function productRating(req,res){
  let productId = req.params.id;
  //Getting all products with their rating.
  Productrating.aggregate([
    { $group: { _id: '$product', rating: {$avg: '$rating' } } },
    ]).exec(function(err,ratingData){
      if(err){
        return handleError(res);
      }
      else{
        //Getting a single object from an array of obj.
        function findSpecificProduct(ratingData) {
          return ratingData._id == productId;
        }
        //sending response
        res.json(ratingData.find(findSpecificProduct));
      }
  });
}

//get rating through productid and orderId
export function ratingByProductOrder(req,res){
  // let productId = req.params.id;
  //Getting all products with their rating.
  Productrating.findOne({'product':req.body.productId, 'order':req.body.orderId},{}).exec(function(err,ratingData){
      if(err){
        return handleError(res);
      }
      else{
        //sending response
        res.json(ratingData);
      }
  });
}
