/**
 * StoreType model events
 */

"use strict";

import { EventEmitter } from "events";
var StoreTypeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StoreTypeEvents.setMaxListeners(0);

// Model events
var events = {
  save: "save",
  remove: "remove"
};

// Register the event emitter to the model events
function registerEvents(StoreType) {
  for (var e in events) {
    let event = events[e];
    StoreType.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    StoreTypeEvents.emit(event + ":" + doc._id, doc);
    StoreTypeEvents.emit(event, doc);
  };
}

export { registerEvents };
export default StoreTypeEvents;
