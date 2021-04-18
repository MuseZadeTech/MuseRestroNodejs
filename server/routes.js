/**
 * Main application routes
 */

"use strict";

import errors from "./components/errors";
import path from "path";

export default function(app) {
  // Insert routes below
  app.use("/api/news", require("./api/news"));
  app.use("/api/contactus", require("./api/contactus"));
  app.use("/api/bookingtables", require("./api/bookingtable"));
  app.use("/api/chats", require("./api/chat"));
  app.use("/api/cuisineLocations", require("./api/cuisineLocation"));
  app.use("/api/cuisines", require("./api/cuisine"));
  app.use("/api/ordertracks", require("./api/ordertrack"));
  app.use("/api/coupons", require("./api/coupan"));
  app.use("/api/notifications", require("./api/notification"));
  app.use("/api/favourites", require("./api/favourite"));
  app.use("/api/accountdetails", require("./api/accountdetail"));
  app.use("/api/carddetails", require("./api/carddetail"));
  app.use("/api/wallets", require("./api/wallet"));
  app.use("/api/productratings", require("./api/productrating"));
  app.use("/api/payments", require("./api/payment"));
  app.use("/api/pointrates", require("./api/pointrate"));
  app.use("/api/orders", require("./api/order"));
  app.use("/api/tags", require("./api/tag"));
  app.use("/api/messages", require("./api/message"));
  app.use("/api/deliveryareas", require("./api/deliveryarea"));
  app.use("/api/products", require("./api/product"));
  app.use("/api/locations", require("./api/location"));
  app.use("/api/subcategories", require("./api/subcategory"));
  app.use("/api/categories", require("./api/category"));
  app.use("/api/settings", require("./api/setting"));
  app.use("/api/users", require("./api/user"));
  app.use("/api/loyalty", require("./api/loyalty"));
  app.use("/api/dishoption", require("./api/dishoption"));
  app.use("/api/choice/", require("./api/choice"));
  app.use("/auth", require("./auth").default);

  // Adding new apis for Store Type
  app.use("/api/store-type", require("./api/storeType"));
  app.use("/api/store", require("./api/store"));
  // All undefined asset or api routes should return a 404
  app
    .route("/:url(api|auth|components|app|bower_components|assets)/*")
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route("/*").get((req, res) => {
    res.sendFile(path.resolve(`${app.get("appPath")}/index.html`));
  });
}
