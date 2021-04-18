/**
 * Product model events
 */

'use strict';

import {EventEmitter} from 'events';
var DishoptionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DishoptionEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Dishoption) {
  for(var e in events) {
    let event = events[e];
    Dishoption.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    DishoptionEvents.emit(event + ':' + doc._id, doc);
    DishoptionEvents.emit(event, doc);
  };
}

export {registerEvents};
export default DishoptionEvents;
