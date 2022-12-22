import express from "express"
import { PrismaClient } from "@prisma/client"

const adminCategoriesRoutes = express.Router()
const prisma = new PrismaClient()

adminCategoriesRoutes.post("/add", async (req, res) => {
    const { name } = req.body

    if (!name) return res.render("pages/server-response/error")

    await prisma.category
        .create({
            data: {
                name,
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCategoriesRoutes.post("/delete", async (req, res) => {
    const { id } = req.query

    if (!id) return res.render("pages/server-response/error")

    await prisma.category
        .delete({
            where: {
                id: Number(id),
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCategoriesRoutes.post("/update", async (req, res) => {
    const { id } = req.query
    const { name } = req.body

    if (!id) return res.render("pages/server-response/error")

    await prisma.category
        .update({
            where: {
                id: Number(id),
            },
            data: {
                name,
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCategoriesRoutes.get("/all", async (req, res) => {
    await prisma.category
        .findMany({})
        .then((resp) => {
            return res.render("pages/server-response/succes", {
                categories: resp,
            })
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCategoriesRoutes.get("/single", async (req, res) => {
    const { id } = req.query

    if (!id) return res.render("pages/server-response/error")

    await prisma.category
        .findUnique({
            where: {
                id: Number(id),
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes", {
                category: resp,
            })
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

export { adminCategoriesRoutes }
