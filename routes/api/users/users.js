import express from "express"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { excludePass } from "../../../funcs/ExcludePass.js"
import { lastDay } from '../../../funcs/last-24-h.js'
import { Categories , Cities , MainCategories , SubCategories , proviences  } from "../../../static/_index.js"

config()

const usersRoute = express.Router()
const prisma = new PrismaClient()

usersRoute.get("/", (req, res) => {
    res.send("/api/users")
})

usersRoute.get("/all", async (req, res) => {
    const { start, length } = req.query

    if (!start || !length)
        return res.json({ msg: "کوئری پارامتر های شروع و پایان اجباری است" })

    await prisma.user.findMany({
        where : {
            isShown : true
        },
        skip: parseInt(start) - 1,
        take: parseInt(length),
    }).then(data=>{
        data.forEach(elm=>{
            excludePass(elm,['password'])
        })
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
                 id: intUserId ,
        },
        include : {
            stories : {
                where : {
                    date : {
                        gte : new Date(lastDay).toISOString(),

                    }
                }
            }
        }
    }).then(data=>{
        excludePass(data,['password'])
        return res.json(data)
    }).catch(()=>{
        return res.json({err : '500'})
    })
})

usersRoute.delete("/delete", async (req, res) => {
    const { userID } = req.query

    if (!userID) return res.json({ err: "ایدی وارد نشده است" })

    await prisma.user
        .update({
            where: {
                id: Number(id),
            },
            data : {
                isShown : false
            }
        }).then(()=>{
            return res.json({msg : 'موفق'})
        })
        .catch(() => {
            return res.send("کاربری با مشخصات زیر موجود نیست")
        })
})

usersRoute.get('/add-prov',async(req,res)=>{
    await prisma.provience.createMany({
        data : proviences
    }).then(resp=>{
        return res.json({resp})
    }).catch((err)=>{
        return res.json({err})    
    }) 
})


usersRoute.get('/add-city',async(req,res)=>{
    await prisma.city.createMany({
        data : Cities,
    }).then(resp=>{
        return res.json({resp})
    }).catch((err)=>{
        return res.json({err})    
    }) 
})


usersRoute.get('/add-main-cat',async(req,res)=>{
    await prisma.mainCategory.createMany({
        data : MainCategories,
    }).then(resp=>{
        return res.json({resp})
    }).catch((err)=>{
        return res.json({err})    
    }) 
})


usersRoute.get('/add-sub-cat',async(req,res)=>{
    await prisma.subCategory.createMany({
        data : SubCategories,
    }).then(resp=>{
        return res.json({resp})
    }).catch((err)=>{
        return res.json({err})    
    }) 
})



usersRoute.get('/add-down-cat',async(req,res)=>{
    await prisma.category.createMany({
        data : Categories,
    }).then(resp=>{
        return res.json({resp})
    }).catch((err)=>{
        return res.json({err})    
    }) 
})




export { usersRoute }
