'use strict';
import express from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';

// Passport Configuration
require('./local/passport').setup(User, config);
require('./facebook/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./twitter/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local').default);
router.use('/facebook', require('./facebook').default);
router.use('/twitter', require('./twitter').default);
router.use('/google', require('./google').default);

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send({ message: "Logout failed", err });
      }
      req.sessionID = null;
      req.logout();
      res.status(200).send({ message: "Logout success" });
    });
  });
export default router;
