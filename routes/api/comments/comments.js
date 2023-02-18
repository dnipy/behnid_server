import express from "express"
import { PrismaClient } from "@prisma/client"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"

const commentsRoute = express.Router()
const prisma = new PrismaClient()

commentsRoute.get("/", (req, res) => {
    res.send("/api/comments")
})





commentsRoute.post("/onProduct", authorizeMiddleware, async (req, res) => {
    const { productID, message } = req.body

    await prisma.product.update({
            where : {
                id : Number(productID)
            },
            data : {
                comments : {
                    create : {
                        commentAuthor : {
                            connect : {
                                phone : req.userData.userPhone
                            }
                        },
                        message,
                    },
                }
            },
            include : {
                comments : {
                    include : {
                        commentAuthor : {
                            include : {
                                profile : {
                                    select : {
                                        name : true,
                                        family : true
                                    }
                                }
                            }
                        }
                    }                   
                }
            }

        

        })
        .then((resp) => {
            return res.json(resp.comments?.at(-1))
        })
        .catch((error) => {
            console.log(error)
            return res.json({ err: "خظا در ثبت" })
        })
})

commentsRoute.post("/onBlog", authorizeMiddleware, async (req, res) => {
    const { blogID, message } = req.body
    const intBlog = parseInt(blogID)

    const comment = await prisma.commentsForBlog
        .create({
            data: {
                blog: {
                    connect: {
                        id: intBlog,
                    },
                },
                commentAuthor: {
                    connect: {
                        phone: req.userData.userPhone,
                    },
                },
                message,
            },
        })
        .then(() => {
            return res.json({ msg: "موفق" })
        })
        .catch(() => {
            return res.json({ err: "خطا در ثبت" })
        })
})

commentsRoute.post(
    "/reply/onProduct",
    authorizeMiddleware,
    async (req, res) => {
        const { id, message } = req.body

        prisma.user
            .update({
                where: {
                    phone: req.userData.userPhone,
                },
                data: {
                    commentsOnProductsComments: {
                        create: {
                            comment: {
                                connect: {
                                    id,
                                },
                            },
                            message,
                        },
                    },
                },
            })
            .then(() => {
                return res.json({ msg: "موفق" })
            })
            .catch(() => {
                return res.json({ err: "کامنت مورد نظر یافت نشد" })
            })
    }
)

commentsRoute.post("/reply/onBlog", authorizeMiddleware, async (req, res) => {
    const { id, message } = req.body

    prisma.user
        .update({
            where: {
                phone: req.userData.userPhone,
            },
            data: {
                commentsOnBlogComments: {
                    create: {
                        comment: {
                            connect: {
                                id,
                            },
                        },
                        message,
                    },
                },
            },
        })
        .then(() => {
            return res.json({ msg: "موفق" })
        })
        .catch(() => {
            return res.json({ err: "کامنت مورد نظر یافت نشد" })
        })
})

export { commentsRoute }
