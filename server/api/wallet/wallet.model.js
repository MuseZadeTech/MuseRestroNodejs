'use strict';
//amount 
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
import {registerEvents} from './wallet.events';
var WalletSchema = new mongoose.Schema({
  orderId: {
    type: Schema.ObjectId,
    ref: 'Order'
  }, 
  location: {
    type: Schema.ObjectId,
    ref: 'Location'
  },
  //when from order wallet document 
  //would be saved,restaurant owner id id would be receiverId,
  //in case of,restaurant owner id requested for withdrawl,
  //in that case also,receiverid would be restaurant owner id Id
  receiverId:{
    type: Schema.ObjectId,
    ref: 'User'
  },
  //when document will be saved by order,
  //sender Id would be either user id or blank
  senderId:{
    type: Schema.ObjectId,
    ref: 'User'
  },
  bankdetail:{
    type: Schema.ObjectId,
    ref: 'Accountdetail'
  },
  payableAmount:{
    type:Number
  },
  transactionID: {
    type: Number,
    default: 100000,
    unique:true
  },
  //earned by order
  amount:{
  	type:Number
  },
  //charges earned by admin
  charges:{
  	type:Number
  },
  //Credited-when getting by order collection
  //Debited-while payment is done
  // by admin to restaurant owner
  status:{
  	type:String
  },
  //this field will be saved only while
  //restaurant owner will request for
  //withdrawl
  //Pending/Confirmed/Rejected/Cancelled
  transactionStatus:{
  	type:String
  },
  //timestamp of the day
  timestamp:{
    type:Number
  },
  day:{
  	type:Number
  },
  month:{
  	type:Number
  },
  year:{
  	type:Number
  },
  createdAt:{
   	type:Date,
   	default:Date.now
  }
},{
  usePushEach: true
});

WalletSchema.plugin(autoIncrement.plugin, {
  model: 'Wallet',
  field: 'transactionID',
  startAt: 100000,
  incrementBy: 1
});


//registerEvents(WalletSchema);
export default mongoose.model('Wallet', WalletSchema);
