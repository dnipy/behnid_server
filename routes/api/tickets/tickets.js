import express from "express"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"
config()

const ticketsRoute = express.Router()
const prisma = new PrismaClient()

ticketsRoute.get("/", (req, res) => {
    res.send("/api/users")
})

ticketsRoute.post("/add", authorizeMiddleware, async (req, res) => {
    const phone = req.userData.userPhone
    const { message , name } = req.body

    await prisma.user
        .update({
            where: { phone: phone },
            data: {
                tickets: {
                    create: {
                        name : name ? name : "بدون سابجکت",
                        message: message,
                        status: "pending",
                    },
                },
            },
        })
        .then(() => {
            return res.json({ msg: "موفق" })
        })
        .catch(() => {
            return res.json({ err: "مشکلی پیش آمده است" })
        })
})

ticketsRoute.post("/delete", authorizeMiddleware, async (req, res) => {
    const phone = req.userData.userPhone
    const { id } = req.body

    await prisma.user
        .update({
            where: { phone: phone },
            data: {
                tickets: {
                    delete: {
                        id: Number(id),
                    },
                },
            },
        })
        .then(() => {
            return res.json({ msg: "موفق" })
        })
        .catch(() => {
            return res.json({ err: "مشکلی پیش آمده است" })
        })
})

export { ticketsRoute }
