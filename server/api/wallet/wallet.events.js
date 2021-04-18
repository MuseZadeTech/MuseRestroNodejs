/**
 * Wallet model events
 */

'use strict';

import {EventEmitter} from 'events';
var WalletEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
WalletEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Wallet) {
  for(var e in events) {
    let event = events[e];
    Wallet.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    WalletEvents.emit(event + ':' + doc._id, doc);
    WalletEvents.emit(event, doc);
  };
}

export {registerEvents};
export default WalletEvents;
