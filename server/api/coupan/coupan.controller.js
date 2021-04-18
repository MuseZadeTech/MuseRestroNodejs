/**vaildCoupanData vaildCoupanData
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/coupans              ->  index
 * POST    /api/coupans              ->  create
 * GET     /api/coupons/:id          ->  show
 * PUT     /api/coupans/:id          ->  upsert
 * PATCH   /api/coupans/:id          ->  patch
 * DELETE  /api/coupans/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Coupan from './coupan.model';
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

// Gets a list of Coupans
export function index(req, res) {
  var user_id = req.query.store;
  return Coupan.find({'restaurantID': user_id},{__v:false}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Coupan by location id
export function show(req, res) {
  return Coupan.find({'location':req.params.id},{'__v':false}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Coupan from the DB
export function singleCoupan(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);console.log(id);
  return Coupan.findById(id,{__v:false}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// get only valid coupan
export function vaildCoupanData(req, res) {
  // getting current timestamp
  let currentTime=new Date();
  let currentTimeStamp=currentTime.getTime();
  // applying matching criteria
  Coupan.find({enable:true,'location':req.params.id,applicableFromTimeStamp: { $lt: currentTimeStamp },applicableToTimeStamp: { $gt:currentTimeStamp} },{__v:false}).exec(function(err,coponData){
    if(err){
      // handling error
      return handleError(err)
    }
    if(coponData.length==0){
      // there is no valid coupan
      return res.status(200).send({message:'there is no valid coupon '})
    }
    else{
      // send response
      res.send(coponData)
    }
  })
}

// Creates a new Coupan in the DB
export function create(req, res) {
  //creating coupan instance 2018-03-15
  console.log('mmmmmmmmmmmm'+JSON.stringify(req.body))
  let coupan = new Coupan(req.body);
  // spliting date
  if((req.body.applicableFrom!=undefined )){
    var myDate=req.body.applicableFrom;
    myDate=myDate.split("-");
    var datum = new Date(Date.UTC(myDate[0],myDate[1]-1,myDate[2]));
    var date1=new Date(datum);
    var x=date1.getTime();
    coupan.applicableFromTimeStamp=x;
  }
  //spliting date
  if(req.body.applicableTo!=undefined){
    var myDate=req.body.applicableTo;
    myDate=myDate.split("-");
    var datum = new Date(Date.UTC(myDate[0],myDate[1]-1,myDate[2]));
    var date1=new Date(datum);
    var x=date1.getTime();
    coupan.applicableToTimeStamp=x;
  }
  // save coupan
  coupan.save(function(err){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //send response
      res.json(coupan);
    }
  })
}

// Upserts the given Coupan in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  if((req.body.applicableFrom!=undefined )){
    var myDate=req.body.applicableFrom;
    myDate=myDate.split("-");
    var datum = new Date(Date.UTC(myDate[0],myDate[1]-1,myDate[2]));
    var date1=new Date(datum);
    var x=date1.getTime();
    req.body.applicableFromTimeStamp=x;
  }
  //spliting date
  if(req.body.applicableTo!=undefined){
    var myDate=req.body.applicableTo;
    myDate=myDate.split("-");
    var datum = new Date(Date.UTC(myDate[0],myDate[1]-1,myDate[2]));
    var date1=new Date(datum);
    var x=date1.getTime();
    req.body.applicableToTimeStamp=x;
  }
  return Coupan.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Deletes a Coupan from the DB
export function destroy(req, res) {
  return Coupan.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function activationUpdate(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  return Coupan.findOne({_id:id})
    .then(coupan=>{
         var enable = !coupan.enable;
         Coupan.findOneAndUpdate({_id:id},{enable:enable})
        .then(coupan=>{res.json(coupan)})})
}




