/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /y              ->  index
 * POST    /y              ->  create
 * GET     /y/:id          ->  show
 * PUT     /y/:id          ->  upsert
 * PATCH   /y/:id          ->  patch
 * DELETE  /y/:id          ->  destroy
 */

"use strict";

import jsonpatch from "fast-json-patch";
import Setting from "./setting.model";
import { settings } from "cluster";
var fs = require("fs");
var mkdirp = require("mkdirp");
var mongoose = require("mongoose");
const config = require("../../config/environment");
const AWSConfig = require("../../config/aws");

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      // eslint-disable-next-line prefer-reflect
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

// Gets a list of Settings
export function index(req, res) {
  return Setting.find({ restaurantID: req.user._id }, { __v: false })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Setting from the DB
export function show(req, res) {
  return Setting.findOne({ restaurantID: req.params.id }, { __v: false }).exec(
    function (err, seting) {
      if (err) {
        return handleError(res);
      }
      if (!seting) {
        return res.json("not found");
      }
      res.json(seting);
    }
  );
}

// Creates a new Setting in the DB
export function create(req, res) {
  return Setting.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Gets a single Setting from the DB
export function loyalty(req, res) {
  return Setting.find({ location: req.params.id }, {})
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Upserts the given Setting in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, "_id");
  }
  return Setting.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  })
    .exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Setting from the DB
