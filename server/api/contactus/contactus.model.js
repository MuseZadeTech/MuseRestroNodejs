'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
var ContactusSchema = new mongoose.Schema({
 restaurantID:{
   type:Schema.ObjectId,
   ref:'User'
 },
 location:{
   type:Schema.ObjectId,
   ref:'Location'
 },
 user:{
   type:Schema.ObjectId,
   ref:'User'
 },
 email:{
   type :String
 },
 sbj:{
   type :String
 },
 msg:{
   type :String
 },
 enable:{
 	type:Boolean,
 	default:true
 },
 createdAt:{
 	type:Date,
 	default:Date.now
 }

},{
   versionKey: false // You should be aware of the outcome after set to false
   },{ usePushEach: true });

//registerEvents ContactusSchema);
export default mongoose.model('Contactus', ContactusSchema);
 