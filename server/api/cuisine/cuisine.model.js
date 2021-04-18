'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {registerEvents} from './cuisine.events';

var CuisineSchema = new mongoose.Schema({
  cuisineName:{
  	type:String
  }
},{
  usePushEach: true
});

registerEvents(CuisineSchema);
export default mongoose.model('Cuisine', CuisineSchema);
