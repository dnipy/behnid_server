import { PrismaClient } from "@prisma/client"
import express from "express"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"

const connectionsRoute = express.Router()
const prisma = new PrismaClient()

connectionsRoute.get("/", (req, res) => {
    res.send("/api/connections")
})

connectionsRoute.post("/follow", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const { id } = req.body

    if (!id) return res.json({ err: "ایدی یوزر پیدا نشد" })

    const user_one = await prisma.user.findUnique({
        where: { phone: userPhone },
    })
    const user_two = await prisma.user
        .findUnique({ where: { id: Number(id) } })
        .catch(() => {
            return res.json({ err: "یوزر اشتباه" })
        })

    if (user_two) {
        await prisma.connections
            .upsert({
                where: {
                    AuthorId: user_two.id,
                },
                update: {
                    follower: {
                        connect: {
                            phone: userPhone,
                        },
                    },
                },
                create: {
                    author: {
                        connect: {
                            id: Number(id),
                        },
                    },
                    follower: {
                        connect: {
                            phone: userPhone,
                        },
                    },
                },
            })
            .then(async () => {
                await prisma.connections.upsert({
                    where: {
                        AuthorId: user_one.id,
                    },
                    update: {
                        following: {
                            connect: {
                                id: Number(id),
                            },
                        },
                    },
                    create: {
                        author: {
                            connect: {
                                phone: user_one.phone,
                            },
                        },
                        following: {
                            connect: {
                                id: Number(id),
                            },
                        },
                    },
                })
            })
            .then(() => {
                return res.json({ msg: "موفق" })
            })
            .catch(() => {
                return res.json({ err: "خطا" })
            })
    } else {
        return res.json({ err: "no user found" })
    }
})

connectionsRoute.get("/get-info", authorizeMiddleware, async (req, res) => {
    const { id } = req.body

    if (!id) return res.json({ err: "ایدی یوزر پیدا نشد" })

    await prisma.connections
        .findUnique({
            where: {
                AuthorId: Number(id),
            },
            include: {
                follower: true,
                following: true,
            },
        })
        .then((data) => {
            if (data) {
                return res.json(data)
            } else {
                return res.json({ err: "مشخصات اشتباه وارد شده" })
            }
        })
        .catch(() => {
            return res.json({ err: "یوزر پیدا نشد" })
        })
})

connectionsRoute.post("/unfollow", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const { id } = req.body

    if (!id) return res.json({ err: "ایدی یوزر پیدا نشد" })

    const user_one = await prisma.user.findUnique({
        where: { phone: userPhone },
    })
    const user_two = await prisma.user
        .findUnique({ where: { id: Number(id) } })
        .catch(() => {
            return res.json({ err: "یوزر اشتباه" })
        })

    if (user_two) {
        await prisma.connections
            .update({
                where: {
                    AuthorId: user_two.id,
                },
                update: {
                    follower: {
                        delete: {
                            phone: userPhone,
                        },
                    },
                },
            })
            .then(async () => {
                await prisma.user.update({
                    where: {
                        AuthorId: user_one.id,
                    },
                    update: {
                        following: {
                            delete: {
                                id: Number(id),
                            },
                        },
                    },
                })
            })
            .then(() => {
                return res.json({ msg: "موفق" })
            })
            .catch(() => {
                return res.json({ err: "خطا" })
            })
    } else {
        return res.json({ err: "no user found" })
    }
})

export { connectionsRoute }
