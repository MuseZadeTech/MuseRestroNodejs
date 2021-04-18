/**
 * Favourite model events
 */

'use strict';

import {EventEmitter} from 'events';
var FavouriteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FavouriteEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Favourite) {
  for(var e in events) {
    let event = events[e];
    Favourite.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    FavouriteEvents.emit(event + ':' + doc._id, doc);
    FavouriteEvents.emit(event, doc);
  };
}

export {registerEvents};
export default FavouriteEvents;
