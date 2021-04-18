'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './favourite.events';
import {Schema} from 'mongoose';

var FavouriteSchema = new mongoose.Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  restaurantID: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  location:{
    type:Schema.ObjectId,
    ref:'Location'
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
   createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: { 
    type: Date 
 }
},{
  usePushEach: true
});

registerEvents(FavouriteSchema);
export default mongoose.model('Favourite', FavouriteSchema);