export function destroy(req, res) {
  return Setting.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

//AppSetting carousel image uploading

export function carouselImageUpload(req, res) {
  //var carouselImage = (req.body).carouselImage;
  // var carouselUrl = (req.body).carouselUrl;
  console.log("HERE");
  var storename = req.body.storename;
  var storetype = req.body.storetype;
  var bannerUrl = req.body.bannerUrl;
  var about = req.body.about;
  var appColor = req.body.appColor;
  var appBanner = req.body.appBanner;
  var user_id = req.body.user_id;
  var enable = req.body.enable;
  var carousel1 = req.body.carousel1;
  var carouselUrl1 = req.body.carouselUrl1;
  var carousel2 = req.body.carousel2;
  var carouselUrl2 = req.body.carouselUrl2;
  var carousel3 = req.body.carousel3;
  var carouselUrl3 = req.body.carouselUrl3;
  var carouselUrl = [carouselUrl1, carouselUrl2, carouselUrl3];
  var path = require("path");
  //console.log("appBanner", appBanner);
  mkdirp(
    //`${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${storename}/App/Carousel/`,
    `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${user_id}/App/Carousel/`,
    function (err) {
      if (err) {
        console.log(err);
        res.json("please try again!");
      }
      if (appBanner) {
        var bannerImage = appBanner.replace(/^data:image\/\w+;base64,/, "");
        var buffer_bannerImage = new Buffer(bannerImage, "base64");
        if (config.useS3) {
          AWSConfig.uploadToS3(
            //`public/Stores/${storetype}/${storename}/App/Carousel/${bannerUrl}.png`,
            `public/Stores/${storetype}/${user_id}/App/Carousel/${bannerUrl}.png`,
            buffer_bannerImage
          );
        } else {
          console.log("bannerUrlz", bannerUrl);
          fs.writeFileSync(
            path.normalize(
              //`${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${storename}/App/Carousel/${bannerUrl}.png`
              `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${user_id}/App/Carousel/${bannerUrl}.png`
            ),
            buffer_bannerImage
          );
        }
      }
      if (carousel1) {
        var carouselImage1 = carousel1.replace(/^data:image\/\w+;base64,/, "");
        var buffer_carousel1 = new Buffer(carouselImage1, "base64");
        if (config.useS3) {
          AWSConfig.uploadToS3(
            //`public/Stores/${storetype}/${storename}/App/Carousel/${carouselUrl1}.png`,
            `public/Stores/${storetype}/${user_id}/App/Carousel/${carouselUrl1}.png`,
            buffer_carousel1
          );
        } else {
          fs.writeFileSync(
            path.normalize(
              // `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${storename}/App/Carousel/${carouselUrl1}.png`
              `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${user_id}/App/Carousel/${carouselUrl1}.png`
            ),
            buffer_carousel1
          );
        }
      }

      if (carousel2) {
        var carouselImage2 = carousel2.replace(/^data:image\/\w+;base64,/, "");
        var buffer_carousel2 = new Buffer(carouselImage2, "base64");
        if (config.useS3) {
          AWSConfig.uploadToS3(
            //`public/Stores/${storetype}/${storename}/App/Carousel/${carouselUrl2}.png`,
            `public/Stores/${storetype}/${user_id}/App/Carousel/${carouselUrl2}.png`,
            buffer_carousel2
          );
        } else {
          fs.writeFileSync(
            path.normalize(
              // `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${storename}/App/Carousel/${carouselUrl2}.png`
              `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${user_id}/App/Carousel/${carouselUrl2}.png`
            ),
            buffer_carousel2
          );
        }
      }

      if (carousel3) {
        var carouselImage3 = carousel3.replace(/^data:image\/\w+;base64,/, "");
        var buffer_carousel3 = new Buffer(carouselImage3, "base64");
        if (config.useS3) {
          AWSConfig.uploadToS3(
            //`public/Stores/${storetype}/${storename}/App/Carousel/${carouselUrl3}.png`,
            `public/Stores/${storetype}/${user_id}/App/Carousel/${carouselUrl3}.png`,
            buffer_carousel3
          );
        } else {
          fs.writeFileSync(
            path.normalize(
              // `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${storename}/App/Carousel/${carouselUrl3}.png`
              `${__dirname}/../../../../react-admin/public/public/Stores/${storetype}/${user_id}/App/Carousel/${carouselUrl3}.png`
            ),
            buffer_carousel3
          );
        }
      }

      //  if(carouselImage.length!=0){
      //   carouselImage.map((image, index)=>{
      //     var data = image.replace(/^data:image\/\w+;base64,/, "");
      //     var buffer = new Buffer(data, 'base64');
      //     mkdirp(`${__dirname}/../../../../react-admin/public/public/${storetype}/${storename}/App/Carousel/`, function (err) {
      //           if (err) {
      //             res.json('please try again!');
      //           }
      //     fs.writeFileSync(path.normalize(`${__dirname}/../../../../react-admin/public/public/${storetype}/${storename}/App/Carousel/${carouselUrl[index]}.png`), buffer);

      //     })
      //   });
      //  }

      Setting.findOne({ restaurantID: mongoose.Types.ObjectId(user_id) }).then(
        (setting) => {
          if (!setting) {
            Setting.create({
              restaurantID: mongoose.Types.ObjectId(user_id),
              appTheme: {
                appBanner: bannerUrl,
                about: about,
                appColor: appColor,
                enable: enable,
                carouselUrl: carouselUrl,
              },
            })
              .then((setting) => {
                return res.json(setting);
              })
              .catch((err) => {
                res.json(err);
              });
          } else {
            var Theme = setting.appTheme[0];
            if (!appBanner || !bannerUrl) {
              console.log("appBanner1", appBanner);
              console.log("bannerUrl1", bannerUrl);
              bannerUrl = Theme.appBanner;
              console.log("appBanner", appBanner);
              console.log("bannerUrl", bannerUrl);
            }
            if (!carouselUrl1 || !carousel1) {
              carouselUrl1 = Theme.carouselUrl[0];
            }
            if (!carouselUrl2 || !carousel2) {
              carouselUrl2 = Theme.carouselUrl[1];
            }
            if (!carouselUrl3 || !carousel3) {
              carouselUrl3 = Theme.carouselUrl[2];
            }
            carouselUrl = [carouselUrl1, carouselUrl2, carouselUrl3];
            Setting.findOneAndUpdate(
              { restaurantID: mongoose.Types.ObjectId(user_id) },
              {
                restaurantID: mongoose.Types.ObjectId(user_id),
                appTheme: {
                  appBanner: bannerUrl,
                  about: about,
                  appColor: appColor,
                  carouselUrl: carouselUrl,
                  enable: enable,
                },
              }
            )
              .then((setting) => {
                return res.json(setting);
              })
              .catch((err) => {
                res.json(err);
              });

            // var Theme = setting.appTheme[0];
            //   if(appBanner!=''){
            //     if(carouselImage.length!=0){
            //       Setting.findOneAndUpdate({ restaurantID: mongoose.Types.ObjectId(user_id) }, { restaurantID: mongoose.Types.ObjectId(user_id), appTheme: { appBanner: bannerUrl, about: about, appColor: appColor, carouselUrl: carouselUrl, carouselImage: carouselImage, enable: enable }})
            //       .then(setting=>{
            //         res.json(setting)
            //       })
            //       .catch(err=>{
            //         res.json(err)
            //       })
            //     }
            //     else{
            //       Setting.findOneAndUpdate({ restaurantID: mongoose.Types.ObjectId(user_id) }, { restaurantID: mongoose.Types.ObjectId(user_id), appTheme: { appBanner: bannerUrl, about: about, appColor: appColor, enable: enable, carouselUrl: Theme.carouselUrl }})
            //       .then(setting=>{
            //         res.json(setting)
            //       })
            //       .catch(err=>{
            //         res.json(err)
            //       })
            //     }

            //   }
            //   else{console.log('no appbanner')
            //     if(carouselImage.length!=0){
            //       Setting.findOneAndUpdate({ restaurantID: mongoose.Types.ObjectId(user_id) }, { restaurantID: mongoose.Types.ObjectId(user_id), appTheme: {  appBanner: Theme.appBanner, about: about, appColor: appColor, carouselUrl: carouselUrl, carouselImage: carouselImage, enable: enable }})
            //       .then(setting=>{
            //         res.json(setting)
            //       })
            //       .catch(err=>{
            //         res.json(err)
            //       })
            //     }
            //     else{console.log(Theme.carouselUrl, Theme.appBanner)
            //       Setting.findOneAndUpdate({ restaurantID: mongoose.Types.ObjectId(user_id) }, { restaurantID: mongoose.Types.ObjectId(user_id), appTheme: {  appBanner: Theme.appBanner, about: about, appColor: appColor, enable: enable, carouselUrl: Theme.carouselUrl }})
            //       .then(setting=>{
            //         res.json(setting)
            //       })
            //       .catch(err=>{
            //         res.json(err)
            //       })
            //     }

            //   }
          }
        }
      );
    }
  );
}

//Updating state tax 2019.9.12

export function update(req, res) {
  var settingData = req.body;
  //console.log(settingData);
  settingData.restaurantID = mongoose.Types.ObjectId(req.params.id);
  Setting.findOne({ restaurantID: mongoose.Types.ObjectId(req.params.id) })
    .then((setting) => {
      if (!setting) {
        //console.log("setting");
        Setting.create(settingData)
          .then((setting) => {
            //console.log(setting);
            res.json(setting);
          })
          .catch((err) => {
            res.json(err);
          });
      } else {
        return Setting.findOneAndUpdate(
          { restaurantID: mongoose.Types.ObjectId(req.params.id) },
          settingData
        )
          .then((setting) => {
            return res.json(setting);
          })
          .catch((err) => {
            res.json(err);
          });
      }
    })
    .catch((err) => res.json("one erro"));
}

export function activation(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  return Setting.findOne({ restaurantID: id }).then((setting) => {
    var appTheme = setting.appTheme[0];
    var enable = !setting.appTheme[0].enable;
    appTheme.enable = enable;
    Setting.findOneAndUpdate({ restaurantID: id }, { appTheme: appTheme }).then(
      (setting) => {
        res.json(setting);
      }
    );
  });
}

// === Mobile App ===
// Get Avilable Sales Tax for Store
export function getAllSalesTax(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  Setting.aggregate([
    {
      $match: { restaurantID: id },
    },

    // {
    //   $unwind: "$stateTax"
    // },
    //{ $group: { _id: "$stateTax" } },
    //{ $group: { _id: { stateTax: "$stateTax" } } },
    // {
    //   $unwind: "$stateTax"
    // }
    {
      $project: {
        _id: 0,
        stateTax: 1,
        // "stateTax.taxRate": 1,
        // "stateTax.taxName": 1,
        // "stateTax._id": 1
      },
    },
    // {
    //   $unwind: "$stateTax"
    // }
  ])
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json({ data: "Data Not Found" }));
}

