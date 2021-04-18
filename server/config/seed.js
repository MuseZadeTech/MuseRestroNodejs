/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

"use strict";
import User from "../api/user/user.model";
import Location from "../api/location/location.model";
import Order from "../api/order/order.model";
import Category from "../api/category/category.model";
import Product from "../api/product/product.model";
import Tag from "../api/tag/tag.model";
import Setting from "../api/setting/setting.model";
import Wallet from "../api/wallet/wallet.model";
import Coupan from "../api/coupan/coupan.model";
import Notification from "../api/notification/notification.model";
import Productrating from "../api/productrating/productrating.model";
import StoreType from "../api/storeType/storeType.model";
import Store from "../api/store/store.model";
import Cat_loc from "../api/cat_loc.model";
import Pro_loc from "../api/pro_loc.model";
import Loyalty from "../api/loyalty/loyalty.model";
import DishOption from "../api/dishoption/dishoption.model";
import config from "./environment/";


export default function seedDatabaseIfNeeded() {
  // let x=132
  //&& x==1234
  //
  if (config.seedDB) {
    User.find({})
      .remove()
      .then(() => {
        User.create(
          {
            _id: "5a79929f9050b4001461f0b2",
            totalLoyaltyPoints: 0,
            provider: "local",
            name: "Biz2App",
            email: "alan1234@gmail.com",
            contactNumber: 8866588148,
            password: 123456,
            role: "Owner",
            createdAt: "2018-01-29T09:05:16.152Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [
              {
                point: 0
              }
            ],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            country: "",
            street: "5354 Amigo Ave",
            restarurantName: "",
            postalCode: 0
          },
          {
            _id: "5a6eb71728d7b9001499a140",
            provider: "local",
            restaurantName: "FoodWorld",
            name: "JhonOwner",
            email: "swati@biz2app.com",
            password: 123456,
            role: "Owner",
            createdAt: "2018-01-29T05:54:31.504Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            logo:
              "https://res.cloudinary.com/impnolife/image/upload/v1517292557/ghkzruj469gbzpcgraqw.jpg",
            publicId: "ghkzruj469gbzpcgraqw",
            rememberMe: false,
            __v: 0,
            taxInfo: {
              taxRate: 10,
              taxName: "GST(10%)"
            }
          },
          {
            _id: "5a6eb84428d7b9001499a142",
            provider: "local",
            restaurantName: "AdminAccount",
            name: "SuperAdmin",
            email: "alan@biz2app.com",
            password: 123456,
            role: "Admin",
            createdAt: "2018-01-29T05:59:32.561Z",
            status: false,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0
          },
          {
            _id: "5a6ebe6c28d7b9001499a143",
            provider: "local",
            name: "watson",
            address: "16 main,1 stage",
            contactNumber: 9888122645,
            email: "watson@gmail.com",
            restaurantName: "FoodWorld",
            restaurantID: "5a6eb71728d7b9001499a140",
            password: 123456,
            role: "Manager",
            createdAt: "2018-01-29T06:25:48.001Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0,
            locationInfo: {
              locationName: "BTM",
              locationId: "5a6ec0b328d7b9001499a144"
            },
            location: "5a6ec0b328d7b9001499a144"
          },
          {
            _id: "5a6ec262bebf1b001460d925",
            provider: "local",
            name: "Wasim",
            address: "7 block",
            contactNumber: 7878788922,
            email: "manager@gmail.com",
            restaurantName: "FoodWorld",
            restaurantID: "5a6eb71728d7b9001499a140",
            password: 123456,
            role: "Manager",
            createdAt: "2018-01-29T06:42:42.416Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0,
            locationInfo: {
              locationName: "koramangala",
              locationId: "5a6ec34fbebf1b001460d926"
            },
            location: "5a6ec34fbebf1b001460d926"
          },
          {
            _id: "5a6ec3f7bebf1b001460d927",
            provider: "local",
            name: "Thron",
            address: "9 th block",
            contactNumber: 8989888781,
            email: "thronmanager@gmail.com",
            restaurantName: "FoodWorld",
            restaurantID: "5a6eb71728d7b9001499a140",
            password: 123456,
            role: "Manager",
            createdAt: "2018-01-29T06:49:27.173Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0,
            locationInfo: {
              locationName: "Bellandur",
              locationId: "5a6ec48dbebf1b001460d928"
            },
            location: "5a6ec48dbebf1b001460d928"
          },
          {
            _id: "5a6eb7a128d7b9001499a141",
            totalLoyaltyPoints: 0,
            provider: "local",
            name: "Sandip",
            email: "sandip@gmail.com",
            contactNumber: 8866588148,
            password: 123456,
            role: "User",
            createdAt: "2018-01-29T05:56:49.492Z",
            status: false,
            activationStatus: true,
            loyaltyPoints: [
              {
                point: 0
              }
            ],
            newCardNumber: [],
            newAddress: [
              {
                name: "Sandip",
                city: "Ahmedabad",
                zip: "560100",
                locationName: "Bangalore ",
                contactNumber: "8866588148",
                address: "#32, silkboard, Bangalore"
              }
            ],
            earnedPoints: [],
            rememberMe: false,
            __v: 1
          },
          {
            _id: "5a6ecf99eded160014cc2166",
            provider: "local",
            name: "DeliveryBoy",
            address: "16 main",
            contactNumber: 8923122323,
            email: "foodworldstaff@gmail.com",
            restaurantName: "FoodWorld",
            restaurantID: "5a6eb71728d7b9001499a140",
            password: 123456,
            location: "5a6ec0b328d7b9001499a144",
            role: "Staff",
            createdAt: "2018-01-29T07:39:05.766Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0,
            country: "india"
          },
          {
            _id: "5a6ed34dfb8bea00144d1418",
            provider: "local",
            name: "DeliveryBoy2",
            address: "17 main",
            contactNumber: 8912281718,
            email: "foodworldstaff2@gmail.com",
            restaurantName: "FoodWorld",
            restaurantID: "5a6eb71728d7b9001499a140",
            password: 123456,
            location: "5a6ec0b328d7b9001499a144",
            role: "Staff",
            createdAt: "2018-01-29T07:54:53.302Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0
          },
          {
            _id: "5a6ef8b62f21c010ac4fca15",
            provider: "local",
            name: "Mark",
            address: "10th block",
            contactNumber: 8998789889,
            email: "mark@gmail.com",
            restaurantName: "FoodWorld",
            restaurantID: "5a6eb71728d7b9001499a140",
            password: 123456,
            location: "5a6ec48dbebf1b001460d928",
            locationInfo: {
              locationName: "Bellandur",
              locationId: "5a6ec48dbebf1b001460d928"
            },
            role: "Staff",
            createdAt: "2018-01-29T10:34:30.978Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0
          },
          {
            _id: "5a6f055f15f0271a240c1f5f",
            provider: "local",
            restaurantName: "FoodZone",
            contactNumber: 9889899877,
            name: "Mickel",
            email: "mickelowner@gmail.com",
            logo:
              "https://res.cloudinary.com/impnolife/image/upload/v1517292677/ac4ofxtufqikdn1cye1t.jpg",
            publicId: "ac4ofxtufqikdn1cye1t",
            password: 123456,
            role: "Owner",
            createdAt: "2018-01-29T11:28:31.176Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0,
            taxInfo: {
              taxRate: 12,
              taxName: "GST(12%)"
            }
          },
          {
            _id: "5a6f003a15f0271a240c1f45",
            provider: "local",
            name: "zozo",
            address: "block 10",
            contactNumber: 9889899877,
            email: "foodworldstaff3@gmail.com",
            restaurantName: "FoodWorld",
            restaurantID: "5a6eb71728d7b9001499a140",
            password: 123456,
            location: "5a6ec34fbebf1b001460d926",
            role: "Staff",
            createdAt: "2018-01-29T11:06:34.804Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0
          },
          {
            _id: "5a6f064215f0271a240c1f60",
            provider: "local",
            name: "Joy",
            address: "17th block",
            contactNumber: 8898978778,
            email: "joymanager@gmail.com",
            restaurantName: "FoodZone",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            password: 123456,
            role: "Manager",
            createdAt: "2018-01-29T11:32:18.158Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0,
            locationInfo: {
              locationName: "Marathali",
              locationId: "5a6f073d15f0271a240c1f63"
            },
            location: "5a6f073d15f0271a240c1f63"
          },
          {
            _id: "5a6f067315f0271a240c1f61",
            provider: "local",
            name: "Roy",
            address: "11th block",
            contactNumber: 8898978779,
            email: "roymanager@gmail.com",
            restaurantName: "FoodZone",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            password: 123456,
            role: "Manager",
            createdAt: "2018-01-29T11:33:07.710Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0,
            locationInfo: {
              locationName: "ACS layout",
              locationId: "5a6f07d815f0271a240c1f64"
            },
            location: "5a6f07d815f0271a240c1f64"
          },
          {
            _id: "5a6f069215f0271a240c1f62",
            provider: "local",
            name: "Rohit",
            address: "11th block",
            contactNumber: 8898978770,
            email: "rohitmanager@gmail.com",
            restaurantName: "FoodZone",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            password: 123456,
            role: "Manager",
            createdAt: "2018-01-29T11:33:38.127Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0,
            locationInfo: {
              locationName: "WhiteField",
              locationId: "5a6f083b15f0271a240c1f66"
            },
            location: "5a6f083b15f0271a240c1f66"
          },
          {
            _id: "5a6f0c6d15f0271a240c1f7a",
            provider: "local",
            name: "vickey",
            address: "6 block",
            contactNumber: 9988978781,
            email: "foodzonestaff@gmail.com",
            restaurantName: "FoodZone",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            password: 123456,
            location: "5a6f083b15f0271a240c1f66",
            role: "Staff",
            createdAt: "2018-01-29T11:58:37.427Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0
          },
          {
            _id: "5a6f0de815f0271a240c1f85",
            provider: "local",
            name: "Ravi",
            address: "9 block",
            contactNumber: 8798678675,
            email: "foodzonestaff1@gmail.com",
            restaurantName: "FoodZone",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            password: 123456,
            location: "5a6f07d815f0271a240c1f64",
            role: "Staff",
            createdAt: "2018-01-29T12:04:56.805Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0
          },
          {
            _id: "5a6f0ec915f0271a240c1f8a",
            provider: "local",
            name: "varun",
            address: "17 cross",
            contactNumber: 7867756466,
            email: "fodezonestaff3@gmail.com",
            restaurantName: "FoodZone",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            password: 123456,
            location: "5a6f073d15f0271a240c1f63",
            role: "Staff",
            createdAt: "2018-01-29T12:08:41.764Z",
            status: true,
            activationStatus: true,
            loyaltyPoints: [],
            newCardNumber: [],
            newAddress: [],
            earnedPoints: [],
            rememberMe: false,
            __v: 0
          }
        )
          .then(() => console.log("finished populating users"))
          .catch(err => console.log("error populating users", err));
      });
    Location.find({})
      .remove()
      .then(() => {
        Location.create(
          {
            _id: "5a6ec0b328d7b9001499a144",
            restaurantID: "5a79929f9050b4001461f0b2",
            alwaysReachable: true,
            featured: false,
            taxExist: false,
            contactPerson: "5a6ebe6c28d7b9001499a143",
            contactNumber: 8187749400,
            alternateEmail: "watson@gmail.com",
            locationName: "Tel Aviv - Encino",
            address: "17201 Ventura Blvd",
            state: "California",
            city: "Encino",
            zip: 91356,
            country: "USA",
            alternateTelephone: "9087723456",
            latitude: 12.9170646,
            longitude: 77.5898977,
            aboutUs: "Good",
            createdAt: "2018-01-29T06:35:31.695Z",
            enable: true,
            ratingCount: 1,
            rating: 4,
            tax: [],
            postalCode: 91356,
            __v: 0,
            deliveryInfo: {
              id: "5a6ec0b328d7b9001499a144",
              deliveryInfo: {
                deliveryCharges: "30",
                freeDelivery: false,
                amountEligibility: 500,
                areaCode: [null],
                areaAthority: true,
                deliveryTime: "20-30 min"
              }
            }
          },
          {
            _id: "5a6ec34fbebf1b001460d926",
            restaurantID: "5a79929f9050b4001461f0b2",
            alwaysReachable: true,
            featured: false,
            taxExist: false,
            contactPerson: "5a6ec262bebf1b001460d925",
            contactNumber: 7878788922,
            alternateEmail: "manager@gmail.com",
            locationName: "Tel Aviv - Woodland Hills",
            address: "23349 Mulholland Dr",
            state: "California",
            city: "Woodland Hills",
            zip: 91364,
            country: "USA",
            alternateTelephone: "8187749400",
            latitude: 12.9737359,
            longitude: 77.6377612,
            aboutUs: "good",
            createdAt: "2018-01-29T06:46:39.436Z",
            enable: true,
            ratingCount: 0,
            rating: 0,
            tax: [],
            __v: 0,
            deliveryInfo: {
              id: "5a6ec34fbebf1b001460d926",
              deliveryInfo: {
                deliveryCharges: "50",
                freeDelivery: false,
                amountEligibility: 500,
                areaCode: [{}],
                areaAthority: true,
                deliveryTime: "10 min"
              }
            }
          },
          {
            _id: "5a6ec48dbebf1b001460d928",
            restaurantID: "5a79929f9050b4001461f0b2",
            alwaysReachable: true,
            featured: false,
            taxExist: false,
            contactPerson: "5a6ec3f7bebf1b001460d927",
            contactNumber: 8187749400,
            alternateEmail: "thronmanager@gmail.com",
            locationName: "Tel Aviv Fish",
            address: "19014 Ventura Blvd",
            state: "California",
            city: "Tarzana",
            zip: 91356,
            country: "USA",
            alternateTelephone: "9898889786",
            latitude: 12.9737359,
            longitude: 77.6377612,
            aboutUs: "good",
            createdAt: "2018-01-29T06:51:57.745Z",
            enable: true,
            ratingCount: 0,
            rating: 0,
            tax: [],
            __v: 0,
            deliveryInfo: {
              id: "5a6ec48dbebf1b001460d928",
              deliveryInfo: {
                deliveryCharges: "20",
                freeDelivery: false,
                amountEligibility: 500,
                areaCode: [{}],
                areaAthority: true,
                deliveryTime: "15 min"
              }
            },
            workingHours: {
              daySchedule: [
                {
                  timeSchedule: [{}]
                }
              ],
              isAlwaysOpen: true
            }
          },
          {
            _id: "5a6f073d15f0271a240c1f63",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            alwaysReachable: true,
            featured: false,
            taxExist: false,
            contactPerson: "5a6f064215f0271a240c1f60",
            contactNumber: 8898978778,
            alternateEmail: "joymanager@gmail.com",
            locationName: "Marathali",
            address:
              " #88, Venkatadri Plaza, 3rd Floor,, Above Elite Ford, Marthalli Outer Ring ",
            state: "karnatak",
            city: "Bengaluru",
            zip: 560078,
            country: "India",
            alternateTelephone: "8987876866",
            latitude: 12.9715987,
            longitude: 77.5945627,
            aboutUs: "GOOD",
            createdAt: "2018-01-29T11:36:29.840Z",
            enable: true,
            ratingCount: 0,
            rating: 0,
            tax: [],
            __v: 0
          },
          {
            _id: "5a6f07d815f0271a240c1f64",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            alwaysReachable: true,
            featured: false,
            taxExist: false,
            contactPerson: "5a6f067315f0271a240c1f61",
            contactNumber: 8898978779,
            alternateEmail: "roymanager@gmail.com",
            locationName: "ACS layout",
            address:
              "No.295, Ground Floor, BBMP Khatha No.291, AECS Layout Main Road",
            state: "karnatak",
            city: "bangaluru",
            zip: 560067,
            country: "India",
            alternateTelephone: "9798787867",
            latitude: 12.9715987,
            longitude: 77.5945627,
            aboutUs: "good",
            createdAt: "2018-01-29T11:39:04.104Z",
            enable: true,
            ratingCount: 0,
            rating: 0,
            tax: [],
            __v: 0,
            deliveryInfo: {
              id: "5a6f07d815f0271a240c1f64",
              deliveryInfo: {
                deliveryCharges: "40",
                freeDelivery: false,
                amountEligibility: 500,
                areaCode: [{}],
                areaAthority: true,
                deliveryTime: "10 min"
              }
            }
          },
          {
            _id: "5a6f083b15f0271a240c1f66",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            alwaysReachable: true,
            featured: false,
            taxExist: false,
            contactPerson: "5a6f069215f0271a240c1f62",
            contactNumber: 8898978770,
            alternateEmail: "rohitmanager@gmail.com",
            locationName: "WhiteField",
            address:
              "1/5, Nallurahalli Circle, Near The whitefield Super Market",
            state: "karnatak",
            city: "bangaluru",
            zip: 560066,
            country: "India",
            alternateTelephone: "8778677666",
            latitude: 12.9715987,
            longitude: 77.5945627,
            aboutUs: "good",
            createdAt: "2018-01-29T11:40:43.855Z",
            enable: true,
            ratingCount: 0,
            rating: 0,
            tax: [],
            __v: 0,
            deliveryInfo: {
              id: "5a6f083b15f0271a240c1f66",
              deliveryInfo: {
                deliveryCharges: "30",
                freeDelivery: false,
                amountEligibility: 500,
                areaCode: [{}],
                areaAthority: true,
                deliveryTime: "20-30 min"
              }
            }
          }
        ).then(() => {
          console.log("finished populating Location");
        });
      });
    Category.find({})
      .remove()
      .then(() => {
        Category.create(
          {
            _id: "5a6ec85fbebf1b001460d92a",
            location: "5a6ec0b328d7b9001499a144",
            categoryName: "meal",
            restaurantID: "5a6eb71728d7b9001499a140",
            locationInfo: {
              locationName: "BTM",
              locationId: "5a6ec0b328d7b9001499a144"
            },
            sort: 1,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517209693/cpazgcrcejo4p5gvgxso.jpg",
            publicId: "cpazgcrcejo4p5gvgxso",
            parent_category: "5a6ec893bebf1b001460d92b",
            createdAt: "2018-01-29T06:37:29.582Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6ec893bebf1b001460d92b",
            location: "5a6ec0b328d7b9001499a144",
            categoryName: "snacks",
            restaurantID: "5a6eb71728d7b9001499a140",
            locationInfo: {
              locationName: "BTM",
              locationId: "5a6ec0b328d7b9001499a144"
            },
            sort: 3,
            parent_category: "5a6ec893bebf1b001460d92b",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517209745/tru8rlk7vi50e8dv044u.jpg",
            publicId: "tru8rlk7vi50e8dv044u",
            createdAt: "2018-01-29T06:37:29.582Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6ec8c0bebf1b001460d92c",
            location: "5a6ec0b328d7b9001499a144",
            categoryName: "salad",
            restaurantID: "5a6eb71728d7b9001499a140",
            locationInfo: {
              locationName: "BTM",
              locationId: "5a6ec0b328d7b9001499a144"
            },
            sort: 2,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517209791/utrppx4yyuckpn40x6ng.jpg",
            publicId: "utrppx4yyuckpn40x6ng",
            parent_category: "5a6ec893bebf1b001460d92b",
            createdAt: "2018-01-29T06:37:29.582Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6ee49bfb8ddd0014474086",
            location: "5a6ec48dbebf1b001460d928",
            categoryName: "sweet ",
            parent_category: "5a6ec893bebf1b001460d92b",
            restaurantID: "5a6eb71728d7b9001499a140",
            locationInfo: {
              locationName: "Bellandur",
              locationId: "5a6ec48dbebf1b001460d928"
            },
            sort: 3,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517216921/kamaounvtpvy4umqtu9a.jpg",
            publicId: "kamaounvtpvy4umqtu9a",
            createdAt: "2018-01-29T08:54:28.062Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6ee4c83ac1c80014331e8f",
            location: "5a6ec48dbebf1b001460d928",
            categoryName: "prathas",
            restaurantID: "5a6eb71728d7b9001499a140",
            locationInfo: {
              locationName: "Bellandur",
              locationId: "5a6ec48dbebf1b001460d928"
            },
            sort: 4,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517216967/ha5ky4jdveg3lofv7dot.jpg",
            publicId: "ha5ky4jdveg3lofv7dot",
            createdAt: "2018-01-29T09:09:23.779Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6ee4f03ac1c80014331e90",
            location: "5a6ec48dbebf1b001460d928",
            categoryName: "rolls",
            restaurantID: "5a6eb71728d7b9001499a140",
            locationInfo: {
              locationName: "Bellandur",
              locationId: "5a6ec48dbebf1b001460d928"
            },
            sort: 5,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517217007/copjorjyerp2t3dtgnou.jpg",
            publicId: "copjorjyerp2t3dtgnou",
            createdAt: "2018-01-29T09:09:23.779Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f00c515f0271a240c1f47",
            location: "5a6ec34fbebf1b001460d926",
            categoryName: "veg ",
            restaurantID: "5a6eb71728d7b9001499a140",
            locationInfo: {
              locationName: "koramangala",
              locationId: "5a6ec34fbebf1b001460d926"
            },
            sort: 2,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517224131/ytg6odzhgiqup3sovxwr.jpg",
            publicId: "ytg6odzhgiqup3sovxwr",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f014f15f0271a240c1f4c",
            location: "5a6ec34fbebf1b001460d926",
            categoryName: "snacks",
            restaurantID: "5a6eb71728d7b9001499a140",
            locationInfo: {
              locationName: "koramangala",
              locationId: "5a6ec34fbebf1b001460d926"
            },
            sort: 3,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517224269/umcpqfa140gnwsxoemgt.jpg",
            publicId: "umcpqfa140gnwsxoemgt",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f015015f0271a240c1f4d",
            location: "5a6ec34fbebf1b001460d926",
            categoryName: "icecream",
            restaurantID: "5a6eb71728d7b9001499a140",
            locationInfo: {
              locationName: "koramangala",
              locationId: "5a6ec34fbebf1b001460d926"
            },
            sort: 3,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517224270/xfwebituf7g2dzzkclie.jpg",
            publicId: "xfwebituf7g2dzzkclie",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f08db15f0271a240c1f6a",
            location: "5a6f073d15f0271a240c1f63",
            categoryName: "south special",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            locationInfo: {
              locationName: "Marathali",
              locationId: "5a6f073d15f0271a240c1f63"
            },
            sort: 2,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226201/unep9w8qs8pcbg4hmp93.jpg",
            publicId: "unep9w8qs8pcbg4hmp93",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f090315f0271a240c1f6b",
            location: "5a6f073d15f0271a240c1f63",
            categoryName: "north special",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            locationInfo: {
              locationName: "Marathali",
              locationId: "5a6f073d15f0271a240c1f63"
            },
            sort: 3,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226241/rnfz762y8hckvknpy2hh.jpg",
            publicId: "rnfz762y8hckvknpy2hh",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f092a15f0271a240c1f6d",
            location: "5a6f073d15f0271a240c1f63",
            categoryName: "chinese",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            locationInfo: {
              locationName: "Marathali",
              locationId: "5a6f073d15f0271a240c1f63"
            },
            sort: 5,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226280/btkwzhhn3mjpvaja7mct.jpg",
            publicId: "btkwzhhn3mjpvaja7mct",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f097f15f0271a240c1f6f",
            location: "5a6f07d815f0271a240c1f64",
            categoryName: "veg special",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            locationInfo: {
              locationName: "ACS layout",
              locationId: "5a6f07d815f0271a240c1f64"
            },
            sort: 1,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226366/nlbcjxqzkvre7f6s1emm.jpg",
            publicId: "nlbcjxqzkvre7f6s1emm",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f09a415f0271a240c1f70",
            location: "5a6f07d815f0271a240c1f64",
            categoryName: "Non-veg special",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            locationInfo: {
              locationName: "ACS layout",
              locationId: "5a6f07d815f0271a240c1f64"
            },
            sort: 2,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226402/wwzsxicpb2yegfzbiptn.jpg",
            publicId: "wwzsxicpb2yegfzbiptn",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f09d915f0271a240c1f71",
            location: "5a6f07d815f0271a240c1f64",
            categoryName: "Raita",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            locationInfo: {
              locationName: "ACS layout",
              locationId: "5a6f07d815f0271a240c1f64"
            },
            sort: 2,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226455/enajcawnzkgjwikenqvl.jpg",
            publicId: "enajcawnzkgjwikenqvl",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f0a3c15f0271a240c1f72",
            location: "5a6f083b15f0271a240c1f66",
            categoryName: "cake",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            locationInfo: {
              locationName: "WhiteField",
              locationId: "5a6f083b15f0271a240c1f66"
            },
            sort: 1,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226555/su1sb3suiu891xuqwpml.jpg",
            publicId: "su1sb3suiu891xuqwpml",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f0ac215f0271a240c1f73",
            location: "5a6f083b15f0271a240c1f66",
            categoryName: "chinese special",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            locationInfo: {
              locationName: "WhiteField",
              locationId: "5a6f083b15f0271a240c1f66"
            },
            sort: 3,
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226688/sppknpdzjjnz6whm4jck.jpg",
            publicId: "sppknpdzjjnz6whm4jck",
            createdAt: "2018-01-29T11:03:30.439Z",
            enable: true,
            __v: 0
          }
        ).then(() => {
          console.log("finished populating Category");
        });
      });
    Product.find({})
      .remove()
      .then(() => {
        Product.create(
          {
            _id: "5a6ecb08bebf1b001460d92d",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec0b328d7b9001499a144",
            category: "5a6ec85fbebf1b001460d92a",
            title: "Egg curry",
            brand: "foodworld",
            description: "foodworld special",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517210374/w0juklk7ugduyklsa5kc.jpg",
            publicId: "w0juklk7ugduyklsa5kc",
            categoryTitle: "meal",
            createdAt: "2018-01-29T07:19:36.356Z",
            variants: [
              {
                weight: 250,
                unit: "gm",
                MRP: 250,
                size: "half",
                Discount: 0,
                price: 250
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 1,
            rating: 4,
            __v: 0
          },
          {
            _id: "5a6ecb75bebf1b001460d92f",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec0b328d7b9001499a144",
            category: "5a6ec85fbebf1b001460d92a",
            title: "Chapati",
            brand: "foodworld",
            description: "foodwold north special",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517210483/eyd1tzss5koprdmzn9l3.jpg",
            publicId: "eyd1tzss5koprdmzn9l3",
            categoryTitle: "meal",
            createdAt: "2018-01-29T07:21:25.911Z",
            variants: [
              {
                weight: 50,
                unit: "gm",
                MRP: 100,
                size: "half",
                Discount: 0,
                price: 100,
                _id: "5a6ecb75bebf1b001460d930"
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6ecbcdbebf1b001460d931",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec34fbebf1b001460d926",
            category: "5a6f00c515f0271a240c1f47",
            title: "kdhai Paneer",
            brand: "foodworld",
            description: "desy tadka",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517210571/qz3k0gtmmll1n3egnf3z.jpg",
            publicId: "qz3k0gtmmll1n3egnf3z",
            categoryTitle: "veg ",
            createdAt: "2018-01-29T07:22:53.622Z",
            variants: [
              {
                _id: "5a6ecbcdbebf1b001460d932",
                price: 360,
                Discount: 10,
                size: "half",
                MRP: 400,
                unit: "gm",
                weight: 250
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6ecc18bebf1b001460d933",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec34fbebf1b001460d926",
            category: "5a6f00c515f0271a240c1f47",
            title: "fry Rice",
            brand: "foodworld",
            description: "with extra veggi",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517210647/arejpcendlkoggg2xehn.jpg",
            publicId: "arejpcendlkoggg2xehn",
            categoryTitle: "veg ",
            createdAt: "2018-01-29T07:24:08.516Z",
            variants: [
              {
                _id: "5a6ecc18bebf1b001460d934",
                price: 180,
                Discount: 0,
                MRP: 180,
                size: "half",
                unit: "gm",
                weight: 300
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6ef9682f21c010ac4fca16",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec48dbebf1b001460d928",
            category: "5a6ee49bfb8ddd0014474086",
            title: "chinese sweet",
            brand: "foodworld",
            description: "desy with chinese",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517222247/nd5dodkhgjm1h4mor1dh.jpg",
            publicId: "nd5dodkhgjm1h4mor1dh",
            categoryTitle: "sweet ",
            createdAt: "2018-01-29T10:37:28.987Z",
            variants: [
              {
                weight: 100,
                unit: "gm",
                MRP: 200,
                size: "half",
                Discount: 0,
                price: 200,
                _id: "5a6ef9682f21c010ac4fca17"
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6efb182f21c010ac4fca1b",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec48dbebf1b001460d928",
            category: "5a6ee4f03ac1c80014331e90",
            title: "veg pocket",
            brand: "foodworld",
            description: "extra cheese ",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517222678/zoa0e9lme4qk3zqcmksn.jpg",
            publicId: "zoa0e9lme4qk3zqcmksn",
            categoryTitle: "rolls",
            createdAt: "2018-01-29T10:44:40.626Z",
            variants: [
              {
                weight: 100,
                unit: "gm",
                MRP: 100,
                size: "half",
                Discount: 0,
                price: 100,
                _id: "5a6efb182f21c010ac4fca1c"
              }
            ],
            enable: true,
            tags: [
              {
                id: "5a6efa0a2f21c010ac4fca19",
                text: "desi chinese",
                _id: "5a6efb182f21c010ac4fca1d"
              }
            ],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f029215f0271a240c1f50",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec0b328d7b9001499a144",
            category: "5a6ec8c0bebf1b001460d92c",
            title: "Fruit salad",
            brand: "foodworld",
            description: "no fat",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517224592/k2bpwrtuwlq4ttr6bhj6.jpg",
            publicId: "k2bpwrtuwlq4ttr6bhj6",
            categoryTitle: "salad",
            createdAt: "2018-01-29T11:16:34.549Z",
            variants: [
              {
                weight: 100,
                unit: "gm",
                MRP: 100,
                size: "half",
                Discount: 0,
                price: 100,
                _id: "5a6f029215f0271a240c1f51"
              }
            ],
            enable: true,
            tags: [
              {
                id: "5a6ecda6bebf1b001460d937",
                text: "foodworld special",
                _id: "5a6f029215f0271a240c1f52"
              }
            ],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f035315f0271a240c1f55",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec34fbebf1b001460d926",
            category: "5a6f014f15f0271a240c1f4c",
            title: "sandwich",
            brand: "foodworld",
            description: "none chesee",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517224785/oxijsw8ktskuibablh0c.jpg",
            publicId: "oxijsw8ktskuibablh0c",
            categoryTitle: "snacks",
            createdAt: "2018-01-29T11:19:47.867Z",
            variants: [
              {
                weight: 100,
                unit: "gm",
                size: "half",
                MRP: 120,
                Discount: 120,
                price: 120,
                _id: "5a6f035315f0271a240c1f56"
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f03d115f0271a240c1f57",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec34fbebf1b001460d926",
            category: "5a6f015015f0271a240c1f4d",
            title: "icey",
            brand: "foodworld",
            description: "you can get extra cream free",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517224912/delnldnbweozjqjlha3y.jpg",
            publicId: "delnldnbweozjqjlha3y",
            categoryTitle: "icecream",
            createdAt: "2018-01-29T11:21:53.893Z",
            variants: [
              {
                weight: 50,
                unit: "gm",
                MRP: 200,
                size: "half",
                Discount: 200,
                price: 200,
                _id: "5a6f03d115f0271a240c1f58"
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f04b915f0271a240c1f5c",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec48dbebf1b001460d928",
            category: "5a6ee4c83ac1c80014331e8f",
            title: "Alloo Parath",
            brand: "foodworld",
            description: "with extra butter",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517225143/z7avwbby0nlav3zdbktl.jpg",
            publicId: "z7avwbby0nlav3zdbktl",
            categoryTitle: "prathas",
            createdAt: "2018-01-29T11:25:45.017Z",
            variants: [
              {
                _id: "5a6f04b915f0271a240c1f5d",
                price: 150,
                Discount: 0,
                size: "half",
                MRP: 150,
                unit: "gm",
                weight: 150
              }
            ],
            enable: true,
            tags: [
              {
                _id: "5a6f04b915f0271a240c1f5e",
                text: "desi chinese",
                id: "5a6efa0a2f21c010ac4fca19"
              }
            ],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f0b4815f0271a240c1f74",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f083b15f0271a240c1f66",
            category: "5a6f0a3c15f0271a240c1f72",
            title: "choco",
            brand: "foodworld",
            description: "with pine apple ",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226822/f37urjevjhjlxzpftczi.jpg",
            publicId: "f37urjevjhjlxzpftczi",
            categoryTitle: "cake",
            createdAt: "2018-01-29T11:53:44.110Z",
            variants: [
              {
                price: 200,
                Discount: 0,
                MRP: 200,
                size: "half",
                unit: "gm",
                weight: 100,
                _id: "5a6f0b4815f0271a240c1f75"
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f0bc115f0271a240c1f76",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f083b15f0271a240c1f66",
            category: "5a6f0ac215f0271a240c1f73",
            title: "momos",
            brand: "foodworld",
            description: "full veggi",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226943/yliwvea9hdd4lwvtn6o5.jpg",
            publicId: "yliwvea9hdd4lwvtn6o5",
            categoryTitle: "chinese special",
            createdAt: "2018-01-29T11:55:45.001Z",
            variants: [
              {
                weight: 100,
                unit: "0",
                MRP: 100,
                size: "half",
                Discount: 0,
                price: 100,
                _id: "5a6f0bc115f0271a240c1f77"
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f0bf915f0271a240c1f78",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f083b15f0271a240c1f66",
            category: "5a6f0ac215f0271a240c1f73",
            title: "fry momos",
            brand: "foodworld",
            description: "crunchy",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517226999/ztmbbescextioklwkldt.jpg",
            publicId: "ztmbbescextioklwkldt",
            categoryTitle: "chinese special",
            createdAt: "2018-01-29T11:56:41.790Z",
            variants: [
              {
                weight: 100,
                unit: "gm",
                MRP: 100,
                size: "half",
                Discount: 0,
                price: 100,
                _id: "5a6f0bf915f0271a240c1f79"
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f0d3515f0271a240c1f7d",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f07d815f0271a240c1f64",
            category: "5a6f09a415f0271a240c1f70",
            title: "roll",
            brand: "foodworld",
            description: "combination of chinese ",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517227315/yhumapnadq4udcteb1yb.jpg",
            publicId: "yhumapnadq4udcteb1yb",
            categoryTitle: "Non-veg special",
            createdAt: "2018-01-29T12:01:57.140Z",
            variants: [
              {
                weight: 200,
                unit: "gm",
                size: "half",
                MRP: 200,
                Discount: 0,
                price: 200,
                _id: "5a6f0d3515f0271a240c1f7e"
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f0d6e15f0271a240c1f7f",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f07d815f0271a240c1f64",
            category: "5a6f097f15f0271a240c1f6f",
            title: "veg thali",
            brand: "foodzone",
            description: "simple ",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517227372/bg53lalgr02z4ebqywpg.jpg",
            publicId: "bg53lalgr02z4ebqywpg",
            categoryTitle: "veg special",
            createdAt: "2018-01-29T12:02:54.842Z",
            variants: [
              {
                weight: 100,
                unit: "gm",
                size: "half",
                MRP: 100,
                Discount: 0,
                price: 100,
                _id: "5a6f0d6e15f0271a240c1f80"
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f0e6715f0271a240c1f86",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f073d15f0271a240c1f63",
            category: "5a6f08db15f0271a240c1f6a",
            title: "south curry",
            brand: "foodzone",
            description: "without salty",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517227620/mqjbsv1mulh1gb8qmfxg.jpg",
            publicId: "mqjbsv1mulh1gb8qmfxg",
            categoryTitle: "south special",
            createdAt: "2018-01-29T12:07:03.078Z",
            variants: [
              {
                weight: 100,
                unit: "0",
                MRP: 100,
                size: "half",
                Discount: 0,
                price: 100,
                _id: "5a6f0e6715f0271a240c1f87"
              }
            ],
            enable: true,
            tags: [],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f0f3315f0271a240c1f8b",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f073d15f0271a240c1f63",
            category: "5a6f092a15f0271a240c1f6d",
            title: "role",
            brand: "foodzone",
            description: "special desi mix",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517227824/pmdiqaezcohyx36vwi8r.jpg",
            publicId: "pmdiqaezcohyx36vwi8r",
            categoryTitle: "chinese",
            createdAt: "2018-01-29T12:10:27.071Z",
            variants: [
              {
                weight: 200,
                unit: "gm",
                MRP: 100,
                size: "half",
                Discount: 0,
                price: 100,
                _id: "5a6f0f3315f0271a240c1f8c"
              }
            ],
            enable: true,
            tags: [
              {
                id: "5a6f0e8515f0271a240c1f88",
                text: "veg",
                _id: "5a6f0f3315f0271a240c1f8d"
              }
            ],
            ratingCount: 0,
            rating: 0,
            __v: 0
          },
          {
            _id: "5a6f0f9a15f0271a240c1f8e",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f073d15f0271a240c1f63",
            category: "5a6f08db15f0271a240c1f6a",
            title: "idly fry",
            brand: "foodzone",
            description: "with north mix",
            imageUrl:
              "https://res.cloudinary.com/impnolife/image/upload/v1517227928/eob4mpgwofbeebrsejcq.jpg",
            publicId: "eob4mpgwofbeebrsejcq",
            categoryTitle: "south special",
            createdAt: "2018-01-29T12:12:10.991Z",
            variants: [
              {
                weight: 200,
                unit: "0",
                Discount: 0,
                size: "half",
                MRP: 200,
                price: 200,
                _id: "5a6f0f9a15f0271a240c1f8f"
              }
            ],
            enable: true,
            tags: [
              {
                id: "5a6f0e8515f0271a240c1f88",
                text: "veg",
                _id: "5a6f0f9a15f0271a240c1f90"
              }
            ],
            ratingCount: 0,
            rating: 0,
            __v: 0
          }
        ).then(() => {
          console.log("finished populating Product");
        });
      });
    Order.find({})
      .remove()
      .then(() => {
        Notification.find({})
          .remove()
          .then(() => {
            Order.create(
              {
                _id: "5a6eceb8bebf1b001460d93b",
                orderID: 10001,
                user: "5a79929f9050b4001461f0b2",
                year: 2018,
                month: 1,
                date: 29,
                deliveryCharge: "Free",
                shippingAddress: {
                  address: "#32, silkboard, Bangalore",
                  contactNumber: "8866588148",
                  locationName: "Bangalore ",
                  zip: "560100",
                  city: "Bangalore",
                  name: "Sandip"
                },
                restaurantID: "5a6eb71728d7b9001499a140",
                restaurantName: "FoodWorld",
                location: "5a6ec0b328d7b9001499a144",
                locationName: "BTM",
                grandTotal: 594,
                subTotal: 540,
                charges: 11.88,
                coupon: {
                  couponApplied: false
                },
                payableAmount: 594,
                orderType: "Home Delivery",
                paymentOption: "Stripe",
                orderUpdatedCount: 0,
                createdAt: "2018-01-29T07:35:20.523Z",
                status: "Pending",
                userInfo: {
                  name: "ionicfirebaseapp",
                  contactNumber: 8866588148,
                  email: "ionicfirebaseapp@gmail.com",
                  role: "User"
                },
                payment: {
                  paymentStatus: false,
                  paymentType: "Stripe",
                  transactionId: "txn_1BpXAqFMyULkmFivnkpa1vQO"
                },
                paymentStatus: "Pending",
                userNotification: [
                  {
                    time: 1517211320522,
                    status: "Pending"
                  },
                  {
                    status: "Awaiting confirmation from vendor.",
                    time: 1517211328654
                  }
                ],
                assigned: true,
                productRating: [],
                productDetails: [
                  {
                    price: 360,
                    Discount: 10,
                    MRP: 400,
                    weight: 250,
                    location: "5a6ec34fbebf1b001460d926",
                    restaurantID: "5a6eb71728d7b9001499a140",
                    imageUrl:
                      "https://res.cloudinary.com/impnolife/image/upload/v1517210571/qz3k0gtmmll1n3egnf3z.jpg",
                    Quantity: 1,
                    productId: "5a6ecbcdbebf1b001460d931",
                    brand: "foodworld",
                    title: "kdhai Paneer",
                    restaurant: "FoodWorld",
                    totalPrice: 360
                  },
                  {
                    price: 180,
                    Discount: 0,
                    MRP: 180,
                    weight: 300,
                    location: "5a6ec34fbebf1b001460d926",
                    restaurantID: "5a6eb71728d7b9001499a140",
                    imageUrl:
                      "https://res.cloudinary.com/impnolife/image/upload/v1517210647/arejpcendlkoggg2xehn.jpg",
                    Quantity: 1,
                    productId: "5a6ecc18bebf1b001460d933",
                    brand: "foodworld",
                    title: "fry Rice",
                    restaurant: "FoodWorld",
                    totalPrice: 180
                  }
                ],
                __v: 1,
                deliveryByName: "DeliveryBoy2",
                deliveryBy: "5a6ed34dfb8bea00144d1418",
                assignedDate: "2018-01-29T07:55:24.336Z",
                position: {
                  lat: 12.9082396,
                  long: 77.60740880000003,
                  name: "BTM 2nd Stage"
                }
              },
              {
                _id: "5a6ed5bcfb8bea00144d141a",
                orderID: 10002,
                user: "5a79929f9050b4001461f0b2",
                year: 2018,
                month: 1,
                date: 30,
                deliveryCharge: "30",
                shippingAddress: {
                  address: "#32, silkboard, Bangalore",
                  contactNumber: "8866588148",
                  locationName: "Bangalore ",
                  zip: "560100",
                  city: "Bangalore",
                  name: "Sandip"
                },
                restaurantID: "5a6eb71728d7b9001499a140",
                restaurantName: "FoodWorld",
                location: "5a6ec0b328d7b9001499a144",
                locationName: "BTM",
                grandTotal: 503,
                subTotal: 430,
                charges: 10.06,
                coupon: {
                  couponApplied: false
                },
                payableAmount: 503,
                orderType: "Home Delivery",
                paymentOption: "COD",
                orderUpdatedCount: 0,
                createdAt: "2018-01-30T08:05:16.152Z",
                status: "On the Way",
                userInfo: {
                  name: "ionicfirebaseapp",
                  contactNumber: 8866588148,
                  email: "ionicfirebaseapp@gmail.com",
                  role: "User"
                },
                payment: {
                  paymentStatus: false
                },
                paymentStatus: "Pending",
                userNotification: [
                  {
                    time: 1517213116152,
                    status: "Pending"
                  },
                  {
                    status: "Your order is on the way.",
                    time: 1517222811488
                  }
                ],
                assigned: true,
                productRating: [],
                productDetails: [
                  {
                    price: 250,
                    Discount: 0,
                    MRP: 250,
                    weight: 250,
                    location: "5a6ec0b328d7b9001499a144",
                    restaurantID: "5a6eb71728d7b9001499a140",
                    imageUrl:
                      "https://res.cloudinary.com/impnolife/image/upload/v1517210374/w0juklk7ugduyklsa5kc.jpg",
                    Quantity: 1,
                    productId: "5a6ecb08bebf1b001460d92d",
                    brand: "foodworld",
                    title: "Egg curry",
                    restaurant: "FoodWorld",
                    totalPrice: 250
                  },
                  {
                    price: 180,
                    Discount: 0,
                    MRP: 180,
                    weight: 300,
                    location: "5a6ec34fbebf1b001460d926",
                    restaurantID: "5a6eb71728d7b9001499a140",
                    imageUrl:
                      "https://res.cloudinary.com/impnolife/image/upload/v1517210647/arejpcendlkoggg2xehn.jpg",
                    Quantity: 1,
                    productId: "5a6ecc18bebf1b001460d933",
                    brand: "foodworld",
                    title: "fry Rice",
                    restaurant: "FoodWorld",
                    totalPrice: 180
                  }
                ],
                position: {
                  lat: 12.9082396,
                  long: 77.60740880000003,
                  name: "BTM 2nd Stage"
                },
                __v: 1,
                deliveryByName: "DeliveryBoy",
                deliveryBy: "5a6ecf99eded160014cc2166",
                assignedDate: "2018-01-30T10:10:14.935Z"
              },
              {
                _id: "5a6ee46afb8ddd0014474083",
                orderID: 10003,
                user: "5a6eb7a128d7b9001499a141",
                year: 2018,
                month: 1,
                date: 28,
                deliveryCharge: "Free",
                shippingAddress: {
                  address: "#32, silkboard, Bangalore",
                  contactNumber: "8866588148",
                  locationName: "Bangalore ",
                  zip: "560100",
                  city: "Bangalore",
                  name: "Sandip"
                },
                restaurantID: "5a6eb71728d7b9001499a140",
                restaurantName: "FoodWorld",
                location: "5a6ec34fbebf1b001460d926",
                locationName: "koramangala",
                grandTotal: 198,
                subTotal: 180,
                charges: 3.96,
                coupon: {
                  couponApplied: false
                },
                payableAmount: 198,
                orderType: "Home Delivery",
                paymentOption: "COD",
                orderUpdatedCount: 0,
                createdAt: "2018-01-28T09:07:54.125Z",
                status: "Pending",
                userInfo: {
                  name: "Sandip",
                  contactNumber: 8866588148,
                  email: "sandip@gmail.com",
                  role: "User"
                },
                payment: {
                  paymentStatus: false
                },
                paymentStatus: "Pending",
                userNotification: [
                  {
                    time: 1517216874124,
                    status: "Pending"
                  }
                ],
                assigned: true,
                productRating: [],
                productDetails: [
                  {
                    price: 180,
                    Discount: 0,
                    MRP: 180,
                    weight: 300,
                    location: "5a6ec34fbebf1b001460d926",
                    restaurantID: "5a6eb71728d7b9001499a140",
                    imageUrl:
                      "https://res.cloudinary.com/impnolife/image/upload/v1517210647/arejpcendlkoggg2xehn.jpg",
                    Quantity: 1,
                    productId: "5a6ecc18bebf1b001460d933",
                    brand: "foodworld",
                    title: "fry Rice",
                    restaurant: "FoodWorld",
                    totalPrice: 180
                  }
                ],
                position: {
                  lat: 12.9082396,
                  long: 77.60740880000003,
                  name: "BTM 2nd Stage"
                },
                __v: 0,
                deliveryByName: "zozo",
                deliveryBy: "5a6f003a15f0271a240c1f45",
                assignedDate: "2018-01-28T11:06:48.053Z"
              },
              {
                _id: "5a6ecdc0bebf1b001460d938",
                orderID: 10000,
                user: "5a6eb7a128d7b9001499a141",
                year: 2018,
                month: 1,
                date: 31,
                deliveryCharge: "Free",
                shippingAddress: {
                  address: "#32, silkboard, Bangalore",
                  contactNumber: "8866588148",
                  locationName: "Bangalore ",
                  zip: "560100",
                  city: "Bangalore",
                  name: "Sandip"
                },
                restaurantID: "5a6eb71728d7b9001499a140",
                restaurantName: "FoodWorld",
                location: "5a6ec0b328d7b9001499a144",
                locationName: "BTM",
                grandTotal: 869,
                subTotal: 790,
                charges: 17.38,
                coupon: {
                  couponApplied: false
                },
                payableAmount: 869,
                orderType: "Home Delivery",
                paymentOption: "COD",
                orderUpdatedCount: 0,
                createdAt: "2018-01-31T07:31:12.738Z",
                status: "Pending",
                userInfo: {
                  name: "Sandip",
                  contactNumber: 8866588148,
                  email: "sandip@gmail.com",
                  role: "User"
                },
                payment: {
                  paymentStatus: false
                },
                paymentStatus: "Pending",
                userNotification: [
                  {
                    time: 1517211072735,
                    status: "Pending"
                  },
                  {
                    status:
                      "Your order has been delivered,Share your experience with us.",
                    time: 1517224775357
                  }
                ],
                assigned: true,
                productRating: [
                  {
                    rating: 4,
                    createdAt: "2018-01-31T11:51:02.776Z",
                    product: "5a6ecb08bebf1b001460d92d",
                    comment: "They provide good food"
                  }
                ],
                productDetails: [
                  {
                    price: 250,
                    Discount: 0,
                    MRP: 250,
                    weight: 250,
                    location: "5a6ec0b328d7b9001499a144",
                    restaurantID: "5a6eb71728d7b9001499a140",
                    imageUrl:
                      "https://res.cloudinary.com/impnolife/image/upload/v1517210374/w0juklk7ugduyklsa5kc.jpg",
                    Quantity: 1,
                    productId: "5a6ecb08bebf1b001460d92d",
                    brand: "foodworld",
                    title: "Egg curry",
                    restaurant: "FoodWorld",
                    totalPrice: 250
                  },
                  {
                    price: 360,
                    Discount: 10,
                    MRP: 400,
                    weight: 250,
                    location: "5a6ec34fbebf1b001460d926",
                    restaurantID: "5a6eb71728d7b9001499a140",
                    imageUrl:
                      "https://res.cloudinary.com/impnolife/image/upload/v1517210571/qz3k0gtmmll1n3egnf3z.jpg",
                    Quantity: 1,
                    productId: "5a6ecbcdbebf1b001460d931",
                    brand: "foodworld",
                    title: "kdhai Paneer",
                    restaurant: "FoodWorld",
                    totalPrice: 360
                  },
                  {
                    price: 180,
                    Discount: 0,
                    MRP: 180,
                    weight: 300,
                    location: "5a6ec34fbebf1b001460d926",
                    restaurantID: "5a6eb71728d7b9001499a140",
                    imageUrl:
                      "https://res.cloudinary.com/impnolife/image/upload/v1517210647/arejpcendlkoggg2xehn.jpg",
                    Quantity: 1,
                    productId: "5a6ecc18bebf1b001460d933",
                    brand: "foodworld",
                    title: "fry Rice",
                    restaurant: "FoodWorld",
                    totalPrice: 180
                  }
                ],
                __v: 2,
                deliveryByName: "DeliveryBoy",
                deliveryBy: "5a6ecf99eded160014cc2166",
                assignedDate: "2018-01-31T07:39:32.621Z",
                position: {
                  lat: 12.9082396,
                  long: 77.60740880000003,
                  name: "BTM 2nd Stage"
                }
              },
              {
                _id: "5a6efe86be71200014742b4d",
                orderID: 10004,
                user: "5a6eb7a128d7b9001499a141",
                year: 2018,
                month: 1,
                date: 29,
                deliveryCharge: "30",
                shippingAddress: {
                  address: "#32, silkboard, Bangalore",
                  contactNumber: "8866588148",
                  locationName: "Bangalore ",
                  zip: "560100",
                  city: "Bangalore",
                  name: "Sandip"
                },
                restaurantID: "5a6eb71728d7b9001499a140",
                restaurantName: "FoodWorld",
                location: "5a6ec0b328d7b9001499a144",
                locationName: "BTM",
                grandTotal: 228,
                subTotal: 180,
                charges: 4.56,
                coupon: {
                  couponApplied: false
                },
                payableAmount: 228,
                orderType: "Home Delivery",
                position: {
                  name: "Silk Board Bus Stop",
                  long: 77.62423000000001,
                  lat: 12.91747
                },
                paymentOption: "PayPal",
                orderUpdatedCount: 0,
                createdAt: "2018-01-29T10:59:18.045Z",
                status: "Pending",
                userInfo: {
                  name: "Sandip",
                  contactNumber: 8866588148,
                  email: "sandip@gmail.com",
                  role: "User"
                },
                payment: {
                  paymentStatus: false,
                  transactionId: "PAY-18F77481FK923863KLJXP5LI"
                },
                paymentStatus: "Pending",
                userNotification: [
                  {
                    time: 1517223558043,
                    status: "Pending"
                  },
                  {
                    status: "Awaiting confirmation from vendor.",
                    time: 1517223603030
                  }
                ],
                assigned: true,
                productRating: [],
                productDetails: [
                  {
                    price: 180,
                    Discount: 0,
                    MRP: 180,
                    weight: 300,
                    location: "5a6ec34fbebf1b001460d926",
                    restaurantID: "5a6eb71728d7b9001499a140",
                    imageUrl:
                      "https://res.cloudinary.com/impnolife/image/upload/v1517210647/arejpcendlkoggg2xehn.jpg",
                    Quantity: 1,
                    productId: "5a6ecc18bebf1b001460d933",
                    brand: "foodworld",
                    title: "fry Rice",
                    restaurant: "FoodWorld",
                    totalPrice: 180
                  }
                ],
                __v: 1,
                deliveryByName: "DeliveryBoy",
                deliveryBy: "5a6ecf99eded160014cc2166",
                assignedDate: "2018-01-29T11:05:02.163Z"
              }
            ).then(() => {
              console.log("finished populating Order");
            });
          });
      });
    Tag.find({})
      .remove()
      .then(() => {
        Tag.create(
          {
            _id: "5a6ecd8abebf1b001460d936",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec0b328d7b9001499a144",
            tag: "veg",
            createdAt: "2018-01-29T07:30:18.601Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6ecda6bebf1b001460d937",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec0b328d7b9001499a144",
            tag: "foodworld special",
            createdAt: "2018-01-29T07:30:46.931Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6ef9c62f21c010ac4fca18",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec48dbebf1b001460d928",
            tag: "foodworld combo",
            createdAt: "2018-01-29T10:39:02.967Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6efa0a2f21c010ac4fca19",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec48dbebf1b001460d928",
            tag: "desi chinese",
            createdAt: "2018-01-29T10:40:10.215Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6efa132f21c010ac4fca1a",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec48dbebf1b001460d928",
            tag: "choco",
            createdAt: "2018-01-29T10:40:19.178Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f041a15f0271a240c1f59",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec34fbebf1b001460d926",
            tag: "creamy",
            createdAt: "2018-01-29T11:23:06.409Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f042215f0271a240c1f5a",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec34fbebf1b001460d926",
            tag: "salty",
            createdAt: "2018-01-29T11:23:14.878Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f042815f0271a240c1f5b",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec34fbebf1b001460d926",
            tag: "sweet",
            createdAt: "2018-01-29T11:23:20.989Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f0c9615f0271a240c1f7b",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f083b15f0271a240c1f66",
            tag: "foodzone special",
            createdAt: "2018-01-29T11:59:18.817Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f0ca615f0271a240c1f7c",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f083b15f0271a240c1f66",
            tag: "foodzone monthly offer",
            createdAt: "2018-01-29T11:59:34.306Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f0d7615f0271a240c1f81",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f07d815f0271a240c1f64",
            tag: "veg",
            createdAt: "2018-01-29T12:03:02.314Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f0d8715f0271a240c1f82",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f07d815f0271a240c1f64",
            tag: "north",
            createdAt: "2018-01-29T12:03:19.954Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f0d9715f0271a240c1f83",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f07d815f0271a240c1f64",
            tag: "south meel",
            createdAt: "2018-01-29T12:03:35.254Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f0e8515f0271a240c1f88",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f073d15f0271a240c1f63",
            tag: "veg",
            createdAt: "2018-01-29T12:07:33.700Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6f0e9115f0271a240c1f89",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            location: "5a6f073d15f0271a240c1f63",
            tag: "north curry",
            createdAt: "2018-01-29T12:07:45.385Z",
            enable: true,
            __v: 0
          }
        ).then(() => {
          console.log("finished populating Tag");
        });
      });
    Wallet.find({})
      .remove()
      .then(() => {
        Wallet.create(
          {
            _id: "5a6ecdc0bebf1b001460d93a",
            transactionID: 100000,
            month: 1,
            year: 2018,
            day: 29,
            charges: 17.38,
            amount: 851.62,
            payableAmount: 869,
            status: "Credited",
            timestamp: 1517184000000,
            location: "5a6ec0b328d7b9001499a144",
            receiverId: "5a6eb71728d7b9001499a140",
            senderId: "5a6eb7a128d7b9001499a141",
            createdAt: "2018-01-29T07:31:12.769Z",
            __v: 0
          },
          {
            _id: "5a6eceb8bebf1b001460d93d",
            transactionID: 100001,
            month: 1,
            year: 2018,
            day: 29,
            charges: 11.88,
            amount: 582.12,
            payableAmount: 594,
            status: "Credited",
            timestamp: 1517184000000,
            location: "5a6ec0b328d7b9001499a144",
            receiverId: "5a6eb71728d7b9001499a140",
            senderId: "5a6eb7a128d7b9001499a141",
            createdAt: "2018-01-29T07:35:20.542Z",
            __v: 0
          },
          {
            _id: "5a6ed5bcfb8bea00144d141c",
            transactionID: 100002,
            month: 1,
            year: 2018,
            day: 29,
            charges: 10.06,
            amount: 492.94,
            payableAmount: 503,
            status: "Credited",
            timestamp: 1517184000000,
            location: "5a6ec0b328d7b9001499a144",
            receiverId: "5a6eb71728d7b9001499a140",
            senderId: "5a6eb7a128d7b9001499a141",
            createdAt: "2018-01-29T08:05:16.177Z",
            __v: 0
          },
          {
            _id: "5a6ee46afb8ddd0014474085",
            transactionID: 100003,
            month: 1,
            year: 2018,
            day: 29,
            charges: 3.96,
            amount: 194.04,
            payableAmount: 198,
            status: "Credited",
            timestamp: 1517184000000,
            location: "5a6ec34fbebf1b001460d926",
            receiverId: "5a6eb71728d7b9001499a140",
            senderId: "5a6eb7a128d7b9001499a141",
            createdAt: "2018-01-29T09:07:54.173Z",
            __v: 0
          },
          {
            _id: "5a6efe86be71200014742b4f",
            transactionID: 100004,
            month: 1,
            year: 2018,
            day: 29,
            charges: 4.56,
            amount: 223.44,
            payableAmount: 228,
            status: "Credited",
            timestamp: 1517184000000,
            location: "5a6ec0b328d7b9001499a144",
            receiverId: "5a6eb71728d7b9001499a140",
            senderId: "5a6eb7a128d7b9001499a141",
            createdAt: "2018-01-29T10:59:18.116Z",
            __v: 0
          }
        ).then(() => {
          console.log("finished populating Wallet");
        });
      });
    Coupan.find({})
      .remove()
      .then(() => {
        Coupan.create(
          {
            _id: "5a6ecd67bebf1b001460d935",
            applicableToTimeStamp: 1517529600000,
            applicableFromTimeStamp: 1517184000000,
            couponName: "foodword monthly offer",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec0b328d7b9001499a144",
            offPrecentage: 10,
            applicableFrom: "29-01-2018",
            applicableTo: "02-02-2018",
            description: "only for special custosmer customers",
            createdAt: "2018-01-29T07:29:43.604Z",
            enable: true,
            __v: 0
          },
          {
            _id: "5a6efcbff7d6dd367c49a452",
            applicableToTimeStamp: 1515974400000,
            applicableFromTimeStamp: 1517184000000,
            couponName: "foodworld magic",
            restaurantID: "5a6eb71728d7b9001499a140",
            location: "5a6ec48dbebf1b001460d928",
            offPrecentage: 10,
            applicableFrom: "29-01-2018",
            applicableTo: "15-01-2018",
            description: "more then 500 purchase ",
            createdAt: "2018-01-29T10:51:43.434Z",
            enable: true,
            __v: 0
          }
        ).then(() => {
          console.log("finished populating Coupan");
        });
      });
    Productrating.find({})
      .remove()
      .then(() => {
        Productrating.create({
          _id: "5a6f0aa6be71200014742b51",
          restaurantID: "5a6eb71728d7b9001499a140",
          product: "5a6ecb08bebf1b001460d92d",
          order: "5a6ecdc0bebf1b001460d938",
          comment: "They provide good food",
          location: "5a6ec0b328d7b9001499a144",
          createdAt: "2018-01-29T11:51:02.776Z",
          ratingCount: 0,
          rating: 4,
          __v: 0
        }).then(() => {
          console.log("finished populating Productrating");
        });
      });
    Setting.find({})
      .remove()
      .then(() => {
        Setting.create(
          {
            _id: "5a6ec74cbebf1b001460d929",
            restaurantID: "5a6eb71728d7b9001499a140",
            minOrdLoyality: 300,
            createdAt: "2018-01-29T07:03:40.385Z",
            loyalityProgram: true,
            minLoyalityPoints: 50,
            loyalityPercentage: 10,
            __v: 0
          },
          {
            _id: "5a6f087f15f0271a240c1f67",
            restaurantID: "5a6f055f15f0271a240c1f5f",
            minOrdLoyality: 400,
            createdAt: "2018-01-29T11:41:51.867Z",
            loyalityProgram: true,
            minLoyalityPoints: 100,
            loyalityPercentage: 10,
            __v: 0
          }
        ).then(() => {
          console.log("finished populating Setting");
        });
      });
    StoreType.find({})
      .remove()
      .then(() => {
        StoreType.create(
          {
            _id: "5cd856335e8b4dff9421f0be",
            storeTypeName: "Restaurants"
          },
          {
            _id: "5cd8569a5e8b4dff9421f143",
            storeTypeName: "Retails"
          }
        ).then(() => {
          console.log("finished populating Store Type");
        });
      });

    Store.find({})
      .remove()
      .then(() => {
        Store.create(
          {
            _id: "5cd856335e8b4dff9421f0be",
            storeName: "Alan Pizza",
            user_id: "5a79929f9050b4001461f0b2",
            store_type_id: "5cd856335e8b4dff9421f0be",
            activation: true
          },
          {
            _id: "5cd8569a5e8b4dff9421f143",
            storeName: "Dan Buns",
            user_id: "5a6f055f15f0271a240c1f5f",
            store_type_id: "5cd856335e8b4dff9421f0be",
            activation: true
          }
        ).then(() => {
          console.log("finished populating Store");
        });
      });

    Cat_loc.find({})
      .remove()
      .then(() => {
        Cat_loc.create(
          {
            _id: "5cd856335e8b4dff9421f0be",
            category_id: "5a6ec85fbebf1b001460d92a",
            location_id: "5a6ec85fbebf1b001460d92a"
          },
          {
            _id: "5cd8569a5e8b4dff9421f143",
            category_id: "5a6ec85fbebf1b001460d92a",
            location_id: "5a6ec85fbebf1b001460d92a"
          }
        ).then(() => {
          console.log("finished populating category_location");
        });
      });

    Pro_loc.find({})
      .remove()
      .then(() => {
        Pro_loc.create(
          {
            _id: "5cd856335e8b4dff9421f0be",
            product_id: "5a6ecb08bebf1b001460d92d",
            location_id: "5a6ec85fbebf1b001460d92a"
          },
          {
            _id: "5cd8569a5e8b4dff9421f143",
            product_id: "5a6ecb75bebf1b001460d92f",
            location_id: "5a6ec85fbebf1b001460d92a"
          }
        ).then(() => {
          console.log("finished populating category_location");
        });
      });

    Loyalty.find({})
      .remove()
      .then(() => {
        Loyalty.create({
          _id: "5cd856335e8b4dff9421f0be",
          restaurantID: "5a79929f9050b4001461f0b2",
          minPoint: 15,
          minAmount: 25,
          percentageOff: 25,
          enable: true
        }).then(() => {
          console.log("finished populating Loyalty");
        });
      });

    DishOption.find({})
      .remove()
      .then(() => {
        DishOption.create(
          {
             _id:'5cd856335e8b4dff9421f0be',
             restaurantID: "5a79929f9050b4001461f0b2",
             optionName: "optionA",
             enable: true,
          }).then(() => {
            console.log("finished populating options");
          })
      })
  }
}
