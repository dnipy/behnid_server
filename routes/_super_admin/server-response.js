import express from "express"

const adminRespRoutes = express.Router()

adminRespRoutes.get("/", (req, res) => {
    res.send("/server-response/")
})

adminRespRoutes.get("/succes", (req, res) => {
    res.render("pages/server-response/succes")
})

adminRespRoutes.get("/error", (req, res) => {
    res.render("pages/server-response/error")
})

export { adminRespRoutes }
