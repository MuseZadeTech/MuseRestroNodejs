/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products/restaurant/:id     ->  index
 * POST    /api/products                    ->  create
 * GET     /api/products/:id                ->  show
 * PUT     /api/products/:id/:flag          ->  upsert
 * DELETE  /api/products/:id                ->  destroy
 */

"use strict";

import jsonpatch from "fast-json-patch";
import Product from "./product.model";
import Order from "../order/order.model";
import User from "../user/user.model";
import Location from "../location/location.model";
import Cat_loc from "../cat_loc.model";
import Pro_loc from "../pro_loc.model";
var fs = require("fs");

var mongoose = require("mongoose");
var multiparty = require("multiparty");
var path = require("path");
var cloudinary = require("cloudinary");
var mkdirp = require("mkdirp");
const config = require("../../config/environment");
const AWSConfig = require("../../config/aws");

//Cloudinary Image Upload Config
cloudinary.config({
  cloud_name: "dgcs",
  api_key: "682777964494331",
  api_secret: "VNzzLF7r6WQMq2vPfkUNVUz_K2A"
});
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove().then(() => {
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

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Products by restaurant Id
export function index(req, res) {
  //getting a list of products by restaurant id
  Product.find({ restaurantID: req.params.id })
    .populate(
      "restaurantID location category",
      "name locationName categoryName"
    )
    .exec(function(err, product) {
      if (err) {
        //error occoured
        return handleError(res);
      }
      if (product.length == 0) {
        return res.status(200).send({ message: "no product found" });
      } else {
        //wrapping for response
        let resobj = {
          productdata: product,
          productcount: product.length
        };
        //sending response
        res.json(resobj);
      }
    });
}

export function productSerchByName(req, res) {
  //searching products by their name using regular expression
  return Product.find({
    title: { $regex: req.body.title, $options: "i" },
    restaurantID: req.body.id
  })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Gets a list of Products by location Id byLocation
export function byLocation(req, res) {
  //getting a list of products of a location
  Product.find({ location: req.params.id }, {})
    .populate("location", "locationName")
    .exec(function(err, product) {
      if (err) {
        //error occoured
        return handleError(res);
      }
      if (
        !product ||
        product == undefined ||
        product == null ||
        product.length == 0
      ) {
        //while no products found
        return res.send({ message: "No product in this location" });
      } else {
        var id = product[0].restaurantID;
        //getting restaurant info by their if
        User.findById(id, "-password -salt").exec(function(
          err,
          restaurantdata
        ) {
          if (err) {
            //error occoured
            return handleError(res);
          }
          if (!restaurantdata) {
            //when no data found
            return res.send({ message: "No data" });
          } else {
            //getting location info by location id
            Location.findById(req.params.id).exec(function(err, deliverydata) {
              if (err) {
                //error occoured
                return handleError(res);
              }
              if (!deliverydata) {
                //while no location found
                return res.status(404).send({ message: "data not found" });
              }
              //framing data in object
              let resobj = {
                restaurant: restaurantdata,
                productdata: product,
                location: product[0].location,
                deliveryInfo: deliverydata.deliveryInfo,
                productDataLength: product.length
              };
              //sending response
              res.json(resobj);
            });
          }
        });
      }
    });
}
//***************

// Gets a list of Products by category Id
export function byCategory(req, res) {
  var restaurant = req.query.store;
  var category_id = mongoose.Types.ObjectId(req.params.id);
  return Location.find({
    restaurantID: mongoose.Types.ObjectId(restaurant)
  }).then(location => {
    var location_id = [];
    location.map((value, index) => {
      location_id.push(value._id);
    });
    //console.log(location_id.length);
    Pro_loc.find({ location_id: { $in: location_id } })
      .then(data => {
        var product_id = [];
        data.map((value, index) => {
          product_id.push(value.product_id);
        });
        //console.log(product_id);
        Product.find({
          _id: { $in: product_id },
          category: category_id
        }).then(product => res.json(product));
      })
      .catch(err => {
        console.log(err);
      });
  });
}

// Gets a list of Products by Subcategory Id
export function bySubcategory(req, res) {
  return Product.find({ subcategory: req.params.id })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Product from the DB
export function show(req, res) {
  //console.log(req);
  return Product.findById(req.params.id, { __v: false })
    .populate("location category", "categoryName locationName")
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Product in the DB
//Modify by Dan creating new product
export function create(req, res) {
  let product = {};
  // product.save(function(err){
  //   if(err){
  //     return handleError(res);
  //   }
  //   else{
  //     res.json(product);
  //   }
  // })
  product.title = req.body.title;
  product.description = req.body.description;
  product.tags = req.body.tags;
  product.category = mongoose.Types.ObjectId(req.body.category);
  product.imageUrl = req.body.imageUrl;
  product.enable = req.body.enable;
  product.variants = req.body.variants;
  product.extraIngredients = req.body.extraIngredients;
  let location = req.body.location;
  Product.create(product)
    .then(product => {
      if (product) {
        location.map((value, index) => {
          //console.log(value);
          Pro_loc.create({
            product_id: mongoose.Types.ObjectId(product._id),
            location_id: mongoose.Types.ObjectId(value)
          })
            .then(cat_loc => res.json(cat_loc))
            .catch(err => res.json("errrrrrr"));
        });
      }
    })
    .catch(err => console.log(err));
}

//Dan updated product
export function updateproduct(req, res) {
  let product = {};
  let location = {};
  location = req.body.location;
  product.title = req.body.title;
  product.description = req.body.description;
  product.tags = req.body.tags;
  product.category = mongoose.Types.ObjectId(req.body.category);
  product.variants = req.body.variants;
  product.extraIngredients = req.body.extraIngredients;
  if (req.body.imageUrl) {
    product.imageUrl = req.body.imageUrl;
  }
  //product.enable = req.body.enable;

  Product.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    product
  )
    .then(product => {
      Pro_loc.remove({ product_id: mongoose.Types.ObjectId(req.params.id) })
        .then(pro_loc => {
          location.map((value, index) => {
            Pro_loc.create({
              product_id: mongoose.Types.ObjectId(product._id),
              location_id: mongoose.Types.ObjectId(value)
            })
              .then(pro_loc => res.json("success"))
              .catch(err => res.json("erro"));
          });
        })
        .catch(err => res.json("erro"));
    })
    .catch(err => res.json("erro occured!!!"));
}
export function uploadImage(req, res) {
  if (!req.body.file || req.body.file == "data:,") {
    res.json("please select image!");
    return;
  }
  var img = req.body.file; //console.log(img);
  var filename = req.body.filename;
  if (filename == "") {
    res.json("success");
    return;
  }
  var storename = req.body.storename;
  var storetype = req.body.storetype;
  var storeID = req.body.storeID;
  var path = require("path");
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buffer = new Buffer(data, "base64");

  mkdirp(
    //`${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${storename}/App/Products/`,
    `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${storeID}/App/Products/`,
    function(err) {
      if (err) {
        res.json("please try again!");
      }
      if (config.useS3) {
        AWSConfig.uploadToS3(
          //`public/Stores/${storetype}/${storename}/App/Products/${filename}.png`,
          `public/Stores/${storetype}/${storeID}/App/Products/${filename}.png`,
          buffer
        );
      } else {
        fs.writeFileSync(
          path.normalize(
            //`${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${storename}/App/Products/${filename}.png`
            `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${storeID}/App/Products/${filename}.png`
          ),
          buffer
        );
      }
      res.json("success");
    }
  );

  // let file =  req.files.file;
  // var filename = req.body.filename;
  // var storename = req.body.storename;
  // var storetype = req.body.storetype;
  // var path = require("path");
  // console.log(path.normalize(`${__dirname}/../../../../react-admin`))
  // file.mv(path.normalize(`${__dirname}/../../../../react-admin/public/${storetype}/${storename}/App/Products/${filename}.png`), function(err) {
  //   if (err)
  //   {
  //    mkdirp(`${__dirname}/../../../../react-admin/public/${storetype}/${storename}/App/Products/`, function (err) {
  //      if (err) {
  //        res.json('please try again!');
  //      }
  //      else {
  //        file.mv(path.normalize(`${__dirname}/../../../../react-admin/public/${storetype}/${storename}/App/Products/${filename}.png`), function(err) {
  //          if(err) res.json(err)
  //          res.json('File uploaded!')
  //        })
  //      }
  //     });
  //   }
  //   res.send('File uploaded!');
  // });
}
// Upserts the given Product in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  //if only field data has to update
  //flag 0 by body
  if (req.body.flag == 0) {
    return Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    })
      .exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  //if file data also has to update
  //flag 1 by body
  else {
    let id = req.params.id;
    let count = 0;
    let compareValue = 0;
    //find a product by product id
    Product.findById(id, function(err, product) {
      let publicId;
      if (req.body.deletePublicId != undefined) {
        publicId = product.publicId;
        count++;
      }
      //Destroying cloudinary image
      if (publicId != undefined) {
        cloudinary.uploader.destroy(publicId, function(result) {});
        compareValue++;
        complete();
      }
      function complete() {
        if (compareValue === count) {
          //updating field data
          return Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true
          })
            .exec()
            .then(respondWithResult(res))
            .catch(handleError(res));
        }
      }
    });
  }
}

