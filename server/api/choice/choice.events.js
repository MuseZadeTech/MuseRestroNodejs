/**
 * Product model events
 */

'use strict';

import {EventEmitter} from 'events';
var ChoiceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ChoiceEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Choice) {
  for(var e in events) {
    let event = events[e];
    Choice.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ChoiceEvents.emit(event + ':' + doc._id, doc);
    ChoiceEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ChoiceEvents;
