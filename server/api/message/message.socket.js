/**
 * Broadcast updates to client when the model changes
 */
/*commented
'use strict';

import MessageEvents from './message.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for(var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener(`message:${event}`, socket);

    MessageEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}

 
function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    MessageEvents.removeListener(event, listener);
  };
}
*commented/
/**
 * Broadcast updates to client when the model changes
 */

'use strict';
//var count =1;
//
//var dateAndTime = 0;
import MessageEvents from './message.events';
import userEvents from './message.events';
 
// Model events to emit
var events = {
  save: 'save' 
};
var notify;
var data = [];
var receiverSocketIds='';
export function demo(receiverSocketId) {
  // Bind model events to socket events
 // receiverSocketIds = receiverSocketId;
 // console.log('Conected array222:' + JSON.stringify(receiverSocketId));
}
export function register(socket) {
  var event = events.save;
  var listener = createListener(socket);
  var notifyListner = createNotifyListener(socket);
  //console.log('listener:' + listener);
  MessageEvents.on(event,listener);
  MessageEvents.on(event,notifyListner);
  socket.on('disconnect', removeListener(socket , event, listener));
}

export function createNotifyListener(socket) {
  return function(doc) {
    console.log('doc'+JSON.stringify(doc));
    socket.SocketId = receiverSocketIds;
    if(doc.count > 0){
      socket.emit('notify'+doc.receiver, doc);
    }
  };
}

export function createListener(socket) {
  return function(doc) {
    socket.SocketId = receiverSocketIds;
    if(doc.__v == 0)
    {
      console.log('inside message...............99999.')
      socket.emit('message'+doc.receiver, doc);
    }
  };
}

function removeListener(socket ,event, listener) {
  return function() {
   // console.log('socket unRegistered');
    socket.removeListener(event, listener);
  };
}
