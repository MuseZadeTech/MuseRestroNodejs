/**
 * Deliveryarea model events
 */

'use strict';

import {EventEmitter} from 'events';
var DeliveryareaEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DeliveryareaEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Deliveryarea) {
  for(var e in events) {
    let event = events[e];
    Deliveryarea.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    DeliveryareaEvents.emit(event + ':' + doc._id, doc);
    DeliveryareaEvents.emit(event, doc);
  };
}

export {registerEvents};
export default DeliveryareaEvents;
