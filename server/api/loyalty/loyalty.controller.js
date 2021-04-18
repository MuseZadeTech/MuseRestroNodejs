import Loyalty from "../loyalty/loyalty.model";
var mongoose = require("mongoose");

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function index(req, res) {
  var user_id = req.query.id;
  Loyalty.find({ restaurantID: user_id })
    .then(loyalty => {
      res.json(loyalty);
    })
    .catch(err => {
      res.json(err);
    });
}
export function create(req, res) {
  let loyaltybody = new Loyalty(req.body);
  console.log(loyaltybody);
  Loyalty.findOne({
    restaurantID: mongoose.Types.ObjectId(req.body.restaurantID)
  }).then(loyalty => {
    console.log(loyalty);
    if (!loyalty) {
     
      loyaltybody.save(function(err) {
        if (err) {
          //error occoured
          return handleError(err);
        } else {
          //send response
          res.json(loyalty);
        }
      });
    } else {
      Loyalty.findOneAndUpdate(
        { restaurantID: mongoose.Types.ObjectId(req.body.restaurantID) },
        req.body
      )
        .then(loyalty => {
          res.json(loyalty);
        })
        .catch(err => {
          res.json(err);
        });
    }
  });

}


export function loyaltyEnableUpdate(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  return Loyalty.findOne({restaurantID:id})
    .then(loyalty=>{
         var enable = !loyalty.enable;
         loyalty.enable = enable;
         Loyalty.findOneAndUpdate({restaurantID:id},loyalty)
        .then(loyalty=>{res.json(loyalty)})
    })
}

export function rewardEnableUpdate(req, res) {
  var id = req.params.id;
  var id = mongoose.Types.ObjectId(id);
  return Loyalty.findOne({restaurantID:id})
    .then(loyalty=>{
         var enable = !loyalty.rewardEnable;
         loyalty.rewardEnable = enable;
         Loyalty.findOneAndUpdate({restaurantID:id},loyalty)
        .then(loyalty=>{res.json(loyalty)})
    })
} 

