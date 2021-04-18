
/**
 * Message model events
 */ 
 
'use strict';

import {EventEmitter} from 'events';
var MessageEvents = new EventEmitter();
var userEvents = new EventEmitter();

import Message from './message.model';
import User from '../user/user.model';
// Set max event listeners (0 == unlimited)
MessageEvents.setMaxListeners(0);
userEvents.setMaxListeners(0);
 

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};
// Register the event emitter to the model events
function registerEvents(Message) {
  for(var e in events) {
    let event = events[e];
    Message.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    let dataObj = {};
    let count = 0;
    Message.find({"receiver":doc.receiver,"sender":doc.sender}).exec(function (err, messages){
      for (var i = 0; i < messages.length; i++) {
        if(messages[i].receiverRead === false)
        {
          count++;
        }
      }
      Message.count({"receiver":doc.receiver,"receiverRead":false}).exec(function (err, currUnreadCount) {
        if (err) {
          return handleError(res, err);
        }
        User.findById(doc.sender).exec(function(err,data){
          if(err){
            return handleError(res)
          }
          else{
            dataObj = {
              _id:doc.sender,
              receiverRole:doc.receiverRole,
              senderRole:doc.senderRole,
              receiver:doc.receiver,
              count:count,
              totalcount:currUnreadCount,
              lastMessage:doc.message,
              email:data.email,
              name:data.name
            }
            MessageEvents.emit(event,dataObj);
          }
        })
      }) 
    });
    MessageEvents.emit(event + ':' + doc._id, doc);
    MessageEvents.emit(event, doc);
  };
}

export {registerEvents};
export default MessageEvents;




 /**
 * Message model events
 */ 

