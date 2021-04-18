"use strict";

import express from "express";
import passport from "passport";
import { signToken } from "../auth.service";
import config from "../../config/environment";
import jwt from "jsonwebtoken";
var router = express.Router();

router.post("/", function(req, res, next) {
  //console.log(req)
  passport.authenticate("local", function(err, user, info) {
    //console.log(user);
    var error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res
        .status(404)
        .json({ message: "Something went wrong, please try again." });
    }
    if (
      (user.role == "Manager" && user.location == null) ||
      user.location == ""
    ) {
      return res
        .status(401)
        .json({ message: "manager did not assigned to any restaurant." });
    }
    if (user.role == "User" && req.body.restId != undefined) {
      var zFiltered = [{ id: req.body.restId }].map(itemY => {
        return itemY.id;
      });
      let filteredZ = user.userFromWhichApp.filter(itemX =>
        zFiltered.includes(itemX.id)
      );
      if (filteredZ.length == 0) {
        user.userFromWhichApp.push({ id: req.body.restId });
        user.save(function(err, data) {});
      }
    }
    var token = jwt.sign(
      { _id: user._id, role: user.role },
      config.secrets.session,
      {
        expiresIn: 60 * 2
      }
    );
    var token = signToken(user._id, user.role);
    res.json({ token });
  })(req, res, next);
});

export default router;
