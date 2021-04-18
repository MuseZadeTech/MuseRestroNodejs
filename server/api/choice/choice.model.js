'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './choice.events';
import {Schema} from 'mongoose';
var ChoiceSchema = new mongoose.Schema({
  restaurantID:{
    type:Schema.ObjectId,
    ref:'User'
  },
  ChoiceName: {
    type: String
  },

  ChoiceOptions:{
    type: Array
  },

  enable:{
  	type:Boolean,
    default:true 
  },

  enableChoice:{
    type: String,
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

registerEvents(ChoiceSchema);
export default mongoose.model('Choice', ChoiceSchema);
