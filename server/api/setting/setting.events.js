/**
 * Setting model events
 */

'use strict';

import {EventEmitter} from 'events';
var SettingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SettingEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Setting) {
  for(var e in events) {
    let event = events[e];
    Setting.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    SettingEvents.emit(event + ':' + doc._id, doc);
    SettingEvents.emit(event, doc);
  };
}

export {registerEvents};
export default SettingEvents;