// Get City Tax by stateTax ID 4/12/20
export function getCityTax(req, res) {
  var Taxid = req.params.id;
  var Taxid = mongoose.Types.ObjectId(Taxid);
  Setting.aggregate([
    {
      $project: {
        _id: 0,
        stateTax: 1,
      },
    },
    {
      $unwind: "$stateTax",
    },
    {
      $match: { "stateTax._id": Taxid },
    },
  ])
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json({ data: "Data Not Found" }));
}

// Get Store Setting By Store ID
export function StoreSettings(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  Setting.aggregate([
    {
      $match: { restaurantID: id },
    },
    {
      $lookup: {
        from: "stores",
        localField: "restaurantID",
        foreignField: "user_id",
        as: "stores",
      },
    },
    // {
    //   $unwind: "$stores"
    // },
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
        "appTheme.appBanner": {
          $concat: [
            config.WebsiteURL,
            "/public/Stores/",
            "$storetypes.storeTypeID",
            "/",
            { $toString: "$restaurantID" },
            "/App/Carousel/",
            { $toString: { $toLong: "$appTheme.appBanner" } },
            ".png",
          ],
        },
        "appTheme.carouselUrl": {
          $map: {
            input: "$appTheme.carouselUrl",
            as: "carouselUrls",
            in: {
              $concat: [
                config.WebsiteURL,
                "/public/Stores/",
                "$storetypes.storeTypeID",
                "/",
                { $toString: "$restaurantID" },
                "/App/Carousel/",
                "$$carouselUrls",
                ".png",
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        createdAt: 0,
        __v: 0,
        "paymentMethod.merchantAccount": 0,
        "paymentMethod.userID": 0,
        "paymentMethod.merchantName": 0,
        loyalityProgram: 0,
        minLoyalityPoints: 0,
        loyalityPercentage: 0,
        stores: 0,
        "storetypes._id": 0,
        "storetypes.storeOwners": 0,
        "storetypes.__v": 0,
      },
    },
  ])
    .exec()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => res.json({ data: "Data Not Found", err }));
}
