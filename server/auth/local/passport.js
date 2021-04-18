import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

function localAuthenticate(User, email, password, done) {
  User.findOne({
    email: email.toLowerCase()
  })
    .exec()
    .then(user => {
      if (!user) {
        //return done(null, false, { - remove my Alan 11/27
        done(null, false, {
          message: "This email is not registered."
        });
      }
      user.authenticate(password, function(authError, authenticated) {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(null, false, {
            message: "This password is not correct."
          });
        }
        if (user.role == "Owner" && user.status == false) {
          return done(null, false, {
            message: "You are not verified till now."
          });
        }
        if (user.activationStatus == false) {
          return done(null, false, {
            message: "Your account has been deactivated."
          });
        }
        if (user.role == "Manager") {
          return done(null, false, {
            message: "you can not login as Manager."
          });
        }
        if (user.role == "Staff") {
          return done(null, false, { message: "you can not login as staff." });
        } else {
          if (user.role == "User") {
            return done(null, false, { message: "you can not login as user." });
          }
          return done(null, user);
        }
      });
    })
    .catch(err => done(err));
}

export function setup(User) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password" // this is the virtual field on the model
      },
      function(email, password, done) {
        return localAuthenticate(User, email, password, done);
      }
    )
  );
}
