/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/accountdetails              ->  index
 * POST    /api/accountdetails              ->  create
 * GET     /api/accountdetails/:id          ->  show
 * PUT     /api/accountdetails/:id          ->  upsert
 * PATCH   /api/accountdetails/:id          ->  patch
 * DELETE  /api/accountdetails/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Accountdetail from './accountdetail.model';
import seedDatabaseIfNeeded from '../../config/seed';
var cron = require('node-cron');   

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

//REMOVE COMMENTS
//cron job in every 30 minute
//override database by seed db
// cron.schedule('*/30 * * * *', function(){
// seedDatabaseIfNeeded();
// });


// Gets a list of Accountdetails of a user
export function index(req, res) {
  return Accountdetail.find({'user':req.user._id},{}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Accountdetail from the DB
export function show(req, res) {
  return Accountdetail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Accountdetail in the DB
export function create(req, res) {
  //creating account detail object
 let accountdetail  = new Accountdetail(req.body);
 accountdetail.user = req.user._id;
 //save account detail
 accountdetail.save(function(err){
  if(err){
    //error occoured
    return handleError(res);
  }
  else{
    //sending newly created account detail as response 
    res.json(accountdetail);
  }
 })
}

// Upserts the given Accountdetail in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  //when not updating primaryAccount
  if(req.body.flag == 0){
    return Accountdetail.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

      .then(respondWithResult(res))
      .catch(handleError(res));
  }  
  //while updating primary account
  if(req.body.flag == 1){
    Accountdetail.find({'user':req.user._id,primaryAccount:1},{}).exec(function(err,account){
      if(account.length == 0){
        return Accountdetail.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
      }
      else{
        //updating current primary account to secondary
        //for a user,there can be only one primaryAccount
        account[0].primaryAccount = 0;
      }
      //save changes
      account[0].save(function(err){
        if(err){
          //handle error
          return handleError(res);
        }
        else{
          abc();
        }
      })
      function abc(){
        //update accountdetail
        return Accountdetail.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
      }
    })
  }
}



// Deletes a Accountdetail from the DB
export function destroy(req, res) {
  return Accountdetail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

