/**
 * Main application file
 */

"use strict";

import express from "express";
import mongoose from "mongoose";
const fileUpload = require("express-fileupload");
mongoose.Promise = require("bluebird");
import config from "./config/environment";
import http from "http";
import seedDatabaseIfNeeded from "./config/seed";
var bodyParser = require("body-parser");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(config.mongo.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("error", function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});
mongoose.set("useCreateIndex", true);

// https://docs.sentry.io/platforms/javascript/
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "https://92bac78493ce461480a4cf4d0a3c3b42@sentry.io/1355759"
});

// Populate databases with sample data
if (config.seedDB) {
  require("./config/seed");
}

// Setup server
var app = express();
var server = http.createServer(app);

app.use(
  fileUpload({
    limits: { fileSize: 5000000 }
  })
);

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
/*var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});*/
var socketio = require("socket.io").listen(server);
require("./config/socketio").default(socketio);
require("./config/express").default(app);
require("./routes").default(app);

// Start server
function startServer() {
  console.log("config port " + config.port);
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log(
      "Express server listening on %d, in %s mode",
      config.port,
      app.get("env")
    );
  });
}

seedDatabaseIfNeeded();
setImmediate(startServer);
// app.use(express.json({limit: '5000000'}));
// app.use(express.urlencoded({limit: '5000000'}));
// app.use(bodyParser.json({limit:'50mb', extended: true}));
// app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
// bodyParser = {
//   json: {limit: '500mb', extended: true},
//   urlencoded: {limit: '500mb', extended: true}
// };
// Expose app
exports = module.exports = app;
