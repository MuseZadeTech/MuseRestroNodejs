/**
 * Productrating model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductratingEvents = new EventEmitter();
import Product from '../product/product.model';
import Location from '../location/location.model';

// Set max event listeners (0 == unlimited)
ProductratingEvents.setMaxListeners(0);
function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Productrating) {
  for(var e in events) {
    let event = events[e];
    Productrating.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    Product.findById(doc.product).exec(function(err,productdata){
      if(err){
      }
      else{
        console.log("productdata data.........."+JSON.stringify(productdata))
        productdata.rating=(productdata.rating*productdata.ratingCount+doc.rating)/(productdata.ratingCount+1);
        productdata.ratingCount=productdata.ratingCount+ 1;
        productdata.save(function(err){
          if(err){
            
          }
          else{
            Location.findById(doc.location).exec(function(err,locationdata){
              if(err){
                
              }
              else{
                console.log("locationdata data.........."+JSON.stringify(locationdata))
                locationdata.rating=(locationdata.rating*locationdata.ratingCount+doc.rating)/(locationdata.ratingCount+1);
                locationdata.ratingCount=locationdata.ratingCount+ 1;
                locationdata.save(function(err){
                  if(err){
                    
                  }
                  else{
                  //console.log('location data..........'+JSON.stringify(locationdata))
                  ProductratingEvents.emit(event + ':' + doc._id, doc);
                  ProductratingEvents.emit(event, doc);
                  }
                })
              }
            })
          }
        })
      }
    })
  };
}

export {registerEvents};
export default ProductratingEvents;
