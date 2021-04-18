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

import jsonpatch from 'fast-json-patch';
import Favourite from './favourite.model';

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
    console.log('entity'+entity)
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

// Gets a list of Favourites
export function index(req, res) {
  return Favourite.find({'user':req.user._id},{__v:false}).populate('location','deliveryInfo locationName').populate('restaurantID','-salt -password -status -createdAt -role -aboutUs -alternateTelephone -provider').populate('product').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//get a list of favourites of particular location and user id basis
export function favListOfUser(req, res) {
  return Favourite.find({'user':req.user._id,'location':req.params.location},{__v:false}).populate('location','deliveryInfo locationName').populate('restaurantID','-salt -password -status -createdAt -role -aboutUs -alternateTelephone -provider').populate('product').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//get a  favourites of particular productId and locationId basis
export function favListProduct(req, res) {
  return Favourite.findOne({'product':req.body.product,'location':req.body.location},{__v:false}).populate('location','deliveryInfo locationName').populate('restaurantID','-salt -password -status -createdAt -role -aboutUs -alternateTelephone -provider').populate('product').exec(function(err,favourites){
    if(err){
      return handleError(err)
    }
    if(!favourites){
      return res.status(200).send(null)
    }
    res.send(favourites)
  })
}
// Gets a single Favourite from the DB
export function show(req, res) {
  return Favourite.findById(req.params.id,{'__v':false}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Favourite in the DB
export function create(req, res) {
  Favourite.findOne({user:req.user._id,product:req.body.product},{__v:false}).exec(function(err,data){
    if(err){
      return handleError(res,err);
    }
    if(!data){
      let favourite = new Favourite(req.body);
      favourite.user = req.user._id;
      favourite.save(function(err){
        if(err){
          return handleError(res);
        }
        else{
          res.json(favourite);
        }
      })
    }
    else{
      res.json({message:'Already favourite',_id:data._id});
    }
  })
}
// Deletes a Favourite from the DB
export function destroy(req, res) {
  return Favourite.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}



//check whether a product is favourite or not
export function checkFavourite(req,res){
  return Favourite.findOne({user:req.user._id,product:req.body.product},{__v:false}).exec(function(err,data){
    if(err){
      return handleError(res,err);
    }
    if(!data){
      res.json({resflag:false});
    }
    else{
      res.json({resflag:true,_id:data._id});
    }
  })
}

export function deletByProductIdAndLocation(req, res) {
  Favourite.find({user:req.user._id,product:req.body.product,location:req.body.location,restaurantID:req.body.restaurantID}).remove().exec(function(err,deleted){
    if(err){
      return handleError(res);
    }
    res.send({message:"sucessfully deleted"})
  })
}