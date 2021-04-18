'use strict';    ////customer/restaurant orderAmountAndCount
  
var express = require('express');
var controller = require('./order.controller');
var auth 	   = require('../../auth/auth.service');
var router = express.Router();

// Get all Order of a User
router.get('/user/:id', auth.isAuthenticated(),controller.index);

// user Order delivered History
router.get('/userorder/history/', auth.isAuthenticated(),controller.userOrderHistory);

// user Order pending History
router.get('/userorder/pending/', auth.isAuthenticated(),controller.userOrderPending);

// Dashboard data
router.get('/dashboard/data/:id',controller.dashboardData);

// Customer info of a restaurant 
router.get('/customer/restaurant/:id', controller.customerData);

// Customer info of a location 
router.get('/customer/location/:id', controller.customerDataByLocation);

// Get all Order of a location 
router.get('/location/:id', auth.isAuthenticated(),controller.byLocation);

// Get all delivered Order of a location
router.get('/delivered/location/:id', auth.isAuthenticated(),controller.deliveredOrdersOfLocation);

// Get all Order of a restaurant
router.get('/restaurant/:id', auth.isAuthenticated(),controller.byRestaurant);

// Get an order by id
router.get('/:id', auth.isAuthenticated(),controller.show);

// Create an Order
router.post('/', auth.isAuthenticated(),controller.create);

// Update an Order //by admin //assign for delivery
router.put('/:id', auth.isAuthenticated(),controller.upsert);

// Update an Order with options and choices //by admin 
router.put('/:id/options', auth.isAuthenticated(),controller.upsertChoice);

// Delete an Order
router.delete('/:id', auth.isAuthenticated(),controller.destroy);

// csv data(orders customized by days data)
// Here id is restaurant id and days is number of days of data needed.
router.post('/csv/restaurant/:id', auth.isAuthenticated(),controller.csvData);

// CUSTOMER SEARCH
router.post('/customer/search/:id', auth.isAuthenticated(),controller.customerSearch);

// One day data
router.get('/one/day/:id', auth.isAuthenticated(),controller.oneDayData);

// ORDER SEARCH
router.post('/search/:id', auth.isAuthenticated(),controller.orderSearch);

// ORDER SEARCH on location basis with status
router.post('/search/order/bylocation/:id', auth.isAuthenticated(),controller.orderSearchByLocationId);


// Staff/deliverybuy access reqired:
// Get all orders list that has to deliver or already delivered by deliveryGuy 
router.get('/delivery/list/:id', auth.isAuthenticated(),controller.allDelivery);

// all pending delivery of a delivery boy
router.get('/pending/:id', auth.isAuthenticated(),controller.pendingDelivery);

// all delivered Orders by a delivery boy
router.post('/delivered/:id', auth.isAuthenticated(),controller.deliveredDelivery);

// location wise customized order data
router.post('/custom', auth.isAuthenticated(), controller.csvOrder);

// Get a delivery boy assigned order by day week month
router.get('/all/show/:id',auth.isAuthenticated(), controller.dayWeekMonthData);

// Get seven days orders and withdraw of a seller
router.get('/and/withdraw/:id',auth.isAuthenticated(), controller.ordersAndWithdraw);

// Get all sellers orders total and orders count of a week in decending order
router.post('/amount/count', auth.hasRole('Admin'),controller.orderAmountAndCount);

// today selling of all restaurant
router.get('/day/sell', auth.hasRole('Admin'),controller.todaySell);

// search by the matching crieteria
router.post('/search', controller.search);

// earning of a restaurant(all/month/day)
router.get('/restaurant/info/:id', auth.isAuthenticated(),controller.restaurantdata);

// earning (all/month/day) of a location of a restaurant
router.get('/location/info/:id', auth.isAuthenticated(),controller.locationorderdata);

// orders between two dates(timestamps) of a restaurant
router.get('/restaurant/:id/:lowerlimit/:upperlimit', auth.isAuthenticated(),controller.restaurantOrdersBtnDates);

// orders between two dates(timestamps) of a location
router.get('/location/:id/:lowerlimit/:upperlimit', auth.isAuthenticated(),controller.locationOrdersBtnDates);

// get coustomer by name
router.get('/search/customer/:id/:customername', controller.searchcustomer);

// single restaurant collection of a month by day of a restaurant
router.get('/sales/counts/restaurant/:restaurantId', controller.restaurantCount);

// single restaurant collection of a month by day of a restaurant
router.get('/sales/counts/location/:id', controller.locationCount);

// single restaurant collection of a month by day of a restaurant
router.get('/collection/:restaurantId',  auth.hasRole('Owner'),controller.singleRestaurantCollInfos);

// graph api as well as few accountability info of a location 
router.get('/location/data/:locationId',  auth.hasRole('Manager'),controller.singleLocationCollInfos);

// graph api as well as few accountability info
router.get('/collections/restaurants',controller.allRestaurantCollectionInfos);

// gets a list of cancel or deliver of a user
router.get('/cancel/OR/deliver/:id',controller.canORdel);

// search customer by name and loction id
router.post('/customerbyname/bylocationid/search/:id', controller.customerSerchByName);

// search customer by name and restaurant id
router.post('/customerbyname/byrestaurant/search/:id', controller.customerSerchByNamebyrestaurant);

module.exports = router;
