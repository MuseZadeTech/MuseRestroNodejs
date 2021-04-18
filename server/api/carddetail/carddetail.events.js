/**
 * Carddetail model events
 */

'use strict';

import {EventEmitter} from 'events';
var CarddetailEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CarddetailEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Carddetail) {
  for(var e in events) {
    let event = events[e];
    Carddetail.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    CarddetailEvents.emit(event + ':' + doc._id, doc);
    CarddetailEvents.emit(event, doc);
  };
}

export {registerEvents};
export default CarddetailEvents;
