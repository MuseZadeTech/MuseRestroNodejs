"use strict";
//changePassword  ownerList addAddress countdata templateforgetpassword upsert facebook me newlyAddedManagers
import User from "./user.model";
import config from "../../config/environment";
import Category from "../category/category.model";
import Product from "../product/product.model";
import Order from "../order/order.model";
import passport from "passport";
import Carddetail from "../carddetail/carddetail.model";
var mongoose = require("mongoose");
import jwt from "jsonwebtoken";
var Mails = require("../../mail");
var Utils = require("../../util");
var multiparty = require("multiparty");
var path = require("path");
var cloudinary = require("cloudinary");
var nodemailer = require("nodemailer");
var smtpConfig = {
  host: "email-smtp.us-west-2.amazonaws.com",
  port: 587,
  //secure: true, // use SSL
  auth: {
    user: "AKIAJQQCVESBWY53KGZA",
    pass: "Aq05JPK8+D9QALlP9owzrMMzeiks7o3UvJIZnMP+KsJ+"
  }
};
var transport = nodemailer.createTransport(smtpConfig);
var AWS = require("aws-sdk");
//SMS(OTP) config
// SMS Config
AWS.config.update({
  secretAccessKey: "5jvnKMLaa00xgl6Hpn+j26GTPFT/xVdcSKJ44Lor",
  accessKeyId: "AKIAJG474C2ZMUHBY72A"
});

//SMS
AWS.config.region = "us-west-2";
var sns = new AWS.SNS();
// Include NPM
var async = require("async");
var crypto = require("crypto");
var path = require("path");
// Email Config
//var nodemailer = require('nodemailer');
var api_key = "key-7fa9edb1b8f46cc6d5995448cd733241";
var domain = "impnolife.org";

var mailgun = require("mailgun-js")({
  apiKey: api_key,
  domain: domain
});

//Cloudinary Image Upload Config
cloudinary.config({
  cloud_name: "impnolife",
  api_key: "893162174727146",
  api_secret: "walL7KgGAwZrpjhajAk1BzBjFR0"
});
function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}
function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}
function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync().spread(updated => {
      return updated;
    });
  };
}
function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync().then(() => {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}
//**********get new address from a user document
export function getaddress(req, res) {
  User.findById(req.user._id, "-salt -password").exec(function(err, address) {
    if (err) {
      return handleError(res);
    }
    if (!address) {
      return res.status(404).send({ message: "data not found" });
    }
    res.send(address.newAddress);
  });
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  //never give salt and password in res
  return User.find({}, "-salt -password -__v")
    .exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}
export function allUserPlateform(req, res) {
  return User.find(
    { "userFromWhichApp.id": req.params.id },
    "name  email contactNumber totalLoyaltyPoints"
  )
    .exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

// Registration
export function create(req, res) {
  var newUser = new User(req.body);
  var email = req.body.email;
  newUser.provider = "local";
  newUser.role = req.body.role || "User";
  if (newUser.role == "User") {
    newUser.totalLoyaltyPoints = 0;
    newUser.loyaltyPoints.push({
      point: 0
    });
    User.findOne(
      { email: newUser.email, "userFromWhichApp.id": { $exists: true } },
      {}
    ).exec(function(err, user) {
      if (err) {
        return handleError(err);
      }
      if (!user) {
        newUser.userFromWhichApp.push({ id: req.body.restId });
        delete newUser.restId;
        newUser
          .save()
          .then(function(user) {
            Mails.welcomeMail(user.name, user.email).then(function(d) {});
            res.send({
              _id: user._id,
              message:
                "An email has been sent to the provided email with further instructions."
            });
          })
          .catch(validationError(res));
      } else {
        user.userFromWhichApp.push({ id: req.body.restId });
        user
          .save()
          .then(function(user) {
            Mails.welcomeMail(user.name, user.email).then(function(d) {});
            res.send({
              _id: user._id,
              message:
                "An email has been sent to the provided email with further instructions."
            });
          })
          .catch(validationError(res));
      }
    });
  } else {
    if (req.body.role == "Owner") {
      newUser.status = false;
    }
    newUser
      .save()
      .then(function(user) {
        var token = jwt.sign({ _id: user._id }, config.secrets.session, {
          expiresIn: 600 * 60 * 5
        });
        res.send({ token });
      })
      .catch(validationError(res));
  }
}

//*******forget password with template
export function templateforgetpassword(req, res) {
  User.findOne({ email: req.body.email }).exec(function(err, user) {
    if (err) {
      return handleError(res);
    }
    if (!user) {
      return res.status(404).send({
        message: "There is no User with this email id."
      });
    } else {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 10
      });
      var randomNo = Math.floor(Math.random() * 900000) + 100000;
      user.forgetPasswordNo = randomNo;
      user.save(function(err) {
        if (err) {
          return handleError(err);
        } else {
          Mails.forgetMail(user.email, randomNo).then(function(d) {});
          res.send({ message: "Otp sent on your email", token: token });
        }
      });
    }
  });
}

