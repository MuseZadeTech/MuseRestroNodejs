
/**  
 * Using Rails-like standard naming convention for endpoints. dashboardData
 * GET     /api/orders     deliveredOrdersOfLocation         ->  index minOrdLoyality
 * POST    /api/orders              ->  create upsert
 * GET     /api/orders/:id          ->  show singleLocationCollInfos
 * PUT     /api/orders/:id          ->  upsert search allRestaurantCollectionInfos
 * PATCH   /api/orders/:id          ->  patch
 * DELETE  /api/orders/:id          ->  destroy restaurantCount
 */
 
'use strict';
import mongoose from 'mongoose';
import jsonpatch from 'fast-json-patch';
import Order from './order.model';
import User from '../user/user.model';
import Category from '../category/category.model';
import Product from '../product/product.model'; 
import Location from '../location/location.model';
import Payment from '../order/order.model';
import Wallet from '../wallet/wallet.model';
import config from '../../config/environment';
import Setting from '../setting/setting.model';
var Mails = require('../../mail');
var Utils = require('../../util');
//Json to csv
var json2csv = require('json2csv');
//Json to xl
var json2xls = require('json2xls');
var fs = require('fs');
//******************
var async  = require("async");
var crypto = require("crypto");
var path   = require("path");
// Email Config
//var nodemailer = require('nodemailer');
var api_key = 'key-7fa9edb1b8f46cc6d5995448cd733241';
var domain  = 'impnolife.org';
var mailgun = require('mailgun-js')({
  apiKey: api_key, 
  domain: domain
});
var path = require('path');
//For sending mail
var SparkPost = require('sparkpost');
var client    = new SparkPost('dda9e493ede3b896feab1197fe024ae3c296403f');

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

