/**
 * Order model events
 */
/*
'use strict';

import {EventEmitter} from 'events';
import Order from './order.model';
var OrderEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OrderEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Order) {
  for(var e in events) {
    let event = events[e];
    Order.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    //console.log('doc' + JSON.stringify(doc));
    OrderEvents.emit(event + ':' + doc._id, doc);
    OrderEvents.emit(event, doc);
  };
}

export {registerEvents};
export default OrderEvents;
*/

/**
 * Orders model events
 */
'use strict';
import {EventEmitter} from 'events';
import Order from './order.model';
var OrderEvents = new EventEmitter();
var UserEvents = new EventEmitter();
import Notification from '../notification/notification.model';

//var userEvents = new EventEmitter();
//console.log('hello@@@@@@');
// Set max event listeners (0 == unlimited)
OrderEvents.setMaxListeners(0);
UserEvents.setMaxListeners(0);
// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Orders) {
  for(var e in events) {
    let event = events[e];
    // console.log('hello')
    // console.log(event + "---------event-----------")
    Orders.post(e, emitEvent(event));
  }
}
 
function emitEvent(event) {
  return function(doc) {
    if(doc.orderUpdatedCount ===0){
    var notification = new Notification()
    notification.order = doc._id;
    notification.orderID = doc.orderID;
    notification.location = doc.location;
    notification.priceGrandTotal = doc.payableAmount;
    notification.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: 'Order notification could not saved.'
        });
      } else { 
        let notifyObj = {
          _id:notification._id,
          readNotification:notification.readNotification,
          order:doc._id,
          orderID:doc.orderID,
          location: doc.location,
          priceGrandTotal:doc.payableAmount,
          orderUpdatedCount:doc.orderUpdatedCount,
          createdAt:doc.createdAt
        }
        //UserEvents.emit(event,notifyObj);
        OrderEvents.emit(event,notifyObj);
      }
    });
  }
     OrderEvents.emit(event + ':' + doc._id, doc);
     OrderEvents.emit(event, doc);
  }
} 

export {registerEvents};
export default OrderEvents;







