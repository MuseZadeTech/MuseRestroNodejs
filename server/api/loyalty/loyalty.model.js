'use strict';

import mongoose from 'mongoose'
require('mongoose-double')(mongoose);
import {registerEvents} from './loyalty.event';
var SchemaTypes = mongoose.Schema.Types;
import {Schema} from 'mongoose';
var LoyaltySchema = new mongoose.Schema({

  minPoint:{
      type: String
  },
  minAmount:{
      type:String
  },
  percentageOff:{
      type:Number
  },
  restaurantID:{
    type:Schema.ObjectId,
   ref:'User'
  },
  rewardEnable:{
    type: Boolean
  },
  rewardEarned:{
    type: String,
  },
  rewardType:{
    type: String
  },
  valueSpent:{
    type: String
  },
  totalValueSpent: {
    type: String
  },
  createdAt:{
  	type:Date,
  	default:Date.now
  },
  enable:{
      type: Boolean
  },
  updatedAt:{
  	type:Date
  }
},{
  usePushEach: true
});

registerEvents(LoyaltySchema);
export default mongoose.model('Loyalty', LoyaltySchema);
