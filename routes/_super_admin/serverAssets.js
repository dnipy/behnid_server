import express from "express"
const adminServerAssetsRoutes = express.Router()

adminServerAssetsRoutes.get("/", (req, res) => {
    res.render("pages/server-assets/server_assets_base")
})

export { adminServerAssetsRoutes }
