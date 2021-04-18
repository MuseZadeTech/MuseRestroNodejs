/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/payments              ->  index
 * POST    /api/payments              ->  create
 * GET     /api/payments/:id          ->  show
 * PUT     /api/payments/:id          ->  upsert
 * PATCH   /api/payments/:id          ->  patch
 * DELETE  /api/payments/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Payment from './payment.model';
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

// Gets a list of Payments(Only admin access)
export function index(req, res) {
  return Payment.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Payment from the DB(Only admin access)
export function show(req, res) {
  return Payment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Payment in the DB
export function create(req, res) {
 
  let payment              = new Payment();
  payment.restaurantID     = req.user._id;
  payment.withdrawAmount   = req.body.withdrawAmount;
  payment.paymentOption    = req.body.paymentOption;
  payment.save(function(err){
    if(err){
     return handleError(res);
    }
    else{
      res.json(payment);
    }
  })
}


export function restaurantPayments(req,res){
  Payment.find({'restaurantID':req.user._id},{}).exec(function(err,payments){
    if(err){
      resw.status(400).send({
        message:'Something Went Wrong.'
      })
    }
    else{
      res.json(payments);
    }
  })
}

//List of withdraw amount of a seller(by admin)
export function allPayments(req,res){
  Payment.find({'restaurantID':req.params.id},{}).exec(function(err,data){
    if(err){
      res.status(400).send({
        message:'Something Went Wrong.'
      })
    }
    else{
      res.json(data);
    }
  })
}


// Upserts the given Payment in the DB at the specified ID
export function upsert(req, res) {
  let paymentId = req.params.id;
  //if admin has to update with process or success flag
  if((req.body.flag == 2) || (req.body.flag == 3)){
    Payment.findById(paymentId).exec(function(err,paymentData){
      if(err){
        return handleError(res);
      }
      else{
        if(req.body.withdrawAmount !=undefined){
          paymentData.withdrawAmount = req.body.withdrawAmount;
        }
        if(req.body.withdrawStatus !=undefined){
          paymentData.withdrawStatus = req.body.withdrawStatus;
        }
        if(req.body.flag !=undefined){
          paymentData.flag = req.body.flag;
        }
        if( paymentData.flag!= undefined && paymentData.withdrawAmount){
          paymentData.save(function(err){
            if(err){
              res.status(400).send({
                message:'Something Wrong'
              });
            }
            else{
              res.json(paymentData);
            }
          })
        }
      }
    })
  }
  //when seller or admin has to cancel the payment req.
  if(req.body.flag == 0){
    Payment.findById(paymentId).exec(function(err,cancelPayment){
      if(err){
        res.status(400).send({
          message:'Something Went Wrong.'
        })
      }
      else{
        cancelPayment.flag           = req.body.flag;
        cancelPayment.withdrawStatus = 'cancelled';
        cancelPayment.save(function(err){
          if(err){
            res.status(400).send({
              message:'Something Wrong'
            });
          }
          else{
            var payment              = new Payment();
            payment.restaurantID     =cancelPayment.restaurantID;
            payment.withdrawAmount   =cancelPayment.withdrawAmount;
            payment.withdrawStatus   ='cancelled';
            payment.flag             =0;
            payment.cancelledAt      =Date.now();
            payment.save(function(err){
              if(err){
                console.log('error' +err);
                res.status(400).send({
                  message:'Something Wrong'
                });
              }
              else{
                res.json(payment);
              }
            });
          }
        });
      }
    });
  }
}

//Get a seller wallet balance
export function walletBalance(req,res){
  let withdrawAmount=0;
  let avlBal = 0;
  let cardOrderBal;
  let dataObj = {
    avlBal:'',
    totalNumberOfOrders:'',
    totalEarning:''
  }
  let restaurantID1 = req.params.id;
  Order.aggregate([
  {
    $group: {_id:{restaurantID:"$restaurantID",paymentOption:'$CARD'},data:{$sum:'$payableAmount' },totalNumberOfOrders:{$sum:1}},
  }
  ]).exec(function(err,byCard){
    if(err){
      res.status(400).send({
        message:'Something Went Wrong.'
      })
    }
    else{
      //Getting a single object from an array of obj.
      function cardBasedTrans(byCard) {
        return byCard._id.restaurantID == restaurantID1;
      }
      cardOrderBal = byCard.find(cardBasedTrans);
      Payment.find({'restaurantID':restaurantID1,$or: [{flag: 1}, {flag: 2},{flag: 3}]},{withdrawAmount:1}).lean().
      exec(function(err,withdrawAmounts){
        if(err){
          res.status(400).send({
            message:'Something Went Wrong.'
          })
        }
        else{
          if(withdrawAmounts.length == 0){
            dataObj.avlBal              = cardOrderBal.data;
            dataObj.totalNumberOfOrders = cardOrderBal.totalNumberOfOrders;
            dataObj.totalEarning        = cardOrderBal.data;
            res.json(dataObj);
          }
          else{
            for(let j=0;j<withdrawAmounts.length;j++){
              withdrawAmount = withdrawAmount+withdrawAmounts[j].withdrawAmount;
              if(j ==withdrawAmounts.length-1){
                avlBal                      = cardOrderBal.data-withdrawAmount;
                dataObj.avlBal              = avlBal;
                dataObj.totalNumberOfOrders = cardOrderBal.totalNumberOfOrders;
                dataObj.totalEarning        = cardOrderBal.data;
                res.json(dataObj);
              }
            }
          }
        }
      })
    }
  });
}

//All seller requested for withdraw(status pending)
//admin access
export function pendingWithdrawStatus(req,res){
  Payment.find({'withdrawStatus':'Pending'},{}).populate('restaurantID','restaurantName').exec(function(err,payments){
    if(err){
      res.status(400).send({
        message:'Something Went Wrong.'
      })
    }
    else{
      res.json(payments);
    }
  })
}