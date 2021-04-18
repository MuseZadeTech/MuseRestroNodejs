/**byLocation
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/categories/restaurant/:id     ->  index byLocation
 * POST    /api/categories/:flag   tax        ->  create
 * GET     /api/categories/:id                ->  show
 * PUT     /api/categories/:id/:flag          ->  upsert
 * DELETE  /api/categories   byLocation       ->  destroy
 */

"use strict";

import jsonpatch from "fast-json-patch";
import Category from "./category.model";
import Subcategory from "../subcategory/subcategory.model";
import Product from "../product/product.model";
import Cat_loc from "../cat_loc.model";
var multiparty = require("multiparty");
var path = require("path");
var cloudinary = require("cloudinary");
var mongoose = require("mongoose");
var mkdirp = require("mkdirp");
var formidable = require("formidable");
var fs = require("fs");
//const base64url = require("base64url");
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

// Gets a list of Categories of a single restaurant
export function index(req, res) {
  return Category.find({ restaurantID: req.params.id }, { __v: false })
    .sort("sort")
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//Get Category by location Id
export function byLocation(req, res) {
  //console.log("bylocation");
  return Category.find({ location: req.params.id }, { __v: false })
    .sort("sort")
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Category from the DB
//no matter either it is enable or disable(enable:0||enable:1)
export function show(req, res) {
  return Category.findById(req.params.id, { __v: false })
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Category in the DB
export function create(req, res) {
  //creating category instance
  let category = new Category(req.body);
  category.location = req.body.locationInfo.locationId;
  //save category
  category.save(function(err) {
    if (err) {
      //error handling
      return handleError(res);
    } else {
      //sending newly created instance
      res.json(category);
    }
  });
}

//update a category
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  let id = req.params.id;
  //find a particular category data
  Category.findById(id, function(err, category) {
    if (err) {
      //handling error
      return handleError(res);
    }
    if (!category) {
      //while there is no any category by that id
      return res.status(404).send({
        message: "data not found"
      });
    }
    if (req.body.deletePublicId != undefined) {
      //deleting cloudinary image of the product
      let publicId = category.publicId;
      cloudinary.uploader.destroy(publicId, function(result) {});
    }
    //updating changes
    Category.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    })
      .exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  });
}
// Deletes a Category from the DB
export function destroy(req, res) {
  //getting category id by param
  let categoryId = req.params.id;
  //checking whether this category has sub categories or not
  //if it is,category can't be deleted
  Subcategory.find({ category: categoryId }, {}).exec(function(
    err,
    subcategory
  ) {
    if (err) {
      //handling error
      return handleError(res);
    }
    if (subcategory.length > 0) {
      //got some subcategory,
      //sending response category can't be deleted.
      res.status(200).send({
        message:
          "Category could not deleted,Delete related Sub-Categories first."
      });
    }
    if (subcategory.length == 0) {
      //if no sub category found for that category
      //then it can be deleted
      Category.findById(categoryId, function(err, category) {
        if (category.publicId != undefined) {
          let imagePath = category.publicId;
          // Delete cloudinary Image
          cloudinary.uploader.destroy(imagePath, function(result) {
            //after deleting cloudinary image
            //deleting category data
            return Category.findById(req.params.id)
              .exec()
              .then(handleEntityNotFound(res))
              .then(
                removeEntity(
                  res.status(200).send({
                    message: "Category deleted."
                  })
                )
              )
              .catch(handleError(res));
          });
        } else {
          return Category.findById(req.params.id)
            .exec()
            .then(handleEntityNotFound(res))
            .then(
              removeEntity(
                res.status(200).send({
                  message: "Category deleted."
                })
              )
            )
            .catch(handleError(res));
        }
      });
    }
  });
}

//User-end(Front-end)
//Get all Categories as well as related location by location id
export function byLocAllCat(req, res) {
  return Category.find({ location: req.params.id, enable: 1 }, {})
    .populate("location")
    .sort("sort")
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
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
  //grouping all menuitem by category title
  MenuItem.aggregate([
    { $group: { _id: "$categoryTitle", data: { $sum: 1 } } }
  ]).exec(function(err, menuItem) {
    if (err) {
      return handleError(res, err);
    }
    length = menuItem.length;
    //iterating all categorytitle
    for (i = 0; i < length; i++) {
      //framing for response
      //raw array
      categoryName.push(menuItem[i]._id);
      rawData.push(menuItem[i].data);
    }
    //raw object
    rawDataInObj = {
      data: rawData
    };
    //wrapping in array
    rawDataInObjInArray.push(rawDataInObj);
    //response object
    result = {
      labels: categoryName,
      datasets: rawDataInObjInArray
    };
    //sending response
    res.json(result);
  });
}

//Custom search by category name
export function customCategory(req, res) {
  //search category by their category name
  //using regular expression
  Category.find({
    categoryName: { $regex: req.body.categoryName, $options: "i" }
  }).exec(function(err, data) {
    if (err) {
      //error occoured
      return handleError(res);
    } else {
      //sending response
      res.json(data);
    }
  });
}

//get all enabled location
export function enableAllCategoryList(req, res) {
  //applying matching criteria
  Category.find({ location: req.params.id, enable: true }, "categoryName").exec(
    function(err, enableList) {
      if (err) {
        //handling error
        return handleError(res);
      }
      if (enableList.length == 0) {
        //while no enabled category
        return res.status(404).send({ message: "no data found" });
      }
      //sending response
      res.send(enableList);
    }
  );
}

