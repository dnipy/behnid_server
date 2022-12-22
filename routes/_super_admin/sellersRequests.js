import { PrismaClient } from "@prisma/client"
import express from "express"
const adminSellerRequestsRoutes = express.Router()
const prisma = new PrismaClient()
adminSellerRequestsRoutes.get("/", (req, res) => {
    res.render("pages/seller-requests/seller_requests_base")
})

adminSellerRequestsRoutes.post("/set-status", async (req, res) => {
    const { id } = req.query
    const { status } = req.body
    console.log("resived")

    await prisma.user
        .update({
            where: {
                id: Number(id),
            },
            data: {
                sellerProfile: {
                    update: {
                        sellerStatus: status,
                    },
                },
                Role: `${status == "accepted" ? "Seller" : "Buyer"}`,
            },
        })
        .then(() => {
            console.log("موفق")
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminSellerRequestsRoutes.get("/all", async (req, res) => {
    await prisma.user
        .findMany({
            where: {
                sellerProfile: {
                    sellerStatus: "pending",
                },
            },
        })
        .then((resp) => {
            console.log(resp)
            return res.render("pages/seller-requests/seller_requests_base", {
                sellers: resp,
            })
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminSellerRequestsRoutes.get("/single", async (req, res) => {
    const { id } = req.query

    if (!id) return res.render("pages/server-response/error")

    await prisma.user
        .findFirst({
            where: {
                id: Number(id),
                sellerProfile: {
                    sellerStatus: "pending",
                },
            },
            include: {
                sellerProfile: true,
            },
        })
        .then((resp) => {
            console.log(resp)
            return res.render("pages/seller-requests/single", { seller: resp })
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

export { adminSellerRequestsRoutes }
