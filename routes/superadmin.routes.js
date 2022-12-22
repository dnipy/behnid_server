//libs
import express from "express"
//imported routes
import { adminAuthRoutes } from "./_super_admin/auth.js"
import { adminBlogRoutes } from "./_super_admin/blog.js"
import { adminSellerRequestsRoutes } from "./_super_admin/sellersRequests.js"
import { adminServerAssetsRoutes } from "./_super_admin/serverAssets.js"
import { adminTicketsRoutes } from "./_super_admin/ticket.js"
import { adminUsersRoutes } from "./_super_admin/users.js"
import { adminRespRoutes } from "./_super_admin/server-response.js"
import { adminCategoriesRoutes } from "./_super_admin/categoreis.js"
import { adminCityRoutes } from "./_super_admin/city.js"

//initial router
const superAdminRoute = express.Router()

//routes
superAdminRoute.use("/auth", adminAuthRoutes)
superAdminRoute.use("/blog", adminBlogRoutes)
superAdminRoute.use("/seller-requests", adminSellerRequestsRoutes)
superAdminRoute.use("/server-assets", adminServerAssetsRoutes)
superAdminRoute.use("/tickets", adminTicketsRoutes)
superAdminRoute.use("/users", adminUsersRoutes)
superAdminRoute.use("/server-response", adminRespRoutes)
superAdminRoute.use("/categories", adminCategoriesRoutes)
superAdminRoute.use("/city", adminCityRoutes)

superAdminRoute.get("/", (req, res) => {
    res.render("pages/index")
})

export { superAdminRoute }

// cause purse elegant sentence bargain control explain joy shrimp bonus satisfy kick
