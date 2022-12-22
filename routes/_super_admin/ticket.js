import { PrismaClient } from "@prisma/client"
import express from "express"

const prisma = new PrismaClient()
const adminTicketsRoutes = express.Router()

adminTicketsRoutes.get("/", async (req, res) => {
    console.log("ok")
    const data = await prisma.ticket.findMany({
        include: {
            user: {
                select: {
                    phone: true,
                    name: true,
                },
            },
        },
    })

    res.render("pages/tickets/tickets_base", { data })
})

adminTicketsRoutes.get("/response", async (req, res) => {
    const { id } = req.query

    await prisma.ticket
        .findUnique({
            where: {
                id: Number(id),
            },
            include: {
                user: {
                    select: {
                        phone: true,
                        name: true,
                    },
                },
            },
        })
        .then((data) => {
            return res.render("pages/tickets/set_response", {
                data: {
                    data,
                    id,
                },
            })
        })
        .catch(() => {
            return res.redirect("/super-admin/server-response/error")
        })
})

adminTicketsRoutes.post("/response", async (req, res) => {
    const { id } = req.query
    const { response } = req.body
    console.log(req.body)

    await prisma.ticket
        .update({
            where: {
                id: Number(id),
            },
            data: {
                response,
                status: "done",
            },
        })
        .then(() => {
            return res.redirect("/super-admin/server-response/succes")
        })
        .catch((e) => {
            return res.redirect("/super-admin/server-response/error")
        })
})

export { adminTicketsRoutes }
