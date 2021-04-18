'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
var NewsSchema = new mongoose.Schema({
 restaurantID:{
   type:Schema.ObjectId,
   ref:'User'
 },
 title:{
 	type:String
 },
 description:{
 	type:String
 },
 image:{
 	type:String
 },
 deleteKey:{
 	type:String
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

//registerEvents(NewsSchema);
export default mongoose.model('News', NewsSchema);