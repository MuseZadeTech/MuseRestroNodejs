 'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './cuisineLocation.events';
import {Schema} from 'mongoose';
var CuisineLocationSchema = new mongoose.Schema({
	cuisineId:{
		type: Schema.ObjectId,
    ref: 'Cuisine'
  },
  location: {
    type: Schema.ObjectId,
    ref: 'Location'
  }
},{
  usePushEach: true
});

registerEvents(CuisineLocationSchema);
export default mongoose.model('CuisineLocation', CuisineLocationSchema);
