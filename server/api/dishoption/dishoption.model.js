'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './dishoption.events';
import {Schema} from 'mongoose';
var DishoptionSchema = new mongoose.Schema({
  restaurantID:{
    type:Schema.ObjectId,
    ref:'User'
  },
  optionName: {
    type: String
  },

  enable:{
  	type:Boolean,
    default:true 
  },
  price: {
    type: String
  },
  store_id: {
    type: Schema.ObjectId,
    ref:'User'
  },
  admin_enable: {
    type: Boolean,
    default: false
  },
  createdAt:{
  	type:Date,
  	default:Date.now
  },
  updatedAt:{
  	type:Date
  }
},{
  usePushEach: true
});

registerEvents(DishoptionSchema);
export default mongoose.model('Dishoption', DishoptionSchema);
