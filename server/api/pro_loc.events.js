/**
 * Tag model events
 */

'use strict';

import {EventEmitter} from 'events';
var Pro_locEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
Pro_locEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Pro_loc) {
  for(var e in events) {
    let event = events[e];
    Pro_loc.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    Pro_locEvents.emit(event + ':' + doc._id, doc);
    Pro_locEvents.emit(event, doc);
  };
}

export {registerEvents};
export default Pro_locEvents;
