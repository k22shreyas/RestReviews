import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

const router = express.Router()
//router.route gets URL from restaurant.controller.js file
router.route("/").get(RestaurantsCtrl.apiGetRestaurants)

router
  .route("/reviews")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview)

export default router
