 /**ownerInfo   singleThreadMarkRead
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/messages              ->  index
 * POST    /api/messages              ->  create
 * GET     /api/messages/:id          ->  show
 * PUT     /api/messages/:id          ->  upsert
 * PATCH   /api/messages/:id          ->  patch
 * DELETE  /api/messages/:id          ->  destroy
 */
   
'use strict';
 
import jsonpatch from 'fast-json-patch';
import Message from './message.model';
import User from '../user/user.model';
import mongoose from 'mongoose';
var  multiparty  = require('multiparty');
var Schema       = mongoose.Schema;
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**************************   User Access  *****************************/

//get a list of seller who had ever contacted through a user
export function userIndex(req, res,user) {
  var result = [];
  var flag = 0;
  var setValue=1;
  var slot;
  var senderId = req.user._id;
  var newObj = {};
  var newArray = [];
  //get all receiver ids
  Message.find({'sender':senderId}).distinct('receiver').exec(function (err, messages){
    if(err)
    {
      //error occoured
      return handleError(res);
    }
    if(messages.length == 0){
      //no seller found
      return res.status(404).send({
        message: 'You do not have any seller who contacted you atleast once.'
      });
    }
    else
    { 
      //iterating all seller one by one
      for(let i = 0;i<messages.length;i++)
      { 
        //getting all messages of a single thread
        Message.find({'receiver':messages[i],'sender':senderId}).exec(function(err,lastMsg){
          if(err){
            //error occoured
            return handleError(res);
          }
          else{
            //getting last message of a thread
            let lastSellerMsgIndex = lastMsg.length-1;
            let lastMsgData = lastMsg[lastSellerMsgIndex].message;
            //getting seller infos
            User.findById(messages[i],{storeName:1,email:1}).exec(function(err,users){
              if(err)
              {
                //error occoured
                return handleError(res);
              }
              else{
                result.push(users);
                if(result.length === messages.length)
                {
                  //iterating sellers one by one
                  for(let j=0;j<messages.length;j++)
                  {
                    Message.count({'sender':senderId,'receiver':messages[j],"senderRead":false}).exec(function (err, count){
                      if(err)
                      {
                        //error occoured
                        return handleError(res);
                      }
                      else{
                        for(let k=0;k<messages.length;k++)
                        {
                          var x = result[k]._id.toString();
                          var y = messages[j].toString();
                          if(x === y)
                          {
                            flag++;
                            newObj = {
                              lastMessage:lastMsgData,
                              _id: result[k]._id,
                              storeName: result[k].storeName,
                              email: result[k].email,
                              count: count
                            }
                            newArray.push(newObj);
                          }
                          if(flag === messages.length && setValue === 1)
                          {
                            //sending response
                            res.json(newArray);
                            setValue = 0;
                          }
                        }
                      }
                    })
                  }
                }
              }
            })
          }
        })
      }
    }
  })
}

