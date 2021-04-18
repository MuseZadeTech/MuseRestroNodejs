'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './ordertrack.events';
import {Schema} from 'mongoose';
var OrdertrackSchema = new mongoose.Schema({
  deliveryBy:{
    type: Schema.ObjectId,
    ref: 'User'
  },
  order:{
  	type:Schema.ObjectId,
  	ref:'Order'
  },
  latLongInfo:{
  	type:Array
  },
  user:{
    type: Schema.ObjectId,
    ref: 'User'
  },
  restaurantID: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
  
},{
  usePushEach: true
});

registerEvents(OrdertrackSchema);
export default mongoose.model('Ordertrack', OrdertrackSchema);
