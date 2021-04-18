'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './category.events';
import {Schema} from 'mongoose';
var CategorySchema = new mongoose.Schema({
  restaurantID:{
    type:Schema.ObjectId,
    ref:'User'
  },
  location:{
    type:Schema.ObjectId,
    ref:'Location'
  },
  parent_category: {
    type: Schema.ObjectId,
    ref:'Parentcategory'
  },
  locationInfo:{},
  categoryName:{
  	type:String
  },
  sort:{
  	type:Number
  },
  publicId:{
  	type:String
  },
  imageUrl:{
  	type:String
  },
  enable:{
    type:Boolean,
    default:1
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

registerEvents(CategorySchema);
export default mongoose.model('Category', CategorySchema);