//verification for forget password
export function otpVerification(req, res) {
  var email = req.user.email;
  var otp = req.body.otp;
  User.findOne({ email: email }, "-salt -password").exec(function(err, user) {
    if (err) {
      return handleError(err);
    } else {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 10
      });
      if (user.forgetPasswordNo == otp) {
        res.status(200).send({
          token: token,
          message: "your otp is verified."
        });
      } else {
        res.status(400).send({
          message: "your otp is mismatched"
        });
      }
    }
  });
}

//if otp is verified ,then user can update their password
export function ResetPassword(req, res) {
  var email = req.user.email;
  var newPassword = req.body.newPass;
  User.findOne({ email: email }, "-salt -password").exec(function(err, users) {
    if (err) {
      return handleError(res);
    } else {
      users.password = newPassword;
      users.forgetPasswordNo = Math.floor(Math.random() * 900000) + 100000;
      return users.save(function(err, users) {
        if (err) {
          return handleError(res);
        }
        var token = jwt.sign({ _id: users._id }, config.secrets.session, {
          expiresIn: 60 * 60 * 5
        });
        let tokendata = {
          token: token,
          message: "new password sucessfully updated"
        };
        res.json(tokendata);
      });
    }
  });
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  //getting user id by param
  var userId = req.params.id;
  //find user by their id
  return User.findById(userId, "-salt -password -__v").exec(function(
    err,
    userdata
  ) {
    //if error
    if (err) {
      return handleError(res);
    } else {
      //sending response
      res.json(userdata);
    }
  });
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  //getting user id,old password and new password
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  //getting user data
  return User.findById(userId)
    .exec()
    .then(user => {
      //checking whether oldpassword value is same or not
      //if it's matched
      if (user.authenticate(oldPass)) {
        //then update this by user requested new password req.params
        user.password = newPass;
        //update those changes to database
        return user
          .save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      }
      //if old password value didn't matched by existing password
      //denied user request and send some error message
      else {
        return res.status(403).end();
      }
    });
}

// Upserts the given user in the DB at the specified ID
export function upsert(req, res) {
  User.findOne({ _id: req.params.id, email: req.body.email }, function(
    err,
    user
  ) {
    if (err) {
      return handleError(err);
    }
    if (!user) {
      User.findOne({ email: req.body.email }, function(err, d) {
        if (err) {
          return handleError(err);
        }
        if (!d) {
          update();
        } else {
          res.send({ message: "Email already exist" });
        }
      });
    } else {
      update();
    }
  });
  function update() {
    let test = req.body.sentMail;
    let userStatuActivation;
    delete req.body.sentMail;
    User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: false
    }).exec(function(err, user) {
      if (err) {
        return handleError(err);
      }
      if (test && test == "NO") {
        res.send({ message: "updated sucessfully" });
      } else {
        if (req.body.activationStatus != undefined) {
          if (req.body.activationStatus == true) {
            userStatuActivation = "  Aactivated! welcome.";
          }
          if (req.body.activationStatus == false) {
            userStatuActivation = "  Deactivated sorry to inform you.";
          }
          Mails.accountActivateAndDeactivateMail(
            user.name,
            user.email,
            userStatuActivation
          ).then(function(d) {});
          res.send({ message: userStatuActivation });
        } else {
          res.send({ message: "updated sucessfully" });
        }
      }
    });
  }
}

// Upserts the given user in the DB at the specified ID
export function updateMe(req, res) {
  return User.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: false
  })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//Get User Info(By Admin)
export function userData(req, res, next) {
  var userId = req.params.id;
  //getting a single user info
  return (
    User.findOne({ _id: userId }, { salt: false, password: false, __v: false })
      .exec()
      .then(user => {
        // don't ever give out the password or salt
        //if no any user exists by that requested id
        if (!user) {
          return res.status(400).send({});
        }
        //if got callback
        //sending user info
        res.json(user);
      })
      //handling error
      .catch(err => next(err))
  );
}

//Add an address in the array of newAddress(USER)
export function addAddress(req, res) {
  console.log("address" + JSON.stringify(req.body));
  //getting user id by token data
  var userId = req.user._id;
  console.log("userId................" + userId);
  User.findById(userId, "-password -salt").exec(function(err, userdata) {
    if (err) {
      return handleError(res);
    } else {
      //let obj=userdata.toJSON()
      userdata.newAddress.push(req.body);
      //userdata.newAddress=obj.newAddress;
      userdata.save(function(err, done) {
        if (err) {
          console.log("err" + err);
          return handleError(res);
        } else {
          res.send(done);
        }
      });
    }
  });
}

