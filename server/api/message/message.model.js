'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {registerEvents} from './message.events';
 
var MessageSchema = new mongoose.Schema({
    message: {
		type:String
	},
    //seller or user
	sentBy:{
		type:String
	}, 
	senderRead:{
		type:Boolean,
		default:true
	},
	receiverRead:{
		type:Boolean,
		default:false
	},
	sender: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	receiver: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	//User/Owner/Admin
    senderRole:{
    	type:String
    },
    //User/Owner/Admin
    receiverRole:{
    	type:String
    },
    timestamp:{
    	type:Number
    },
	createdAt: {
		type: Date,
		default: Date.now
	}
},{
  usePushEach: true
});

registerEvents(MessageSchema);
export default mongoose.model('Message', MessageSchema);
