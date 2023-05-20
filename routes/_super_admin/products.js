import express from "express"
import { PrismaClient } from "@prisma/client"

const AdminProductRoute = express.Router()
const prisma = new PrismaClient()


AdminProductRoute.get('/',async(req,res)=>{
    const products = await prisma.product.findMany({
        include : {
            author : {
                select:{
                    user:{
                        select:{
                            name  : true ,
                            id : true,
                            phone : true
                        }
                    },
                    shopName : true,
                    shopURLname : true
                }
            },
            
        }
    })
    return res.json(products)
})


AdminProductRoute.get('/:id',async(req,res)=>{
    const {id} = req.params

    await prisma.product.findFirst({
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
            author : {
                include : {
                    user :{
                        select : {
                            id : true,
                            profile :{
                                select : {
                                    id : true,
                                    name : true,
                                    family : true,
                                }
                            }
                        }
                    },
                }
            },
            keywords : true,
            categorie : {
                include :{
                    subCategory : {
                        include : {
                            mainCategory : true
                        }
                    }
                }
            },
            unit : true,
        }
    }).then((resp=>{
        return res.json(resp)
    })).catch((err)=>{
        return res.status(404).json(err)
    })
})


export {AdminProductRoute}