import express from "express"
import { PrismaClient } from "@prisma/client"

const AdminProductRoute = express.Router()
const prisma = new PrismaClient()


AdminProductRoute.get('/',async(req,res)=>{
    const {range} = req.query
    let start = 0;
    let end =  9 ;
    if (range) {
        start = JSON.parse(range)[0];
        end = JSON.parse(range)[1];
    }
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
            
        },
        take : 10,
        skip : start 
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

AdminProductRoute.post('/disable/:id',async(req,res)=>{
    const {id} = req.params

    await prisma.product.update({
        where : {
            id : Number(id),
        },
        data : {
            isShown : false,
        }
        
    }).then((resp=>{
        return res.json(resp)
    })).catch((err)=>{
        return res.status(404).json(err)
    })
})


AdminProductRoute.post('/accept/:id',async(req,res)=>{
    const {id} = req.params

    await prisma.product.update({
        where : {
            id : Number(id),
        },
        data : {
            productStatus : 'accepted',
            isShown : true
        }
        
    }).then((resp=>{
        return res.json(resp)
    })).catch((err)=>{
        return res.status(404).json(err)
    })
})


AdminProductRoute.post('/reject/:id',async(req,res)=>{
    const {id} = req.params
    const {reason} = req.body

    const User = await prisma.product.update({
        where : {
            id : Number(id),
        },
        data : {
            productStatus : 'rejected',
            rejectReason : reason, 
            isShown : false
        }
        
    }).then((resp=>{
        return res.json(resp)
    })).catch((err)=>{
        return res.status(404).json(err)
    })
})

export {AdminProductRoute}