//Add an Account in the array of newAccountDetails(USER)
export function addNewAccountDetail(req, res) {
  //getting user id from user token data
  var userId = req.user._id;
  //getting user data by user id
  User.findById(userId).exec(function(err, userdata) {
    //if got some error
    if (err) {
      return handleError(res);
    }
    //after getting cb pushing requested newCardNumber to newCardNumber array
    else {
      userdata.newCardNumber.push(req.body.newCardNumber);
      //updating user data
      userdata.save(function(err, done) {
        //if got some error
        if (err) {
          return handleError(res);
        }
        //sending response
        else {
          res.json(userdata);
        }
      });
    }
  });
}

//Update user address in the array of newAddress(USER)
export function updateAddress(req, res) {
  //getting user id by user token
  var userId = req.user._id;
  //that index of array which has to update
  var index = parseInt(req.params.index);
  User.findById(userId).exec(function(err, userdata) {
    //if got some error
    if (err) {
      return handleError(res);
    }
    //replacing  user newAddress by requested object for a particular index
    else {
      userdata.newAddress.splice(index, 1);
      userdata.newAddress.push(req.body.addAddress);
      //userdata.newAddress[index] = req.body.addAddress;
      //updating those changes to database
      userdata.save(function(err) {
        //if got error
        if (err) {
          return handleError(res);
        }
        //sending response
        else {
          console.log("ssssssssfg" + JSON.stringify(userdata));
          res.json(userdata);
        }
      });
    }
  });
}

//Update card detail in the array of new card number(USER)
export function updateNewAccountDetail(req, res) {
  //getting user id by user token
  var userId = req.user._id;
  //getting index of array which has to change
  let index = parseInt(req.params.index);
  //getting user document
  User.findById(userId).exec(function(err, userdata) {
    //if got some error
    if (err) {
      return handleError(res);
    } else {
      //updating card number for a specific index
      userdata.newCardNumber[index] = req.body.newCardNumber;
      //updating those changes in db
      userdata.save(function(err, done) {
        //while got some error
        if (err) {
          return handleError(res);
        } else {
          //sending response
          res.json(userdata);
        }
      });
    }
  });
}

//Delete an address from array of Address(USER)
export function deleteAddress(req, res) {
  //getting index of newAddress array which has to be deleted.
  let index = req.params.index;
  //getting user id by token data
  let userId = req.user._id;
  //getting user data
  User.findById(userId).exec(function(err, userdata) {
    //while got error
    if (err) {
      return handleError(res);
    } else {
      //deleting an address of a particular index
      userdata.newAddress.splice(index, 1);
      //after deleting updating db
      userdata.save(function(err, done) {
        //if got error
        if (err) {
          return handleError(res);
        }
        //sending response
        else {
          res.json(userdata);
        }
      });
    }
  });
}

//Delete a single card number from array of card (USER)
export function deleteNewAccountDetail(req, res) {
  //getting an index of newCardNumber which has to delete
  let index = req.body.index;
  //getting user id by token
  let userId = req.user._id;
  //getting user data
  User.findById(userId).exec(function(err, userdata) {
    if (err) {
      return handleError(res);
    } else {
      //deleting a card number from array of card numbers
      userdata.newCardNumber.splice(index, 1);
      //updating changes to db
      userdata.save(function(err, done) {
        //while error
        if (err) {
          return handleError(res);
        } else {
          //sending response
          res.json(userdata);
        }
      });
    }
  });
}
/**
 * Get my info
 */
export function me(req, res, next) {
  //get user id by token data
  var userId = req.user._id;
  //getting user info
  return User.findOne(
    { _id: userId },
    { salt: false, password: false, __v: false }
  )
    .populate("restaurantID", "restaurantName logo")
    .exec()
    .then(user => {
      // don't ever give out the password or salt
      //if no such user doc by that id
      if (!user) {
        return res.status(401).end();
      }
      //in case of success,sending response
      res.json(user);
    })
    .catch(err => next(err));
}