//get all enabled category of a restaurant
export function allCategoryListByrestaurant(req, res) {
  //applying matching criteria
  Category.find(
    { restaurantID: req.params.id, enable: true },
    "categoryName"
  ).exec(function(err, enableList) {
    if (err) {
      //error handling
      return handleError(res);
    }
    if (enableList.length == 0) {
      //while no enabled category
      return res.send([]);
    }
    //sending response
    res.send(enableList);
  });
}
//Get Category by location Id
export function allCategoryForHome(req, res) {
  return Category.find(
    { location: req.params.id, enable: true },
    { __v: false }
  )
    .sort("sort")
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//updated by Dan: Get Category by location
export function getCategories(req, res) {
  var location = [];
  req.body.map((id, index) => {
    location.push(mongoose.Types.ObjectId(id._id));
  });

  if (req.params.id == "AllLocation") {
    return Cat_loc.aggregate([
      {
        $match: { location_id: { $in: location } }
      },
      {
        $group: { _id: "$category_id" }
      }
    ])
      .then(data => {
        var category = [];
        data.map((value, index) => {
          category.push(mongoose.Types.ObjectId(value._id));
        });
        return Category.find({ _id: { $in: category } })
          .then(category => res.json(category))
          .catch(err => res.json(err));
      })
      .catch(err => console.log(err));
  } else {
    return Cat_loc.find({
      location_id: mongoose.Types.ObjectId(req.params.id)
    }).then(cat_loc => {
      let category_id = [];
      cat_loc.map((value, index) => {
        category_id.push(mongoose.Types.ObjectId(value.category_id));
      });
      Category.find({ _id: { $in: category_id } })
        .then(category => res.json(category))
        .catch(err => console.log("errr"));
    });
  }
}
//dan
export function getLocationForCategory(req, res) {
  return Cat_loc.aggregate([
    {
      $match: { category_id: mongoose.Types.ObjectId(req.params.id) }
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
      return res.json(data);
    })
    .catch(err => res.json("errrrrr"));
}
//Dan creating category
export function createCategory(req, res) {
  let data = {};
  let location = {};
  //console.log(req.body.parent_category);
  location = req.body.submitLocation;
  data.categoryName = req.body.categoryName;
  data.imageUrl = req.body.imageUrl;
  data.enable = req.body.enable;
  data.sort = req.body.sort;
  data.restaurantID = mongoose.Types.ObjectId(req.body.restaurantID);
  if (req.body.parent_category) {
    data.parent_category = mongoose.Types.ObjectId(req.body.parent_category);
  }

  Category.create(data)
    .then(category => {
      location.map((value, index) => {
        Cat_loc.create({
          category_id: mongoose.Types.ObjectId(category._id),
          location_id: mongoose.Types.ObjectId(value)
        })
          .then(cat_loc => res.json(cat_loc))
          .catch(err => res.json("errrrrrr"));
      });
    })
    .catch(err => res.json(err));
}
//Dan updaing category
export function updateCategory(req, res) {
  let data = {};
  let location = {};
  location = req.body.submitLocation;
  data.categoryName = req.body.categoryName;
  if (req.body.imageUrl) {
    data.imageUrl = req.body.imageUrl;
  }
  data.enable = req.body.enable;
  data.sort = req.body.sort;
  data.parent_category = req.body.parent_category;
  Category.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    data
  )
    .then(category => {
      Cat_loc.remove({ category_id: mongoose.Types.ObjectId(req.params.id) })
        .then(cat_loc => {
          location.map((value, index) => {
            Cat_loc.create({
              category_id: mongoose.Types.ObjectId(category._id),
              location_id: mongoose.Types.ObjectId(value)
            })
              .then(cat_loc => res.json("success"))
              .catch(err => res.json("erro"));
          });
        })
        .catch(err => res.json("erro"));
    })
    .catch(err => res.json("erro occured!!!"));
}
//Dan image uploading;
export function uploadImageCategory(req, res) {
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
  if (config.useS3) {
    AWSConfig.uploadToS3(
      `public/Stores/${storetype}/${storeID}/App/Category/${filename}.png`,
      buffer
    );
  } else {
    fs.writeFileSync(
      path.normalize(
        `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${storeID}/App/Category/${filename}.png`
      ),
      buffer
    );
  }
  res.json("success");

  // console.log(path.normalize(`${__dirname}/../../../../react-admin`))
  // img.mv(path.normalize(`${__dirname}/../../../../react-admin/public/public/${storetype}/${storename}/App/Category/${filename}.png`), function(err) {
  //    if (err)
  //    {
  //     mkdirp(`${__dirname}/../../../../react-admin/public/public/${storetype}/${storename}/App/Category/`, function (err) {
  //       if (err) {
  //         res.json('please try again!');
  //       }
  //       else {
  //         file.mv(path.normalize(`${__dirname}/../../../../react-admin/public/public/${storetype}/${storename}/App/Category/${filename}.png`), function(err) {
  //           if(err) res.json(err)
  //           res.json('File uploaded!')
  //         })
  //       }
  //      });
  //    }
  //    res.send('File uploaded!');
  //  });
}
//updated by Dan: updating enable property
export function updateCategoryEnable(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  return Category.findOne({ _id: id }).then(category => {
    var enable = !category.enable;
    Category.findOneAndUpdate({ _id: id }, { enable: enable }).then(
      category => {
        res.json(category);
      }
    );
  });
}

// === Mobile App ===