export function productData(req, res) {
  //params id when 0

  if (req.params.id == 0) {
    let query = {};
    query["$and"] = [];
    //if filter with categoryId
    if (req.body.categoryId != undefined) {
      query["$and"].push({ category: { $in: req.body.categoryId } });
    }
    //if filter with subCategoryId
    if (req.body.subCategoryId != undefined) {
      query["$and"].push({ subcategory: { $in: req.body.subCategoryId } });
    }
    //if filter with title
    if (req.body.title != undefined) {
      query["$and"].push({ title: { $regex: req.body.title, $options: "i" } });
    }
    //getting products data as per  query
    Product.find(query).exec(function(err, products) {
      if (err) {
        //error occoured
        return handleError(res);
      } else {
        //sending response
        res.json(products);
      }
    });
  }
  //only title field needed(with id )
  //case-insensitive
  //else part when only title from client side
  //params id except 0.
  else {
    Product.find({ title: { $regex: req.body.title, $options: "i" } }).exec(
      function(err, data) {
        if (err) {
          //error occoured
          return handleError(res);
        } else {
          //sending response
          res.json(data);
        }
      }
    );
  }
}

// Deletes a Product from the DB
export function destroy(req, res) {
  //getting product id
  let productId = req.params.id;
  //getting order data of a product
  Order.find({ Product: productId }, {}).exec(function(err, order) {
    if (err) {
      //error occoured
      return handleError(res);
    }
    if (order.length > 0) {
      //while got some orders of a productId
      res.status(200).send({
        message: "There are Some Orders related to this Product!"
      });
    }
    if (order.length == 0) {
      //while no order found
      Product.findById(productId, function(err, product) {
        let imagePath = product.publicId;
        // Delete Image
        cloudinary.uploader.destroy(imagePath, function(result) {
          return Product.findById(req.params.id)
            .exec()
            .then(handleEntityNotFound(res))
            .then(removeEntity(res))
            .catch(handleError(res));
        });
      });
    } else {
      //deleting product
      return Product.findById(productId)
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
    }
  });
}
//**************menuitem graph*********
//getting all categories's menuItem count
export function noOfMenuItem(req, res) {
  var i;
  var rawData = [];
  var categoryName = [];
  var length;
  var rawDataInObj = {};
  var rawDataInObjInArray = [];
  var result = {};
  //grouping all categories basis on having products count
  Product.aggregate([
    {
      $group: {
        _id: "$categoryTitle",
        data: { $sum: 1 }
      }
    }
  ]).exec(function(err, menuItem) {
    if (err) {
      //error occoured
      return handleError(res, err);
    }
    length = menuItem.length;
    //iterating categories
    for (i = 0; i < length; i++) {
      categoryName.push(menuItem[i]._id);
      rawData.push(menuItem[i].data);
    }
    rawDataInObj = {
      data: rawData
    };
    rawDataInObjInArray.push(rawDataInObj);
    //framing into object
    result = {
      labels: categoryName,
      datasets: rawDataInObjInArray
    };
    //sending response
    res.json(result);
  });
}

