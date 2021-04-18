'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './notification.events';
import {Schema} from 'mongoose';
var NotificationSchema = new mongoose.Schema({
  order: {
    type: Schema.ObjectId,
    ref: 'Order'
  },
  location: {
    type: Schema.ObjectId,
    ref: 'Location'
  },
  priceGrandTotal:{
  	type:Number
  },
  orderID:{
  	type:Number
  },
  readNotification:{
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{
  usePushEach: true
});

registerEvents(NotificationSchema);
export default mongoose.model('Notification', NotificationSchema);
