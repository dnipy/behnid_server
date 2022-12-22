import express from "express"

const botRoute = express.Router()

botRoute.get("/", (req, res) => {
    res.send("/api/bot")
})

export { botRoute }
