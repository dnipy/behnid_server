import express from "express"
const adminAuthRoutes = express.Router()

adminAuthRoutes.get("/", (req, res) => {
    res.render("pages/auth/auth_base")
})

export { adminAuthRoutes }
