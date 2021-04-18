var request = require("request");
var dconfig = require("./developmentconfig/config");
var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: dconfig.cloudinaryConfig.cloud_name,
  api_key: dconfig.cloudinaryConfig.api_key,
  api_secret: dconfig.cloudinaryConfig.api_secret
});
module.exports = {
  test(path) {
    return new Promise(function(resolve, reject) {
      console.log("working fine...........");
      resolve("ok");
    });
  },
  sentOrderMsg(mobileNumber, info) {
    return new Promise(function(resolve, reject) {
      var myFetch =
        "http://sms.adeep.in/api/v3/index.php?method=sms&api_key=Ae35ca54d608251b86ffa39ecc31e27cc&to=" +
        mobileNumber +
        "&sender=MNSAVE&message=" +
        dconfig.mailConfig.appName +
        ":- " +
        info +
        "& format=json&custom=1,2&flash=0";
      var FetchStream = require("fetch").FetchStream;
      var fetch = new FetchStream(myFetch);
      fetch.on("data", function(chunk) {
        console.log(chunk);
        resolve(chunk);
      });
    });
  },
  otpSentMobile(mobileNumber, info) {
    return new Promise(function(resolve, reject) {
      console.log("mobileNumber" + mobileNumber);
      var myFetch =
        "http://sms.adeep.in/api/v3/index.php?method=sms&api_key=Ae35ca54d608251b86ffa39ecc31e27cc&to=" +
        mobileNumber +
        "&sender=MNSAVE&message=Hi! " +
        info +
        "& format=json&custom=1,2&flash=0";
      var FetchStream = require("fetch").FetchStream;
      var fetch = new FetchStream(myFetch);
      fetch.on("data", function(chunk) {
        console.log(chunk);
        resolve(chunk);
      });
    });
  },
  otpSentMobileVerification(mobileNumber, info) {
    return new Promise(function(resolve, reject) {
      console.log("mobileNumber" + mobileNumber);
      var myFetch =
        "http://sms.adeep.in/api/v3/index.php?method=sms&api_key=Ae35ca54d608251b86ffa39ecc31e27cc&to=" +
        mobileNumber +
        "&sender=MNSAVE&message=Welcome To " +
        dconfig.mailConfig.appName +
        info +
        "& format=json&custom=1,2&flash=0";
      var FetchStream = require("fetch").FetchStream;
      var fetch = new FetchStream(myFetch);
      fetch.on("data", function(chunk) {
        console.log(chunk);
        resolve(chunk);
      });
    });
  },
  uploadToCloud(data) {
    return new Promise(function(resolve, reject) {
      cloudinary.uploader.upload(data, function(result) {
        if (!result) {
          resolve({ message: "some thing err to upload" });
        } else {
          resolve(result);
        }
      });
    });
  },
  uploadToCloud1(data) {
    return new Promise(function(resolve, reject) {
      //var d="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAABkCAMAAAC8R1L8AAAAh1BMVEX/mTMSiAf/////licAgwC4zab/3sEAAIIAAIXs7Pb8/P8AAH739/26utwAAIrAwN5eXq+AgLWhodC1tdrIyOU7O6Di4u9qaq+UlMZ2drUoKJnZ2e12dr9CQp/T0+uGhr2urtdVVaeIiMZ+fsNtbbhoaLc2NpVFRZt+fruNjcdvb7AfH5NYWK99DQahAAAB40lEQVRoge3YXY+jIBSAYffs7CIg4qilWpRSP1rt7P//fUOTTdNksxdEEklznibNtBfkzUAQmiQIIYQQQgghhBBCCL2xn3FKfscpgTi9fRczohKGhRouTBcVfUoIJyTtRRZkxCBd9srTy6UV7eWS8msVYsgAXWzmeVFSAOX+cWWR8znAbG7vogd+Ugyohgo0Baa++IHu35XdSKNBuiUGJQjq/tIluW1eZJu7Fn7IKCgBA6wwMKGAZge+7N1leF9DLWGlZ/bJznQF6T733OzbxY5E0wwqqxZbfpZ2VLYCRg05blz7G7tUnlJqa2js2hzvx+ZsGzCW0jRXu3aVvHTvcqqXezG4130wnXh+v19XQZSppFFN0Y3Dn2HsioZqKYwixa5dNyLdjmXbdhynPM2nbmwXqzKQ5LZnF7ueMqVrWXXF0Kd52g9FV8laq+x03bbw37PrdR5nN49zJPP4z7qf/q57vfO6f9kn5sc+0UayT7zsq2tM+6p7DpkYn0P/fW7rjeMGPudALOecaM+Fj3P0V4Tn6Oe9gz3vHdP2McPc06oo72lOFue99iHK3wHCi7brV5ySjzglP+KEXX6wyw92+cEuP9jlB7v8YJcf7PKDXX6wyw92+cEuP9jlB7v8YJefWLu+AUrGbBlvbqivAAAAAElFTkSuQmCC"
      cloudinary.uploader.upload(data, function(result) {
        //console.log(result);
        resolve(result);
      });
    });
  }

  // orderPushNotification(device,message,title){
  //     return new Promise(function(resolve,reject){
  //         var restKey = 'ZTAxZjJiNTYtNThiOC00YzM2LTllMjEtOTNmZTdjMzhmNDUx';
  //         var appID = '4aa91342-708c-4b69-8db6-0e33e05a4de4';
  //         request({
  //             method:'POST',
  //             uri:'https://onesignal.com/api/v1/notifications',
  //             headers: {
  //                "authorization": "Basic "+restKey,
  //                "content-type": "application/json"
  //             },
  //             json: true,
  //             body:{
  //                 'app_id': appID,
  //                 'contents': {en: message},
  //                 'headings': { en: title},
  //                 'include_player_ids': Array.isArray(device) ? device : [device]
  //             }
  //         },
  //         function(error, response, body) {
  //             if(!body.errors){
  //               console.log(body);
  //               resolve({message:"push send"})
  //             }else{
  //               console.error('Error:', body.errors);
  //               resolve({message:"push send"})
  //             }
  //         });
  //     })
  // }
};
