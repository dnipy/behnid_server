import express from "express"
import { PrismaClient } from "@prisma/client"

const searchRoute = express.Router()
const prisma = new PrismaClient()

searchRoute.get("/", (req, res) => {
    res.send("/api/search")
})

searchRoute.get("/products", async (req, res) => {
    const data = await prisma.product
        .findMany({ take: 5 })
        .then(() => {
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "مشکلی پیش آمده است" })
        })
})

searchRoute.get("/requests", async (req, res) => {
    const data = await prisma.freeRequests
        .findMany({ take: 5 })
        .then(() => {
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "مشکلی پیش آمده است" })
        })
})

searchRoute.get("/by-category", async (req, res) => {
    const { id } = req.body

    await prisma.category
        .findMany({
            where: {
                id: id,
            },
            include: {
                products: true,
                requests: true,
            },
        })
        .then((data) => {
            return res.json({ data })
        })
        .catch(() => {
            return res.json({ err: "دسته بندی مورد نظر یافت نشد" })
        })
})

searchRoute.get("/sellers", async (req, res) => {
    const data = await prisma.user
        .findMany({
            take: 5,
            where: {
                Role: "Seller",
            },
        })
        .then(() => {
            return res.send(data)
        })
        .catch(() => {
            return res.send("مشکلی پیش آمده است")
        })
})

export { searchRoute }