// Gets all Messages from the DB of a user and seller(for user only)
export function userChat(req, res) {
let senderId = req.user._id;
let receiverId = req.params.id;
  return Message.find({"sender":senderId,"receiver":receiverId}).sort([['createdAt', 1]]).populate('user seller','name email').exec()
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

/**************************   Seller Access  *****************************/

//get a list of user who had ever contacted through a seller
export function userList(req, res,user) {
  var result = [];
  var flag = 0;
  var setValue=1;
  var slot;
  var receiverId = req.user._id;
  var newObj = {};
  var newArray = [];
  //get all senders between user and owner 
  Message.find({$or:[{'receiver':receiverId},{'sender':receiverId}],$or:[{senderRole:'User',receiverRole:'Owner'},{senderRole:'Owner',receiverRole:'User'}]}).distinct('sender').exec(function (err, messages){
    if(err)
    {
      //error occoured
      return handleError(res);
    }
    if(messages.length == 0){
      //while no sender found
      return res.send({
        message: 'You do not have any user who contacted you atleast once.'
      });
    }
    else
    {
      //iterating ids
      for(let i = 0;i<messages.length;i++)
      {
        // getting some basic infos
        User.findById(messages[i],{name:1,email:1,publicId:1}).exec(function(err,users){
          if(err)
          {
            //error occoured
            return handleError(res);
          }
          else{
            result.push(users);
            if(result.length === messages.length)
            { //iterating ids
              for(let j=0;j<messages.length;j++)
              { //getting unread messages count
                Message.count({'receiver':receiverId,'sender':messages[j],"receiverRead":false}).exec(function (err, count){
                  if(err)
                  {
                    //error occoured
                    return handleError(res);
                  }
                  else{
                    //getting single thread message
                    Message.find({'receiver':receiverId,'sender':messages[j]}).exec(function(err,lastMsg){                                                                                                                                                                                                                               
                      if(err){
                        //error occoured
                        return handleError(res);
                      }
                      else{
                        //getting last message
                        let lastUserMsgIndex = lastMsg.length-1;
                        let lastMsgData = lastMsg[lastUserMsgIndex].message;
                        let lastmsgTime = lastMsg[lastUserMsgIndex].createdAt;
                        for(let k=0;k<messages.length;k++)
                        {
                          if(result[k]!= null){
                          var x = result[k]._id.toString();
                          var y = messages[j].toString();
                        }
                          if(x === y)
                          {
                            flag++;
                            if(result[k]!= null){
                            //creating raw object
                            newObj = {
                              lastMessage:lastMsgData,
                              _id: result[k]._id,
                              name: result[k].name,
                              email: result[k].email,
                              image:result[k].publicId,
                              count: count,
                              lastmsgTime:lastmsgTime
                            }
                          }
                          //pushing all raw objects into array
                            newArray.push(newObj);
                        }
                          if(flag === messages.length && setValue === 1)
                          { 
                            //sorting on the basis of last message time
                            newArray.sort(function (a, b) {
                              return b.lastmsgTime - a.lastmsgTime;
                            });
                            res.json(newArray);
                            setValue = 0;
                          }
                        }
                      }
                    })
                  }
                })
              }
            }
          }
        })
      }
    }
  })
}

//for seller
//update unread messages count
export function updateCount(req, res) {
  let i = 0;
  var receiverId = req.user._id;
  var senderId = req.params.id;
  //getting all messages of a single thread
  Message.find({"receiver":receiverId,"sender":senderId}).exec(function (err, message) {
    if (err) {
      //error occoured
      return handleError(res, err);
    }
    if (!message) {
      //if there is no such thread
      return res.status(404).send('Not Found');
    }
    //iterating all messages
    for(i =0;i<message.length;i++)
    { //updating all unread as read
      if(message[i].receiverRead === false)
      {
        message[i].receiverRead = true;
        //save changes
        message[i].save(function (err) {
          if (err) {
            //error occoured
            return handleError(res);
          }
          else {
          }
        });
      }
    }
    if(i === message.length)
    { //getting all unread messages count
      Message.count({"receiver":receiverId,"receiverRead":false}).exec(function (err, messages) {
        if (err) {
          //error occoured
          return handleError(res, err);
        }
        if (!messages) {
          //if no unread messages
          return res.json(0);
        }
        //sending count of unread messages
        res.json(messages);
      })
    }
   })
}




// Gets all messages of a single thread
export function singleThreadChat(req, res) {
  let receiverId = req.user._id;
  let senderId = req.params.id;
  let skipval = req.params.pageno*15;
  let nextpageno = +(req.params.pageno)+1;
  //getting all messages of single thread
  Message.find({$or:[{"sender":senderId,"receiver":receiverId},{"sender":receiverId,"receiver":senderId}]}).sort('-timestamp').skip(skipval).limit(15).exec(function(err,msgs){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //get senderId basic info
      User.findById(senderId,'name email restaurantName').exec(function(err,sender){
        if(err){
          //error occoured
          return handleError(res);
        }
        else{
          //get receiverId basic info
          User.findById(receiverId,'name email restaurantName').exec(function(err,receiver){
            if(err){
              //error occoured
              return handleError(res);
            }
            else{
              let msgsdata = msgs;
              if( req.params.pageno ==0){
                //sorting basic of timestamp
                msgsdata.sort(function (a, b) {
                  return a.timestamp - b.timestamp;
                });
              }
              if(msgsdata.length == 0){
                msgsdata = ''
                nextpageno = null
              }
              //creating wrapper object for response
            let resData={
              sender:sender,
              receiver:receiver,
              messages:msgsdata,
              nextpageno:nextpageno
            }
            //send response
            res.json(resData);
            }
          })
        }
      })
    }
  })
}

