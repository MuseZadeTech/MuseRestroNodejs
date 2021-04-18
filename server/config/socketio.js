// /**
//  * Socket.io configuration  res
//  */
// 'use strict';
// var sockets = [];
// var people = {};
// var userIds = [];
// var receiverSocketId = '';
// // import config from './environment';

// // When the user disconnects.. perform this
// function onDisconnect(/*socket*/) {}

// // When the user connects.. perform this
// function onConnect(socket) {
//   console.log('HELLO....');
//   // When the client emits 'info', this listens and executes
//   socket.on('info', function (data) {
//     console.log("Connection Established..." + JSON.stringify(data));
//     sockets.push(socket);
//     // console.log("socket in socket js" + JSON.stringify(sockets));
//     userIds.push(data.userId);
//     people[socket.id] = data.userId;
//     console.log('people' + JSON.stringify(people));
//   });

//   socket.on('restaurantInfo',function(data){
//     var userId = data.userId;
//     console.log('data'  +JSON.stringify(data));
//     sockets.push(socket);

//     // console.log("socket in socket js" + JSON.stringify(sockets));
//     userIds.push(data.userId);
//     people[socket.id] = data.userId;
//     receiverSocketId = findUserByName(userId);
//     console.log('receiverSocketId:::' + receiverSocketId);
//   });

//  var test;
//  function findUserByName(userId) {
//   console.log('userId---------------' + userId)
//     for(var socketID in people) {
//       console.log('http'+ JSON.stringify(people[socketID]))
//         if(people[socketID] === userId) {
//           console.log('socketId-----------' + socketID )
//             return test = socketID;
//         }
//     }
//     // return false;
//     console.log('not there');
// }
//   // Insert sockets below
//   require('../api/productrating/productrating.socket').register(socket);
//   require('../api/payment/payment.socket').register(socket);
//   // require('../api/pointrate/pointrate.socket').register(socket);
//   // require('../api/coupon/coupon.socket').register(socket);
//   require('../api/order/order.socket').register(socket);
//   // require('../api/tag/tag.socket').register(socket);
//   // require('../api/deliveryarea/deliveryarea.socket').register(socket);
//   // require('../api/tax/tax.socket').register(socket);
//   // require('../api/product/product.socket').register(socket);
//   // require('../api/location/location.socket').register(socket);
//   // require('../api/subcategory/subcategory.socket').register(socket);
//   // require('../api/category/category.socket').register(socket);
//  // require('../api/thing/thing.socket').register(socket);
// }

// export default function(socketio) {
//   // socket.io (v1.x.x) is powered by debug.
//   // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
//   //
//   // ex: DEBUG: "http*,socket.io:socket"

//   // We can authenticate socket.io users and access their token through socket.decoded_token
//   //
//   // 1. You will need to send the token in `client/components/socket/socket.service.js`
//   //
//   // 2. Require authentication here:
//   // socketio.use(require('socketio-jwt').authorize({
//   //   secret: config.secrets.session,
//   //   handshake: true
//   // }));

//   socketio.on('connection', function(socket) {
//     socket.address = `${socket.request.connection.remoteAddress}:${socket.request.connection.remotePort}`;

//     socket.connectedAt = new Date();

//     socket.log = function(...data) {
//       console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
//     };

//     // Call onDisconnect.
//     socket.on('disconnect', () => {
//       onDisconnect(socket);
//       socket.log('DISCONNECTED');
//     });

//     // Call onConnect.
//     onConnect(socket);
//     socket.log('CONNECTED');
//   });
// }

"use strict";
import Message from "../api/message/message.model";
import config from "./environment";
import Ordertrack from "../api/ordertrack/ordertrack.model";
var mongoose = require("mongoose");
var clientInfoArray = [];
var receiverSocketId = "";
var sockets = [];
var people = {};
var userIds = [];
// import config from './environment';

// When the user disconnects.. perform this
function onDisconnect(socket) {
  delete people[socket.id];
  // socket.removeAllListeners();
  console.log("spliced");
  sockets.splice(sockets.indexOf(socket), 1);
}

