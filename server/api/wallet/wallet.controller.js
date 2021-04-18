/**restaurantOwnerWalletInfo orderCollection
 * Using Rails-like standard naming convention for endpoints. orderCollection
 * GET     /api/wallets              ->  index
 * POST    /api/wallets              ->  create
 * GET     /api/wallets/:id          ->  show
 * PUT     /api/wallets/:id          ->  upsert
 * PATCH   /api/wallets/:id          ->  patch
 * DELETE  /api/wallets/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Wallet from './wallet.model';
import Location from '../location/location.model';
import mongoose from 'mongoose';
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

// Gets a list of Wallets
export function filterdTransaction(req, res) {
  //getting receiver id and transaction status
  let receiverId = req.params.id;
  let transStatus = req.body.transactionStatus;
  //getting all wallets data of a particular status and receiver id
  Wallet.find({'receiverId':receiverId,transactionStatus:transStatus},{}).exec(function(err,resdata){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      res.json(resdata)
    }
  })
}
// Gets a list of Wallets
export function index(req, res) {
  return Wallet.find({transactionStatus:{$in:['Pending','Confirmed','Rejected','Cancelled']}},'-__v').populate('receiverId','name').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Wallets
export function sellerWallet(req, res) {
  return Wallet.find({'receiverId':req.user._id},{}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Wallets
export function allRestaurantTransaction(req, res) {
  return Wallet.find({'receiverId':req.user._id,transactionStatus:{$in:['Pending','Confirmed','Rejected','Cancelled']}},'-__v').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Gets a single Wallet from the DB
export function show(req, res) {
  return Wallet.findById(req.params.id,'-__v').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Wallet in the DB
export function create(req, res) {
  //creating wallet instance
  let wallet           = new Wallet(req.body);
  let date             = new Date();
  let midnight         = date.setUTCHours(0,0,0,0);
  wallet.day           = date.getDate();
  wallet.year          = date.getFullYear();
  wallet.month         = date.getMonth()+1;
  //save wallet
  wallet.save(function(err){
    if(err){
      return handleError(res);
    }
    else{
      res.json(wallet);
    }
  })
}

// Upserts the given Wallet in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Wallet.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}



//get collection of all locations of a restaurant
export function orderCollection(req, res) {
  let rawobj={};
  let restaurantId = mongoose.Types.ObjectId(req.params.restaurantId);
  //applying aggregate function
  Wallet.aggregate([
    { $match: { receiverId:restaurantId} },
    { $group : {
      _id :{year:"$year", month:"$month",day:"$day",location:"$location",timestamp:"$timestamp"},
      data: { $sum: '$amount' } ,
    }
  }
  ]).
  exec(function (err,groupedCollection) {
    if(err){
      return handleError(res);
    }
    else{
      let labelArray = [];
      let dataArray = [];
      let count=0;
      let len = groupedCollection.length;
      //iterating groupedCollection
      console.log('groupedCollection'+JSON.stringify(groupedCollection));
      for(let i=0;i<groupedCollection.length;i++){
        let locationId = mongoose.Types.ObjectId(groupedCollection[i]._id.location);
        console.log('groupedCollection...........'+JSON.stringify(locationId));
        Location.findById(locationId,'locationName address contactPerson contactNumber').exec(function(err,locationinfo){
          if(err){
            return handleError(res);
          }
          if(!locationinfo){
            console.log("no id found")
          //   let label            = groupedCollection[i]._id.day + '/' +groupedCollection[i]._id.month+ '/' +groupedCollection[i]._id.year;
          //   rawobj.label         = label;
          //   rawobj.locationId    = groupedCollection[i]._id.location;
          //   rawobj.timestamp     = groupedCollection[i]._id.timestamp;
          //   rawobj.locationName  =  "" ;
          //   rawobj.address       =  "";
          //   rawobj.contactPerson =  "";
          //   rawobj.contactNumber =  "";
          //   rawobj.collection    = groupedCollection[i].data;
          //   labelArray.push(rawobj);
          //   if(labelArray.length == len){
          //     res.json(labelArray);
          //   }
          }
          else{
            count++;
            console.log('groupedCollection...'+JSON.stringify(locationId));
            let rawobj = {};
            let label            = groupedCollection[i]._id.day + '/' +groupedCollection[i]._id.month+ '/' +groupedCollection[i]._id.year;
            rawobj.label         = label;
            rawobj.locationId    = groupedCollection[i]._id.location;
            rawobj.timestamp     = groupedCollection[i]._id.timestamp;
            rawobj.locationName  =  locationinfo.locationName ;
            rawobj.address       =  locationinfo.address;
            rawobj.contactPerson =  locationinfo.contactPerson;
            rawobj.contactNumber =  locationinfo.contactNumber;
            rawobj.collection    = groupedCollection[i].data;
            labelArray.push(rawobj);
            
            if(labelArray.length == len){
              res.json(labelArray);
            }
          }
        })
      }
    }
  })
}



//get all wallet info of a restaurant owner
export function restaurantOwnerWalletInfo(req,res){
  let id = mongoose.Types.ObjectId(req.params.id);
  Wallet.aggregate([
    {
      $match:
      {
        receiverId:id,status:'Credited'
      }
    },
    { $group :
      {
        _id :null,
        data: { $sum: '$amount' } ,
      }
    }
  ]).
  exec(function (err, totalOrderEarning) {
    if(err){
      return handleError(res);
    }
    else{
      //grouping on receiver id and transaction status
      Wallet.aggregate([
        { $match: { receiverId:id,transactionStatus:{ $in: ['Confirmed','Pending']}}},
        { $group : {
          _id :null,
          data: { $sum: '$amount' } ,
        }
      }
      ]).
      exec(function (err, withdrawlAmount) {
        if(err){
          return handleError(res);
        }
        else{
          let totalOrderEarning1;
          let withdrawlAmount1;
          if(withdrawlAmount.length !=0)
          {
            withdrawlAmount1 = withdrawlAmount[0].data
          }
          if(withdrawlAmount.length ==0)
          {
            withdrawlAmount1 =0
          }
          if(totalOrderEarning.length !=0)
          {
            totalOrderEarning1 = totalOrderEarning[0].data
          }
          if(totalOrderEarning.length ==0)
          {
            totalOrderEarning1 =0
          }
          let availableBalance = totalOrderEarning1 -withdrawlAmount1;
          let resobj ={
            totalOrderEarning:totalOrderEarning1,
            withdrawlAmount:withdrawlAmount1,
            availableBalance:availableBalance
          }
          res.json(resobj);
        }
      })
    }
  })
}


//get all charges total where status is credited
export function totalCharge(req,res){
  Wallet.aggregate([{$match:{status:'Credited'}},
    { $group :{
        _id :null,
        data: { $sum: '$charges' } ,
      }
    }]).exec(function(err,charge){
      if(err){
        return handleError(res)
      }
      if(!charge){
        //while no charge found
        return res.status(200).send({message:"no commission found"})
      }
      else{
        //sending response
        res.send(charge)
      }

    })
}