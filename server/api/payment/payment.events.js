/**
 * Payment model events
 */

'use strict';

import {EventEmitter} from 'events';
var PaymentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PaymentEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Payment) {
  for(var e in events) {
    let event = events[e];
    Payment.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    PaymentEvents.emit(event + ':' + doc._id, doc);
    PaymentEvents.emit(event, doc);
  };
}

export {registerEvents};
export default PaymentEvents;
