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

ticketsRoute.post("/new-ticket", authorizeMiddleware, async (req, res) => {
    const phone = req.userData.userPhone
    const { message , title } = req.body

    if (!message || !title) return res.json({err : 'لطفا متن و موضوع تیکت را وارد کنید'})

    await prisma.ticket.create({
            data : {
                user : {
                    connect : {
                        phone : phone
                    }
                },
                title : title  ? String(title) : 'تیکت بدون نام',
                messages : {
                    create : {
                        text : String(message)
                    }
                },
                status : 'pending'
            }

        })
        .then((data) => {
            return res.json({ msg: "موفق" , id : data.id})
        })
        .catch(() => {
            return res.json({ err: "مشکلی پیش آمده است" })
        })
})

ticketsRoute.post("/new-ticket-message", authorizeMiddleware, async (req, res) => {
    const phone = req.userData.userPhone
    const { message , id } = req.body

    if (!message || !id) return res.json({err : 'لطفا متن و موضوع تیکت را وارد کنید'})

    await prisma.ticketmessage.create({
            data : {
                Ticket : {
                    connect : {
                        id : Number(id)
                    }
                },
                user : {
                    connect : {
                        phone : phone
                    }
                },
                text : message,
                
            }

        })
        .then((data) => {
            return res.json(data)
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
