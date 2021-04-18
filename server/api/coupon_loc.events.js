/**
 * Tag model events
 */

'use strict';

import {EventEmitter} from 'events';
var Coupon_locEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
Coupon_locEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Coupon_loc) {
  for(var e in events) {
    let event = events[e];
    Coupon_loc.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    Coupon_locEvents.emit(event + ':' + doc._id, doc);
    Coupon_locEvents.emit(event, doc);
  };
}

export {registerEvents};
export default Coupon_locEvents;
