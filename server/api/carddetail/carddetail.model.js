'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './carddetail.events';
import {Schema} from 'mongoose';

var CarddetailSchema = new mongoose.Schema({
 user:{
   type: Schema.ObjectId,
   ref: 'User'
 }, 
 //for stripe  only
 lastFourDigit:{
	type:Number
 },
 //for stripe only
 customerId:{
	type:String
 },
 createdAt:{
	type:Date,
	default:Date.now
 }
},{
  usePushEach: true
});

registerEvents(CarddetailSchema);
export default mongoose.model('Carddetail', CarddetailSchema);
