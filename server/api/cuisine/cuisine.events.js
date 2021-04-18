/**
 * Cuisine model events
 */

'use strict';

import {EventEmitter} from 'events';
var CuisineEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CuisineEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Cuisine) {
  for(var e in events) {
    let event = events[e];
    Cuisine.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    CuisineEvents.emit(event + ':' + doc._id, doc);
    CuisineEvents.emit(event, doc);
  };
}

export {registerEvents};
export default CuisineEvents;
