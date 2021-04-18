'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './pro_loc.events';
import {Schema} from 'mongoose';
var Pro_locSchema = new mongoose.Schema({
  
  product_id:{
    type:Schema.ObjectId,
    ref:'Product'
  },
  location_id:{
    type:Schema.ObjectId,
    ref: 'Location'
  },

},{
  usePushEach: true
});

registerEvents(Pro_locSchema);
export default mongoose.model('Pro_loc', Pro_locSchema);
