'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
var auth = require('../../auth/auth.service');
import {registerEvents} from './coupan.events';
var CoupanSchema = new mongoose.Schema({
	restaurantID:{
		type:Schema.ObjectId,
	   ref:'User'
	},
  location:{
  	type: Array
  },
  enable:{
    type:Boolean,
    default:true
  },
  couponName:{
  	type:String
  },
  offPrecentage:{
    type:Number
  },
  applicableTo:{
    type:String
  },
  applicableFrom:{
    type:String
  },
  applicableToTimeStamp:{
    type:Number
  },
  applicableFromTimeStamp:{
    type:Number
  },
  description:{
    type:String
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

registerEvents(CoupanSchema);
export default mongoose.model('Coupan', CoupanSchema);
