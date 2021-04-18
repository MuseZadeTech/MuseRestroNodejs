'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './deliveryarea.events';
import {Schema} from 'mongoose';
var DeliveryareaSchema = new mongoose.Schema({

restaurantID:{
	type:Schema.ObjectId,
	ref:'User'
},
city:{
	type:String
},
zone:{
	type:String
},
minAmount:{
	type:Number
},
charges:{
	type:Number
},
createdAt:{
	type:Date,
    default:Date.now
},
updatedAt:{
	type:Date
}
},{
  usePushEach: true
});

registerEvents(DeliveryareaSchema);
export default mongoose.model('Deliveryarea', DeliveryareaSchema);