//GET NUMBER OF UNREAD MESSAGES 
export function count(req, res) {
  var count = 0;
  //getting user id
  var Id = req.user._id;
  //quering for unread count
  Message.find({"receiver":Id,receiverRead:false}).exec(function (err, unreadmessagescount){
    if(err){
      //error occoured 
      return handleError(res);
    }
    else{
      //send response of unread count
      res.json(unreadmessagescount)
    }
  })
}

// Creates a new Message in the DB
export function create(req, res) {
  var senderId         = req.user._id;
  var receiverId       = req.body.receiver;
  //create a message instance
  var message          = new Message();
  message.timestamp    = Date.now();
  message.sender       = senderId;
  message.receiver     = receiverId;
  message.senderRole   = req.user.role;
  message.receiverRole = req.body.receiverRole;
  message.message      = req.body.message;
  message.sentBy       = req.user.role;
  // Save Message 
  message.save(function (err) {
    if (err) {
      //error occoured
      return handleError(res);
    }
    else {
      // sending response
      res.json(message);
    }
  })
}

//Mark all unread as read
export function markRead(req, res) {
  var receiverId = req.user._id;
  //updating all unread messages as read
  Message.update({"receiver":receiverId,'receiverRead':false},{$set:{'receiverRead':true}},{'multi':true}).exec(function (err, message) {
    if (err) {
      //error occoured
      return handleError(res, err);
    }
    if (!message) {
      //if no unread
      return res.status(404).send('Not Found');
    }
    //getting all unread count
    Message.count({"receiver":receiverId,"receiverRead":false}).exec(function (err, messages) {
      if (err) {
        //error occoured
        return handleError(res, err);
      }
      //sending count
      res.json(messages);
    })
  })
}



//get a list of managers who had ever contacted through a restaurant owner
export function managersInfo(req, res,user) {
  //getting owner id by token data
  let ownerId = req.user._id;
  let rawobj   = {};
  let resarray = [];
  //getting all managers of a restaurant
  User.find({'restaurantID':ownerId,role:'Manager'},'name email publicId').exec(function(err,managerids){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //iterating all managerids
      for(let i=0;i<managerids.length;i++){
        //getting all unread count of a single thread
        Message.find({'receiver':ownerId,'sender':managerids[i],"receiverRead":false},{}).sort('-createdAt').exec(function(err,unreadmessages){
          if(err){
            //error occoured
            return handleError(res);
          }
          else{
            //getting single thread messages
            Message.find({'receiver':ownerId,'sender':managerids[i]},{}).exec(function(err,allmsgs){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //getting last message index
                let lastmsgindex = allmsgs.length-1;
                if(allmsgs.length>0){
                  //creating raw object
                  rawobj={
                    lastMessage: allmsgs[lastmsgindex].message || '',
                    _id: managerids[i]._id || '',
                    name: managerids[i].name || '',
                    email:managerids[i].email || '',
                    image: managerids[i].publicId || '',
                    count:unreadmessages.length || '',
                    lastmsgTime:allmsgs[0].createdAt
                  }
                  //pushing them into an array
                  resarray.push(rawobj);
                }
                if(allmsgs.length==0){
                  //creating raw object
                  rawobj={
                    lastMessage:'',
                    _id: managerids[i]._id ,
                    name: managerids[i].name ,
                    email:managerids[i].email,
                    image: managerids[i].publicId,
                    count:0,
                    lastmsgTime:''
                  }
                  //pushing them into an array
                  resarray.push(rawobj);
                }
                //when all done
                if(resarray.length == managerids.length){
                  //send response
                  res.json(resarray);
                }
              }
            })
          }
        })
      }
    }
  })
}



