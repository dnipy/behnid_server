// * libs-Import
import express from "express"
import helmet from "helmet"
import http from "http"
import cluster from "cluster"
import os from "os"
import compression from 'compression'
import webpush from 'web-push'



// * modules-Import
import { indexController } from "./controllers/index.controllers.js"
import { apiRoute } from "./routes/api.routes.js"
import { superAdminRoute } from "./routes/superadmin.routes.js"
import bodyParser from "body-parser"
import { customCors } from "./middlewares/customCORS.js"

if (process.env.NODE_ENV === "prod") {
  console.log = function () {};
}

// cluster config
const totalCPUs = os.cpus().length

if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);
   
    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
      cluster.fork();
    }
   
    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      console.log("Let's fork another worker!");
      cluster.fork();
    });
} else {

    // ? Inintials
    const app = express()
    const port = process.env.PORT || 3001
    const httpServer = http.createServer(app)


    // ? middlewares
    app.use(express.json())
    app.use(helmet({ crossOriginResourcePolicy: false , expectCt : false }))
    app.use(compression())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.set("view engine", "ejs")
    app.use(customCors);

    // ? Routes
    app.get("/", indexController)
    app.use("/api", apiRoute)
    app.use("/super-admin", superAdminRoute)

    // ? statics
    app.use("/uploads",express.static("uploads"))
    


    httpServer.listen(port, () => {
        console.log(`server started on port ${port}`)
    })
}