//get all staff of a restaurant
export function allStaff(req, res) {
  console.log("hitting");
  return User.find(
    { restaurantID: req.user._id, role: { $nin: ["Owner"] } },
    "-salt -password"
  )
    .exec()
    .then(users => {
      //sending response
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

//Get a user points--
export function userPoints(req, res) {
  //getting user id by token data
  let userId = req.user._id;
  User.aggregate([
    { $unwind: "$earnedPoints" },
    {
      $group: {
        _id: userId,
        totalPoints: { $sum: "$earnedPoints.point" }
      }
    }
  ]).exec(function(err, data) {
    //if error occoured
    if (err) {
      return handleError(res);
    } else {
      //sending response
      res.json(data);
    }
  });
}

//User contact number verification
export function contactNoVerify(req, res) {
  //getting user document
  User.findById(req.user._id).exec(function(err, userdata) {
    if (err) {
      return handleError(res);
    } else {
      //generating random number
      var num = Math.floor(Math.random() * 900000) + 100000;
      userdata.verificationCode = num;
      //creating an object to send
      var params = {
        Message:
          "Hello " + userdata.name + "," + " Your generated OTP is:" + num,
        MessageStructure: "string",
        PhoneNumber: "+" + userdata.countryCode + userdata.contactNumber
      };
      //sending a text to contact number
      sns.publish(params, function(err, data) {
        if (err) {
          res.status(403).json({
            message: err
          });
        } else {
          //updating user doc for contact number verification
          userdata.save(function(err) {
            //while error
            if (err) {
              return handleError(res);
            } else {
              //sent response
              res.status(200).send({
                message: "Verification code is sent to the registered number."
              }); // successful response
            }
          });
        }
      });
    }
  });
}

// account activating
export function accountActivation(req, res) {
  //getting otp,sent by user
  let userVerificationNumber = req.body.otp;
  //getting user doc
  User.findById(req.user._id).exec(function(err, userdata) {
    //while error occoured
    if (err) {
      return handleError(res);
    } else {
      //if user otp is matched by db verification code
      if (userdata.verificationCode == userVerificationNumber) {
        //user account activating
        userdata.status = 1;
        //updating changes to db
        userdata.save(function(err) {
          //handling error
          if (err) {
            return handleError(res);
          } else {
            //sending response to user that your account has been activated
            res.status(200).send({
              message: "Your account is activated."
            }); // successful response
          }
        });
      } else {
        //while account couldn't be activated
        res.status(400).send({
          message: "your account could not be activated."
        });
      }
    }
  });
}

//get a list of reastaurant for all users
export function restaurantList(req, res) {
  //query
  User.find(
    { role: "Owner" },
    {
      _id: 1,
      restaurantName: 1,
      logo: 1,
      name: 1,
      email: 1,
      address: 1,
      contactNumber: 1,
      status: 1
    }
  ).exec(function(err, restaurantlist) {
    if (err) {
      //while error occoured
      return handleError(res);
    } else {
      //sending response
      res.json(restaurantlist);
    }
  });
}

//varify seller( varified/disable)
export function verifySeller(req, res) {
  //getting seller id
  let sellerId = req.params.id;
  //selecting query
  User.findById(sellerId).exec(function(err, seller) {
    if (err) {
      //error handling
      return handleError(res);
    } else {
      //update status
      seller.status = req.body.status;
      //update changes
      seller
        .save()
        .then(function(user) {
          //sending success response
          res.status(200).send({
            message: "Seller Account updated as per request."
          });
        })
        .catch(validationError(res));
    }
  });
}

//Getting a restaurant basic info
export function restaurantBasicInfo(req, res) {
  //getting restaurant id by params
  let restaurantId = req.params.id;
  //matching criteria
  User.findById(restaurantId, {
    restaurantName: 1,
    countryCode: 1,
    contactPerson: 1,
    contactNumber: 1,
    address: 1,
    locationName: 1,
    city: 1,
    state: 1,
    country: 1,
    zip: 1,
    logo: 1,
    email: 1
  }).exec(function(err, info) {
    if (err) {
      //error handling
      return handleError(res);
    } else {
      //sending response
      res.json(info);
    }
  });
}

//get a list of counts(products,category,order,user) of a restaurant
export function countdata(req, res) {
  //getting restaurant id by token data
  let restaurantID = req.user._id;
  //matching query
  Category.find({ restaurantID: restaurantID }, {}).exec(function(
    err,
    categoryCount
  ) {
    if (err) {
      //error handling
      return handleError(res);
    } else {
      //after matching criteria category data length
      let categoryCount1 = categoryCount.length;
      //getting product data of a restaurant
      Product.find({ restaurantID: restaurantID }, {}).exec(function(
        err,
        productCount
      ) {
        if (err) {
          //error handling
          return handleError(res);
        } else {
          //getting product data length of a restaurant
          let productCount1 = productCount.length;
          //matching orders of a restaurant
          Order.find({ restaurantID: restaurantID }).exec(function(
            err,
            restaurantOrderCount
          ) {
            if (err) {
              //error occoured
              return handleError(res);
            } else {
              //getting all users of a restaurant
              Order.find({ restaurantID: restaurantID })
                .distinct("user")
                .exec(function(err, orderCount) {
                  if (err) {
                    //error occoured
                    return handleError(res);
                  } else {
                    let orderCount1 = orderCount.length;
                    let totalCount = {
                      categoryCount: categoryCount1,
                      restaurantOrderCount: restaurantOrderCount.length,
                      userCount: orderCount1,
                      productCount: productCount1
                    };
                    //sending response
                    res.json(totalCount);
                  }
                });
            }
          });
        }
      });
    }
  });
}

//various count info of a location
export function locationCountData(req, res) {
  //location id by params
  let locationId = req.params.id;
  //getting all categories of a location
  Category.find({ location: locationId }, {}).exec(function(
    err,
    categoryCount
  ) {
    if (err) {
      //error handling
      return handleError(res);
    } else {
      //getting category length of location
      let categoryCount1 = categoryCount.length;
      //getting product data
      Product.find({ location: locationId }, {}).exec(function(
        err,
        productCount
      ) {
        if (err) {
          return handleError(res);
        } else {
          //got product length of a location product
          let productCount1 = productCount.length;
          //getting all orders of a location
          Order.find({ location: locationId }).exec(function(
            err,
            restaurantOrderCount
          ) {
            if (err) {
              return handleError(res);
            } else {
              //all users of  location
              Order.find({ location: locationId })
                .distinct("user")
                .exec(function(err, orderCount) {
                  if (err) {
                    return handleError(res);
                  } else {
                    let orderCount1 = orderCount.length;
                    //wrapping all data in an object
                    let totalCount = {
                      categoryCount: categoryCount1,
                      restaurantOrderCount: restaurantOrderCount.length,
                      userCount: orderCount1,
                      productCount: productCount1
                    };
                    //sending response
                    res.json(totalCount);
                  }
                });
            }
          });
        }
      });
    }
  });
}

//get a list of managers of a restaurant
export function restaurantManagers(req, res) {
  //getting all managers of a restaurant
  User.find(
    { restaurantID: req.params.restaurant, role: "Manager" },
    "-salt -password"
  ).exec(function(err, managerslist) {
    if (err) {
      //handling error
      return handleError(res);
    } else {
      //sending response
      res.json(managerslist);
    }
  });
}

//get all restaurant owners of this application
export function ownerList(req, res) {
  //matching criteria
  User.find(
    { role: "Owner" },
    { salt: false, password: false, __v: false }
  ).exec(function(err, ownerlist) {
    if (err) {
      //error handling
      return handleError(res);
    } else {
      //sending response
      res.json(ownerlist);
    }
  });
}

//Activate or Deactivate an owner
export function ownerDeactivate(req, res) {
  //searching owner data for making action
  User.findById(req.params.id).exec(function(err, ownerdata) {
    if (err) {
      return handleError(res);
    } else {
      ownerdata.activationStatus = req.body.activationStatus;
      //updating changes to entity document
      ownerdata.save(function(err, ck) {
        if (err) {
          //handling error
          return handleError(res);
        } else {
          let msg;
          if (ownerdata.activationStatus == false) {
            //while entity doc is deactivated
            msg = "deactivated";
          }
          if (ownerdata.activationStatus == true) {
            //while entity activated
            msg = "activated";
          }
          //getting entity email to notify
          let emailId = ownerdata.email;
          transport.sendMail(
            {
              from: "info@ionicfirebaseapp.com",
              to: emailId,
              subject: "Account Activation Info",
              html: "your account has been" + msg + "."
            },
            function(error, data) {
              if (error) {
                //error handling
                return handleError(res);
              }
              if (data) {
                //sending response
                res.status(200).send({
                  message: "Requested owner account has been " + msg + "."
                });
              }
            }
          );
        }
      });
    }
  });
}

//get a list of staffs of a location
export function locationStaff(req, res) {
  let obj_data = {};
  let arr_data = [];
  User.find(
    { location: req.params.locationId, role: "Staff" },
    "-salt -password"
  ).exec(function(err, resdata) {
    if (err) {
      //error handling
      return handleError(res);
    }
    if (resdata.length == 0) {
      //when there is no staff for a location
      res.json({
        message: "No staff found."
      });
    } else {
      var mongoose = require("mongoose");
      var id = mongoose.Types.ObjectId(resdata[0]._id);
      //iterating all staffs
      for (let i = 0; i < resdata.length; i++) {
        //getting all delivered order of staffs(deliveryboys) one by one
        Order.find(
          { deliveryBy: mongoose.Types.ObjectId(resdata[i]._id) },
          {}
        ).exec(function(err, totaldeliveycount) {
          if (err) {
            //error handling
            return handleError(res);
          } else {
            //wrapping in raw object for response
            obj_data = {
              orderdata: resdata[i],
              totalCount: totaldeliveycount.length
            };
            //pushing them into array
            arr_data.push(obj_data);
            if (arr_data.length == resdata.length) {
              //sending response
              res.send(arr_data);
            }
          }
        });
      }
    }
  });
}

//list of managers whose location info field is null
export function newlyAddedManagers(req, res) {
  //applying matching criteria
  console.log("kkkkkk" + req.user._id);
  User.find(
    { role: "Manager", restaurantID: req.user._id, location: null },
    "-salt -password"
  ).exec(function(err, resdata) {
    if (err) {
      //handling error
      return handleError(res);
    } else {
      //sending response
      res.json(resdata);
    }
  });
}

//
export function allActivStaff(req, res) {
  //matching criteria for all staffs of a location who is currently active
  User.find(
    { location: req.params.locationId, role: "Staff", activationStatus: true },
    "name"
  ).exec(function(err, staffData) {
    if (err) {
      //handling error
      return handleError(res);
    }
    if (staffData.length == 0) {
      //if there is no staff in a location who is active
      return res.status(404).send({ message: "no active staff found" });
    } else {
      //sending response
      res.send(staffData);
    }
  });
}

//to verifyToken
export function verifyToken(req, res) {
  //if getting response then your token is valid.
  var x = true;
  res.json(x);
}

//registering user by fb
export function facebook(req, res) {
  var Id = req.body.id;
  var email = req.body.email;
  var name = req.body.name;
  var imageUrl = req.body.imageId;
  //making sure whether this id already registered or not
  User.findOne({ facebookId: Id }, {})
    .exec()
    .then(user => {
      if (user) {
        //if already registered,sending token
        var token = jwt.sign({ _id: user._id }, config.secrets.session, {
          expiresIn: 60 * 60 * 5
        });
        return res.json({ token: token });
      }
      //otherwise,creating a new user
      user = new User({
        name: name,
        email: email,
        facebookId: Id,
        role: "user",
        provider: "facebook",
        imageUrl: imageUrl,
        createAt: new Date(Date.now()),
        updateAt: new Date(Date.now())
      });
      user
        .save()
        .then(function(user) {
          //after save sending token
          var token = jwt.sign({ _id: user._id }, config.secrets.session, {
            expiresIn: 60 * 60 * 5
          });
          res.json({ token });
        })
        .catch(validationError(res));
    })
    .catch(err => res.json(err));
}

//checking whether a facebook id is already existing in database or not
export function facebookinfo(req, res) {
  var Id = req.body.id;
  //applying searching criteria
  User.findOne({ facebookId: Id }, {}).exec(function(err, user) {
    if (err) {
      //handling error
      return handleError(err);
    }
    if (!user) {
      //if there is no user by this id
      res.status(200).send({ message: "no such user exist" });
    } else {
      //if got a user related to this id
      res.send(user);
    }
  });
}

/**
 * Creates & Get a new user by google
 */

export function google(req, res, next) {
  var profile = req.body;
  var imageUrl = req.body.imageId;
  var name = req.body.name;
  var googleId = req.body.googleId;
  var email = req.body.email;
  console.log(JSON.stringify(req.body));
  //checking whether this google id is already registered or not
  User.findOne({ googleId: googleId })
    .exec()
    .then(user => {
      if (user) {
        //if already registered,generating token
        var token = jwt.sign({ _id: user._id }, config.secrets.session, {
          expiresIn: 60 * 60 * 5
        });
        //sending token in response
        return res.json({ token });
      }
      //otherwise,creating a new user instance
      user = new User({
        name: name,
        email: email,
        imageUrl: imageUrl,
        googleId: googleId,
        role: "user",
        provider: "google"
      });
      //saving user data
      user
        .save()
        .then(function(user) {
          //after save,sending response token
          var token = jwt.sign({ _id: user._id }, config.secrets.session, {
            expiresIn: 60 * 60 * 5
          });
          res.json({ token });
        })
        .catch(validationError(res));
    })
    .catch(err => res.json(err));
}

//checking for a google id whether it is already registered or not
export function googleinfo(req, res) {
  //getting google id
  var Id = req.body.id;
  //applying matching criteria
  User.findOne({ googleId: Id }, {}).exec(function(err, user) {
    if (err) {
      //error occoured
      return handleError(err);
    }
    if (!user) {
      //while no user with this id
      res.status(200).send({ message: "no such user exist" });
    } else {
      //get a user by this id sending that document data as response
      res.send(user);
    }
  });
}

//*************************stripe payment****************
//get stripe token
export function accCreateAndTrans(req, res, next) {
  var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
  stripe.tokens.create(
    {
      card: {
        object: "card",
        exp_month: req.body.month,
        exp_year: req.body.year,
        number: req.body.cardNumber,
        cvc: req.body.cvc //100'4242 4242 4242 4242',
      }
    },
    function(err, token) {
      if (err) {
        return handleError(err, res);
      } else {
        stripe.customers
          .create({
            email: req.user.email, //"shubh037@gmail.com",
            source: token.id //'tok_1At9Xi2eZvKYlo2CVhMEj8Io',//token id
          })
          .then(function(customer) {
            User.findById(req.user._id).exec(function(err, userInfo) {
              if (err) {
                return handleError(res);
              } else {
                if (req.body.isSaved == true) {
                  let obj = {
                    lastFourDigit:
                      "xxxxxxxxxxxx" + customer.sources.data[0].last4,
                    customerId: customer.id,
                    cvc: req.body.cvc,
                    userId: req.user._id
                  };
                  userInfo.cardDetail.push(obj);
                }
                userInfo.customerId = customer.id;
                userInfo.save(function(err) {
                  if (err) {
                    return handleError(err, res);
                  } else {
                    res.send({ message: "sucess" });
                  }
                });
              }
            });
          });
      }
    }
  );
}

//stripe payment
export function stripePayment(req, res) {
  User.findById(req.user._id).exec(function(err, userInfo) {
    if (err) {
      return handleError(res);
    }
    if (!userInfo) {
      res.status(200).send({ message: "no such user found" });
    } else {
      //console.log('usr............'+JSON.stringify(userInfo))
      var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
      stripe.charges
        .create({
          amount: req.body.amount,
          currency: "usd",
          customer: userInfo.customerId //'cus_BFesiWxNtkgF6G',//customer id
        })
        .then(function(charge) {
          //console.log('jjjjjjjjjjj....'+JSON.stringify(charge))
          User.findOneAndUpdate(
            { _id: req.user._id },
            { $unset: { customerId: 1 } },
            { upsert: true, new: true },
            function(err, doc) {
              if (err) {
                console.log("Something wrong when updating data!");
              }
              res.send({
                message: "Thank you,Your transaction was successful.",
                transactionId: charge.id
              });
            }
          );
        });
    }
  });
}

//saved card details list
export function allcardInfo(req, res) {
  User.findById(req.params.userId).exec(function(err, userInfo) {
    if (err) {
      return handleError(res);
    }
    if (userInfo.cardDetail.length == 0) {
      res.status(200).send({ message: "no saved card found" });
    } else {
      let raw_array = [];
      for (let i = 0; i < userInfo.cardDetail.length; i++) {
        let obj = {
          lastFourDigit: userInfo.cardDetail[i].lastFourDigit
        };
        raw_array.push(obj);
        if (userInfo.cardDetail.length == raw_array.length) {
          res.send(raw_array);
        }
      }
    }
  });
}
//saved card payment
export function savedCardstripePayment(req, res) {
  User.findById(req.body.userId).exec(function(err, userInfo) {
    if (err) {
      return handleError(res);
    }
    if (!userInfo) {
      res.status(200).send({ message: "no such user found" });
    } else {
      //req.body.index
      console.log("card" + JSON.stringify(userInfo));
      if (
        userInfo.cardDetail.length >= req.body.index &&
        userInfo.cardDetail[req.body.index].cvc == req.body.cvc &&
        userInfo.cardDetail[req.body.index].userId == req.body.userId
      ) {
        var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
        stripe.charges
          .create({
            amount: req.body.amount,
            currency: "usd",
            customer: userInfo.cardDetail[req.body.index].customerId //'cus_BFesiWxNtkgF6G',//customer id
          })
          .then(function(charge) {
            userInfo.cardDetail[req.body.index].customerId = charge.customer;
            userInfo.save(function(err) {
              if (err) {
                return handleError(res);
              } else {
                res.send({
                  message: "Thank you,Your transaction was successful.",
                  transactionId: charge.id
                });
              }
            });
          });
      } else {
        res.send({ errorMessage: "Invalid CVV" });
      }
    }
  });
}
//delete saved card
export function deleteSavedCard(req, res) {
  User.findOne({ _id: req.body.userId }).exec(function(err, userInfo) {
    if (err) {
      return res.status(200).send({ message: "no such user exist" });
    } else {
      var index = req.body.index;
      if (
        req.body.index != undefined &&
        userInfo.cardDetail.length >= req.body.index
      ) {
        userInfo.cardDetail.splice(index, 1);
        userInfo.save(function(err) {
          if (err) {
            return handleError(res);
          }
          res.send({
            message: "Your card is deleted successfully."
          });
        });
      } else {
        res.send({
          message: "you have entered invalid index"
        });
      }
    }
  });
}
/**
 * Authentication callback
 */
//locationStaff
export function authCallback(req, res) {
  res.redirect("/");
}
export function uoloadFile(req, res) {
  Utils.uploadToCloud1(req.body.baseKey).then(function(info) {
    res.send(info);
  });
}

export function updatepassword(req, res) {
  var user_id = req.body.user_id;
  var updated_password = req.body.updated_password;
  var oldPassword = req.body.oldPassword;
  var user_id = mongoose.Types.ObjectId(user_id);
  if (oldPassword) {
    User.findOne({ _id: user_id }).then(user => {
      user.authenticate(oldPassword, function(autherr, authenticated) {
        if (autherr) {
          res.json(autherr);
        }
        if (!authenticated) {
          res.json({ auth: "The password is incorrect!" });
        } else {
          user.password = updated_password;
          user.save(function(err, data) {
            if (!err) res.json(data);
          });
        }
      });
    });
  } else {
    User.findOne({ _id: user_id }).then(user => {
      user.password = updated_password;
      user.save(function(err, data) {
        if (!err) res.json(data);
      });
    });
  }
}

export function updateemail(req, res) {
  var user_id = req.body.user_id;
  var updated_email = req.body.updated_email;

  return User.findOneAndUpdate({ _id: user_id }, { email: updated_email })
    .then(user => res.json(user))
    .catch(erro => res.json(erro));
}

//Added by Dan 6.22

export function getAllstaff(req, res) {
  var id = req.params.id;
  console.log(id);
  var id = mongoose.Types.ObjectId(id);
  return User.find({
    role: { $in: ["Staff", "User", "Manager", "Driver"] },
    restaurantID: id
  })
    .then(users => res.json(users))
    .catch(err => res.json(err));
}

//Added by Dan 6.22

export function addofstaff(req, res) {
  var data = new User(req.body.staff);
  data
    .save()
    .then(data => res.json(data))
    .catch(err => res.json(err));
}

//updating staff .. 6.22 by Dan
export function updatedofstaff(req, res) {
  var user_id = req.params.id;
  var password = req.body.staff.password;
  var staff = req.body.staff;
  User.findOne({ _id: user_id }).then(user => {
    var new_password = user.encryptPassword(password);

    User.findOneAndUpdate(
      { _id: user_id },
      {
        name: staff.name,
        role: staff.role,
        postalCode: staff.postalCode,
        password: new_password,
        email: staff.email,
        contactNumber: staff.contactNumber,
        street: staff.street,
        country: staff.country,
        state: staff.state,
        activationStatus: staff.activationStatus
      }
    )
      .then(data => res.json(data))
      .catch(err => res.json(err));
  });
}

//Dan activation updating
export function updateActivation(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  console.log(id);
  return User.findOne({ _id: id })
    .then(user => {
      var activation = !user.activationStatus;
      User.findOneAndUpdate({ _id: id }, { activationStatus: activation }).then(
        user => {
          res.json(user);
        }
      );
    })
    .catch(err => res.json("err"))
    .catch(err => res.json("err"));
}

//Dan Get all the managers
export function getmanagerslist(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  return User.find({ role: "Manager", restaurantID: id })
    .then(user => {
      res.json(user);
    })
    .catch(err => res.json(err));
}

// === Mobile App ===
// New USER Registration
export function createNewUser(req, res) {
  var newUser = new User(req.body);
  var email = req.body.email;
  newUser.provider = "local";
  newUser.role = req.body.role || "User";
  if (newUser.role == "User") {
    newUser.totalLoyaltyPoints = 0;
    newUser.loyaltyPoints.push({
      point: 0
    });
    User.findOne(
      { email: newUser.email, "userFromWhichApp.id": { $exists: true } },
      {}
    ).exec(function(err, user) {
      if (err) {
        return handleError(err);
      }
      if (!user) {
        newUser.userFromWhichApp.push({ id: req.body.restId });
        delete newUser.restId;
        newUser
          .save()
          .then(function(user) {
            Mails.welcomeMail(user.name, user.email).then(function(d) {});
            res.send({
              _id: user._id,
              message:
                "An email has been sent to the provided email with further instructions."
            });
          })
          .catch(validationError(res));
      } else {
        user.userFromWhichApp.push({ id: req.body.restId });
        user
          .save()
          .then(function(user) {
            Mails.welcomeMail(user.name, user.email).then(function(d) {});
            res.send({
              _id: user._id,
              message:
                "An email has been sent to the provided email with further instructions."
            });
          })
          .catch(validationError(res));
      }
    });
  }
}

// Get a Single User Info
export function userinfo(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  User.aggregate([
    {
      $match: { _id: id }
    },
    {
      $project: {
        salt: 0,
        password: 0,
        createdAt: 0,
        cardDetail: 0,
        newCardNumber: 0,
        __v: 0,
        taxInfo: 0
      }
    }
  ])
    .exec()
    .then(data => res.json(data))
    .catch(err => res.json({ data: "Data Not Found" }));
}

//working OLD way
// export function userinfo(req, res, next) {
//   //getting user id by param
//   var userId = req.params.id;
//   //find user by their id
//   return User.findById(userId, "-salt -password -__v -createdAt").exec(function(
//     err,
//     userdata
//   ) {
//     //if error
//     if (err) {
//       //return handleError(res);
//       return err;
//     } else {
//       //sending response
//       res.json(userdata);
//     }
//   });
// }
