'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './accountdetail.events';
import {Schema} from 'mongoose';
var AccountdetailSchema = new mongoose.Schema({
 user:{
   type: Schema.ObjectId,
   ref: 'User'
 }, 
 accountHolderName:{
 	type:String
 },
 ifscCode:{
 	type:String
 },
 bankAddress:{
	type:String
 },
 bankName:{
	type:String
 },
 primaryAccount:{
  	type:Boolean,
  	default:false
 },
 accountNumber:{
 	type:Number
 },
 createdAt:{
 	type:Date,
 	default:Date.now
 }
},{
  usePushEach: true
});

registerEvents(AccountdetailSchema);
export default mongoose.model('Accountdetail', AccountdetailSchema);
