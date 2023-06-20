import express from "express"
import { PrismaClient } from "@prisma/client"

const AdminRequetsRoute = express.Router()
const prisma = new PrismaClient()
 

AdminRequetsRoute.get('/',async(req,res)=>{
    const {range} = req.query
    let start = 0;
    let end =  9 ;
    if (range) {
        start = JSON.parse(range)[0];
        end = JSON.parse(range)[1];
    }
    const requests = await prisma.freeRequests.findMany({
        include : {
            Author : {
                select : {
                    phone : true,
                    name : true,
                    id : true
                }
            }
        },
        take : 10,
        skip : start 
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


AdminRequetsRoute.post('/disable/:id',async(req,res)=>{
    const {id} = req.params

    const User = await prisma.freeRequests.update({
        where : {
            id : Number(id),
        },
        data : {
            isShown : false
        }
        
    }).then((resp=>{
        return res.json(resp)
    })).catch((err)=>{
        return res.status(404).json(err)
    })
})


AdminRequetsRoute.post('/accept/:id',async(req,res)=>{
    const {id} = req.params

    await prisma.freeRequests.update({
        where : {
            id : Number(id),
        },
        data : {
            status : 'accepted',
            isShown : true
        }
        
    }).then((resp=>{
        return res.json(resp)
    })).catch((err)=>{
        return res.status(404).json(err)
    })
})


AdminRequetsRoute.post('/reject/:id',async(req,res)=>{
    const {id} = req.params
    const {reason} = req.body

    const User = await prisma.freeRequests.update({
        where : {
            id : Number(id),
        },
        data : {
            status : 'rejected',
            rejectReason : reason
        }
        
    }).then((resp=>{
        return res.json(resp)
    })).catch((err)=>{
        return res.status(404).json(err)
    })
})

export {AdminRequetsRoute}