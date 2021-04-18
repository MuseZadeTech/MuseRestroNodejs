"use strict";

import mongoose from "mongoose";
import { registerEvents } from "./setting.events";
import { Schema } from "mongoose";

var SettingSchema = new mongoose.Schema(
  {
    restaurantID: {
      type: Schema.ObjectId,
      ref: "User"
    },
    location: {
      type: Schema.ObjectId,
      ref: "Location"
    },
    globalVAT: {
      type: Number
    },
    loyalityPercentage: {
      type: Number,
      default: 0
    },
    minLoyalityPoints: {
      type: Number,
      default: 0
    },
    loyalityProgram: {
      type: Boolean,
      default: false
    },
    //min order value on which loyality calculated
    minOrdLoyality: {
      type: Number
    },
    appTheme: {
      type: Array
    },
    // stateTax:{
    //   type:Array
    // },
    stateTax: [
      {
        taxName: {
          type: String
        },
        taxRate: {
          type: Number
        }
      }
    ],
    paymentMethod: {
      type: Array
    },
    storeHours: {
      type: Array
    },
    deliveryArea: {
      type: Array
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

registerEvents(SettingSchema);
export default mongoose.model("Setting", SettingSchema);
