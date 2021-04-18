/**
 * Coupan model events
 */

'use strict';

import {EventEmitter} from 'events';
var LoyaltyEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LoyaltyEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Loyalty) {
  for(var e in events) {
    let event = events[e];
    Loyalty.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    LoyaltyEvents.emit(event + ':' + doc._id, doc);
    LoyaltyEvents.emit(event, doc);
  };
}

export {registerEvents};
export default LoyaltyEvents;
