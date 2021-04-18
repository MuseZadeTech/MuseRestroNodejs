/**
 * Broadcast updates to client when the model changes
 */

// 'use strict';

// import OrderEvents from './order.events';

// // Model events to emit
// var events = {
//   save: 'save' 
// };
 
// var receiverSocketIds='';
// export function demo(receiverSocketId) {
//   // Bind model events to socket events
//  // receiverSocketIds = receiverSocketId;
//  // console.log('Conected array222:' + JSON.stringify(receiverSocketId));
// }

// export function register(socket) {
//   console.log("register  is called");
//   // Bind model events to socket events
//   //for(var i = 0, eventsLength = events.length; i < eventsLength; i++) {
//     // var event = events[i];
//     // var listener = createListener(`order:${event}`, socket);
//     var event = events.save;
//     var listener = createListener(socket);
//    // var notifyListner = createNotifyListener(socket);
//     //console.log('listener:' + listener);
//     OrderEvents.on(event, listener);
//     socket.on('disconnect', removeListener(event, listener));
//   //}
// }


// function createListener(socket) {
//   return function(doc) {
//     console.log("doc----------"+JSON.stringify(doc));
//     let notificationData = {
//       id: doc._id,
//       userName:doc.userInfo.name,
//       userEmail:doc.userInfo.email,
//       grandTotal:doc.grandTotal,
//       totalProducts: doc.productDetails.length
//     }
//     socket.emit('notification'+doc.restaurantID, notificationData);
//     //
//     var message = {
//           app_id: "43e7f997-3a19-4d58-8fe1-e88c71f69f6b",
//           contents: {"en": "A New order Arrived"},
//            include_player_ids: ["afaf19d4-699e-4cf6-a30e-74c28ac760bd","83408e7e-5853-4a84-9602-fb6fd7a8c747"]
//         };

//      sendNotification(message);
     
//      //
//   };
// }

// function removeListener(event, listener) {
//   return function() {
//     OrderEvents.removeListener(event, listener);
//   };
// }

// var sendNotification = function(data) {
//   console.log("here is the sendNotification function calling")
//   var headers = {
//     "Content-Type": "application/json; charset=utf-8",
//     "Authorization": "Basic NDRhYTJhM2UtZDRmYi00N2ZhLTlhODItYzhmMWJlYmMyNjMx"
//   };
  
//  var options = {
//     host: "onesignal.com",
//     port: 443,
//     path: "/api/v1/notifications",
//     method: "POST",
//     headers: headers
//   };
  
//  var https = require('https');
//   var req = https.request(options, function(res) {  
//    res.on('data', function(data) {
//       console.log("Response:");
//       console.log(JSON.parse(data));
//     });
//   });
  
//  req.on('error', function(e) {
//     console.log("ERROR:");
//     console.log(e);
//   });
  
//  req.write(JSON.stringify(data));
//   req.end();
// };


'use strict';
import OrderEvents from './order.events';
import userEvents from './order.events';
 console.log('order socket page....')
// Model events to emit
var events = {
  save: 'save' 
};
export function demo(receiverSocketId) {
  // Bind model events to socket events
 // receiverSocketIds = receiverSocketId;
 // console.log('Conected array222:' + JSON.stringify(receiverSocketId));
}
export function register(socket) {
  // Bind model events to socket events
  //console.log('hey! here into register.')
   var event = events.save;
    var notifyListner = createNotifyListener(socket);
    OrderEvents.on(event,notifyListner);
    //socket.on('disconnect', removeListener(socket , event, listener));
  }
export function createNotifyListener(socket) {
  return function(doc) {
    //console.log('doc.location...'+JSON.stringify(doc))
    if(doc.readNotification == false && doc.orderUpdatedCount == 0){
      //console.log('1111111111111111111$$$$$$$$$$')
      socket.emit('orderNotification'+doc.location, doc);
    }
  };
}

function removeListener(socket ,event, listener) {
  return function() {
    socket.removeListener(event, listener);
  };
}


