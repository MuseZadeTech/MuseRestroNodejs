"use strict";

import mongoose from "mongoose";
import { registerEvents } from "./product.events";
import { Schema } from "mongoose";
var ProductSchema = new mongoose.Schema(
  {
    restaurantID: {
      type: Schema.ObjectId,
      ref: "User"
    },

    location: {
      type: Schema.ObjectId,
      ref: "Location"
    },

    category: {
      type: Schema.ObjectId,
      ref: "Category"
    },

    //new field added post data
    categoryTitle: {
      type: String
    },

    subcategory: {
      type: Schema.ObjectId,
      ref: "Subcategory"
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

    title: {
      type: String
    },

    brand: {
      type: String
    },

    description: {
      type: String
    },

    tags: {
      type: Array
    },

    tag: {
      type: Schema.ObjectId,
      ref: "Tag"
    },

    imageUrl: {
      type: String
    },

    publicId: {
      type: String
    },

    enable: {
      type: Boolean,
      default: true
    },

    extraIngredients: [
      {
        dishOption: {
          type: String
        },
        dishOptionPrice: {
          type: Number
        }
      }
    ],
    //variants array has been updated
    variants: {
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

registerEvents(ProductSchema);
export default mongoose.model("Product", ProductSchema);
