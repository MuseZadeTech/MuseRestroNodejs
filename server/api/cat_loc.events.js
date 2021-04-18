/**
 * Tag model events
 */

'use strict';

import {EventEmitter} from 'events';
var Cat_locEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
Cat_locEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Cat_loc) {
  for(var e in events) {
    let event = events[e];
    Cat_loc.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    Cat_locEvents.emit(event + ':' + doc._id, doc);
    Cat_locEvents.emit(event, doc);
  };
}

export {registerEvents};
export default Cat_locEvents;
