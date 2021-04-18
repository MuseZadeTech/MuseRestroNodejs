/**
 * Accountdetail model events
 */

'use strict';

import {EventEmitter} from 'events';
var AccountdetailEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AccountdetailEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Accountdetail) {
  for(var e in events) {
    let event = events[e];
    Accountdetail.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    AccountdetailEvents.emit(event + ':' + doc._id, doc);
    AccountdetailEvents.emit(event, doc);
  };
}

export {registerEvents};
export default AccountdetailEvents;
