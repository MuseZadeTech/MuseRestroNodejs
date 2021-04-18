/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/subcategories              ->  index
 * POST    /api/subcategories              ->  create
 * GET     /api/subcategories/:id          ->  show
 * PUT     /api/subcategories/:id          ->  upsert
 * PATCH   /api/subcategories/:id          ->  patch
 * DELETE  /api/subcategories/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Subcategory from './subcategory.model';
import Product from '../product/product.model';
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

// Gets a list of Subcategorys
export function index(req, res) {
  return Subcategory.find({'restaurantID':req.user._id},{}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Subcategories
export function byCategory(req, res) {
  return Subcategory.find({'category':req.params.id},{}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Subcategories(Customized Field Name)
export function byCategoryId(req, res) {
  //getting all subcategories of a category
  Subcategory.find({'category':req.params.id},{}).exec(function(err,subcat){
    if(err){
      return handleError(res);
    }
    else{
      let data_arr = [];
      let data_obj = {};
      //iterating subcat
      for(let i=0;i<subcat.length;i++){
        data_obj = {};
        //framing in an object
        data_obj = {
          id:subcat[i]._id,
          text:subcat[i].title
        }
        data_arr.push(data_obj);
        //when all done
        if(i==subcat.length-1)
        {
          //sending response
          res.json(data_arr);
        }
      }
    }
  })
}

// Gets a single Subcategories from the DB
export function show(req, res) {
  return Subcategory.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Subcategories in the DB
export function create(req, res) {
  //creating sub category instance
  let subcategory = new Subcategory(req.body);
   subcategory.restaurantID = req.user._id;
   //save sub category instance
   subcategory.save(function (err) {
    if (err) {
      //error occoured
      return handleError(res);
    }
    else {
      //sending response
      res.json(subcategory); 
    }
  })
}

// Upserts the given Subcategory in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Subcategory.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Deletes a Subcategory from the DB
export function destroy(req, res) {
  //getting sub category id 
  let subcategoryId = req.params.id;
  //getting all products of a sub category
  Product.find({'subcategory':subcategoryId},{}).exec(function(err,product){
    if(err){
      //error occoured
      return handleError(res);
    }
    if(product.length>0){
      // while products found
      res.status(200).send({
        message:'There are Some products related to this Sub-Category!'
      })
    }
    if(product.length==0){
      //while no product found
      return Subcategory.findById(req.params.id).exec()
      .then(handleEntityNotFound(res))
      .then(removeEntity(res))
      .catch(handleError(res));
    }
  })
}

// Gets a list of Subcategories
export function byCatId(req, res) {
  return Subcategory.find({'category':req.params.id,'enable':1},{}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}