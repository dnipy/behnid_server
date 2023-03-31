import express from "express"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { excludePass } from "../../../funcs/ExcludePass.js"
import { lastDay } from '../../../funcs/last-24-h.js'
import { Categories , Cities , MainCategories , SubCategories , proviences  } from "../../../static/_index.js"
import {authorizeMiddleware} from "../../../middlewares/authorizeMiddleware.middlewares.js"
config()

const spamsRoute = express.Router()
const prisma = new PrismaClient()


spamsRoute.post('/user',authorizeMiddleware,async(req,res)=>{
    const { id , spamType } = req.body
    const author_phone = req?.userData?.userPhone

    if (!id) return res.json({err : "ایدی کاربر را وارد کنید"})

    await prisma.spamUsers.create({
        data : {
            author_phone ,
            user : {
                connect : {
                    id : Number(id)
                }
            },
            spamType : spamType ? spamType : 'violence',

        }
    }).then((data)=>{
        return res.json({msg : 'گزارش با موفقیت ثبت شد و از کمک شما سپاس گذاریم'})
    }).catch((err)=>{
        return res.json({err : 'کاربری با ایدی مورد نظر پیدا نشد'})
    })

})


spamsRoute.post('/product',authorizeMiddleware,async(req,res)=>{
    const { id , spamType } = req.body
    const author_phone = req?.userData?.userPhone

    if (!id) return res.json({err : "ایدی محصول را وارد کنید"})

    await prisma.spamProducts.create({
        data : {
            author_phone ,
            product : {
                connect : {
                    id : Number(id)
                }
            },
            spamType : spamType ? spamType : 'violence',

        }
    }).then((data)=>{
        return res.json({msg : 'گزارش با موفقیت ثبت شد و از کمک شما سپاس گذاریم'})
    }).catch((err)=>{
        return res.json({err : 'محصول با ایدی مورد نظر پیدا نشد'})
    })

})


spamsRoute.post('/message',authorizeMiddleware,async(req,res)=>{
    const { id , spamType } = req.body
    const author_phone = req?.userData?.userPhone

    if (!id) return res.json({err : "ایدی پیام را وارد کنید"})

    await prisma.spamMessages.create({
        data : {
            author_phone ,
            message : {
                connect : {
                    id : Number(id)
                }
            },
            spamType : spamType ? spamType : 'violence',

        }
    }).then((data)=>{
        return res.json({msg : 'گزارش با موفقیت ثبت شد و از کمک شما سپاس گذاریم'})
    }).catch((err)=>{
        return res.json({err : 'پیام با ایدی مورد نظر پیدا نشد'})
    })

})


spamsRoute.post('/request',authorizeMiddleware,async(req,res)=>{
    const { id , spamType } = req.body
    const author_phone = req?.userData?.userPhone

    if (!id) return res.json({err : "ایدی درخواست را وارد کنید"})

    await prisma.spamRequests.create({
        data : {
            author_phone ,
            FreeRequest : {
                connect : {
                    id : Number(id)
                }
            },
            spamType : spamType ? spamType : 'violence',

        }
    }).then((data)=>{
        return res.json({msg : 'گزارش با موفقیت ثبت شد و از کمک شما سپاس گذاریم'})
    }).catch((err)=>{
        return res.json({err : 'درخواست با ایدی مورد نظر پیدا نشد'})
    })

})


spamsRoute.post('/seller',authorizeMiddleware,async(req,res)=>{
    const { id , spamType } = req.body
    const author_phone = req?.userData?.userPhone

    if (!id) return res.json({err : "ایدی فروشنده را وارد کنید"})

    await prisma.spamSellers.create({
        data : {
            author_phone ,
            seller : {
                connect : {
                    id : Number(id)
                }
            },
            spamType : spamType ? spamType : 'violence',

        }
    }).then((data)=>{
        return res.json({msg : 'گزارش با موفقیت ثبت شد و از کمک شما سپاس گذاریم'})
    }).catch((err)=>{
        return res.json({err : 'فروشنده با ایدی مورد نظر پیدا نشد'})
    })

})


spamsRoute.post('/comment-product',authorizeMiddleware,async(req,res)=>{
    const { id , spamType } = req.body
    const author_phone = req?.userData?.userPhone

    if (!id) return res.json({err : "ایدی کامنت را وارد کنید"})

    await prisma.spamCommentsOnProducts.create({
        data : {
            author_phone ,
            Comment : {
                connect : {
                    id : Number(id)
                }
            },
            spamType : spamType ? spamType : 'violence',

        }
    }).then((data)=>{
        return res.json({msg : 'گزارش با موفقیت ثبت شد و از کمک شما سپاس گذاریم'})
    }).catch((err)=>{
        return res.json({err : 'کامنت با ایدی مورد نظر پیدا نشد'})
    })

})


spamsRoute.post('/comment-seller',authorizeMiddleware,async(req,res)=>{
    const { id , spamType } = req.body
    const author_phone = req?.userData?.userPhone

    if (!id) return res.json({err : "ایدی کامنت را وارد کنید"})

    await prisma.spamCommentsOnSellers.create({
        data : {
            author_phone ,
            Comment : {
                connect : {
                    id : Number(id)
                }
            },
            spamType : spamType ? spamType : 'violence',

        }
    }).then((data)=>{
        return res.json({msg : 'گزارش با موفقیت ثبت شد و از کمک شما سپاس گذاریم'})
    }).catch((err)=>{
        return res.json({err : 'کامنت با ایدی مورد نظر پیدا نشد'})
    })

})


spamsRoute.post('/comment-blog',authorizeMiddleware,async(req,res)=>{
    const { id , spamType } = req.body
    const author_phone = req?.userData?.userPhone

    if (!id) return res.json({err : "ایدی کامنت را وارد کنید"})

    await prisma.spamCommentsOnBlog.create({
        data : {
            author_phone ,
            Comment : {
                connect : {
                    id : Number(id)
                }
            },
            spamType : spamType ? spamType : 'violence',

        }
    }).then((data)=>{
        return res.json({msg : 'گزارش با موفقیت ثبت شد و از کمک شما سپاس گذاریم'})
    }).catch((err)=>{
        return res.json({err : 'کامنت با ایدی مورد نظر پیدا نشد'})
    })

})

export  { spamsRoute }