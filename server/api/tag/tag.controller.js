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
import Tag from './tag.model';
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
  return Tag.find({'location':req.params.id},{__v:false}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of tags(Customized Field Name)
export function byLocation(req, res) {
  //get all tags of a location which are enabled
  Tag.find({'location':req.params.id,'enable':1},{__v:false}).exec(function(err,tags){
    if(err){
      //error occoured
      return handleError(err)
    }
    if(!tags){
      //while no tags found
      return res.status(200).send({'message':'data not found'})
    }
    if(tags.length==0){
      //while no tags found
       return res.status(200).send({'message':'data not found'})
    }
    else{
      let data_arr = [];
      let data_obj = {};
      //iterating tags
      for(let i=0;i<tags.length;i++){
        data_obj = {};
        //framing data into object
        data_obj = {
          id:tags[i]._id,
          text:tags[i].tag
        }
        data_arr.push(data_obj);
        //when all done
        if(i==tags.length-1)
        {
          //sending response
          res.json(data_arr);
        }
      }
    }
  })
}

// Gets a single Tag from the DB
export function show(req, res) {
  return Tag.findById(req.params.id,{__v:false}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Tag in the DB
export function create(req, res) {console.log(req.body)
  
  return Tag.create(req.body)
    .then(tag=>res.json(tag))
    .catch(err => res.json(err));
}

// Upserts the given Tag in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Tag.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Deletes a Tag from the DB
export function destroy(req, res) {
  return Tag.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

//Dan  get list tags 
export function getTags(req, res) {
  return Tag.find({'restaurantID':req.query.store})
  .then(tag=>{res.json(tag)})
  .catch(err=>res.json(err))
} 

//Dan updating activation
export function updatedActivation(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  return Tag.findOne({_id:id})
    .then(tag=>{
         var enable = !tag.enable;
         Tag.findOneAndUpdate({_id:id},{enable:enable})
        .then(tag=>{res.json(tag)})})
}

export function getTagsForProduct(req, res) {console.log(req.query.store);
  return Tag.find({'restaurantID':req.query.store, enable:true})
  .then(tag=>{res.json(tag)})
  .catch(err=>res.json(err))
} 

