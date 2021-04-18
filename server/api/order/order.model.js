
'use strict'; 
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
import {registerEvents} from './order.events';
var OrderSchema = new mongoose.Schema({
	productDetails: {
    type: Array,
  }, 
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  loyalty:{
    type:Number
  },
  taxInfo:{},
  coupon:{},
  shippingAddress:{},
  productRating:{
    type:Array,
    default:[]
  },
  deliveryBy:{
    type: Schema.ObjectId,
    ref: 'User'
  },
  deliveryByName:{
    type:String
  },
  position:{},
  assigned:{
    type:Boolean,
    default:0
  },
  assignedDate:{
    type:Date
  },
  deliveryCharge:{
    type:String 
  },
  userNotification:[{}],
  paymentStatus:{
    type :String,
    default:'Pending'
  },
  restaurantID: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  payment:{
    transactionId:{
      type:String
    },
    paymentType:{
      type:String
    },
    paymentStatus:{
      type:Boolean,
      default:false
    }
  },
  restaurantName:{
    type:String
  },
  locationName:{
    type:String
  },
  subTotal:{
    type:Number
  },
  location: {
    type: Schema.ObjectId,
    ref: 'Location'
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  subcategory: {
    type: Schema.ObjectId,
    ref: 'Subcategory'
  },
  orderType:{
    type:String 
  },
  paymentOption:{
    type:String
  },
  userInfo: {
    name: '',
    email: '',
    address: '',
    role: '',
    pincode:'',
    contactNumber:''
  },
  date: {
    type: Number
  },
 grandTotal:{
  type:Number
 },
 //it will be apply on all
 //orders,this amount would be
 //credited to admin account.
 charges:{
  type:Number
 },
 status:{
  type:String,
  default:'Pending'
 },
 payableAmount:{
  type:Number
 },
 month: {
    type: Number
  },
  year:{
    type:Number
  },
  usedPoint:{
    type:Number
  },
  earnedPoint:{
    type:Number
  },
  orderID: {
    type: Number,
    default: 1000,
    unique: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  orderUpdatedCount:{
    type:Number,
    default:0
  },
  statusUpdate:{
    type:Date
  },
  assignedDate:{
    type:Date
  },
  updatedAt: {
    type: Date
  }

},{
  usePushEach: true
});

OrderSchema.plugin(autoIncrement.plugin, {
  model: 'Order',
  field: 'orderID',
  startAt: 10000,
  incrementBy: 1
});

registerEvents(OrderSchema);
export default mongoose.model('Order', OrderSchema);
