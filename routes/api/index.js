import express from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const IndexRoute = express.Router()

IndexRoute.get("/", async (req, res) => {
    try {
        const lastFiveProducts = await prisma.product.findMany({ take: 5 })
        const lastFiveRequests = await prisma.freeRequests.findMany({ take: 5 })
        // const lastTenBlogs = await prisma.blog.findMany({ take: 10 })
        const lastFiveSeller = await prisma.user.findMany({
            take: 5,
            where: { Role: "Seller" },
        })

        return res.json({
            // lastTenBlogs,
            lastFiveProducts,
            lastFiveRequests,
            lastFiveSeller,
        })
    } catch {
        return res.json({ err: 500 })
    }
})

export { IndexRoute }
