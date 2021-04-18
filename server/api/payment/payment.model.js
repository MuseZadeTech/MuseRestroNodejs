'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './payment.events';
import {Schema} from 'mongoose';
var PaymentSchema = new mongoose.Schema({
 //Here, restaurant id is like seller
restaurantID:{
type: Schema.ObjectId,
ref: 'User'
},
withdrawAmount:{
	type:Number
},
withdrawStatus:{
	type:String,
	default:'Pending'
},
//for pending status flag would be 1
//if it is processed by admin would be 2
//success for 3
//and if cancelled will show 0
flag:{
	type:Number,
	default:1
},
// Bank detail of admin(restaurant Admin account)
paymentOption:{},
createdAt: {
   type: Date,
default: Date.now
},
cancelledAt: {
  type: Date
}

},{
  usePushEach: true
});

registerEvents(PaymentSchema);
export default mongoose.model('Payment', PaymentSchema);
