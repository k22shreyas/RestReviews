import mongoDB from "mongodb"
const ObjectId = mongoDB.ObjectID

let reviews

export default class ReviewsDAO {
  static async injectDB(conn){ // async-await is promise returning keywords
    if(reviews){
      return
    }
    try{
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
      // connecting to the database using environment variables
    }
    catch(e){
      console.error(`Unable to connect to the database ${e}`,)
    }
  }
  static async addReview(restaurantId, user, review, date){
    try{
      const reviewDoc = { name:user.name,
      user_id: user._id,
      date: date,
      text: review,
      restaurant_id: ObjectId(restaurantId),}
      return await reviews.insertOne(reviewDoc)
    }catch(e){
      console.error(`unable to post review ${e}`)
      return{error:e}
    }
  }
  static async updateReview(reviewID, userID, date, text){
    try{
      const updateResponse = await reviews.updateOne(
        {user_id:userID, _id: ObjectId(reviewID)},
        {$set:{text:text, date:date}},
    )
    return updateResponse
    }catch(e){
      console.error(`Unable to update reviews ${e}`)
      return{error:e}
    }
  }
  static async deleteReview(reviewID, userID){
    try{
      const deleteResponse = await reviews.deleteOne(
        {_id:userID, review:reviewID},
      )
      return deleteResponse
    }catch(e){
      console.error(`Unable to update reviews ${e}`)
    return{error:e}
    }
  }
}
