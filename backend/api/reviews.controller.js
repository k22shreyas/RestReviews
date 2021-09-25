import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController{
  static async apiPostReview(req, res, next){
    //here we will try to request a post method
    //for user to add reviews in the front end
    try{
    const restaurantId = req.body.restaurant_id
    const review = req.body.text
    const userInfo = {
      name : req.body.name,
      _id : req.body.user_id
    }
    //above variables are requests for thier respective ID's
    const date = new Date()
    const ReviewResponse = await ReviewsDAO.addReview(
      //addReview function is defined in ReviewsDAO.js file
      restaurantId,
      userInfo,
      review,
      date,
    )
    //once we get details of the restaurants and user
    //we will call fucntion addReview to finally post the review
    res.json({status:"success"})
    }
    catch(e){
      res.status(500).json({error:e.message})
    }
  }
  static async apiUpdateReview(req, res, next){
    try{
      const reviewID = req.body.review_id
      const text = req.body.text
      const date = new Date()
      //similar to the apiPostReview, we will update
      //reviews in a similar way by requesting details of
      //restaurant and user
      const reviewResponse = await ReviewsDAO.updateReview(
        reviewID,
        req.body.user_id,
        text,
        date,
      )
      //finally posting the updated review by calling updateReview
      var {error} = reviewResponse
      if(error){
        res.status(400).json({error})
      }
      if(reviewResponse.modifiedCount ===0){
        throw new Error(
          "unable to update review = user may not be original poster",
        )
      }
      res.json({ status: "success" })
    }catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
  static async apiDeleteReview(req, res, next){
    try{
      const reviewId = req.query.id
      const userId = req.body.user_id
      console.log(reviewId)
      //request for the review query and user info
      //and delete the review from the database
      const reviewResponse = await ReviewsDAO.deleteReview(
        reviewId,
        userId,
      )
      res.json({status:"success"})
    }
    catch(e){
      res.status(500).json({error: e.message})
    }
  }

}
