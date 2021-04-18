/**
 * Pointrate model events
 */

'use strict';

import {EventEmitter} from 'events';
var PointrateEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PointrateEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Pointrate) {
  for(var e in events) {
    let event = events[e];
    Pointrate.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    PointrateEvents.emit(event + ':' + doc._id, doc);
    PointrateEvents.emit(event, doc);
  };
}

export {registerEvents};
export default PointrateEvents;
