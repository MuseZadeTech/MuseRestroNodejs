'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './coupon_loc.events';
import {Schema} from 'mongoose';
var Coupon_locSchema = new mongoose.Schema({
  
  coupon_id:{
    type:Schema.ObjectId,
    ref:'Coupon'
  },
  location_id:{
    type:Schema.ObjectId,
    ref: 'Location'
  },

},{
  usePushEach: true
});

registerEvents(Coupon_locSchema);
export default mongoose.model('Coupon_loc', Coupon_locSchema);
