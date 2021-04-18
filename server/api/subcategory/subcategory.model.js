'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './subcategory.events';
import {Schema} from 'mongoose';
var SubcategorySchema = new mongoose.Schema({
  title:{
  	type:String
  },
  enable:{
    type:Boolean,
    default:1
  },
  restaurantID:{
    type:Schema.ObjectId,
    ref:'User'
  },
  location:{
    type:Schema.ObjectId,
    ref:'Location'
  },
  category:{
  	type:Schema.ObjectId,
  	ref:'Category'
  },
  createdAt:{
  	type:Date,
  	default:Date.now()
  },
  updatedAt:{
  	type:Date
  }
},{
  usePushEach: true
});

registerEvents(SubcategorySchema);
export default mongoose.model('Subcategory', SubcategorySchema);