// When the user connects.. perform this
function onConnect(socket) {
  socket.on("storeClientInfo", function(data) {
    console.log("vconnect---------");
    sockets.push(socket);
    // console.log("socket in socket js" + JSON.stringify(sockets));
    userIds.push(data.userId);
    people[socket.id] = data.userId;
  });

  socket.on("user_message", function(data) {
    console.log("user_message$$$$$$$$$$$$$" + JSON.stringify(data));
    var userId = data.user_id;
    console.log("userId###########" + userId);
    receiverSocketId = findUserByName(userId);
    console.log("receiverSocketId:::" + receiverSocketId);
    //require('../api/message/message.socket').demo(receiverSocketId);
  });

  //mark a single thread of unread messages as read
  socket.on("updateUnread", function(data) {
    console.log("data@@@@" + JSON.stringify(data));
    let i = 0;
    var receiverId = mongoose.Types.ObjectId(data.receiver_id);
    var senderId = mongoose.Types.ObjectId(data.sender_id);
    Message.update(
      { receiver: receiverId, sender: senderId, receiverRead: false },
      { $set: { receiverRead: true } },
      { multi: true }
    ).exec(function(err, message) {
      if (err) {
        //return handleError(res, err);
      }
      if (!message) {
        //return res.status(404).send('Not Found');
      }

      Message.count({ receiver: receiverId, receiverRead: false }).exec(
        function(err, currUnreadCount) {
          if (err) {
            //return handleError(res, err);
          }
          console.log("currUnreadCount" + currUnreadCount);
          socket.emit("updatedCount" + receiverId, currUnreadCount);
        }
      );
    });
  });

  // //for user
  // socket.on('updateUser',function(data){
  //   let i = 0;
  //   var receiverId = data.receiver_id;
  //   var senderId = data.sender_id;
  //   Message.update({"receiver":receiverId,"sender":senderId,'senderRead':false},{$set:{'userRead':true}},{'multi':true}).exec(function (err, message) {
  //     if (err) {
  //       return handleError(res, err);
  //     }
  //     if (!message) {
  //       return res.status(404).send('Not Found');
  //     }
  //     Message.count({"sender":senderId,"senderRead":false}).exec(function (err, messages) {
  //       if (err) {
  //         return handleError(res, err);
  //       }
  //       socket.emit('updatedCount'+data.sender_id,messages);
  //     });
  //   });

  // });

  /////////////////order track
  //mark a single thread of unread messages as read
  socket.on("ordertrack", function(data) {
    console.log("data@@@@" + JSON.stringify(data));
    var orderId = mongoose.Types.ObjectId(data.orderId);
    Ordertrack.findOne({ order: orderId }, {}).exec(function(err, latLongData) {
      if (err) {
        //return handleError(res, err);
      }
      if (!latLongData) {
        //return res.status(404).send('Not Found');
      } else {
        let obj = {
          lat: data.lat,
          long: data.long,
          orderId: data.orderId,
          timeStamp: new Date().getTime()
        };
        latLongData.latLongInfo.push(obj);
      }
    });
  });

  var test;
  //find user by name (
  function findUserByName(userId) {
    console.log("userId---------------" + userId);
    for (var socketID in people) {
      console.log("http" + JSON.stringify(people[socketID]));
      if (people[socketID] === userId) {
        console.log("socketId-----------" + socketID);
        return (test = socketID);
      }
    }
    // return false;
    console.log("not there");
  }
  // Insert sockets below
  require("../api/cuisine/cuisine.socket").register(socket);
  require("../api/ordertrack/ordertrack.socket").register(socket);
  require("../api/coupan/coupan.socket").register(socket);
  require("../api/notification/notification.socket").register(socket);
  require("../api/favourite/favourite.socket").register(socket);
  require("../api/accountdetail/accountdetail.socket").register(socket);
  require("../api/carddetail/carddetail.socket").register(socket);
  require("../api/wallet/wallet.socket").register(socket);
  require("../api/productrating/productrating.socket").register(socket);
  require("../api/payment/payment.socket").register(socket);
  require("../api/message/message.socket").register(socket);
  // require('../api/coupon/coupon.socket').register(socket);
  require("../api/order/order.socket").register(socket);
  // require('../api/tag/tag.socket').register(socket);
  // require('../api/deliveryarea/deliveryarea.socket').register(socket);
  // require('../api/product/product.socket').register(socket);
  // require('../api/location/location.socket').register(socket);
  // require('../api/subcategory/subcategory.socket').register(socket);
  // require('../api/category/category.socket').register(socket);
  // require('../api/thing/thing.socket').register(socket);
}

export default function(socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on("connection", function(socket) {
    // console.log('socket'+JSON.parse(socket))
    console.log("getting control");
    socket.address =
      socket.request.connection.remoteAddress +
      ":" +
      socket.request.connection.remotePort;

    socket.connectedAt = new Date();

    socket.log = function(...data) {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);

      var Ids = {};
      Ids = socket.id;
      console.log("Ids...................." + Ids);
    };

    //socket.emit('message','hello, sending response to  client....');
    // Call onDisconnect.
    socket.on("disconnect", () => {
      onDisconnect(socket);
      socket.log("DISCONNECTED");
    });

    // Call onConnect.
    //socket.on('connect', () => {
    onConnect(socket);
    socket.log(
      "CONNECTED+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    );
  });
}
