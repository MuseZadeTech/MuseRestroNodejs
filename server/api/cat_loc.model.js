'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './cat_loc.events';
import {Schema} from 'mongoose';
var Cat_locSchema = new mongoose.Schema({
  
  category_id:{
    type:Schema.ObjectId,
    ref:'Category'
  },
  location_id:{
    type:Schema.ObjectId,
    ref: 'Location'
  },
  // category:{
  //    type:Schema.ObjectId,
  //    ref:'Category'
  //     },

  // location:{
  //   type:Schema.ObjectId, 
  //   ref:'location'
  // }
},{
  usePushEach: true
});

registerEvents(Cat_locSchema);
export default mongoose.model('Cat_loc', Cat_locSchema);
