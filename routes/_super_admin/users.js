import express from "express"
import { PrismaClient } from "@prisma/client"

const AdminUserRoute = express.Router()
const prisma = new PrismaClient()


AdminUserRoute.get('/',async(req,res)=>{
    const User = await prisma.user.findMany({
        include : {
            profile : {
                select : {
                    name : true,
                    family : true,
                    instaAcc : true
                }
            }
        }
    })
    return res.json(User)
})

AdminUserRoute.get('/:id',async(req,res)=>{
    const {id} = req.params

    const User = await prisma.user.findFirst({
        where : {
            id : Number(id)
        },
        include : {
            city : {
                select :{
                    name : true,
                    id : true ,
                    provience : {
                        select: {
                            id : true, 
                            name : true
                        }
                    }
                }
            },
            sellerProfile : {
                select :{
                    id : true,
                    shopName : true,
                }
            },
            profile : {
                select : {
                    id : true,
                    name : true,
                    family : true,
                }
            },
        }
    }).then((resp=>{
        return res.json(resp)
    })).catch((err)=>{
        return res.status(404).json(err)
    })
    })

export {AdminUserRoute}