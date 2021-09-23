let restaurants //variable

export default restaurantsDAO{ //exporting this specfic page
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
}
static async getRestaurants({
  filters = null,
  page = 0,
  restaurantsPerPage = 20,
} = {})
{
  let query
  if("name" in filters){
      query = {$text:{$search: filters["name"] } }
  }
  else if("cusine" in filters){
    query = {"cusine":{$eq: filters["cusine"] } }
  }
  else if("zipcode" in filters){
    query = {"address.zipcode": {$eq: filters["zipcode"] } }
  }
}
