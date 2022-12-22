import jwt from "jsonwebtoken"
import { config } from "dotenv"

config()

function authorizeMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader ? authHeader.split(" ")[1] : null

    if (token === null) return res.json({ err: "یوزری با این مشخصات پیدا نشد" })

    jwt.verify(token, process.env.ACCESS_TOKEN_SEC, (err, userData) => {
        if (err) return res.json({ err: "نشست غیر فعال" })
        req.userData = userData
        next()
    })
}

export { authorizeMiddleware }
