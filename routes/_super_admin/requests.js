import express from "express"
import { PrismaClient } from "@prisma/client"

const AdminRequetsRoute = express.Router()
const prisma = new PrismaClient()


AdminRequetsRoute.get('/',async(req,res)=>{
    const requests = await prisma.freeRequests.findMany({
        include : {
            Author : {
                select : {
                    phone : true,
                    name : true,
                    id : true
                }
            }
        }
    })
    return res.json(requests)
})



AdminRequetsRoute.get('/:id',async(req,res)=>{
    const {id} = req.params

    await prisma.freeRequests.findFirst({
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
            Author : {
              select : {
                id : true,
                phone : true,
                profile : {
                    select : {
                        id : true,
                        name : true,
                        family : true
                    }
                }
              }  
            },
            keywords : true,
            unit : {
                select : {
                    id : true,
                    name : true
                }
            }
        }
    }).then((resp=>{
        return res.json(resp)
    })).catch((err)=>{
        return res.status(404).json(err)
    })
})


export {AdminRequetsRoute}