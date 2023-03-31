//libs
import express from "express"
//routes
import { AuthRoute } from "./api/Auth/Auth.js"
import { usersRoute } from "./api/users/users.js"
import { commentsRoute } from "./api/comments/comments.js"
import { mediaRoute } from "./api/media/media.js"
import { productsRoute } from "./api/products/products.js"
import { requestsRoute } from "./api/requests/requests.js"
import { categoriesRoute } from "./api/categories/categories.js"
import { connectionsRoute } from "./api/connections/connections.js"
import { BlogRoute } from "./api/blog/blog.js"
import { searchRoute } from "./api/search/search.js"
import { botRoute } from "./api/bot/bot.js"
import { sellersRoute } from "./api/sellers/sellers.js"
import { profileRoute } from "./api/profile/profile.js"
import { IndexRoute } from "./api/index.js"
import { ticketsRoute } from "./api/tickets/tickets.js"
import { chatRoute } from "./api/chat/chat.js"
import { NotificationsRoute } from "./api/notifications/notifications.js"
import { uploadImage } from "../middlewares/base64.js"
import { makeid } from "../funcs/PassGen.js"
import { spamsRoute } from "./api/spams/spams.js"

import fs from 'fs'
//initial router
const apiRoute = express.Router()

apiRoute.use("/Auth", AuthRoute)
apiRoute.use("/users", usersRoute)
apiRoute.use("/media", mediaRoute)
apiRoute.use("/notifications", NotificationsRoute)
apiRoute.use("/comments", commentsRoute)
apiRoute.use("/products", productsRoute)
apiRoute.use("/requests", requestsRoute)
apiRoute.use("/categories", categoriesRoute)
apiRoute.use("/connections", connectionsRoute)
apiRoute.use("/blog", BlogRoute)
apiRoute.use("/search", searchRoute)
apiRoute.use("/bot", botRoute)
apiRoute.use("/sellers", sellersRoute)
apiRoute.use("/profile", profileRoute)
apiRoute.use("/index-page", IndexRoute)
apiRoute.use("/tickets", ticketsRoute)
apiRoute.use("/chats", chatRoute)
apiRoute.use("/spams", spamsRoute)
apiRoute.post("/base64", uploadImage)

apiRoute.get("/", (req, res) => {
    const genCode = makeid(8)
    res.send(genCode)
})

apiRoute.get("/delete-file", (req, res) => {
    fs.unlink('./test.txt',(err)=>{
        if (err){
            console.log(err)
            return res.json({err})
        }
        else {
            return res.json({msg : 'ok'})
        }
    })
})

export { apiRoute }
