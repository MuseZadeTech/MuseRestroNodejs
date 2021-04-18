'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
var BookingtableSchema = new mongoose.Schema({
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
 tableNo:{
   type:Number
 },
 numberOfSeats:{
   type:Number
 },
 bookingTime:{
   type:String
 },
 //converted into minutes
 convertedTime:{
   type:Number
 },
 bookingDate:{
   type:Date
 },
 status:{
 	type:String,
 	default:"Pending"
 },
 createdAt:{
 	type:Date,
 	default:Date.now
 }

},{
   versionKey: false // You should be aware of the outcome after set to false
   },{ usePushEach: true });

//registerEvents BookingtableSchema);
export default mongoose.model('Bookingtable', BookingtableSchema);
 