// * libs-Import
import express from "express"
import helmet from "helmet"
import cors from "cors"
import http from "http"
// * modules-Import
import { indexController } from "./controllers/index.controllers.js"
import { apiRoute } from "./routes/api.routes.js"
import { superAdminRoute } from "./routes/superadmin.routes.js"
import bodyParser from "body-parser"

// ? Inintials
export const app = express()
const port = process.env.PORT || 3001
const httpServer = http.createServer(app)

// ? middlewares
app.use(express.json())
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine", "ejs")

// ? Routes
app.get("/", indexController)
app.use("/api", apiRoute)
app.get("/for-cutie-asal", (req, res) => {
    res.render("pages/asal")
})
app.use("/super-admin", superAdminRoute)

// ? statics
app.use("/uploads", express.static("uploads"))

httpServer.listen(port, () => {
    console.log(`server started on port ${port}`)
})