// Gets a list of Products by SubCategory Id
export function bySubCat(req, res) {
  return Product.find({ subcategory: req.params.id, enable: 1 })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//all of the products getting
export function getProduct(req, res) {
  var restaurant = req.query.store;
  var locationinfo = req.query.location;
  if (locationinfo == "") {
    Location.find({ restaurantID: mongoose.Types.ObjectId(restaurant) }).then(
      location => {
        var location_id = [];
        location.map((value, index) => {
          location_id.push(value._id);
        });
        Pro_loc.aggregate([
          {
            $match: { location_id: { $in: location_id } }
          },
          {
            $group: {
              _id: "$product_id",
              location_id: { $push: "$location_id" }
            }
          }
        ])
          .then(data => {
            var product = [];
            data.map((value, index) => {
              product.push(mongoose.Types.ObjectId(value._id));
            });
            return Product.find({ _id: { $in: product } })
              .then(product => res.json({ product, data }))
              .catch(err => res.json(err));
          })
          .catch(err => console.log(err));
      }
    );
  } else {
    Pro_loc.aggregate([
      {
        $match: { location_id: mongoose.Types.ObjectId(locationinfo) }
      },
      {
        $group: { _id: "$product_id", location_id: { $push: "$location_id" } }
      }
    ]).then(data => {
      var product = [];
      data.map((value, index) => {
        product.push(mongoose.Types.ObjectId(value._id));
      });
      Product.find({ _id: { $in: product } })
        .then(product => res.json({ product, data }))
        .catch(err => res.json(err));
    });
    // return Pro_loc.find({location_id:mongoose.Types.ObjectId(locationinfo)})
    // .then(Pro_loc=>{
    //   let product_id = []
    //   Pro_loc.map((value, index)=>{
    //     product_id.push(mongoose.Types.ObjectId(value.product_id))
    //   })
    //   Product.find({_id:{$in:product_id}})
    //     .then(product=>res.json({ product, Pro_loc }))
    //     .catch(err=>console.log('errr'))
    // })
  }
}

export function updateproductenable(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  return Product.findOne({ _id: id }).then(product => {
    var enable = !product.enable;
    Product.findOneAndUpdate({ _id: id }, { enable: enable }).then(product => {
      res.json(product);
    });
  });
}

//Get location for product id
export function locationforproduct(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  return Pro_loc.aggregate([
    {
      $match: { product_id: id }
    },
    {
      $lookup: {
        from: "locations",
        localField: "location_id",
        foreignField: "_id",
        as: "location"
      }
    }
  ])
    .then(data => {
      res.json(data);
    })
    .catch(err => res.json("errrrrr"));
}

// === Mobile App ===
// Gets a list of Products by category Id & Location
export function byCategory2(req, res) {
  var store = req.query.store;
  var category_id = mongoose.Types.ObjectId(req.params.id);
  return Location.find({
    restaurantID: mongoose.Types.ObjectId(store)
  }).then(location => {
    var location_id = [];
    location.map((value, index) => {
      location_id.push(value._id);
    });
    //console.log(location_id.length);
    Pro_loc.find({ location_id: { $in: location_id } })
      .then(data => {
        var product_id = [];
        data.map((value, index) => {
          product_id.push(value.product_id);
        });
        //console.log(product_id);
        return Product.find({
          _id: { $in: product_id },
          category: category_id
        }).then(product => res.json(product));
      })
      .catch(err => {
        console.log(err);
      });
  });
}

export function show2(req, res) {
  //console.log(req);
  return Product.findById(req.params.id, { __v: false })
    .populate("location category", "categoryName locationName")
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//all of the products getting
// export function getProduct2(req, res) {
//   var restaurant = req.query.store;
//   var locationinfo = req.query.location;
//   if (locationinfo == "") {
//     Location.find({ restaurantID: mongoose.Types.ObjectId(restaurant) }).then(
//       location => {
//         var location_id = [];
//         location.map((value, index) => {
//           location_id.push(value._id);
//         });
//         Pro_loc.aggregate([
//           {
//             $match: { location_id: { $in: location_id } }
//           },
//           {
//             $group: {
//               _id: "$product_id",
//               location_id: { $push: "$location_id" }
//             }
//           }
//         ])
//           .then(data => {
//             var product = [];
//             data.map((value, index) => {
//               product.push(mongoose.Types.ObjectId(value._id));
//             });
//             return Product.find({ _id: { $in: product } })
//               .then(product => res.json({ product, data }))
//               .catch(err => res.json(err));
//           })
//           .catch(err => console.log(err));
//       }
//     );
//   } else {
//     Pro_loc.aggregate([
//       {
//         $match: { location_id: mongoose.Types.ObjectId(locationinfo) }
//       },
//       {
//         $group: { _id: "$product_id", location_id: { $push: "$location_id" } }
//       }
//     ]).then(data => {
//       var product = [];
//       data.map((value, index) => {
//         product.push(mongoose.Types.ObjectId(value._id));
//       });
//       Product.find({ _id: { $in: product } })
//         .then(product => res.json({ product, data }))
//         .catch(err => res.json(err));
//     });
//     // return Pro_loc.find({location_id:mongoose.Types.ObjectId(locationinfo)})
//     // .then(Pro_loc=>{
//     //   let product_id = []
//     //   Pro_loc.map((value, index)=>{
//     //     product_id.push(mongoose.Types.ObjectId(value.product_id))
//     //   })
//     //   Product.find({_id:{$in:product_id}})
//     //     .then(product=>res.json({ product, Pro_loc }))
//     //     .catch(err=>console.log('errr'))
//     // })
//   }
// }
