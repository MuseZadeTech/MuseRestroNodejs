"use strict";

import mongoose from "mongoose";
require("mongoose-double")(mongoose);
import { registerEvents } from "./location.events";
var SchemaTypes = mongoose.Schema.Types;
import { Schema } from "mongoose";
var LocationSchema = new mongoose.Schema(
  {
    restaurantID: {
      type: Schema.ObjectId,
      ref: "User"
    },
    restaurantType: {
      type: String
    },
    taxExist: {
      type: Boolean
    },
    //cuisine extra field added
    cuisine: {
      type: Array
    },
    // tax:[{
    //   text:{
    //     type:String
    //   },
    //   //taxRate is replaced by id
    //   id:{
    //     type:SchemaTypes.Double
    //   }
    // }],
    tax: {
      type: String
    },
    latitude: {
      type: SchemaTypes.Double
    },
    longitude: {
      type: SchemaTypes.Double
    },
    radius: {
      type: SchemaTypes.Double
    },
    hasDelivery: {
      type: Boolean
    },
    //all delivery area info
    deliveryInfo: {},
    minDeliveryAmount: {
      type: Number
    },

    //updated by Dan 2019 6.22
    postalCode: {
      type: Number
    },

    featured: {
      type: Boolean
    },
    contactPerson: {
      type: Schema.ObjectId,
      ref: "User"
    },
    contactNumber: {
      type: Number
    },
    alternateTelephone: {
      type: String
    },
    //added to calculate average rating
    rating: {
      type: Number,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    //************
    email: {
      type: String
    },
    enable: {
      type: Boolean,
      default: true
    },
    alternateEmail: {
      type: String
    },
    locationName: {
      type: String
    },
    alwaysReachable: {
      type: Boolean
    },
    msgNonOperatingHours: {
      type: String
    },
    // workingHours:[{
    //   from:{
    //     type:Number
    //   },
    //   to:{
    //     type:Number
    //   },
    //   day:{
    //     type:String
    //   }
    // }],
    //

    workingHours: {},
    address: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String
    },
    zip: {
      type: Number
    },
    currency: {
      type: String
    },
    aboutUs: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    }
  },
  {
    usePushEach: true
  }
);

registerEvents(LocationSchema);
export default mongoose.model("Location", LocationSchema);
