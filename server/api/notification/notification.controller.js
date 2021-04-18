/**  
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/notifications              ->  index
 * POST    /api/notifications              ->  create
 * GET     /api/notifications/:id          ->  show
 * PUT     /api/notifications/:id          ->  upsert
 * PATCH   /api/notifications/:id          ->  patch
 * DELETE  /api/notifications/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Notification from './notification.model';

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

// Gets a list of Notifications
export function index(req, res) {
  return Notification.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Notification from the DB
export function show(req, res) {
  return Notification.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Notification in the DB
export function create(req, res) {
  return Notification.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Notification in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Notification.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}



// Deletes a Notification from the DB
export function destroy(req, res) {
  return Notification.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


// Gets a list of unread Notifications
export function unreadNotification(req, res) {
  //get all unread notification of a location
  return Notification.find({'location':req.params.id,readNotification:false},{}).exec(function(err,data){
    if(err){
      //error occoured
     handleError(res,err);
    }
    if(data.length==0){
      //while no data found
      //get recent last five notification of a location
      Notification.find({'location':req.params.id},{}).sort('-createdAt').limit(5).exec(function(err,lastfivedata){
        if(err){
          //error occoured
          handleError(res,err);
        }
        if(lastfivedata.length==0){
          //if not a single notification
          let resdata = [];
          //send blank array
          res.json(resdata);
        }
        else{
          //sending five notification
         res.json(lastfivedata);
        }
      })
    }
    else{
      //sending unread notification
      res.json(data);
    }
  })
}

//update notification
export function updateNotification(req, res) {
  //update all unread notification to read of a location 
  Notification.update({'location':req.params.id,'readNotification':false},{$set:{'readNotification':true}},{'multi':true}).exec(function (err, notification) {
    if (err) {
      //error occoured
      return handleError(res, err);
    }
    if (!notification) {
      //while no notification
      return res.status(404).send('Not Found');
    }
    //send response
    res.status(200).send({
      message:'All notification read.'
    })
  });
}