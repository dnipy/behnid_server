import express from "express"
import { PrismaClient } from "@prisma/client"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"

const requestsRoute = express.Router()
const prisma = new PrismaClient()

requestsRoute.get("/", (req, res) => {
    res.send("/api/requests")
})

requestsRoute.post("/FreeRequest", authorizeMiddleware, async (req, res) => {
    const { name, catName, describe, City } = req.body
    console.log(req.body)

    prisma.user
        .update({
            where: {
                phone: req.userData.userPhone,
            },
            data: {
                freeRequests: {
                    create: {
                        name,
                        categorie : {
                            connect: {
                                name : catName
                            }
                        },
                        describe: describe,
                        imgsrc: "",
                        city : {
                            connect : {
                                name : City
                            }
                        },
                    },
                },
            },
        })
        .then(() => {
            return res.json({ msg: "تایید" })
        })
        .catch(() => {
            return res.json({ err: "خطا در ارسال پارامتر" })
        })
})

requestsRoute.get("/all", async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ err: "need both start and length query-params!" })

    await prisma.freeRequests
        .findMany({
            where : {
                isShown : true
            },
            skip: parseInt(start) - 1,
            take: parseInt(length),
            include: {
                Author: true,
                categorie: {
                    distinct: ["name"],
                },
                city: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        })
        .then((dta) => {
            return res.json(dta)
        })
        .catch((e) => {
            return res.json({ err: "خطا" })
        })
})

requestsRoute.get("/my-req", authorizeMiddleware, async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ msg: "need both start and length query-params!" })

    const IntLength = parseInt(length)

    await prisma.user
        .findUnique({
            where: {
                phone: req.userData.userPhone,
            },
            select: {
                freeRequests: {
                    select: {
                        name: true,
                        seenTime: true,
                        describe: true,
                        id: true,
                    },
                },
            },
        })
        .then((dta) => {
            return res.json(dta.freeRequests)
        })
        .catch((e) => {
            return res.json({ msg: e })
        })
})

requestsRoute.post("/edit", authorizeMiddleware, async (req, res) => {
    const { id } = req.query
    const { describe, name, quantity } = req.body
    if (!id) return res.json({ err: "آیدی لازم است!" })

    await prisma.user
        .update({
            where: {
                phone: req.userData.userPhone,
            },
            data: {
                freeRequests: {
                    update: {
                        where: {
                            id: Number(id),
                        },
                        data: {
                            describe,
                            name,
                            quantity,
                        },
                    },
                },
            },
        })
        .then((dta) => {
            return res.json(dta.freeRequests)
        })
        .catch((e) => {
            return res.json({ msg: e })
        })
})

requestsRoute.get("/single", async (req, res) => {
    const { id } = req.query
    if (!id) return res.json({ err: "ایدی درخواست وارد نشده" })
    const IntId = parseInt(id)

    await prisma.freeRequests
        .findFirst({
            where: {
                id: IntId,
            },
            include: {
                Author: true,
                city: true,
                categorie: true,
            },
        })
        .then((dta) => {
            return res.json(dta)
        })
        .catch(() => {
            return res.json({ err: "درخواست مورد نظر موجود نیست" })
        })
})

requestsRoute.post("/delete", authorizeMiddleware, async (req, res) => {
    const { id } = req.body
    if (!id) return res.json({ msg: "ایدی درخواست وارد نشده است" })

    await prisma.user
        .update({
            where: {
                phone: req.userData.userPhone,
            },
            data: {
                freeRequests: {
                    update : {
                        where : {
                            id : Number(id)
                        },
                        data : {
                            isShown : false
                        }
                    }
                },
            },
        })
        .then((dta) => {
            return res.json({
                dta,
                msg: "موفق",
            })
        })
        .catch((e) => {
            return res.json({ err: 1, e })
        })
})

requestsRoute.get("/add-seen", async (req, res) => {
    const { id } = req.query
    const INTid = parseInt(id)

    try {
        const requests = await prisma.freeRequests.findFirst({
            where: {
                id: INTid,
            },
        })
        if (requests) {
            await prisma.freeRequests.update({
                where: {
                    id: INTid,
                },
                data: {
                    seenTime: requests.seenTime + 1,
                },
            })
            res.statusCode(200)
        }
        return res.statusCode(400)
    } catch (error) {
        return res.json({ err: "درخواست مورد نظر موجود نیست" })
    }
})

export { requestsRoute }
