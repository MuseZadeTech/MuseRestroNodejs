const nodemailer = require("nodemailer");
var path = require("path");
var loopback = require("loopback");
var pdf = require("html-pdf");
const uuidv1 = require("uuid/v1");
var dconfig = require("./developmentconfig/config");
let transporter = nodemailer.createTransport({
  host: dconfig.mailConfig.host,
  port: 587,
  auth: dconfig.mailConfig.auth
});
module.exports = {
  orderStatusMail(name, email, mailStatus) {
    return new Promise(function(resolve, reject) {
      var myMessage = {
        name: name,
        logo: dconfig.mailConfig.logo,
        image: dconfig.mailConfig.image,
        banner: dconfig.mailConfig.banner,
        status: mailStatus,
        add: dconfig.mailConfig.mailAddress
      };
      var renderMessage = loopback.template(
        path.resolve(__dirname, "./components/orderStatus/order.ejs")
      );
      var html_body = renderMessage(myMessage);
      let mailOptions = {
        from: dconfig.mailConfig.from, //'info@info@biz2app.com' //'info@ionicfirebaseapp.com',
        to: email, //"testmyemail@gmail.com",
        subject: "Order From " + dconfig.mailConfig.appName,
        text: "text",
        html: html_body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        } else {
          resolve("ok");
        }
      });
    });
  },
  orderInvoiceMail(name, email, mailStatus, orderData) {
    var today = new Date();
    return new Promise(function(resolve, reject) {
      var invoiceMessage = {
        invoiceNumber: uuidv1().toUpperCase(),
        name: name,
        email: email,
        mobileNumber: orderData.user.contactNumber,
        add1: orderData.shippingAddress.address,
        add2: orderData.shippingAddress.locationName,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        pincode: orderData.shippingAddress.zip,
        orderID: orderData.orderID,
        invoiceDate:
          today.getDate() +
          "/" +
          (today.getMonth() + 1) +
          "/" +
          today.getFullYear(),
        paymentStatus: "Success",
        cart: orderData.productDetails,
        grandTotal: orderData.grandTotal,
        add: dconfig.mailConfig.mailAddress,
        appName: dconfig.mailConfig.appName,
        currency: dconfig.mailConfig.currency,
        logo: dconfig.mailConfig.logo
      };
      var myMessage = {
        name: name,
        logo: dconfig.mailConfig.logo,
        image: dconfig.mailConfig.image,
        banner: dconfig.mailConfig.banner,
        status: mailStatus,
        add: dconfig.mailConfig.mailAddress,
        appName: dconfig.mailConfig.appName,
        currency: dconfig.mailConfig.currency
      };
      var renderMessage = loopback.template(
        path.resolve(__dirname, "./components/orderStatus/order.ejs")
      );
      var html_body = renderMessage(myMessage);
      var renderMessagePdf = loopback.template(
        path.resolve(__dirname, "./components/orderStatus/invoice.ejs")
      );
      var html_body_pdf = renderMessagePdf(invoiceMessage);
      var options = { format: "pdf" };
      pdf
        .create(html_body_pdf, options)
        .toFile("invoice.pdf", function(err, res1) {
          if (err) {
            console.log("err.........." + err);
          } else {
            const csvFilePath = res1.filename;
            let mailOptions = {
              from: dconfig.mailConfig.from,
              to: email,
              subject: "Order From " + dconfig.mailConfig.appName,
              text: "text",
              html: html_body,
              attachments: [
                {
                  filename: "invoice.pdf",
                  path: path.resolve(csvFilePath),
                  contentType: "application/pdf"
                }
              ]
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              } else {
                resolve("ok");
              }
            });
          }
        });
    });
  },
  mailToMangerOnNewOrder(name, email, orderId) {
    return new Promise(function(resolve, reject) {
      var myMessage = {
        name: name,
        logo: dconfig.mailConfig.logo,
        image: dconfig.mailConfig.image,
        banner: dconfig.mailConfig.banner,
        orderId: orderId,
        add: dconfig.mailConfig.mailAddress
      };
      var renderMessage = loopback.template(
        path.resolve(__dirname, "./components/orderStatus/ordermailmanager.ejs")
      );
      var html_body = renderMessage(myMessage);
      let mailOptions = {
        from: dconfig.mailConfig.from,
        to: email,
        subject: "New Order",
        text: "text",
        html: html_body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        } else {
          resolve("ok");
        }
      });
    });
  },
  welcomeMail(name, email) {
    return new Promise(function(resolve, reject) {
      var myMessage = {
        name: name,
        logo: dconfig.mailConfig.logo,
        image: dconfig.mailConfig.image,
        appName: dconfig.mailConfig.appName,
        add: dconfig.mailConfig.mailAddress,
        link: "www.google.com" //(process.env.NODE_ENV == 'production')?dconfig.wlink.plink+"users/all/account/verify/link/"+userId:dconfig.wlink.slink+"users/all/account/verify/link/"+userId
      };
      var renderMessage = loopback.template(
        path.resolve(__dirname, "./components/email/store_welcome.ejs")
      );
      var html_body = renderMessage(myMessage);
      let mailOptions = {
        from: dconfig.mailConfig.from,
        to: email,
        subject: "Welcome To " + dconfig.mailConfig.appName,
        text: "text",
        html: html_body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        } else {
          console.log(info);
          resolve("ok");
        }
      });
    });
  },
  forgetMail(email, forgetPasswordNo) {
    return new Promise(function(resolve, reject) {
      var myMessage = {
        otp: forgetPasswordNo,
        logo: dconfig.mailConfig.logo,
        image: dconfig.mailConfig.image,
        appName: dconfig.mailConfig.appName,
        add: dconfig.mailConfig.mailAddress
      };
      var renderMessage = loopback.template(
        path.resolve(__dirname, "./components/email/account_password_reset.ejs")
      );
      var html_body = renderMessage(myMessage);
      let mailOptions = {
        from: dconfig.mailConfig.from,
        to: email,
        subject: "Forget Password To " + dconfig.mailConfig.appName,
        text: "text",
        html: html_body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        } else {
          resolve("ok");
        }
      });
    });
  },
  accountActivateAndDeactivateMail(name, email, userStatuActivation) {
    return new Promise(function(resolve, reject) {
      var myMessage = {
        name: name,
        logo: dconfig.mailConfig.logo,
        image: dconfig.mailConfig.image,
        userStatuActivation: userStatuActivation,
        add: dconfig.mailConfig.mailAddress
      };
      var renderMessage = loopback.template(
        path.resolve(__dirname, "./components/email/accounstauts.ejs")
      );
      var html_body = renderMessage(myMessage);
      let mailOptions = {
        from: dconfig.mailConfig.from,
        to: email,
        subject: "Account Status",
        text: "text",
        html: html_body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        } else {
          resolve("ok");
        }
      });
    });
  }
  // docRegectedMail(name,email,docRejectionMessage){
  //     return new Promise(function (resolve, reject) {
  //         var myMessage = {
  //             name:name,
  //             logo:dconfig.mailConfig.logo,
  //             image:dconfig.mailConfig.image,
  //             docRejectionMessage:docRejectionMessage
  //         };
  //         var renderMessage = loopback.template(path.resolve(__dirname, './components/email/doc_reject_mail.ejs'));
  //         var html_body = renderMessage(myMessage);
  //         let mailOptions = {
  //             from: 'admin.chef@tiffinshare.com',
  //             to: email,
  //             subject: 'Welcome to Tiffinshare.com (Initiative of DreamReality Pvt Ltd in empowering Homemaker.)',
  //             text: 'text',
  //             html: html_body
  //         };
  //         transporter.sendMail(mailOptions, (error, info) => {
  //             if (error) {
  //                 return console.log(error);
  //             }
  //             else{
  //                 resolve('ok')
  //             }
  //         });
  //     });
  // },
  // restaurantActiveDactiveMail(name,email,status){
  //     return new Promise(function (resolve, reject) {
  //         var myMessage = {
  //             name:name,
  //             logo:dconfig.mailConfig.logo,
  //             image:dconfig.mailConfig.image,
  //             activationStatus:status
  //         };
  //         var renderMessage = loopback.template(path.resolve(__dirname, './components/email/restaurant_activestatus.ejs'));
  //         var html_body = renderMessage(myMessage);
  //         let mailOptions = {
  //             from: 'admin.chef@tiffinshare.com',
  //             to: email,
  //             subject: 'Welcome to Tiffinshare.com (Initiative of DreamReality Pvt Ltd in empowering Homemaker.)',
  //             text: 'text',
  //             html: html_body
  //         };
  //         transporter.sendMail(mailOptions, (error, info) => {
  //             if (error) {
  //                 return console.log(error);
  //             }
  //             else{
  //                 resolve('ok')
  //             }
  //         });
  //     });
  // }
};
