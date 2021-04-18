"use strict";

import mongoose from "mongoose";
import { registerEvents } from "./store.events";
import { Schema } from "mongoose";
import { interfaces } from "mocha";

var StoreSchema = new mongoose.Schema({
  storeName: {
    type: String
  },
  user_id:{
      type: Schema.Types.ObjectId
  },
  store_type_id:{
      type:Schema.ObjectId,
      ref:'StoreType'
  },
  activation: {
    type:Boolean,
    default:true
  }
});
registerEvents(StoreSchema);
export default mongoose.model("Store", StoreSchema);
