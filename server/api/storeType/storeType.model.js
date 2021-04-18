"use strict";

import mongoose from "mongoose";
import { registerEvents } from "./storeType.events";
import { Schema } from "mongoose";

var StoreTypeSchema = new mongoose.Schema({
  storeTypeID: {
    type: String
  },
  storeTypeName: {
    type: String
  },
  storeOwners: {
    type: Array,
    default: []
  }
});
registerEvents(StoreTypeSchema);
export default mongoose.model("StoreType", StoreTypeSchema);
