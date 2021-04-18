
'use strict';

import jsonpatch from 'fast-json-patch';
import Bookingtable from './bookingtable.model';
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
  return Bookingtable.find({'user':req.params.id},{__v:false}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}



// Gets a single Bookingtable from the DB
export function show(req, res) {
  return Bookingtable.findById(req.params.id,{__v:false}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Gets a single Bookingtable from the DB
export function listByLocation(req, res) {
  return Bookingtable.find({'location':req.params.id},{__v:false}).populate('user','name').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Bookingtable in the DB
export function create(req, res) {
  if(req.body.bookingTime){
    var time=req.body.bookingTime;
    time=time.split(":");
    req.body.convertedTime=Number(time[0])*60+Number(time[1])
  }
  var bookingtable=new Bookingtable(req.body);
  bookingtable.save(function(err,data){
    if(err){
      return handleError(err)
    }
    else{
      res.send({message:"sucess"})
    }
  })
}

// Upserts the given Bookingtable in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Bookingtable.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Deletes a Bookingtable from the DB
export function destroy(req, res) {
  return Bookingtable.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
