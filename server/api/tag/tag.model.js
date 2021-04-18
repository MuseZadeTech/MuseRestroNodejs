'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './tag.events';
import {Schema} from 'mongoose';
var TagSchema = new mongoose.Schema({
 restaurantID:{
   type:Schema.ObjectId,
   ref:'User'
 },
 location:{
   type:Schema.ObjectId,
   ref:'Location'
 },
 tag:{
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
  usePushEach: true
});

registerEvents(TagSchema);
export default mongoose.model('Tag', TagSchema);