// Gets a list of Orders of a user 
export function index(req, res) {
  return Order.find({'user':req.params.id},'-userInfo').populate('user','name email contactNumber address city').sort('-createdAt').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//************Gets a list of histry of delivered Orders of a user 
export function userOrderHistory(req, res) {
  return Order.find({'user':req.user._id,'status':'Delivered'},'-userInfo').populate('user','name email contactNumber address city').sort('-createdAt').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//************Gets a list of histry of pending Orders of a user 
export function userOrderPending(req, res) {
  return Order.find({'user':req.user._id,status:{$in:['Pending' ,'On the Way']}},{}).populate('user','name email contactNumber address city').sort('-createdAt').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Gets a list of Orders of a location
export function byLocation(req, res) {
  return Order.find({'location':req.params.id},{}).sort('-createdAt').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//gets a list of cancel or deliver of a user
export function canORdel(req,res){
  return Order.find({'user':req.params.id,status:{ $in:['delivered','canceled'] }},{})
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Gets a list of Orders of a location
export function deliveredOrdersOfLocation(req, res) {
  return Order.find({'location':req.params.id,status:'Delivered'},{}).populate('location').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Gets a list of Orders of a user
export function byRestaurant(req, res) {
  return Order.find({'restaurantID':req.params.id},{}).sort('-createdAt').populate('category','categoryName').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Order from the DB
export function show(req, res) {
  return Order.findById(req.params.id,{"__v":false}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
function getMangerInfo(id){
  return new Promise(function (resolve, reject) {
    User.findOne({location:id},{email:true,contactNumber:true,name:true}).exec(function(err,user){
      if(err){
      }
      else{
        resolve(user)
      }
    })
  })
}
// Creates a new Order in the DB
export function create(req, res) {
  let date                           = new Date();  
  req.body.date                      = date.getDate();
  req.body.month                     = date.getMonth()+1;
  req.body.year                      = date.getFullYear();
  req.body.user                      = req.user._id;
  req.body.charges                   = (req.body.payableAmount*2)/100;
  let order                          = new Order(req.body);
  order.userNotification.push({'status':'Pending','time':Date.now()});
  order.save(function(err,saved){
    if(err){
      return handleError(err)
    }
    else{
      if(req.body.loyalty !==undefined){
        let loyaltyDetail={ 
          point:-(req.body.loyalty),
          credited:false,
          orderId:saved._id,
          createdAt:new Date()
        }
        User.findById(saved.user).exec(function(err,userdata){
          if(err){
            return handleError(res);
          }
          else{
            userdata.loyaltyPoints.push(loyaltyDetail);
            userdata.totalLoyaltyPoints=userdata.totalLoyaltyPoints -(req.body.loyalty);
            userdata.save(function(err){
              if(err){
                return handleError(err)
              }
              else{
                //var msg=' Thank You for Your Order !'
                //Utils.sentOrderMsg(saved.userInfo.contactNumber,msg).then(function(d){})
                getMangerInfo(saved.location).then(function(d){
                  //var msg1=' New Order ! and OrderId:- '+saved.orderID;
                 // Utils.sentOrderMsg(d.contactNumber,msg1).then(function(f){})
                  Mails.mailToMangerOnNewOrder(d.name,d.email,saved.orderID).then(function(data){})
                  return res.status(200).send({_id:order._id, message: 'Your Order is successfully placed.'});
                })
              }
            })
          }
        })
      }
      else{
        //var msg=' Thank You for Your Order !'
        //Utils.sentOrderMsg(saved.userInfo.contactNumber,msg).then(function(d){})
        getMangerInfo(saved.location).then(function(d){
          //var msg1=' New Order ! and OrderId:-'+saved.orderID
          //Utils.sentOrderMsg(d.contactNumber,msg1).then(function(f){})
          Mails.mailToMangerOnNewOrder(d.name,d.email,saved.orderID).then(function(data){})
          return res.status(200).send({_id:order._id, message: 'Your Order is successfully placed.'});
        })
      }
    }
  })
}
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  Order.findById(req.params.id).populate('location user').exec(function(err,orderdata){
    let datedata = new Date();
    datedata =  Date.now();
    let notifytext;
    if(req.body.payment){
      notifytext = 'Awaiting confirmation from vendor.';
      orderdata.userNotification.push({'status':'Awaiting confirmation from vendor.','time':datedata})
    }
    if(req.body.status == 'Accepted'){
      orderdata.status=req.body.status;
      notifytext = 'Order Accepted by vendor.';
      orderdata.userNotification.push({'status':'Order Accepted by vendor.','time':datedata})
      let wallet ={}          =  new Wallet();
      wallet.orderId       = orderdata._id;
      wallet.senderId      = orderdata.user._id;
      wallet.receiverId    = orderdata.restaurantID;
      wallet.location      = orderdata.location._id;
      wallet.timestamp     = orderdata.createdAt.getTime();
      wallet.status        = 'Credited';
      wallet.payableAmount = orderdata.payableAmount;
      wallet.amount        = orderdata.payableAmount-orderdata.charges;
      wallet.charges       = orderdata.charges;
      wallet.day           = orderdata.day;
      wallet.date          = orderdata.date;
      wallet.year          = orderdata.year;
      wallet.month         = orderdata.month;
      wallet.save(function(err,data){})
    }
    if(req.body.status == 'On the Way'){
      orderdata.status=req.body.status;
      notifytext = 'Order Accepted by vendor.';
      orderdata.userNotification.push({'status':'Your order is on the way.','time':datedata}) 
    }
    if(req.body.status == 'Delivered'){
      orderdata.status=req.body.status;
      notifytext = 'Your order has been delivered,Share your experience with us.';
      orderdata.userNotification.push({'status':'Your order has been delivered,Share your experience with us.','time':datedata}) 
      var restaurantID=orderdata.restaurantID;
      Setting.findOne({'restaurantID':restaurantID}).exec(function(err,setting){
        if(err){
          return handleError(err,res); 
        }
        if(!setting) {
        }
        else{
          if(setting.loyalityProgram==true){
            var minOrdLoyality=setting.minOrdLoyality;
            var point=0;
            if(orderdata.subTotal >= minOrdLoyality){
              point=point + orderdata.subTotal * (setting.loyalityPercentage) /100;
            }
            else{
              point=point;
            }
            orderdata.loyalty=point;
            let loyaltyDetail={ 
              point:point,
              credited:true,
              orderId:orderdata._id,
              createdAt:new Date()
            }
            User.findById(orderdata.user, '-salt -password').exec(function(err,loyalty){
              if(err){
                return handleError(err,res) 
              }
              else{
                loyalty.loyaltyPoints.push(loyaltyDetail);
                loyalty.totalLoyaltyPoints=loyalty.totalLoyaltyPoints + point;
                loyalty.save(function(err){
                  if(err){
                    return handleError(err,res);
                  }
                  else{
                  }
                })
              }
            })
          }
        }
      })
    }
    if(req.body.status == 'Cancelled'){
      orderdata.status=req.body.status;
      notifytext = 'Your order is cancelled,sorry for inconvenience.';
      orderdata.userNotification.push({'status':'Your order is cancelled,sorry for inconvenience.','time':datedata}) 
    }
    orderdata.orderUpdatedCount = +(orderdata.orderUpdatedCount) +1;
    orderdata.save(function(err){
      if(err){
        res.status(400).send({
          message:'order couldn\'t placed.'
        })
      }
      else{
        var mailStatus=req.body.status;
        if(req.body.status == 'Delivered'){
          //var msg=' OrderId:- '+orderdata.orderID+","+"Your Order is:- "+orderdata.status
          //Utils.sentOrderMsg(orderdata.user.contactNumber,msg).then(function(d){})
          Mails.orderInvoiceMail(orderdata.user.name,orderdata.user.email,mailStatus,orderdata).then(function(data){})
          res.send({_id:orderdata._id,message:'order successfully updated'})
        }
        else{
         // var msg=' OrderId:- '+orderdata.orderID+","+"Your Order is:- "+orderdata.status
         // Utils.sentOrderMsg(orderdata.user.contactNumber,msg).then(function(d){})
          Mails.orderStatusMail(orderdata.user.name,orderdata.user.email,mailStatus).then(function(data){})
          res.send({_id:orderdata._id,message:'order successfully updated'})
        }
      }
    })
  })
}


export function upsertChoice(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  
  console.log(req.body,'gettetetr');
  Order.findById(req.params.id).populate('location user').exec(function(err,orderdata){   
    let options;  
	let	 productId;
	let choice;
	let price;
	let description;
    options=req.body.options?req.body.options:[];
	productId=req.body.productId;
	choice=req.body.choice?req.body.choice:'';
	price=req.body.price?req.body.price:0;
	description=req.body.description?req.body.description:'';
    orderdata.orderUpdatedCount = +(orderdata.orderUpdatedCount) +1;	
	let temp=[];
	orderdata.productDetails.map(row=>{
		if(row.productId==productId){					
			row.extraIngredients=options;			
			row.size=choice;
			row.price=price;
			row.description=description;
			temp.push(row);
		}
		else{
			temp.push(row);
		}
	});
	
	orderdata.productDetails=[];
	orderdata.productDetails=temp;	
    orderdata.save(function(err){
      if(err){
        res.status(400).send({
          message:'order couldn\'t placed.'
        })
      }
      else{
        var mailStatus=req.body.status; 
         // Mails.orderStatusMail(orderdata.user.name,orderdata.user.email,mailStatus).then(function(data){})
          res.send({_id:orderdata._id,message:'Order successfully updated'})
        
      }
    })
  })
}
// Upserts the given Order in the DB at the specified ID totalLoyaltyPoints
// export function upsert(req, res) {
//   if(req.body._id) {
//     delete req.body._id;
//   }
//   Order.findById(req.params.id).exec(function(err,orderdata){
//     let datedata = new Date();
//     datedata =  Date.now();
//     let notifytext;
//     if(req.body.payment){
//       notifytext = 'Awaiting confirmation from vendor.';
//       orderdata.userNotification.push({'status':'Awaiting confirmation from vendor.','time':datedata})
//     }
//     if(req.body.status == 'Accepted'){
//       notifytext = 'Order Accepted by vendor.';
//       orderdata.userNotification.push({'status':'Order Accepted by vendor.','time':datedata})
//       let wallet          = new Wallet();
//       wallet.orderId       = orderdata._id;
//       wallet.senderId      = orderdata.user;
//       wallet.receiverId    = orderdata.restaurantID;
//       wallet.location      = orderdata.location;
//       wallet.timestamp     = orderdata.createdAt;
//       wallet.status        = 'Credited';
//       wallet.payableAmount = orderdata.payableAmount;
//       wallet.amount        = orderdata.payableAmount-orderdata.charges;
//       wallet.charges       = orderdata.charges;
//       wallet.day           = orderdata.day;
//       wallet.year          = orderdata.year;
//       wallet.month         = orderdata.month;
//       wallet.save(function(err){})
//     }
//     if(req.body.status == 'On the Way'){
//       notifytext = 'Order Accepted by vendor.';
//       orderdata.userNotification.push({'status':'Your order is on the way.','time':datedata}) 
//     }
//     if(req.body.status == 'Delivered'){
//       notifytext = 'Your order has been delivered,Share your experience with us.';
//       orderdata.userNotification.push({'status':'Your order has been delivered,Share your experience with us.','time':datedata}) 
//       var restaurantID=orderdata.restaurantID;
//       Setting.findOne({'restaurantID':restaurantID}).exec(function(err,setting){
//         if(err){
//           return handleError(err,res); 
//         }
//         if(!setting) {
//         }
//         else{
//           if(setting.loyalityProgram==true){
//             var minOrdLoyality=setting.minOrdLoyality;
//             var point=0;
//             if(orderdata.grandTotal >= minOrdLoyality){
//               point=point + orderdata.grandTotal * (setting.loyalityPercentage) /100;
//             }
//             else{
//               point=point;
//             }
//             orderdata.loyalty=point;
//             let loyaltyDetail={ 
//               point:point,
//               credited:true,
//               orderId:orderdata._id,
//               createdAt:new Date()
//             }
//             User.findById(orderdata.user, '-salt -password').exec(function(err,loyalty){
//               if(err){
//                 return handleError(err,res) 
//               }
//               else{
//                 loyalty.loyaltyPoints.push(loyaltyDetail);
//                 loyalty.totalLoyaltyPoints=loyalty.totalLoyaltyPoints + point;
//                 loyalty.save(function(err){
//                   if(err){
//                     return handleError(err,res);
//                   }
//                   else{
//                   }
//                 })
//               }
//             })
//           }
//         }
//       })
//     }
//     if(req.body.status == 'Cancelled'){
//       notifytext = 'Your order is cancelled,sorry for inconvenience.';
//       orderdata.userNotification.push({'status':'Your order is cancelled,sorry for inconvenience.','time':datedata}) 
//     }
//     orderdata.orderUpdatedCount = +(orderdata.orderUpdatedCount) +1;
//     orderdata.save(function(err){
//       if(err){
//         res.status(400).send({
//           message:'order couldn\'t placed.'
//         })
//       }
//       else{
//         async.waterfall([
//           function (done) {
//         crypto.randomBytes(20, function (err, buffer) {
//           var token = buffer.toString('hex');
//           done(err, token);
//         });
//       },
//       function (token, done, err) {
//         done(err, token);
//       },
//       function (token, done) {
//         var httpTransport = 'http://';
//         if (config.secure && config.secure.ssl === true) {
//           httpTransport = 'https://';
//         }
//         res.render(path.resolve('server/components/orderStatus/orderrequested'), {
//           notifytext:  notifytext,
//           name:  req.user.name,
//           appName: 'Restaurant SAS App',
//         }, function (err, emailHTML) {
//           done(err, emailHTML);
//         });
//       },
//       function (emailHTML, user, done) {
//         var mailOptions = {
//           to: req.user.email,
//           from: 'info@impnolife.org',
//           subject: 'Thank you for your order.',
//           html: emailHTML
//         };
//         mailgun.messages().send(mailOptions, function (err) {
//           if (!err) {
//             Order.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
//             .then(
//               res.json({
//                 _id:orderdata._id,
//                 message:'order successfully updated'})
//             )
//             .catch(handleError(res));
//           } else {
//             return res.status(400).send({
//               message: 'Failure sending email'
//             });
//           }
//         });
//       }
//       ], function (err) {
//         if (err) {
//           return handleError(err)
//         }
//       });
//       }
//     })
//   })
// }



// Deletes a Order from the DB
export function destroy(req, res) {
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


//Customer info as per restaurant id(it would also used to get csv and xl data export)
export function customerData(req, res){
  let point   = 0;
  let dataObj = {};
  let arrData = [];
  let restaurantID = req.params.id;
  //getting all user of a restaurant
  Order.find({'restaurantID':restaurantID}).distinct('user').exec(function (err, userids){
    if(err){
      //error occoured
      return handleError(res);
    }
    //while a restaurant has no user or customer
    if(userids.length==0){
      return res.status(200).send({message:'There is no any customer for this restaurant.'})
    }
    else{
      //getting all customers basic info
      User.find({_id:{$in:userids}},'contactNumber email name totalLoyaltyPoints').exec(function(err,userinfos){
        if(err){
          //error occoured
          return handleError(res);
        }
        else{
          let dataObj1;
          let find;
          for(let i=0;i<userinfos.length;i++){
            //getting a user order infos
            Order.find({'user':userinfos[i]._id}).exec(function(err,find){
              if(err){
                //error occoured
                return handleError(err)
              }
              if(!find){
                //while no order for a user
                return res.status(402).send({message:'data not found'})
              }
              else{
                //creating a wrapper object for response
                dataObj1={
                  data:userinfos[i],
                  ordercount:find.length
                }
                //pushing object into an array
                arrData.push(dataObj1)
                //while all done
                if(arrData.length==userinfos.length){
                  //sending response
                  res.json(arrData)
                }
              }
            })
          }
        }
      })
    }
  })
}

//Customer info as per location id(it would also used to get csv and xl data export)
export function customerDataByLocation(req, res){
  let point   = 0;
  let dataObj = {};
  let arrData = [];
  //getting location id by params
  let locationID = req.params.id;
  //getting all customer of a location
  Order.find({'location':locationID}).distinct('user').exec(function (err, userids){
    if(err){
      //error occoured
      return handleError(res);
    }
    if(userids.length == 0){
      //while got no customer
      return res.status(200).send({
        message:'There is no customer found for this location.'
      })
    }
    else{
      //getting all customer basic info
      User.find({_id:{$in:userids}},'contactNumber email name totalLoyaltyPoints').exec(function(err,userinfos){
        if(err){
          //error occoured
          return handleError(res);
        }
        else{
          let dataObj1;
          let find;
          //iterating all users or customers
          for(let i=0;i<userinfos.length;i++){
            //getting all orders of a location by user 
            Order.find({'location':locationID,'user':userinfos[i]._id}).exec(function(err,find){
              if(err){
                //error occoured
                return handleError(err)
              }
              if(!find){
                //while no user 
                return res.status(402).send({message:'data not found'})
              }
              else{
                //framing in an object for response
                dataObj1={
                  data:userinfos[i],
                  ordercount:find.length
                }
                //pushing all objects into an array
                arrData.push(dataObj1)
                //while all done
                if(arrData.length==userinfos.length){
                  //sending response
                  res.json(arrData)
                }
              }
            })
          }
        }
      })
    }
  })
}


//Dashboard data
export function dashboardData(req, res) {
  //getting restaurant id by params
  let restaurantID= req.params.id;
  let totalEarnedPrice =0;
  let date = new Date();
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  let thisMidnight = lastMidnight + 24 * 60 * 60 * 1000;
  let oneMonthBackMidnight = lastMidnight - 30 * 24 * 60 * 60 * 1000;
  var mongoose = require('mongoose');
  //changing type of restaurantID to objectId
  var id = mongoose.Types.ObjectId(restaurantID);
  //getting grouped data by day basis
  //for a restaurant between two timestamp
  Order.aggregate([
   { $match: { "restaurantID":id,createdAt: { $gt: new Date(oneMonthBackMidnight), $lt: new Date(thisMidnight) }} },     
    {
      $group: {_id:{ year:"$year",month:"$month",date:"$date"},data:{$sum:'$grandTotal' }},
    }
  ]).exec(function(err,data){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      let labelArray = [];
      let dataArray = [];
      if(data.length==0){
        //while no data found
        let data1 = {
          labels:[],
          datasets:[]
        }
        //sending response
        res.json(data1);
      }
      //iterating data array
      for(let i=0;i<data.length;i++){
        //framing all data 
        let label = data[i]._id.date + '/' +data[i]._id.month;
        labelArray.push(label);
        dataArray.push(data[i].data);
        if(i==data.length-1){
          let wrapperObj = {};
          let wrapperArray = [];
          wrapperObj={
            data:dataArray
          };
          wrapperArray.push(wrapperObj);
          let data = {
            labels:labelArray,
            datasets:wrapperArray
          }
          //sending response
          res.json(data);
        }
      }
    }
  });
}

//One day data
export  function oneDayData(req,res){
  //getting restaurant id by params
  let restaurantID= req.params.id;
  let totalEarnedPrice =0;
  let date = new Date();
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  let thisMidnight = lastMidnight + 24 * 60 * 60 * 1000;
  //today data
  //getting a restuarant orders between two dates
   Order.find({"restaurantID": restaurantID, createdAt: {$gt: lastMidnight, $lt: thisMidnight}}).exec(function (err, orders) {
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //sending response
      res.json(orders);
    }
  });
 }

//JSON to CSV data(ORDER data customized for days)
export  function csvData(req,res){
  //upperLimit represents today time
  //and lowerLimit is for till last day for user looking
  let upperLimit = req.body.upperLimit;
  let lowerLimit = req.body.lowerLimit;
  //getting all data between two dates of a restaurant
  Order.find({'restaurantID':req.params.id, createdAt: {$gt: lowerLimit, $lt: upperLimit}},{}).populate('user').exec(function(err,userdata){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //sending response
      res.json(userdata);
    }
  })
}

//Customer Search
export function customerSearch(req,res){
  let arrData = [];
  let query = {};
  //getting restaurant id
  let restaurantID = req.params.id;
  //dynamically creating matching criteria as per client side request
  query['$and']=[];
  //if filter with name
  query['$and'].push({'restaurantID':restaurantID});
  if(req.body.name!=undefined)
  {
    query['$and'].push({'userInfo.name':{'$regex': req.body.name,"$options": "i"}});
  }
  //if filter with contactNumber
  if(req.body.contactNumber!=undefined)
  {
    query['$and'].push({'userInfo.contactNumber':{'$regex': req.body.contactNumber,"$options": "i"}});
  }
  //if filter with email
  if(req.body.email!=undefined)
  {
    query['$and'].push({'userInfo.email':{'$regex': req.body.email,"$options": "i"}});
  }
  //getting all user data as per matching criteria
  Order.find(query).lean().distinct('user').exec(function(err,userData){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //iterating user data
      for(let i=0;i<userData.length;i++){
        //grouping users points individually
        User.aggregate([
          { $unwind: "$earnedPoints" },
          {
            $group:
            {
              _id :userData[i],
              totalPoints:{ $sum: '$earnedPoints.point' }
            }
          }
        ]).exec(function(err,data){
          if(err){
            //error occoured
            return handleError(res);
          }
          else{
            //getting all orders of a user from a restaurant
            Order.find({'restaurantID':restaurantID,'user':userData[i]}).lean().exec(function(err,finds){
            if(err){
              //error occoured
              return handleError(res);
            }
            else{
              //getting user infos
              User.findById(userData[i]).lean().exec(function(err,users){
                if(err){
                  //error occoured
                  return handleError(res);
                }
                else{
                  let objdata = {};
                  //wrapping raw response data into an object
                  objdata = {
                    id:users._id,
                    email:users.email,
                    name:users.name,
                    contactNumber:users.contactNumber,
                    EnrollmentDate:users.createdAt,
                    point:data[0].totalPoints,
                    orderfind:finds
                  }
                  //pushing objects into an array
                  arrData.push(objdata);
                  if(userData.length==arrData.length){
                    //sending response
                    res.json(arrData);
                  }
                }
              })
            }
           })
          }
        })
      }
    }
  })
}

//Order Search
export function orderSearchByLocationId(req,res){
  let location = req.params.id;
   let query = {};
    query['$and']=[];
    //if filter with name
    query['$and'].push({location:location});
    //if filter with orderStatus
    if(req.body.status!=undefined)
    {
      query['$and'].push({status:req.body.status});
    }
    //getting order data
    Order.find(query).exec(function(err,orders){
      if(err){
        //error occoured
        return handleError(res);
      }
      //No orders
      if(orders.length == 0){
        res.status(400).send({
          message:'There are no such document matching by required criteria.'
        })
      }
      else{
        //seding response
        res.json(orders);
      }
    });
}
export function orderSearch(req,res){
  //getting restaurant id
  let restaurantID = req.params.id;
  let query = {};
  query['$and']=[];
  //if filter with name
  query['$and'].push({restaurantID:restaurantID});
  if(req.body.name!=undefined)
  {
    query['$and'].push({'userInfo.name':{'$regex': req.body.name,"$options": "i"}});
  }
  //if filter with contactNumber
  if(req.body.contactNumber!=undefined)
  {
    query['$and'].push({'userInfo.contactNumber':{'$regex': req.body.contactNumber,"$options": "i"}});
  }
  //if filter with orderStatus
  if(req.body.status!=undefined)
  {
    query['$and'].push({status:req.body.status});
  }
  //upperLimit and lowerLimit bot indicates from and to
  //respectively(both in timestamp)
  if(req.body.upperLimit!=undefined)
  {
    query['$and'].push( { createdAt: { $gt:req.body.lowerLimit, $lt:req.body.upperLimit}});
  }
  //getting orders as per query criteria
  Order.find(query).exec(function(err,orders){
    if(err){
      //error occoured
      return handleError(res);
    }
    //No orders
    if(orders.length == 0){
      res.status(400).send({
        message:'There are no such document matching by required criteria.'
      })
    }
    else{
      //sending response
      res.json(orders);
    }
  });
}


//Api for delivery Boy
//How much delivery assigned to him.
export function allDelivery(req,res){
 //getting delivery boy orders
  Order.find({'deliveryBy':req.params.id},{earnedPoint:0, usedPoint:0, year:0, month:0, date:0, category:0, subcategory:0, user:0}).populate('deliveryBy', '-salt -password -__v -createdAt ').exec(function(err,deliveryData){
    if(err){
      //while error
      return handleError(res);
    }
    else{
      //sending response
      res.json(deliveryData);
    }
  })
}

//All pending delivery of a delivery Boy
export function pendingDelivery(req,res){
  //getting all orders of a delivery boy except Delivered
  Order.find({'deliveryBy':req.params.id,status: { $nin: [ 'Delivered'] }},'-earnedPoint -usedPoint -year -month -date -category -subcategory -user').populate('deliveryBy', '-salt -password -__v -createdAt ').exec(function(err,deliveryData){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //sending response
      res.json(deliveryData);
    }
  })
}

//All delivered order of a delivery Boy
export function deliveredDelivery(req,res){
  //getting upper limit and lower limit to get orders
  let lowerLimit = req.body.lowerLimit;
  let upperLimit = req.body.upperLimit;
  //applying searching query
  Order.find({'deliveryBy':req.params.id, createdAt: {$gt: lowerLimit, $lt: upperLimit},status: { $in: [ 'Delivered'] }},'-earnedPoint -usedPoint -year -month -date -category -subcategory -user').populate('deliveryBy', '-salt -password -__v -createdAt ').exec(function(err,deliveryData){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //sending response
      res.json(deliveryData);
    }
  })
}
 
//Get total daily sell of all seller
export function todaySell(req,res){
  //getting restaurant id by params
  let restaurantID= req.params.id;
  let totalEarnedPrice =0;
  let result = [];
  let date = new Date();
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  let thisMidnight = lastMidnight + 24 * 60 * 60 * 1000;
  //getting grouped grandtotal of a restaurant between two dates
  Order.aggregate([
   { $match: { createdAt: { $gt: new Date(lastMidnight), $lt: new Date(thisMidnight) }} },     
    {
      $group: {_id:{restaurantID:"$restaurantID"},data:{$sum:'$grandTotal' }},
    }
  ]).exec(function(err,data){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //iterating data array
      for(let i=0;i<data.length;i++){
        //framing for response
        let obj = {
          restaurantID:data[i]._id.restaurantID,
          amount:data[i].data
        };
        result.push(obj);
        if(i==data.length-1){
          //sending response
          res.json(result);
        }
      }
    }
  })
}



//JSON data which has to change in csv at client side
export function csvOrder(req,res){
  //required Flag
  let query = {};
  query['$and']=[];
  //if filter with name
  if(req.body.flag ==0)
  {
    query['$and'].push({location:req.body.location});
    //applying matching query
    Order.find(query).select({_id:1, orderID:1,userInfo:1, restaurantID:1, paymentOption:1, orderType:1, earnedPoint:1, grandTotal:1, __v:1, status:1}).populate('user','name email address').exec(function(err,data){
      if(err){
        //error occoured
        return handleError(res);
      }
      else{
        //sending response
        res.json(data);
      }
    })
  }
  else{
    //getting all orders
    Order.find().select({_id:1, orderID:1,userInfo:1, restaurantID:1, paymentOption:1, orderType:1, earnedPoint:1, grandTotal:1, __v:1, status:1}).populate('user','name email address').exec(function(err,data){
      if(err){
        //error occoured
        return handleError(res);
      }
      else{
        //sending response
        res.json(data);
      }
    })
  }
}

//DELIVERY BOY ONE DAY, SEVEN DAY AND ONE MONTH DATA
export function dayWeekMonthData(req,res){
  //getting delivery boy id
  let deliveryBoyId = req.params.id;
  let date = new Date();
  let midnight = date.setUTCHours(0,0,0,0);
  let nextMidnight = midnight + 24*60*60*1000;
  let sevenDaysBack = midnight - 7*24*60*60*1000;
  let oneMonthBack = nextMidnight - 30*24*60*60*1000;
  let todayData;
  let sevenDaysData;
  let oneMonthData;
  let result = {
    todayData: todayData,
    sevenDaysData: sevenDaysData,
    oneMonthData: oneMonthData
  };
  //getting orders of a delivery boy between two dates
  return Order.find({"deliveryBy":deliveryBoyId, assignedDate: {$gt: midnight, $lt: nextMidnight}},{assignedDate:1,_id:1,paymentOption:1,orderID:1,payableAmount:1,userInfo:1})
    .exec()
    .then(users => {
      //getting callback
      todayData = users;
      result.todayData = todayData;
      //getting orders of a delivery boy between two dates
      return Order.find({"deliveryBy":deliveryBoyId, assignedDate: {$gt: sevenDaysBack, $lt: midnight}},{assignedDate:1,_id:1,paymentOption:1,orderID:1,payableAmount:1,userInfo:1})
        .exec()
        .then(users => {
          //getting callback
          sevenDaysData = users;
          result.sevenDaysData = sevenDaysData;
          //getting orders of a delivery boy between two dates
          return Order.find({"deliveryBy":deliveryBoyId, assignedDate: {$gt: oneMonthBack, $lt: nextMidnight}},{assignedDate:1,_id:1,paymentOption:1,orderID:1,payableAmount:1,userInfo:1})
           .exec()
            .then(users => {
              //getting callback
              oneMonthData = users;
              result.OneMonthData = oneMonthData;
              //sending response
              res.status(200).json(result);
            }).catch(handleError(res));
        }).catch(handleError(res));
    }).catch(handleError(res));
}


//Get seven days orders and withdraw of a seller
//probably client side is not using this api,
//make sure and remove it
export function ordersAndWithdraw(req,res){
  //getting restaurant id by params
  let restaurantID = req.params.id;
  let date = new Date();
  let midnight = date.setUTCHours(0,0,0,0);
  let nextMidnight = midnight + 24*60*60*1000;
  let sevenDaysBack = midnight - 7*24*60*60*1000;
  let orderData;
  let withdrawData;
  let result = {
    orderData: orderData,
    withdrawData: withdrawData
  };
  //getting orders of a restaurant boy between two dates
  Order.find({"restaurantID":restaurantID, createdAt: {$gt: sevenDaysBack, $lt: midnight}}).exec(function(err,orderData){
    if(err){
      return handleError(res);
    }
    else{
      Payment.find({"restaurantID":restaurantID, createdAt: {$gt: sevenDaysBack, $lt: midnight}}).exec(function(err,withdrawData){
        if(err){
          return handleError(res);
        }
        else{
          result = {
            orderData: orderData,
            withdrawData: withdrawData
          }
          res.json(result);
        }
      })
    }
  })
}

export function orderAmountAndCount(req,res){
 let date = new Date();
 let midnight = date.setUTCHours(0,0,0,0);
 let nextMidnight = midnight + 24*60*60*1000;
 let sevenDaysBack = midnight - 7*24*60*60*1000;
 let result = [];
  //sort by amount
  //getting a single restaurant grouped grandTotal between two dates
  Order.aggregate([
    { $match: { createdAt: { $gt: new Date(sevenDaysBack), $lt: new Date(nextMidnight) }} },
    {
     $group: {_id:{restaurantID:"$restaurantID"},data:{$sum:'$grandTotal' },sum:{$sum:1 }},
    }
  ]).exec(function(err,data){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //getting user collection data
      User.populate(data, {path: '_id.restaurantID'}, function(err, populatedTransactions) {
        //iterating them
        for(let i=0;i<data.length;i++){
          //framing them into an object
          let obj = {
            restaurantID:data[i]._id.restaurantID._id,
            amount:data[i].data,
            orderCount:data[i].sum,
            restaurantName:data[i]._id.restaurantID.restaurantName,
            logo:data[i]._id.restaurantID.logo,
            contactPerson:data[i]._id.restaurantID.contactPerson,
            address:data[i]._id.restaurantID.address,
            city:data[i]._id.restaurantID.city,
            state:data[i]._id.restaurantID.state,
            zip:data[i]._id.restaurantID.zip,
            country:data[i]._id.restaurantID.country,
            contactNumber:data[i]._id.restaurantID.contactNumber
          };
          //push them into an array
          result.push(obj);
          if(i==data.length-1){
            //if flag= 1,sorting on basis of orderCount
            if(req.body.flag == 1){
              result.sort(function (a, b) {
                return b.orderCount-a.orderCount;
              });
              res.json(result);
            }
            //if flag= 0,sorting on basis of amount
            if(req.body.flag == 0){
            //sorting them on the basis of amount
              result.sort(function (a, b) {
                return b.amount-a.amount;
              });
              res.json(result);
            }
          }
        }
      });
    }
  });
}


//Get total earned amount as well as number of order in descending order(of all restaurants)
export function orderAmountAndfind(req,res){
  let date = new Date();
  let midnight = date.setUTCHours(0,0,0,0);
  let nextMidnight = midnight + 24*60*60*1000;
  let sevenDaysBack = midnight - 7*24*60*60*1000;
  let result = [];
  //sort by amount
  //getting grantotal grouped by two dates of a restaurant
  Order.aggregate([
    { $match: { createdAt: { $gt: new Date(sevenDaysBack), $lt: new Date(nextMidnight) }} },
    {
      $group: {_id:{restaurantID:"$restaurantID"},data:{$sum:'$grandTotal' },sum:{$sum:1 }},
    }
  ]).exec(function(err,data){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //getting reataurant basic info
      User.populate(data, {path: '_id.restaurantID'}, function(err, populatedTransactions) {
        //iterating them one by one
        for(let i=0;i<data.length;i++){
          //framing into object
          let obj = {
            restaurantID:data[i]._id.restaurantID._id,
            amount:data[i].data,
            orderCount:data[i].sum,
            restaurantName:data[i]._id.restaurantID.restaurantName,
            logo:data[i]._id.restaurantID.logo,
            contactPerson:data[i]._id.restaurantID.contactPerson,
            address:data[i]._id.restaurantID.address,
            city:data[i]._id.restaurantID.city,
            state:data[i]._id.restaurantID.state,
            zip:data[i]._id.restaurantID.zip,
            country:data[i]._id.restaurantID.country,
            contactNumber:data[i]._id.restaurantID.contactNumber
          };
          result.push(obj);
          if(i==data.length-1){
            //if flag= 1,sorting on basis of orderCount
            if(req.body.flag == 1){
              //sorting them on the basis of ordercount
              result.sort(function (a, b) {
                return b.orderCount-a.orderCount;
              });
              //sending response
              res.json(result);
            }
             //if flag= 0,sorting on basis of amount
            if(req.body.flag == 0){
              //sorting them on the basis of amount
              result.sort(function (a, b) {
                return b.amount-a.amount;
              });
              //sending response
              res.json(result);
            }
          }
        }
      })
    }
  })
}


