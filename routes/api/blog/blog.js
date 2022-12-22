import express from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const BlogRoute = express.Router()

BlogRoute.get("/", (req, res) => {
    res.send("/api/blog")
})

BlogRoute.get("/all", async (req, res) => {
    const { start, length } = req.query
    console.log("ok")

    if (!start || !length)
        return res.json({ msg: "need both start and length query-params!" })

    const intLength = parseInt(length)

    await prisma.blog
        .findMany({
            skip: parseInt(start) - 1,
            take: parseInt(length),
            distinct: ["date"],
            orderBy: {
                date: "desc",
            },
        })
        .then((blog) => {
            return res.json(blog)
        })
        .catch((e) => {
            return res.json(e)
        })
})

BlogRoute.get("/single", async (req, res) => {
    const { BlogID } = req.query

    const IntBlog = parseInt(BlogID)
    console.log(IntBlog)

    await prisma.blog
        .findUnique({
            where: {
                id: IntBlog,
            },
        })
        .then((rs) => {
            return res.json(rs)
        })
        .catch((e) => {
            return res.json({ err: "مشکلی پیش آمده است", err2: e })
        })
})

BlogRoute.get("/last-four", async (req, res) => {
    await prisma.blog
        .findMany({
            take: 4,
            select: {
                title: true,
                id: true,
            },
        })
        .then((rs) => {
            return res.json(rs)
        })
        .catch((e) => {
            return res.json({ err: 1, err2: e })
        })
})

BlogRoute.get("/add-seen", async (req, res) => {
    const { id } = req.query
    const INTid = parseInt(id)

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: INTid,
            },
        })
        if (blog) {
            await prisma.blog.update({
                where: {
                    id: INTid,
                },
                data: {
                    seenTime: blog.seenTime + 1,
                },
            })
            res.statusCode(200)
        }
        return res.statusCode(400)
    } catch (error) {
        return res.json({ err: "درخواست مورد نظر موجود نیست" })
    }
})

BlogRoute.get("/add-like", async (req, res) => {
    const { id } = req.query
    const INTid = parseInt(id)

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: INTid,
            },
        })
        if (blog) {
            await prisma.blog.update({
                where: {
                    id: INTid,
                },
                data: {
                    likes: blog.likes + 1,
                },
            })
            res.statusCode(200)
        }
        return res.statusCode(400)
    } catch (error) {
        return res.json({ err: "بلاگ  مورد نظر موجود نیست" })
    }
})

export { BlogRoute }
