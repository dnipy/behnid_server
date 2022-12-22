import express from "express"
import { PrismaClient } from "@prisma/client"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"

const prisma = new PrismaClient()
const NotificationsRoute = express.Router()

NotificationsRoute.get("/all", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    await prisma.user
        .findUnique({
            where: {
                phone: userPhone,
            },
            include: {
                notifications: true,
            },
        })
        .then((notifications) => {
            const notifs = notifications.notifications
            return res.json(notifs)
        })
        .catch((e) => {
            return res.json(e)
        })
})

NotificationsRoute.get("/single", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const { id } = req.query

    const user = await prisma.user.findUnique({ where: { phone: userPhone } })

    await prisma.notifications
        .findUnique({
            where: {
                id: Number(id),
                AuthorId: user.id,
            },
        })
        .then(async (notif) => {
            await prisma.notifications.update({
                where: {
                    id: Number(id),
                },
                data: {
                    seen: true,
                },
            })
            return res.json(notif)
        })
        .catch((e) => {
            return res.json(e)
        })
})

NotificationsRoute.get("/seen-all", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    await prisma.user
        .update({
            where: {
                phone: userPhone,
            },
            data: {
                notifications: {
                    update: {
                        seen: true,
                    },
                },
            },
        })
        .then(() => {
            return res.json({ msg: "موفق" })
        })
        .catch((e) => {
            return res.json(e)
        })
})

export { NotificationsRoute }
