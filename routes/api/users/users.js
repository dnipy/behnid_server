import express from "express"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { excludePasswordMiddleware } from "../../../funcs/ExcludePass.js"
config()

const usersRoute = express.Router()
const prisma = new PrismaClient()
// prisma.$use(async(params,next)=>{
//     const result = await next(params)
//     if (params.model === "User" && params.args?.select?.password !== true) {
//         delete result.password
//     }
//     return result
// })

usersRoute.get("/", (req, res) => {
    res.send("/api/users")
})

usersRoute.get("/all", async (req, res) => {
    const { start, length } = req.query

    if (!start || !length)
        return res.json({ msg: "کوئری پارامتر های شروع و پایان اجباری است" })

     await prisma.user.findMany({
        skip: parseInt(start) - 1,
        take: parseInt(length),
    }).then(data=>{
        return res.json(data)
    }).catch(()=>{
        return res.json({err : '500'})
    })
})

usersRoute.get("/single", async (req, res) => {
    const { userID } = req.query

    if (!userID) return res.json({ msg: "یوزر ایدی را وارد کنید" })
    const intUserId = parseInt(userID)
    await prisma.user.findFirst({
        where: {
            id: intUserId,
        },
    }).then(data=>{
        return res.json(data)
    }).catch(()=>{
        return res.json({err : '500'})
    })
})

usersRoute.delete("/delete", async (req, res) => {
    const { userID } = req.query
    
    if (!userID) return res.json({ msg: "یوزر آیدی را وارد کنید" })
    const intUserId = parseInt(userID)
    await prisma.user
        .delete({
            where: {
                id: intUserId,
            },
        }).then(()=>{
            return res.json({msg : 'موفق'})
        })
        .catch(() => {
            return res.send("کاربری با مشخصات زیر موجود نیست")
        })
})

export { usersRoute }
