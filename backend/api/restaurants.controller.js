import RestaurantsDAO from "../dao/restaurantsDAO.js"

export default class restaurantscontroller{
  static async apiGetRestaurants(req,res,next){
    //req here fetches data from router.route method in restaurant.route.js file
    const restaurantsPerPage = req.query.resturantsPerPage ? parseInt(req.query.restaurantsPerPage,10):20
    const page = req.query.page ? parseInt(req.query.page,10):0

    let filters = {}
    if(req.query.cusine){
      filter.cusine = req.query.cusine
    }else if(req.query.zipcode){
      filter.zipcode = req.query.zipcode
    }else if(req.query.name){
      filter.name = req.query.name
    }
    const {restaurantsList, totalNumRestaurants} = await RestaurantsDAO.getRestaurants ({
      page,
      filters,
      restaurantsPerPage,
    })
    let response = {
      filters : filters,
      restaurants:restaurantsList,
      page : page,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    }
    res.json(response)
  }
  static async apiGetRestaurantById(req, res, next) {
    try {
      let id = req.params.id || {}
      let restaurant = await RestaurantsDAO.getRestaurantByID(id)
      if (!restaurant) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(restaurant)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetRestaurantCuisines(req, res, next) {
    try {
      let cuisines = await RestaurantsDAO.getCuisines()
      res.json(cuisines)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
