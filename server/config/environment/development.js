"use strict";
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {
  s3Bucket: "web-admin-11122019-development",
  // MongoDB connection options
  mongo: {
    uri: process.env.SERVER_IP
      ? `mongodb://admin:ComplexPassword1234rtret654@${process.env.SERVER_IP}:27017/react-admin?authSource=admin`
      : "mongodb://localhost:27017/react-admin"
    //uri: "mongodb://test:test1234@ds347298.mlab.com:47298/biz2app"
  },

  // Seed database on startup
  seedDB: false
};
