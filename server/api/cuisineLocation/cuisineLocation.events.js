/**
 * CuisineLocation model events
 */

'use strict';

import {EventEmitter} from 'events';
var CuisineLocationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CuisineLocationEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(CuisineLocation) {
  for(var e in events) {
    let event = events[e];
    CuisineLocation.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    CuisineLocationEvents.emit(event + ':' + doc._id, doc);
    CuisineLocationEvents.emit(event, doc);
  };
}

export {registerEvents};
export default CuisineLocationEvents;
