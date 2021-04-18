/**show topRatedRestaurantlist mapDistance allDataMapDistance allTopRatedRestaurantlist
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/locations     tax         ->  index locCatAndSubCat
 * POST    /api/locations              ->  create allDataMapDistance
 * GET     /api/locations/:id          ->  show categoryData restaurantlistOncreatedOrder
 * PUT     /api/locations/:id          ->  upsert locCategoryData
 allLocationRestaurant mapDistance restaurantlistOncreatedOrder

 */

"use strict";

import jsonpatch from "fast-json-patch";
import Location from "./location.model";
import CuisineLocation from "../cuisineLocation/cuisineLocation.model";
import User from "../user/user.model";
import Category from "../category/category.model";
import Cat_locs from "../cat_loc.model";
import Pro_locs from "../pro_loc.model";
import Product from "../product/product.model";
import Subcategory from "../subcategory/subcategory.model";
import Setting from "../setting/setting.model";
import { response } from "express";
var multiparty = require("multiparty");
var path = require("path");
var cloudinary = require("cloudinary");
const config = require("../../config/environment");
let geoLib = require("geo-lib");
var mongoose = require("mongoose");

var async = require("async");
var crypto = require("crypto");
//Cloudinary Image Upload Config
cloudinary.config({
  cloud_name: "dgcs",
  api_key: "682777964494331",
  api_secret: "VNzzLF7r6WQMq2vPfkUNVUz_K2A",
});
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    return res.status(statusCode).json(entity);
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove().then(() => {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a single Location from the DB
export function show(req, res) {
  return Location.findById(req.params.id, { __v: false })
    .populate("contactPerson", "name email")
    .populate("restaurantID", "restaurantName name logo role taxInfo")
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//get all restaurant list
export function listOfAllrestaurant(req, res) {
  return Location.find({}, "contactPerson locationName")
    .populate("restaurantID", "restaurantName name logo role")
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
export function getlistOfAllrestaurant(req, res) {
  return Location.find()
    .populate("restaurantID")
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//display all locations depends on restaurantType
export function LocationByRestoType(req, res) {
  return Location.find({ restaurantType: req.body.restaurantType }, {})
    .populate("restaurantID")
    .exec(function (err, location) {
      if (err) {
        return handleError(res);
      }
      if (!location) {
        res.json([]);
      }
      res.json(location);
    });
}

// Creates a new Location in the DB
//Modify 2019.6.12 by Dan
export function create(req, res) {
  // let location = new Location(req.body);
  // return Location.create(location)
  //   .then(respondWithResult(res, 201))
  //   .catch(handleError(res));
  console.log(req.body.location);
  var data = {};
  data["locationName"] = req.body.location.name;
  //var contactPerson = mongoose.Types.ObjectId(req.body.location.manager)
  data["contactPerson"] = req.body.location.manager;
  if (data["contactPerson"] == "") {
    delete data["contactPerson"];
  }
  data["restaurantID"] = req.body.location.owner_id;
  data["postalCode"] = req.body.location.postalCode;
  data["state"] = req.body.location.state;
  data["contactNumber"] = req.body.location.phoneNumber;
  data["city"] = req.body.location.city;
  data["aboutUs"] = req.body.location.aboutStore;
  data["address"] = req.body.location.streetAddress;
  let location = new Location(data);
  return Location.create(location)
    .then((location) => res.json(location))
    .catch((err) => res.json(err));
}

// Get all location of a restaurant all LocationRestaurant
export function allLocationRestaurant(req, res) {
  return Location.find({ restaurantID: req.params.id }, {})
    .populate("contactPerson", "name")
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//all retauren count by restaurent id
export function allLocationRestaurantCount(req, res) {
  return Location.find({ restaurantID: req.params.id }, {})
    .count()
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Upserts the given Location in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  if (req.body.contactName) {
    User.findById(req.body.contactPerson).exec(function (err, data) {
      if (err) {
      }
      data.name = req.body.contactName;
      data.save();
    });
  }
  CuisineLocation.create(req.body.cuisinedata).then(() => {
    console.log("finished populating Coupan");
  });
  return Location.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//updating delivery info
export function deliveryInfo(req, res) {
  var locationId = req.body.id;
  //finding location data
  Location.findById(locationId).exec(function (err, deliverydata) {
    if (err) {
      //error occoured
      return handleError(res);
    }
    if (!deliverydata) {
      //when there is no delivery data by locationId
      return res.status(404).send({ message: "data not found" });
    }
    deliverydata.deliveryInfo = req.body;
    //save delivery data
    deliverydata.save(function (err, done) {
      if (err) {
        //handle error
        return handleError(res);
      } else {
        //sending response
        res.json(deliverydata);
      }
    });
  });
}

// Deletes a Location from the DB
export function destroy(req, res) {
  let locationId = req.params.id;
  //Getting categories of a location
  Category.find({ location: locationId }, {}).exec(function (err, category) {
    if (err) {
      return handleError(res);
    }
    //If category exist can't delete location
    if (category.length > 0) {
      res.status(200).send({
        message: "There are Some Categories related to this Restaurant!",
      });
    }
    if (category.length == 0) {
      //find public Id
      Location.findById(locationId, function (err, location) {
        let imagePath = location.publicId;
        // Delete Image
        cloudinary.uploader.destroy(imagePath, function (result) {
          return Location.findById(req.params.id)
            .exec()
            .then(handleEntityNotFound(res))
            .then(removeEntity(res))
            .catch(handleError(res));
        });
      });
    }
  });
}

//Front-End Api--

// Gets a list of Locations by user lat&log
export function mapDistance(req, res) {
  let user_lat = req.body.latitude;
  let user_lan = req.body.longitude;
  //All location data
  Location.find()
    .lean()
    .populate("restaurantID", "restaurantName logo publicId")
    .exec(function (err, locations) {
      //error handling
      if (err) {
        return handleError(res);
      } else {
        let arr_Data = [];
        let i;
        let len = locations.length;
        //traversing all location one by one
        for (i = 0; i < len; i++) {
          //Getting distance between two lat&long
          let result = geoLib.distance({
            p1: { lat: user_lat, lon: user_lan },
            p2: { lat: locations[i].latitude, lon: locations[i].longitude },
          });
          let obj = {
            restaurantName: locations[i].restaurantID.restaurantName,
            restaurantLogo: locations[i].restaurantID.logo,
            restaurantPublicId: locations[i].restaurantID.publicId,
            hasDelivery: locations[i].hasDelivery,
            restaurantID: locations[i]._id,
            distance: result.distance,
            address: locations[i].address,
            city: locations[i].city,
            contactNumber: locations[i].contactNumber,
            rating: locations[i].rating,
          };
          arr_Data.push(obj);
        }
        if (arr_Data.length === locations.length) {
          //Sorting all data on the basis of distance
          arr_Data.sort(function (a, b) {
            return a.distance - b.distance;
          });
          let final_data = [];
          let page = req.body.page - 1;
          //Here,static value 10 is one page data(10 data)
          let lower_limit = page * 4;
          let upper_limit = lower_limit + 4;
          let flag = 0;
          if (lower_limit > arr_Data.length || page < 0) {
            flag = 1;
            let array_null = [];
            res.json(array_null);
          }
          if (upper_limit > arr_Data.length) {
            upper_limit = arr_Data.length;
          }
          for (let i = lower_limit; i < upper_limit; i++) {
            final_data.push(arr_Data[i]);
          }
          if (flag == 0) {
            res.json(final_data);
          }
        }
      }
    });
}

// //mapping all location data basis on distance
export function allDataMapDistance(req, res) {
  let user_lat = req.body.latitude;
  let user_lan = req.body.longitude;
  //All location data
  Location.find()
    .lean()
    .populate("restaurantID", "restaurantName logo publicId")
    .exec(function (err, locations) {
      //error handling
      if (err) {
        return handleError(res);
      } else {
        let arr_Data = [];
        let i;
        let len = locations.length;
        //traversing all location one by one
        for (i = 0; i < len; i++) {
          //Getting distance between two lat&long
          let result = geoLib.distance({
            p1: { lat: user_lat, lon: user_lan },
            p2: { lat: locations[i].latitude, lon: locations[i].longitude },
          });
          let obj = {
            _id: locations[i]._id,
            restaurantID: {
              _id: locations[i].restaurantID._id,
              restaurantName: locations[i].restaurantID.restaurantName,
              logo: locations[i].restaurantID.logo,
              publicId: locations[i].restaurantID.publicId,
            },
            contactNumber: locations[i].contactNumber,
            locationName: locations[i].locationName,
            deliveryInfo: locations[i].deliveryInfo,
            rating: locations[i].rating,
          };
          arr_Data.push(obj);
        }
        if (arr_Data.length === locations.length) {
          //Sorting all data on the basis of distance
          arr_Data.sort(function (a, b) {
            return a.distance - b.distance;
          });
          res.send(arr_Data);
        }
      }
    });
}

//Get Location Info as well as all categorories and sub-categories locCatAndSubCat
export function locCatAndSubCat(req, res) {
  let locId = req.params.id;
  //Getting location info
  Location.findById(locId)
    .populate("restaurantID", "restaurantName logo publicId")
    .exec(function (err, locdata) {
      if (err) {
        return handleError(res);
      } else {
        //Getting category data
        Category.find({ location: locId }, {})
          .lean()
          .exec(function (err, catdata) {
            if (err) {
              return handleError(res);
            } else {
              //Getting sub categories data
              Subcategory.find({ location: locId }, {})
                .lean()
                .exec(function (err, subdata) {
                  if (err) {
                    return handleError(res);
                  } else {
                    let result = {};
                    result = {
                      locationdata: locdata,
                      categorydata: catdata,
                      subcategorydata: subdata,
                    };
                    res.json(result);
                  }
                });
            }
          });
      }
    });
}

//get all categories with their products
export function categoryData(req, res) {
  var obj_data = {};
  var arr_data = [];
  // finding location data
  User.findOne({ location: req.params.id }, {})
    .populate("restaurantID")
    .exec(function (err, restaurant) {
      if (err) {
        //error handling
        return handleError(res);
      }
      if (!restaurant) {
        //when there is no such location with this id
        res
          .status()
          .send({ message: "there is no such location with this id." });
      }
      //get all categories of a location
      Product.find({ location: req.params.id }, {})
        .distinct("category")
        .exec(function (err, categoryData) {
          if (err) {
            //error handling
            return handleError(res);
          }
          if (categoryData.length == 0) {
            //while there is no products in a location
            res
              .status(200)
              .send({ message: "There is no products in a location." });
          }
          //iterating category ids
          for (let i = 0; i < categoryData.length; i++) {
            //find all products of a category
            Product.find({ category: categoryData[i] }, {}).exec(function (
              err,
              productData
            ) {
              if (err) {
                // handle error
                return handleError(res);
              }
              obj_data = {
                categoryTitle: productData[0].categoryTitle,
                product: productData,
              };
              //push all category in an array
              arr_data.push(obj_data);
              if (arr_data.length == categoryData.length) {
                //while all products and category title pushed
                //into array
                //response object
                let obj2 = {
                  restaurant: restaurant.restaurantID,
                  categorydata: arr_data,
                };
                //send response
                res.send(obj2);
              }
            });
          }
        });
    });
}

//top rated rastaurant list only 10
export function topRatedRestaurantlist(req, res) {
  //getting all location
  Location.find({}, "address city rating")
    .populate("restaurantID", "restaurantName logo publicId")
    .sort({ rating: -1 })
    .limit(4)
    .exec(function (err, restaurantlist) {
      if (err) {
        //error occoured
        return handleError(res);
      }
      if (restaurantlist.length == 0) {
        //while there is no location
        res.status(200).send({ message: "restaurant not found" });
      } else {
        let arr_Data = [];
        //iterating all location or restaurant
        for (let i = 0; i < restaurantlist.length; i++) {
          //creating raw object
          let obj = {
            restaurantName: restaurantlist[i].restaurantID.restaurantName,
            restaurantLogo: restaurantlist[i].restaurantID.logo,
            restaurantPublicId: restaurantlist[i].restaurantID.publicId,
            hasDelivery: restaurantlist[i].hasDelivery,
            restaurantID: restaurantlist[i]._id,
            address: restaurantlist[i].address,
            city: restaurantlist[i].city,
            contactNumber: restaurantlist[i].contactNumber,
            rating: restaurantlist[i].rating,
          };
          //pushing objects in an array
          arr_Data.push(obj);
        }
        if (restaurantlist.length == arr_Data.length) {
          //when all done,
          //send response
          res.send(arr_Data);
        }
      }
    });
}

//all top rated rastaurant list all
export function allTopRatedRestaurantlist(req, res) {
  //sorting all locations on basis of their ratings
  Location.find({}, "_id contactPerson locationName deliveryInfo rating")
    .populate("restaurantID", "restaurantName logo publicId")
    .sort({ rating: -1 })
    .exec(function (err, restaurantlist) {
      if (err) {
        //while error occoured
        return handleError(res);
      }
      if (restaurantlist.length == 0) {
        //when there is no restaurant
        res.status(200).send({ message: "restaurant not found" });
      } else {
        //while got restaurant list
        //sending them as response
        res.send(restaurantlist);
      }
    });
}

//**************only 10 restaurant list on newly added basis
export function restaurantlistOncreatedOrder(req, res) {
  //getting all locations
  Location.find({}, "address city rating")
    .populate("restaurantID", "restaurantName logo publicId")
    .sort({ createdAt: -1 })
    .limit(4)
    .exec(function (err, restaurantlist) {
      if (err) {
        return handleError(res);
      }
      if (restaurantlist.length == 0) {
        //while there is no restaurant
        res.status(200).send({ message: "restaurant not found" });
      } else {
        console.log("asdfghjk" + JSON.stringify(restaurantlist));
        let arr_Data = [];
        //iterating all restaurant
        for (let i = 0; i < restaurantlist.length; i++) {
          //creating raw object
          let obj = {
            restaurantName: restaurantlist[i].restaurantID.restaurantName,
            restaurantLogo: restaurantlist[i].restaurantID.logo,
            restaurantPublicId: restaurantlist[i].restaurantID.publicId,
            hasDelivery: restaurantlist[i].hasDelivery,
            restaurantID: restaurantlist[i]._id,
            address: restaurantlist[i].address,
            city: restaurantlist[i].city,
            contactNumber: restaurantlist[i].contactNumber,
            rating: restaurantlist[i].rating,
          };
          arr_Data.push(obj);
        }
        //when done
        if (restaurantlist.length == arr_Data.length) {
          //send response
          res.send(arr_Data);
        }
      }
    });
}

//**************get restaurant list basis of newly added
export function allRestaurantlistOncreatedOrder(req, res) {
  //applying query critetia
  Location.find({}, "_id contactPerson locationName deliveryInfo rating")
    .populate("restaurantID", "restaurantName logo publicId")
    .sort({ createdAt: -1 })
    .exec(function (err, restaurantlist) {
      if (err) {
        //handling error
        return handleError(res);
      }
      if (restaurantlist.length == 0) {
        //when no result found
        res.status(200).send({ message: "restaurant not found" });
      } else {
        //sending response
        res.send(restaurantlist);
      }
    });
}
//**************get restaurant list basis of newly added
export function locationListHome(req, res) {
  Location.find(
    { restaurantID: req.params.id, enable: true },
    "_id locationName contactPerson"
  )
    .populate("restaurantID", "restaurantName logo publicId")
    .sort({ createdAt: -1 })
    .exec(function (err, restaurantlist) {
      if (err) {
        return handleError(res);
      }
      if (restaurantlist.length == 0) {
        res.status(200).send([]);
      } else {
        res.send(restaurantlist);
      }
    });
}

//2019.6.22
export function getofalllocations(req, res) {
  var id = req.params.id;
  //console.log(id);
  var id = mongoose.Types.ObjectId(id);
  Location.aggregate([
    {
      $match: { restaurantID: id },
    },
    {
      $lookup: {
        from: "users",
        localField: "contactPerson", //users field;
        foreignField: "_id", //location field
        as: "users",
      },
    },
  ])
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json({ data: "data don't exist" }));
}

//added by Dan 2019.6.22
export function activationUpdate(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  return Location.findOne({ _id: id }).then((location) => {
    var enable = !location.enable;
    Location.findOneAndUpdate({ _id: id }, { enable: enable }).then(
      (location) => {
        res.json(location);
      }
    );
  });
}

//added by Dan 2019.6.22
//Get single location
export function getOneOfLocation(req, res) {
  var id = req.params.id;
  //console.log(id);
  var id = mongoose.Types.ObjectId(id);
  Location.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: "users",
        localField: "contactPerson",
        foreignField: "_id",
        as: "users",
      },
    },
  ])
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json({ data: "data don't exist" }));
}

//updated by Dan 2019.6.22
//updated location
export function updatedlocation(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  var location = req.body.location;
  console.log("ffff", location);
  return Location.findOneAndUpdate(
    { _id: id },
    {
      locationName: location.name,
      contactPerson: location.manager,
      contactNumber: location.phoneNumber,
      address: location.streetAddress,
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      aboutUs: location.aboutStore,
      enable: location.enable,
      tax: location.tax,
    }
  )
    .then((location) => res.json(location))
    .catch((err) => res.json(err));
}

// === Mobile App ===
// Get All the Avilable Locations (Name, Phone Etc...)
export function getalllocations(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  Location.aggregate([
    {
      $match: { restaurantID: id },
    },
    {
      $project: {
        restaurantID: 0,
        createdAt: 0,
        ratingCount: 0,
        rating: 0,
        cuisine: 0,
        __v: 0,
        contactPerson: 0,
      },
    },
  ])
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json({ data: "Data Not Found" }));
}