//get a list of unread messages
export function unreadMessages(req,res){
  let rawobj ={};
  let resarray = [];
  //getting all sender ids whose message is unread for this entity
  Message.find({'receiver':req.user._id,receiverRead:false},{}).distinct('sender').exec(function(err,senderids){
    if(err){
      return handleError(res);
    }
    if(senderids.length==0){
      //when no sender id
      res.json(senderids);
    }
    else{
      //iterating all sender ids
      for(let i=0;i<senderids.length;i++){
        //getting last message of all snders one by one
        Message.find({'receiver':req.user._id,'sender':senderids[i]}).sort('-createdAt').limit(1).exec(function(err,unreadmessages){
          if(err){
            //error occoured
            return handleError(res);
          }
          else{
            //single thread unread messages count
            Message.count({'receiver':req.user._id,'sender':senderids[i],receiverRead:false}).exec(function(err,count){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //getting sender data
                User.findById(senderids[i]).exec(function(err,data){
                  if(err){
                    //error occoured
                    return handleError(res)
                  }
                  else{
                    // creating raw object
                    rawobj = {
                      _id:unreadmessages[0].sender,
                      receiverRole:unreadmessages[0].receiverRole,
                      senderRole:unreadmessages[0].senderRole,
                      lastmsgTime:unreadmessages[0].createdAt,
                      receiver:unreadmessages[0].receiver,
                      count:count,
                      lastMessage:unreadmessages[0].message,
                      email:data.email,
                      name:data.name
                    }
                    //push into an array
                    resarray.push(rawobj);
                    //when all done
                    if(senderids.length ==resarray.length){
                      //sending all as response
                      res.json(resarray);
                    }
                  }
                })
              }
            })
          }
        })
      }
    }
  })
}

//mark single thread unread messages as read message
export function singleThreadMarkRead(req,res){
  let senderId = req.params.id;
  let receiverId = req.user._id;
  //update single thread unread message as read
  Message.update({"receiver":receiverId,"sender":senderId,'receiverRead':false},{$set:{'receiverRead':true}},{'multi':true}).exec(function (err, message) {
    if (err) {
      //error occoured
      return handleError(res, err);
    }
    if (!message) {
      //while no unread
      return res.status(404).send('Not Found');
    }
    //after update,count unread
    Message.count({"receiver":receiverId,"receiverRead":false}).exec(function (err, messages) {
      if (err) {
        //error occoured
        return handleError(res, err);
      }
      else{
        //send unread count
        res.json(messages);
      }
    })
  })
}

//get all unread messages count
export function allUnreadMessagescount(req,res){
  //getting receiver id by token
  let receiverId = req.user._id;
  //get all unread count 
  Message.count({"receiver":receiverId,"receiverRead":false}).exec(function(err,unreadcount){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //sending response
      res.json(unreadcount);
    }
  })
}