var sendNotification = function(data) {
  console.log("here is the sendNotification function calling")
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic ZDcxOGM3NDQtN2I5Ny00YzVlLWIzZGEtZGIwZjVhNDQ1NTNk"
  };
  
 var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
 var https = require('https');
  var req = https.request(options, function(res) {  
   res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
 req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
 req.write(JSON.stringify(data));
  req.end();
};




//search by location name,order status and by customer name
export function search(req,res){
  let obj1={}
  let obj2 = {};
  let obj3 = {};
  let query = [];
  //if location
  if(req.body.locationId.length>0){
    obj1.location=req.body.locationId;
    query.push(obj1);
  }
  //if status
  if(req.body.status.length>0){
    obj2.status=req.body.status;
    query.push(obj2);
  }
  //if orderID
  if(req.body.orderId.length>0){
    obj3.orderID=req.body.orderId;
    query.push(obj3);
  }
  //searching orders as per query criteria
  Order.find({ $and:query},{}).exec(function(err,orderdata){
    if(err){
      //error occoured
      return handleError(res);
    }
    if(orderdata.length == 0){
      //while no order found matching query criteria
      let resdata = [];
      res.json(resdata);
    }
    else{
      //sending respo
      res.json(orderdata);
    }
  })
}


//all/month/one day earnings of a restaurant
export function restaurantdata(req,res){
  //getting restaurant id and changing them into string to object
  var restaurantId = mongoose.Types.ObjectId(req.params.id);
  let date = new Date();
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  let thisMidnight = lastMidnight + 24 * 60 * 60 * 1000;
  let oneMonthBackMidnight = lastMidnight - 30 * 24 * 60 * 60 * 1000;
  //grouping all payable amount on the basis of restaurant id
  Order.aggregate([
    { $match: { restaurantID:restaurantId} },
    { $group : {
      _id :null,
      data: { $sum: '$payableAmount' } ,
    }
  }
  ]).
  exec(function (err,allearnings) {
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //grouped payable amount of a restaurant between two dates
      Order.aggregate([
        { $match: { $and: [{ restaurantID:restaurantId},{createdAt: { $gt: new Date(lastMidnight), $lt: new Date(thisMidnight) }}]}},
        { $group : {
          _id :null,
          data: { $sum: '$payableAmount' } ,
        }
      }
      ]).
      exec(function (err,todayearning) {
        if(err){
          //error occoured
          return handleError(res);
        }
        else{
          //grouped payable amount of a restaurant between two dates
          Order.aggregate([
            { $match: { $and: [{ restaurantID:restaurantId},{createdAt: { $gt: new Date(oneMonthBackMidnight), $lt: new Date(thisMidnight) }}]}},
            { $group : {
              _id :null,
              data: { $sum: '$payableAmount' } ,
            }
          }
          ]).
          exec(function (err,onemonthearning) {
            if(err){
              //error occoured
              return handleError(res);
            }
            else{
              //for first page,send pageno 0,and then accordingly
              let skipval = 10 * req.params.pagenumber;
              //getting recent ten orders of a restaurant
              Order.find({restaurantID:restaurantId},{}).sort('-createdAt').skip(skipval).limit(10).exec(function(err,paginatedorders){
                if(err){
                  //error occoured
                  return handleError(res);
                }
                else{
                  //getting all orders count of matching criteria
                  Order.find({restaurantID:restaurantId},{}).exec(function(err,totalcount){
                    if(err){
                      //error occoured
                      return handleError(res);
                    }
                    else{
                      let totalpages = Math.floor(totalcount.length/10);
                      //framing them into an object
                      let resobj = {
                        totalearnings:allearnings[0].data,
                        onemonthearning:onemonthearning[0].data,
                        todayearning:todayearning[0].data,
                        paginatedorders:paginatedorders,
                        totalpages:totalpages+1
                      }
                      //sending response
                      res.json(resobj);
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}


//(all/month/one day) earnings of a location of a restaurant
export function locationorderdata(req,res){
  //getting location id from params and converting them into objectId
  var locationId = mongoose.Types.ObjectId(req.params.id);
  let date = new Date();
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  let thisMidnight = lastMidnight + 24 * 60 * 60 * 1000;
  let oneMonthBackMidnight = lastMidnight - 30 * 24 * 60 * 60 * 1000;
  //grouping all payable amount of a restaurant location
  Order.aggregate([
    { $match: { location:locationId} },
    { $group : {
      _id :null,
      data: { $sum: '$payableAmount' } ,
    }
  }
  ]).
  exec(function (err,allearnings) {
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //grouping all payable amount of a restaurant location between two dates
      Order.aggregate([
        { $match: { $and: [{ location:locationId},{createdAt: { $gt: new Date(lastMidnight), $lt: new Date(thisMidnight) }}]}},
        { $group : {
          _id :null,
          data: { $sum: '$payableAmount' } ,
        }
      }
      ]).
      exec(function (err,todayearning) {
        if(err){
          //error occoured
          return handleError(res);
        }
        else{
          //getting grouped payable amount of a location between two dates
          Order.aggregate([
            { $match: { $and: [{ location:locationId},{createdAt: { $gt: new Date(oneMonthBackMidnight), $lt: new Date(thisMidnight) }}]}},
            { $group : {
              _id :null,
              data: { $sum: '$payableAmount' } ,
            }
          }
          ]).
          exec(function (err,onemonthearning) {
            if(err){
              //error occoured
              return handleError(res);
            }
            else{
              //for first page,send pageno 0,and then accordingly
              let skipval = 10 * req.params.pagenumber;
              //getting recently added ten location
              Order.find({ location:locationId},{}).sort('-createdAt').skip(skipval).limit(10).exec(function(err,paginatedorders){
                if(err){
                  //error occoured
                  return handleError(res);
                }
                else{
                  //getting all order data of a location
                  Order.find({ location:locationId},{}).exec(function(err,totalcount){
                    if(err){
                      //error occoured
                      return handleError(res);
                    }
                    else{
                      let totalpages = Math.floor(totalcount.length/10);
                      //framing object for response
                      let resobj = {
                        totalearnings:allearnings[0].data,
                        onemonthearning:onemonthearning[0].data,
                        todayearning:todayearning[0].data,
                        paginatedorders:paginatedorders,
                        totalpages:totalpages+1
                      }
                      //sending response
                      res.json(resobj);
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

//list of orders of a restaurant between two dates
export function restaurantOrdersBtnDates(req,res){
  //getting restaurant Id
  var restaurantId = mongoose.Types.ObjectId(req.params.id);
  // putting lowerlimit and upperlimit for query processing
  var lowerlimit =req.params.lowerlimit;
  var upperlimit = req.params.upperlimit;
  //get all orders of a restaurant between two days
  Order.find({ 'restaurantID':restaurantId,createdAt : { $gte:req.params.lowerlimit, $lte:req.params.upperlimit}},{}).exec(function(err,orderdata){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //sending response
      res.json(orderdata)
    }
  })
}


//list of orders of a restaurant between two dates
export function locationOrdersBtnDates(req,res){
  //getting location id
  var locationId = mongoose.Types.ObjectId(req.params.id);
  // putting lowerlimit and upperlimit for query processing
  var lowerlimit =req.params.lowerlimit;
  var upperlimit = req.params.upperlimit;
  //get all orders of a location between two days
  Order.find({'location':locationId,createdAt : { $gte:req.params.lowerlimit, $lte:req.params.upperlimit}},{}).exec(function(err,orderdata){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //sending response
      res.json(orderdata)
    }
  })
}

// //get customer by their name
export function searchcustomer(req,res){
  //getting coustomer name by params
  let customername = req.params.customername;
  //searching user by name using regular expression in a restaurant 
  Order.find({'restaurantID':req.params.id,"userInfo.name":{'$regex': customername,"$options": "i"}}, '-salt -password').exec(function(err,resdata){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //sending response
      res.json(resdata)
    }
  })
}

//get a list of count infos of a restaurant
export function restaurantCount(req,res){
  //getting restaurant id by params
  let restaurantID = req.params.restaurantId;
   let date = new Date();
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  let thisMidnight = lastMidnight + 24 * 60 * 60 * 1000;
  let oneMonthBackMidnight = lastMidnight - 30 * 24 * 60 * 60 * 1000;
  //getting all orders of a restaurant whose status is Delivered
  Order.find({'restaurantID':restaurantID,status:'Delivered'},{}).exec(function(err,allorders){
    if(err){
      return handleError(res);
    }
    else{
       //getting all orders of a restaurant whose status is Delivered between two dates
      Order.find({'restaurantID':restaurantID,status:'Delivered',createdAt:{$gt:new Date(oneMonthBackMidnight),$lt:new Date(thisMidnight)}},{}).exec(function(err,onemonthorders){
        if(err){
          return handleError(res);
        }
        else{
           //getting all orders of a restaurant whose status is Delivered  between two dates
          Order.find({'restaurantID':restaurantID,status:'Delivered',createdAt:{$gt:new Date(lastMidnight),$lt:new Date(thisMidnight)}},{}).exec(function(err,thisdayorders){
            if(err){
              //error occoured
              return handleError(res);
            }
            else{
              //framing for response
              let resobj={
                allorders:allorders.length,
                onemonthorders:onemonthorders.length,
                todayorders:thisdayorders.length
              }
              //send response
              res.json(resobj);
            }
          })
        }
      })
    }
  })
}


//get a list of count infos of a location
export function locationCount(req,res){
  //getting location id by params
  let location = req.params.id;
  let date = new Date();
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  let thisMidnight = lastMidnight + 24 * 60 * 60 * 1000;
  let oneMonthBackMidnight = lastMidnight - 30 * 24 * 60 * 60 * 1000;
  //getting a list of orders of a location whose status is delivered
  Order.find({'location':location,status:'Delivered'},{}).exec(function(err,allorders){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //getting all orders of a restaurant whose status is Delivered between two dates
      Order.find({'location':location, status:'Delivered', createdAt:{$gt:new Date(oneMonthBackMidnight),$lt:new Date(thisMidnight)}},{}).exec(function(err,onemonthorders){
        if(err){
          //error occoured
          return handleError(res);
        }
        else{
          //getting all orders of a restaurant whose status is Delivered between two dates
          Order.find({'location':location,status:'Delivered', createdAt:{$gt:new Date(lastMidnight),$lt:new Date(thisMidnight)}},{}).exec(function(err,thisdayorders){
            if(err){
              //error occoured
              return handleError(res);
            }
            else{
              //created object for response
              let resobj={
                allorders:allorders.length,
                onemonthorders:onemonthorders.length,
                todayorders:thisdayorders.length
              }
              //sending response
              res.json(resobj);
            }
          })
        }
      })
    }
  })
}

//--------SUPER ADMIN ACCESSIBLE APIS-----------------//

//get a list of restaurant collection of a month along with some count infos
export function allRestaurantCollectionInfos(req,res){
  let date = new Date();
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  let thisMidnight = lastMidnight + 24 * 60 * 60 * 1000;
  let labelArray  = [];
  let dataArray    = [];
  let oneMonthBackMidnight = lastMidnight - 30 * 24 * 60 * 60 * 1000;
  //get all restaurant grandTotal between two dates
  Order.aggregate([
   { $match: { createdAt: { $gt: new Date(oneMonthBackMidnight), $lt: new Date(thisMidnight) }} },     
    {
      $group: {_id:{restaurantName:"$restaurantName"},data:{$sum:'$grandTotal' }},
    }
  ]).exec(function(err,data){
    if(err){
      //error occoured
      return handleError(res,err);
    }
    if(data.length==0){
      //while no data found
      result();
    }
    else{
      //iterating all data
      for(var i=0;i<data.length;i++){
        var label = data[i]._id.restaurantName;
        labelArray.push(label);
        dataArray.push(data[i].data);
        //when iteration done
        if(i==data.length-1){
          result();
        }
      }
    }
  })
  function result(){
    // get all owners count of app
    User.find({role:'Owner'},{}).exec(function(err,ownercount){
      if(err){
        //error occoured
        return handleError(res);
      }
      else{
        // get all Users count of app
        User.find({role:'User'},{}).exec(function(err,usercount){
          if(err){
            //error occoured
            return handleError(res);
          }
          else{
            //get all orders count
            Order.find().exec(function(err,ordercount){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //wrapping all data into an object
                let data = {
                  labels:labelArray || [],
                  datasets:dataArray || [],
                  ownercount:ownercount.length,
                  usercount:usercount.length,
                  ordercount:ordercount.length
                }
                //sending response
                res.json(data);
              }
            })
          }
        })
      }
    })
  }
}
//get one month earnings of a single restaurant
export function singleRestaurantCollInfos(req,res){
  let date = new Date();
  let restaurantID = mongoose.Types.ObjectId(req.params.restaurantId);
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  let thisMidnight = lastMidnight + 24 * 60 * 60 * 1000;
  let oneMonthBackMidnight = lastMidnight - 30 * 24 * 60 * 60 * 1000;
 //getting a restaurant daily basis grand total between two dates
  Order.aggregate([
   { $match: {"restaurantID":restaurantID, createdAt: { $gt: new Date(oneMonthBackMidnight), $lt: new Date(thisMidnight) }} },     
    {
      $group: { _id:{year:"$year",month:"$month",date:"$date"},
      data:{$sum:'$grandTotal' }},
    }
  ]).exec(function(err,data){
    if(err){
      //error occoured
      return handleError(res,err);
    }
    else{
      //while data
      if(data.length>0){
        let labelArray = [];
        let dataArray = [];
        //iterating data array
        for(let i=0;i<data.length;i++){
          let label = data[i]._id.date + '/' +data[i]._id.month;
          labelArray.push(label);
          dataArray.push(data[i].data);
          //while data array iteration done
          if(i==data.length-1){
            //getting all orders of a restaurant
            Order.find({"restaurantID":restaurantID},{}).exec(function(err,ordercount){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //getting all categories of a restaurant
                Category.find({"restaurantID":restaurantID},{}).exec(function(err,categorycount){
                  if(err){
                    //error occoured
                    return handleError(res);
                  }
                  else{
                    //getting all products of a restaurant
                    Product.find({"restaurantID":restaurantID},{}).exec(function(err,productcount){
                      if(err){
                        //error occoured
                        return handleError(res);
                      }
                      else{
                        //getting all customers of a restaurant
                        Order.find({'restaurantID':restaurantID}).distinct('user').exec(function(err,usercount){
                          if(err){
                            //error occoured
                            return handleError(res);
                          }
                          else{
                            //getting all locations of a restaurant
                            Location.find({'restaurantID':restaurantID}).exec(function(err,locationcount){
                              if(err){
                                //error occoured
                                return handleError(res);
                              }
                              else{
                                //wrapping all data into an object
                                let data = {
                                  labels:labelArray,
                                  datasets:dataArray,
                                  ordercount:ordercount.length,
                                  categorycount:categorycount.length,
                                  productcount:productcount.length,
                                  locationcount:locationcount.length,
                                  usercount:usercount.length
                                }
                                //sending response
                                res.json(data);
                              }
                            })
                          }
                        }) 
                      }
                    })
                  }
                })
              }
            })
          }
        }
      }
      else{
        let labelArray = [];
        let dataArray = [];
        //getting all orders of a restaurant
        Order.find({"restaurantID":restaurantID},{}).exec(function(err,ordercount){
          if(err){
            //error occoured
            return handleError(res);
          }
          else{
            //getting all categories of a restaurant
            Category.find({"restaurantID":restaurantID},{}).exec(function(err,categorycount){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //getting all products of a restaurant
                Product.find({"restaurantID":restaurantID},{}).exec(function(err,productcount){
                  if(err){
                    //error occoured
                    return handleError(res);
                  }
                  else{
                    //getting all customers of a restaurant
                    Order.find({'restaurantID':restaurantID}).distinct('user').exec(function(err,usercount){
                      if(err){
                        //error occoured
                        return handleError(res);
                      }
                      else{
                        //getting all locations of a restaurant
                        Location.find({'restaurantID':restaurantID}).exec(function(err,locationcount){
                          if(err){
                            //error occoured
                            return handleError(res);
                          }
                          else{
                            //framing all data into an object
                            let data = {
                              labels:labelArray,
                              datasets:dataArray,
                              ordercount:ordercount.length,
                              categorycount:categorycount.length,
                              productcount:productcount.length,
                              locationcount:locationcount.length,
                              usercount:usercount.length
                            }
                            //sending response
                            res.json(data);
                          }
                        })
                      }
                    }) 
                  }
                })
              }
            })
          }
        })
      }
    }
  })
}


//get one month earnings of a single location
export function singleLocationCollInfos(req,res){
  let date = new Date();
  //getting location id 
  let location = mongoose.Types.ObjectId(req.params.locationId);
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  let thisMidnight = lastMidnight + 24 * 60 * 60 * 1000;
  let oneMonthBackMidnight = lastMidnight - 30 * 24 * 60 * 60 * 1000;
  //getting grant total of a location between two dates whose status is
  //delivered on daily basis
  Order.aggregate([
   { $match: {"location":location, status:'Delivered',createdAt: { $gt: new Date(oneMonthBackMidnight), $lt: new Date(thisMidnight) }} },     
    {
      $group: { _id:{year:"$year",month:"$month",date:"$date"},
      data:{$sum:'$grandTotal' }},
    }
  ]).exec(function(err,data){
    if(err){
      //error occoured
      return handleError(res,err);
    }
    else{
      if(data.length==0){
        //get orders count of a location
        Order.find({"location":location},{}).exec(function(err,ordercount){
          if(err){
            //error occoured
            return handleError(res);
          }
          else{
            //get categories count of a location
            Category.find({"location":location},{}).exec(function(err,categorycount){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //get products count of a location
                Product.find({"location":location},{}).exec(function(err,productcount){
                  if(err){
                    //error occoured
                    return handleError(res);
                  }
                  else{
                    //get locations count of a location
                    Order.find({'location':location}).distinct('user').exec(function(err,usercount){
                      if(err){
                        //error occoured
                        return handleError(res);
                      }
                      else{
                        //framing all data in an object
                        let data = {
                          labels:[],
                          datasets:[],
                          ordercount:ordercount.length,
                          categorycount:categorycount.length,
                          productcount:productcount.length,
                          usercount:usercount.length
                        }
                        //sending response
                        res.json(data);
                      }
                    }) 
                  }
                })
              }
            })
          }
        })
      }
      else{
      let labelArray = [];
      let dataArray = [];
      //iterating data array
      for(let i=0;i<data.length;i++){
        let label = data[i]._id.date + '/' +data[i]._id.month;
        labelArray.push(label);
        dataArray.push(data[i].data);
        //when all done
        if(i==data.length-1){
          let data={
          data:dataArray
          }
          let rawArray =[];
          rawArray.push(data);
          //getting orders count of a location
          Order.find({"location":location},{}).exec(function(err,ordercount){
            if(err){
              //error occoured
              return handleError(res);
            }
            else{
              //getting categories count of a location
              Category.find({"location":location},{}).exec(function(err,categorycount){
                if(err){
                  //error occoured
                  return handleError(res);
                }
                else{
                  //getting products count of a location
                  Product.find({"location":location},{}).exec(function(err,productcount){
                    if(err){
                      //error occoured
                      return handleError(res);
                    }
                    else{
                      //getting users count of a location
                      Order.find({'location':location}).distinct('user').exec(function(err,usercount){
                        if(err){
                          //error occoured
                          return handleError(res);
                        }
                        else{
                          //framing all data into an array
                          let data = {
                            labels:labelArray || [],
                            datasets:rawArray || [],
                            ordercount:ordercount.length || 0,
                            categorycount:categorycount.length || 0,
                            productcount:productcount.length || 0,
                            usercount:usercount.length   || 0
                          }
                          //sending response
                          res.json(data);
                        }
                      }) 
                    }
                  })
                }
              })
            }
          })
        }
      }
    }
      
    }
  })
}

export function customerSerchByName(req, res){
  let point   = 0;
  let dataObj = {};
  let arrData = [];
  //searching a user of a location by regular expression
  Order.find({"userInfo.name": { $regex:req.body.name,$options: 'i' },'location':req.params.id}).distinct('user').exec(function (err, userids){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //getting all users info
      User.find({_id:{$in:userids}},'-salt -password -earnedPoints -newAddress').exec(function(err,userinfos){
        if(err){
          //error occoured
          return handleError(res);
        }
        else{
          let dataObj1;
          let count;
          //iterating all user infos
          for(let i=0;i<userinfos.length;i++){
            //getting a user total orders
            Order.count({'user':userinfos[i]._id}).exec(function(err,count){
              if(err){
                //error occoured
                return handleError(err)
              }
              if(!count){
                //while no data found
                return res.status(404).send({message:'data not found'})
              }
              else{
                //framing data into object
                dataObj1={
                  data:userinfos[i],
                  count:count
                }
                //pushing them into an array
                arrData.push(dataObj1)
                //when all done
                if(arrData.length==userinfos.length){
                  //sending them as response
                  res.json(arrData)
                }
              }
            })
          }
        }
      })
    }
  })
}

//************* orderAmountAndCount
export function customerSerchByNamebyrestaurant(req, res){
  let point   = 0;
  let dataObj = {};
  let arrData = [];
  //getting restaurant id by params
  let restaurantID = req.params.id;
  //searching user ids by their name of a restaurant
  Order.find({"userInfo.name": { $regex:req.body.name,$options: 'i' },'restaurantID':req.params.id}).distinct('user').exec(function (err, userids){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //getting all user infos 
      User.find({_id:{$in:userids}},'-salt -password -earnedPoints -newAddress').exec(function(err,userinfos){
        if(err){
          //error occoured
          return handleError(res);
        }
        else{
          let dataObj1;
          let count;
          //iterating userinfos 
          for(let i=0;i<userinfos.length;i++){
            //getting order count for a user 
            Order.count({'user':userinfos[i]._id}).exec(function(err,count){
              if(err){
                //error occoured
                return handleError(err)
              }
              if(!count){
                //while no order found
                return res.status(402).send({message:'data not found'})
              }
              else{
                //framing them into an object
                dataObj1={
                  data:userinfos[i],
                  count:count
                }
                //pushing them into an array
                arrData.push(dataObj1)
                if(arrData.length==userinfos.length){
                  //sending response
                  res.json(arrData)
                }
              }
            })
          }   
        }
      })
    }
  })
}


 