import express from "express"
import { PrismaClient } from "@prisma/client"

const adminBlogRoutes = express.Router()
const prisma = new PrismaClient()

adminBlogRoutes.get("/", (req, res) => {
    res.render("pages/blog/blog_base")
})

adminBlogRoutes.get("/add", (req, res) => {
    return res.render("pages/blog/add_blog")
})

adminBlogRoutes.post("/add", async (req, res) => {
    const { describe, title } = req.body
    console.log(describe, title)

    await prisma.blog
        .create({
            data: {
                title,
                describe,
            },
        })
        .then((resp) => {
            return res.redirect("/super-admin/server-response/succes")
        })
        .catch((e) => {
            return res.redirect("/super-admin/server-response/error")
        })
})

adminBlogRoutes.get("/all", async (req, res) => {
    await prisma.blog
        .findMany({})
        .then((resp) => {
            // console.log(resp)
            return res.render("pages/blog/all", { data: resp })
        })
        .catch((e) => {
            return res.render("pages/server-response/error")
        })
})

adminBlogRoutes.get("/edit", async (req, res) => {
    const { id } = req.query
    const intID = parseInt(id)
    await prisma.blog
        .findFirst({
            where: {
                id: intID,
            },
        })
        .then((data) => {
            return res.render("pages/blog/edit", { data })
        })
        .catch(() => {
            return res.render("pages/server-response/error")
        })
})

adminBlogRoutes.post("/edit", async (req, res) => {
    const { id } = req.query
    const { describe, title } = req.body
    const intID = parseInt(id)
    await prisma.blog
        .update({
            where: {
                id: intID,
            },
            data: {
                title,
                describe,
            },
        })
        .then((data) => {
            return res.render("pages/server-response/succes")
        })
        .catch(() => {
            return res.render("pages/server-response/error")
        })
})

adminBlogRoutes.get("/delete", async (req, res) => {
    const { id } = req.query
    const intID = parseInt(id)
    await prisma.blog
        .delete({
            where: {
                id: intID,
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

export { adminBlogRoutes }