//Get Single Location Info (address, aboutUs, manager)
export function getSingleLocation(req, res) {
  var id = req.params.id;
  //console.log(id);
  var id = mongoose.Types.ObjectId(id);
  Location.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: "users",
        localField: "contactPerson",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $project: {
        __v: 0,
        createdAt: 0,
        contactPerson: 0,
        "users.salt": 0,
        "users.password": 0,
        "users.restaurantID": 0,
        "users.createdAt": 0,
        "users.cardDetail": 0,
        "users.newCardNumber": 0,
        "users.newAddress": 0,
        "users.earnedPoints": 0,
      },
    },
  ])
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json({ data: "data don't exist" }));
}

// Get Available Categories Info Per Location ID
export function locCatSubCat(req, res) {
  var locid = req.params.id;
  var locid = mongoose.Types.ObjectId(locid);
  Cat_locs.aggregate([
    {
      $match: { location_id: locid },
    },
    {
      $lookup: {
        from: "categories", // <collection to join>
        localField: "category_id", // <field from the input documents>
        foreignField: "_id", // <field from the documents of the "from" collection>
        as: "category", // <output array field>
      },
    },
    {
      $unwind: "$category",
    },
    {
      $match: { "category.enable": true },
    },
    //find the Location to get StoreID for Image Link
    {
      $lookup: {
        from: "locations",
        localField: "location_id",
        foreignField: "_id",
        as: "LocationInfo",
      },
    },
    {
      $unwind: "$LocationInfo",
    },
    {
      $lookup: {
        from: "stores",
        localField: "LocationInfo.restaurantID",
        foreignField: "user_id",
        as: "stores",
      },
    },
    {
      $lookup: {
        from: "storetypes",
        localField: "stores.store_type_id",
        foreignField: "_id",
        as: "storetypes",
      },
    },
    {
      $unwind: "$storetypes",
    },
    {
      $addFields: {
        "category.imageUrl": {
          $concat: [
            config.WebsiteURL,
            "/public/Stores/",
            "$storetypes.storeTypeID",
            "/",
            { $toString: "$LocationInfo.restaurantID" },
            "/App/Category/",
            "$category.imageUrl",
            ".png",
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        category_id: 0,
        //location_id: 0,
        __v: 0,
        "category.restaurantID": 0,
        "category.createdAt": 0,
        "category.__v": 0,
        "subcategory.restaurantID": 0,
        "subcategory.createdAt": 0,
        "subcategory.__v": 0,
        storetypes: 0,
        LocationInfo: 0,
        stores: 0,
      },
    },
    { $sort: { "category.sort": 1 } },
  ])
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json({ data: "Data Not Found" }));
}

// Get Available Products for a Location ID
export function locProducts(req, res) {
  var locid = req.params.id;
  var locid = mongoose.Types.ObjectId(locid);

  Pro_locs.aggregate([
    {
      $match: { location_id: locid },
    },
    //Find Products by Location ID
    {
      $lookup: {
        from: "products", // <collection to join>
        localField: "product_id", // <field from the input documents>
        foreignField: "_id", // <field from the documents of the "from" collection>
        as: "products", // <output array field>
      },
    },
    //find the Location to get StoreID for Image Link
    {
      $lookup: {
        from: "locations",
        localField: "location_id",
        foreignField: "_id",
        as: "LocationInfo",
      },
    },
    {
      $unwind: "$LocationInfo",
    },
    {
      $lookup: {
        from: "stores",
        localField: "LocationInfo.restaurantID",
        foreignField: "user_id",
        as: "stores",
      },
    },
    {
      $lookup: {
        from: "storetypes",
        localField: "stores.store_type_id",
        foreignField: "_id",
        as: "storetypes",
      },
    },
    {
      $unwind: "$storetypes",
    },
    {
      $addFields: {
        "products.imageUrl": {
          $concat: [
            config.WebsiteURL,
            "/public/Stores/",
            "$storetypes.storeTypeID",
            "/",
            { $toString: "$LocationInfo.restaurantID" },
            "/App/Products/",
            {
              $reduce: {
                input: "$products.imageUrl",
                initialValue: "",
                in: {
                  $concat: ["$$value", "$$this"],
                },
              },
            },
            ".png",
          ],
        },
      },
    },
    // {
    //   $unwind: "$products"
    // },
    {
      $match: { "products.enable": true },
    },
    {
      $project: {
        _id: 0,
        product_id: 0,
        __v: 0,
        "products.createdAt": 0,
        "products.ratingCount": 0,
        "products.rating": 0,
        "products.__v": 0,
        //"LocationInfo.restaurantID": 0,
        storetypes: 0,
        LocationInfo: 0,
        stores: 0,
      },
    },
    { $sort: { "products.title": 1 } },
  ])
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json({ data: "Data Not Found - ", err }));
}
