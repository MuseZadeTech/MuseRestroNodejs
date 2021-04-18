'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './productrating.events';
import {Schema} from 'mongoose';
var ProductratingSchema = new mongoose.Schema({
restaurantID:{
   type: Schema.ObjectId,
   ref: 'User'
},
location:{
    type:Schema.ObjectId,
    ref:'Location'
  },
order:{
   type: Schema.ObjectId,
   ref: 'Order'
},
category:{
   type: Schema.ObjectId,
   ref: 'Category'
},
subcategory:{
   type: Schema.ObjectId,
   ref: 'Subcategory'
},
product:{
   type: Schema.ObjectId,
   ref: 'Product'
},
user:{
   type: Schema.ObjectId,
   ref: 'User'
},
rating:{
	type:Number,
  default:0
},
ratingCount:{
    type:Number,
    default:0
  },
comment:{
   type:String
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

registerEvents(ProductratingSchema);
export default mongoose.model('Productrating', ProductratingSchema);
