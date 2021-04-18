/**
 * Ordertrack model events
 */

'use strict';

import {EventEmitter} from 'events';
var OrdertrackEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OrdertrackEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Ordertrack) {
  for(var e in events) {
    let event = events[e];
    Ordertrack.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    OrdertrackEvents.emit(event + ':' + doc._id, doc);
    OrdertrackEvents.emit(event, doc);
  };
}

export {registerEvents};
export default OrdertrackEvents;
