//libs
import express from "express"
import { AdminProductRoute } from "./_super_admin/products.js"
import { AdminRequetsRoute } from "./_super_admin/requests.js"
import { AdminUserRoute } from "./_super_admin/users.js"
import { AdminSellerRoute } from "./_super_admin/sellers.js"

//imported routes


//initial router
const superAdminRoute = express.Router()

//routes
superAdminRoute.use("/products", AdminProductRoute)
superAdminRoute.use("/users", AdminUserRoute)
superAdminRoute.use("/requests", AdminRequetsRoute)
superAdminRoute.use("/sellers", AdminSellerRoute)



superAdminRoute.get("/", (req, res) => {
    res.render("pages/index")
})

export { superAdminRoute }

// cause purse elegant sentence bargain control explain joy shrimp bonus satisfy kick
