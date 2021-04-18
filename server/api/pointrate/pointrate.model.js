'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './pointrate.events';
import {Schema} from 'mongoose';
var PointrateSchema = new mongoose.Schema({
  restaurantID:{
    type:Schema.ObjectId,
    ref:'User'
  },
  points:{
  	type:Number
  },
  orderAmount:{
  	type:Number
  }
},{
  usePushEach: true
});

registerEvents(PointrateSchema);
export default mongoose.model('Pointrate', PointrateSchema);
