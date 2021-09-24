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
}
