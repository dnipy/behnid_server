import express from "express"
import { PrismaClient } from "@prisma/client"
import { excludePass } from "../../../funcs/ExcludePass.js"

const prisma = new PrismaClient()
const sellersRoute = express.Router()

sellersRoute.get("/", (req, res) => {
    res.send("/api/sellers")
})

sellersRoute.get("/all", async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ err: "کوئری پارام های شروع و طول وارد نشده!" })

    await prisma.user
        .findMany({
            skip: parseInt(start) - 1,
            take: parseInt(length),
            where: {
                Role: "Seller"
            },
        })
        .then((data) => {
            data.forEach(elm=>{
                excludePass(elm,['password'])
            })
            return res.json(data)
        })
        .catch((e) => {
            return res.json({ err: e })
        })
})

sellersRoute.get("/single", async (req, res) => {
    const { SellerID } = req.query
    if (!SellerID) return res.json({ err: "آیدی فروشنده را وارد کنید" })


    await prisma.user
        .findFirst({
            where: {
                id: Number(SellerID),
                Role : "Seller"
            },
            include: {
                products: {
                    include: {
                        comments: true,
                    },
                    take: 3,
                },
                sellerProfile: true,
                profile: true,
                freeRequests: {
                    include: {
                        categorie: true,
                        city: true,
                    },
                    take: 3,
                },
            },
        })
        .then((data) => {
            excludePass(data,['password'])
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "فروشنده مورد نظر موجود نمیباشد" })
        })
})

export { sellersRoute }