//get a list of managers who had ever contacted through a restaurant owner
export function managersChatListByUser(req, res,user) {
  //getting sender id by token
  let senderId = req.user._id;
  //getting all sender ids
  Message.find({'sender':senderId,senderRole:'User',receiverRole:'Manager'}).distinct('receiver').exec(function (err, managerids){
    if(err)
    {
      //error occoured
      return handleError(res);
    }
    if(managerids.length == 0){
      //no manager found
      return res.send({
        message: 'You do not have any managers who have contacted you atleast once.'
      });
    }
    else
    {
      //getting all manager basic infos
      User.find({_id:{$in:managerids}},{name:1,email:1,publicId:1,location:1,restaurantName:1}).exec(function(err,managerdata){
        if(err)
        {
          //error occoured
          return handleError(res);
        }
        else{
          let rawobj   = {};
          let resarray = [];
          //iterating manager ids
          for(let i=0;i<managerdata.length;i++){
            //getting unread
            Message.find({'receiver':managerdata[i]._id,'sender':senderId,"receiverRead":false},{}).sort('-createdAt').exec(function(err,unreadmessages){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //get all messages of single thread
                Message.find({'receiver':managerdata[i]._id,'sender':senderId},{}).sort('-createdAt').exec(function(err,allmsgs){
                  if(err){
                    //error occoured
                    return handleError(res);
                  }
                  else{
                    //last message index
                    let lastmsgindex = allmsgs.length-1;
                    if(allmsgs.length>0){
                      //raw object
                      rawobj={
                      lastMessage: allmsgs[lastmsgindex].message || '',
                      _id: managerdata[i]._id || '',
                      name: managerdata[i].name || '',
                      email:managerdata[i].email || '',
                      location:managerdata[i].location || '',
                      restaurantName:managerdata[i].restaurantName || '',
                      image: managerdata[i].publicId || '',
                      count:unreadmessages.length || '',
                      lastmsgTime:allmsgs[0].createdAt
                    }
                    //pushing all raw object to an array
                    resarray.push(rawobj);
                    }
                    if(allmsgs.length==0){
                      //raw object
                      rawobj={
                        lastMessage:'',
                        _id: managerdata[i]._id ,
                        name: managerdata[i].name ,
                        email:managerdata[i].email,
                        restaurantName:managerdata[i].restaurantName || '',
                        location:managerdata[i].location || '',
                        image: managerdata[i].publicId,
                        count:0,
                        lastmsgTime:''
                      }
                    //pushing all raw object to an array
                    resarray.push(rawobj);
                    }
                    if(resarray.length == managerdata.length){
                      //sending response
                      res.json(resarray);
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
  })
}



//get a list of Admins who had ever contacted through a restaurant owner
export function adminsInfo(req, res,user) {
  let ownerId = req.user._id;
  let rawobj   = {};
  let resarray = [];
  //get admin basic info
  User.find({role:'Admin'},'name email publicId').exec(function(err,admininfos){
    if(err){
      return handleError(res);
    }
    else{
      //iterating admin ids
      //considering there may be more than one admin
      for(let i=0;i<admininfos.length;i++){
        //getting single thread unread
        Message.find({'receiver':ownerId,'sender':admininfos[i],"receiverRead":false},{}).sort('-createdAt').exec(function(err,unreadmessages){
          if(err){
            //error occoured
            return handleError(res);
          }
          else{
            //single thread messages
            Message.find({'receiver':ownerId,'sender':admininfos[i]},{}).sort('-createdAt').exec(function(err,allmsgs){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //last message index
                let lastmsgindex = allmsgs.length-1;
                if(allmsgs.length>0){
                  //raw object
                  rawobj={
                    lastMessage: allmsgs[lastmsgindex].message || '',
                    _id: admininfos[i]._id || '',
                    name: admininfos[i].name || '',
                    email:admininfos[i].email || '',
                    image: admininfos[i].publicId || '',
                    count:unreadmessages.length || 0,
                    lastmsgTime:allmsgs[lastmsgindex].createdAt
                  }
                  //pushing raw object into array
                  resarray.push(rawobj);
                }
                if(allmsgs.length==0){
                  //creating raw object
                  rawobj={
                    lastMessage:'',
                    _id: admininfos[i]._id ,
                    name: admininfos[i].name ,
                    email:admininfos[i].email,
                    image: admininfos[i].publicId,
                    count:0,
                    lastmsgTime:''
                  }
                  //pushing raw objects into an array
                  resarray.push(rawobj);
                }
                //when all done
                if(resarray.length == admininfos.length){
                  //send response
                  res.json(resarray);
                }
              }
            })
          }
        })
      }
    }
  })
}



//get a list of managers who had ever contacted through a restaurant owner
export function userChatListByManager(req, res,user) {
  //getting receiverid by token
  let receiverId = req.user._id;
  //getting all sender of matching query
  Message.find({'receiver':receiverId, senderRole:'User', receiverRole:'Manager'}).distinct('sender').exec(function (err, userids){
    if(err)
    {
      //error occoured
      return handleError(res);
    }
    if(userids.length == 0){
      //while no user id found
      return res.send({
        message: 'You do not have any user who have contacted you atleast once.'
      });
    }
    else
    {
      //getting all user ids basic infos
      User.find({_id:{$in:userids}},{name:1,email:1,publicId:1,location:1}).exec(function(err,userdata){
        if(err)
        {
          //error occoured
          return handleError(res);
        }
        else{
          let rawobj   = {};
          let resarray = [];
          //iterating userdata
          for(let i=0;i<userdata.length;i++){
            //getting single thread unread messages
            Message.find({'receiver':receiverId,'sender':userdata[i]._id,"receiverRead":false},{}).sort('-createdAt').exec(function(err,unreadmessages){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //single thread messages
                Message.find({'receiver':receiverId,'sender':userdata[i]._id},{}).sort('-createdAt').exec(function(err,allmsgs){
                  if(err){
                    //error occoured
                    return handleError(res);
                  }
                  else{
                    //last message index
                    let lastmsgindex = allmsgs.length-1;
                    if(allmsgs.length>0){
                      //create row object
                      rawobj={
                      lastMessage: allmsgs[lastmsgindex].message || '',
                      _id: userdata[i]._id || '',
                      name: userdata[i].name || '',
                      email:userdata[i].email || '',
                      location:userdata[i].location || '',
                      image: userdata[i].publicId || '',
                      count:unreadmessages.length || '',
                      lastmsgTime:allmsgs[0].createdAt
                    }
                    //push raw object into an array
                    resarray.push(rawobj);
                    }
                    if(allmsgs.length==0){
                      //creating raw object
                      rawobj={
                        lastMessage:'',
                        _id: userdata[i]._id ,
                        name: userdata[i].name ,
                        email:userdata[i].email,
                        location:userdata[i].location || '',
                        image: userdata[i].publicId,
                        count:0,
                        lastmsgTime:''
                      }
                      //push into array
                    resarray.push(rawobj);
                    }
                    //while all done
                    if(resarray.length == userdata.length){
                      //sending response
                      res.json(resarray);
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
  })
}


//get a list of managers who had ever contacted through a restaurant owner
export function ownerChatListByAdmin(req, res,user) {
  //getting id by token
  let receiverId = req.user._id;
  //get all owner ids
  User.find({role:'Owner'}).distinct('_id').exec(function (err, ownerids){
    if(err)
    {
      //error occoured
      return handleError(res);
    }
    if(ownerids.length == 0){
      ///while no owner
      return res.send({
        message: 'You do not have any owner who have contacted you atleast once.'
      });
    }
    else
    {
      //get basic infos of owners
      User.find({_id:{$in:ownerids}},{name:1,email:1,publicId:1,restaurantName:1}).exec(function(err,ownerdata){
        if(err)
        {
          //error occoured
          return handleError(res);
        }
        else{
          let rawobj   = {};
          let resarray = [];
          //iterating ownerdata
          for(let i=0;i<ownerdata.length;i++){
            //getting single thread unread messages
            Message.find({'receiver':receiverId,'sender':ownerdata[i]._id,"receiverRead":false},{}).sort('-createdAt').exec(function(err,unreadmessages){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //getting single thread messages
                Message.find({'receiver':receiverId,'sender':ownerdata[i]._id},{}).sort('-createdAt').exec(function(err,allmsgs){
                  if(err){
                    //error occoured
                    return handleError(res);
                  }
                  else{
                    //getting last index
                    let lastmsgindex = allmsgs.length-1;
                    if(allmsgs.length>0){
                      //raw object
                      rawobj={
                      lastMessage: allmsgs[lastmsgindex].message || '',
                      _id: ownerdata[i]._id || '',
                      name: ownerdata[i].name || '',
                      email:ownerdata[i].email || '',
                      restaurantName:ownerdata[i].restaurantName || '',
                      image: ownerdata[i].publicId || '',
                      count:unreadmessages.length || '',
                      lastmsgTime:allmsgs[0].createdAt
                    }
                    //pushing raw object into array
                    resarray.push(rawobj);
                    }
                    if(allmsgs.length==0){
                      //raw object
                      rawobj={
                        lastMessage:'',
                        _id: ownerdata[i]._id ,
                        name: ownerdata[i].name ,
                        email:ownerdata[i].email,
                        restaurantName:ownerdata[i].restaurantName || '',
                        image: ownerdata[i].publicId,
                        count:0,
                        lastmsgTime:''
                      }
                      //pushing raw object into array
                    resarray.push(rawobj);
                    }
                    //while all done
                    if(resarray.length == ownerdata.length){
                      //sorting,basis on msgtime
                      resarray.sort(function (a, b) {
                        return b.lastmsgTime - a.lastmsgTime;
                      });
                      //sending response
                      res.json(resarray);
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
  })
}

//get a list of managers who had ever contacted through a restaurant owner
export function singleOwnerChatListByAdminSearch(req, res,user) {
  //getting id by token
  let receiverId = req.user._id;
  //searching key
  let keyToSearch = req.params.key;
  //getting all owners of a restaurant
  User.find({restaurantName:{'$regex': keyToSearch,"$options": "i"},role:'Owner'}).distinct('_id').exec(function (err, ownerids){
    if(err)
    {
      //error occoured
      return handleError(res);
    }
    if(ownerids.length == 0){
      //while no owner ids found
      return res.send({
        message: 'You do not have any user who have contacted you atleast once.'
      });
    }
    else
    {
      //getting basic info of all owners
      User.find({_id:{$in:ownerids}},{name:1,email:1,publicId:1,restaurantName:1}).exec(function(err,ownerdata){
        if(err)
        {
          //error occoured
          return handleError(res);
        }
        else{
          let rawobj   = {};
          let resarray = [];
          //iterating all owners
          for(let i=0;i<ownerdata.length;i++){
            //getting single thread all unread messages
            Message.find({'receiver':receiverId,'sender':ownerdata[i]._id,"receiverRead":false},{}).sort('-createdAt').exec(function(err,unreadmessages){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //single thread all messages
                Message.find({'receiver':receiverId,'sender':ownerdata[i]._id},{}).sort('-createdAt').exec(function(err,allmsgs){
                  if(err){
                    //error occoured
                    return handleError(res);
                  }
                  else{
                    //last message
                    let lastmsgindex = allmsgs.length-1;
                    if(allmsgs.length>0){
                      //raw object
                      rawobj={
                      lastMessage: allmsgs[lastmsgindex].message || '',
                      _id: ownerdata[i]._id || '',
                      name: ownerdata[i].name || '',
                      email:ownerdata[i].email || '',
                      restaurantName:ownerdata[i].restaurantName || '',
                      image: ownerdata[i].publicId || '',
                      count:unreadmessages.length || '',
                      lastmsgTime:allmsgs[0].createdAt
                    }
                    //pushing all raw objects into an array
                    resarray.push(rawobj);
                    }
                    if(allmsgs.length==0){
                      //creating raw object
                      rawobj={
                        lastMessage:'',
                        _id: ownerdata[i]._id ,
                        name: ownerdata[i].name ,
                        email:ownerdata[i].email,
                        restaurantName:ownerdata[i].restaurantName || '',
                        image: ownerdata[i].publicId,
                        count:0,
                        lastmsgTime:''
                      }
                      //pushing all objects into an array 
                    resarray.push(rawobj);
                    }
                    //when all done
                    if(resarray.length == ownerdata.length){
                      //sending response
                      res.json(resarray);
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
  })
}



//get restaurant owner chat info by manager
export function ownerInfo(req, res,user) {
  //getting id from token 
  let managerid = req.user._id;
  let rawobj   = {};
  let resarray = [];
  //getting basic info of a restaurant
  User.find({"_id":req.user.restaurantID},'name email publicId').exec(function(err,ownerinfo){
    if(err){
      //error occoured
      return handleError(res);
    }
    else{
      //iterating owner data
      for(let i=0;i<ownerinfo.length;i++){
        //getting all unreads of a single thread
        Message.find({'receiver':managerid,'sender':ownerinfo[i],"receiverRead":false},{}).sort('-createdAt').exec(function(err,unreadmessages){
          if(err){
            //error occoured
            return handleError(res);
          }
          else{
            //get single thread all messages
            Message.find({'receiver':managerid,'sender':ownerinfo[i]},{}).sort('-createdAt').exec(function(err,allmsgs){
              if(err){
                //error occoured
                return handleError(res);
              }
              else{
                //getting last index
                let lastmsgindex = allmsgs.length-1;
                if(allmsgs.length>0){
                  //creating raw object
                  rawobj={
                    lastMessage: allmsgs[lastmsgindex].message || '',
                    _id: ownerinfo[i]._id || '',
                    name: ownerinfo[i].name || '',
                    email:ownerinfo[i].email || '',
                    image: ownerinfo[i].publicId || '',
                    count:unreadmessages.length || 0,
                    lastmsgTime:allmsgs[lastmsgindex].createdAt
                  }
                  //pushing all raw objects into an array
                  resarray.push(rawobj);
                }
                if(allmsgs.length==0){
                  //creating raw object
                  rawobj={
                    lastMessage:'',
                    _id: ownerinfo[i]._id ,
                    name: ownerinfo[i].name ,
                    email:ownerinfo[i].email,
                    image: ownerinfo[i].publicId,
                    count:0,
                    lastmsgTime:''
                  }
                  //pushing all raw objects into an array
                  resarray.push(rawobj);
                }
                //when all done
                if(resarray.length == ownerinfo.length){
                  //sending response
                  res.json(resarray);
                }
              }
            })
          }
        })
      }
    }
  })
}



