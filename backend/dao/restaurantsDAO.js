import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let restaurants //variable
//DA) => Data Access Object
export default class RestaurantsDAO { //exporting this specfic page
  static async injectDB(conn){ // async-await is promise returning keywords
    if(restaurants){
      return
    }
    try{
      restaurants = await conn.db(process.env.RESTAURANTS_NS).collection("restaurants")
      // connecting to the database using environment variables
    }
    catch(e){
      console.error(`Unable to connect to the database ${e}`,)
    }
  }
  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {})
  {
    let query
    if(filters){
    if("name" in filters){
      query = {$text:{$search: filters["name"] } } //search w.r.t name given by the user
    }
    else if("cusine" in filters){
      query = {"cusine":{$eq: filters["cusine"] } } // search w.r.t cusine of the restaurants
    }
    else if("zipcode" in filters){
      query = {"address.zipcode": {$eq: filters["zipcode"] } } // search w.r.t zipcode of the restaurants
    }
  }
  let cursor
  try{
    cursor = await restaurants.find(query) //trying to get queries from top and store in cursor
  }
  catch(e){
    console.error(`Unable to fetch query results ${e}`)
    return{restaurantsList: [], totalNumRestaurants: 0} //if no results are found we initialize the 2 to nothing
  }
  const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage*page)

  try{
    const restaurantsList = await displayCursor.toArray()
    const totalNumRestaurants = await restaurants.countDocuments(query)

    return {restaurantsList, totalNumRestaurants}
  }
  catch(e){
    console.error(`Unable to fetch results ${e}`)
    return {restaurantsList: [],totalNumRestaurants: 0}
  }
}
static async getRestaurantByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$restaurant_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await restaurants.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`)
      throw e
    }
  }

  static async getCuisines() {
    let cuisines = []
    try {
      cuisines = await restaurants.distinct("cuisine")
      return cuisines
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`)
      return cuisines
    }
  }
}
