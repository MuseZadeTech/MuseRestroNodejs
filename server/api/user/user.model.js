"use strict";
/*eslint no-invalid-this:0*/
import crypto from "crypto";
mongoose.Promise = require("bluebird");
import mongoose, { Schema } from "mongoose";
var mongoosePaginate = require("mongoose-paginate");
import { registerEvents } from "./user.events";
import { stringify } from "querystring";

const authTypes = ["github", "twitter", "facebook", "google"];

var UserSchema = new Schema(
  {
    restaurantName: {
      type: String
    },
    userFromWhichApp: {
      type: Array,
      default: []
    },
    name: {
      type: String
    },
    facebookId: {
      type: Number
    },
    googleId: {
      type: Number
    },
    imageId: {
      type: String
    },
    imageUrl: {
      type: String
    },
    rememberMe: {
      type: Boolean,
      default: false
    },

    countryCode: {
      type: Number
    },

    contactPerson: {
      type: String
    },

    verificationCode: {
      type: Number
    },

    //only for staff
    restaurantID: {
      type: Schema.ObjectId,
      ref: "User"
    },
    // //it would be vary
    // //restaurant to restaurant
    // taxInfo: {
    //   taxName: {
    //     type: String,
    //     default: null
    //   },
    //   taxRate: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    contactNumber: {
      type: Number
    },

    earnedPoints: [
      {
        point: {
          type: Number,
          default: 0
        },

        time: {
          type: Date,
          default: Date.now
        }
      }
    ],

    alternateTelephone: {
      type: Number
    },
    address: {
      type: String
    },

    newAddress: {
      type: Array
    },

    newCardNumber: {
      type: Array
    },
    loyaltyPoints: {
      type: Array
    },
    //current loyalty point
    totalLoyaltyPoints: {
      type: Number
    },
    location: {
      type: Schema.ObjectId,
      ref: "Location"
    },
    //activated
    locationName: {
      type: String
    },
    locationInfo: {},

    city: {
      type: String
    },
    //activated
    activationStatus: {
      type: Boolean,
      default: true
    },
    state: {
      type: String
    },

    country: {
      type: String
    },

    zip: {
      type: Number
    },

    currency: {
      type: String
    },

    aboutUs: {
      type: String
    },

    logo: {
      type: String
    },

    publicId: {
      type: String
    },
    //user profile image
    userImage: {
      type: String
    },
    userImagePublicId: {
      type: String
    },

    //for staff
    status: {
      type: Boolean,
      default: true
    },
    //*********************for card details stripe payment card
    cardDetail: {
      type: Array
    },
    customerId: {
      type: String
    },
    //**********************************
    postalCode: {
      type: Number
    },

    street: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    },
    forgetPasswordNo: {
      type: Number
    },
    userStatuActivation: {
      type: String
    },
    email: {
      type: String,
      lowercase: true,
      required() {
        if (authTypes.indexOf(this.provider) === -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    role: {
      type: String
    },
    password: {
      type: String,
      required() {
        if (authTypes.indexOf(this.provider) === -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    provider: String,
    salt: String,
    facebook: {},
    twitter: {},
    google: {},
    github: {}
  },
  {
    usePushEach: true
  }
);

/**
 * Virtuals
 */

// Public profile information
UserSchema.virtual("profile").get(function() {
  return {
    name: this.name,
    role: this.role
  };
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual("token").get(function() {
  return {
    _id: this._id,
    role: this.role
  };
});

/**
 * Validations
 */

// Validate empty email
UserSchema.path("email").validate(function(email) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}, "Email cannot be blank");

// Validate empty password
UserSchema.path("password").validate(function(password) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return password.length;
}, "Password cannot be blank");

// Validate email is not taken
UserSchema.path("email").validate(function(value, respond) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return respond(true);
  }

  return this.constructor
    .findOne({ email: value })
    .exec()
    .then(user => {
      if (user) {
        if (this.id === user.id) {
          return respond(true);
        }
        return respond(false);
      }
      return respond(true);
    })
    .catch(function(err) {
      throw err;
    });
}, "The specified email address is already in use.");

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema.pre("save", function(next) {
  // Handle new/update passwords
  if (!this.isModified("password")) {
    return next();
  }

  if (!validatePresenceOf(this.password)) {
    if (authTypes.indexOf(this.provider) === -1) {
      return next(new Error("Invalid password"));
    } else {
      return next();
    }
  }

  // Make salt with a callback
  this.makeSalt((saltErr, salt) => {
    if (saltErr) {
      return next(saltErr);
    }
    this.salt = salt;
    this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
      if (encryptErr) {
        return next(encryptErr);
      }
      this.password = hashedPassword;
      return next();
    });
  });
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    var defaultByteSize = 16;

    if (typeof arguments[0] === "function") {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === "function") {
      callback = arguments[1];
    } else {
      throw new Error("Missing Callback");
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, salt.toString("base64"));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null;
      } else {
        return callback("Missing password or salt");
      }
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, "base64");

    if (!callback) {
      return crypto
        .pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, "sha1")
        .toString("base64");
    }

    return crypto.pbkdf2(
      password,
      salt,
      defaultIterations,
      defaultKeyLength,
      "sha1",
      (err, key) => {
        if (err) {
          return callback(err);
        } else {
          return callback(null, key.toString("base64"));
        }
      }
    );
  }
};

registerEvents(UserSchema);
export default mongoose.model("User", UserSchema);
