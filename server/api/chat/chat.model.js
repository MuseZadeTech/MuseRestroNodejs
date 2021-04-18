'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
var ChatSchema = new mongoose.Schema({
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
 conversation:{
   type :Array,
   default:[]
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

//registerEvents ChatSchema);
export default mongoose.model('Chat', ChatSchema);
 