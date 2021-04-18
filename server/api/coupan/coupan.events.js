/**
 * Coupan model events
 */

'use strict';

import {EventEmitter} from 'events';
var CoupanEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CoupanEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Coupan) {
  for(var e in events) {
    let event = events[e];
    Coupan.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    CoupanEvents.emit(event + ':' + doc._id, doc);
    CoupanEvents.emit(event, doc);
  };
}

export {registerEvents};
export default CoupanEvents;
