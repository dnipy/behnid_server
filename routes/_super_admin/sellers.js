import express from "express"
import { PrismaClient } from "@prisma/client"

const AdminSellerRoute = express.Router()
const prisma = new PrismaClient()


AdminSellerRoute.get('/',async(req,res)=>{
    const {range} = req.query
    let start = 0;
    let end =  9 ;
    if (range) {
        start = JSON.parse(range)[0];
        end = JSON.parse(range)[1];
    }
    const User = await prisma.sellerProfile.findMany({
        include : {
          user : true,
        },
        take : 10,
        skip : start 

    })
    return res.json(User)
})

AdminSellerRoute.get('/:id',async(req,res)=>{
    const {id} = req.params

    const User = await prisma.sellerProfile.findFirst({
        where : {
            id : Number(id),
        },
        include : {
            products : true,
            user :  {
                include : {
                    city : true
                }
            },

        }
        
    }).then((resp=>{
        return res.json(resp)
    })).catch((err)=>{
        return res.status(404).json(err)
    })
})


    AdminSellerRoute.post('/disable/:id',async(req,res)=>{
        const {id} = req.params

        const User = await prisma.sellerProfile.update({
            where : {
                id : Number(id),
            },
            data : {
                sellerStatus : 'unAuthorized',

            }
            
        }).then((resp=>{
            console.log(resp)
            return res.json(resp)
        })).catch((err)=>{
            return res.status(404).json(err)
        })
    })


    AdminSellerRoute.post('/accept/:id',async(req,res)=>{
        const {id} = req.params

        const User = await prisma.sellerProfile.update({
            where : {
                id : Number(id),
            },
            data : {
                sellerStatus : 'accepted',
                user : {
                    update : {
                        Role : 'Seller',
                    }
                }
            }
            
        }).then((resp=>{
            return res.json(resp)
        })).catch((err)=>{
            return res.status(404).json(err)
        })
    })


    AdminSellerRoute.post('/reject/:id',async(req,res)=>{
        const {id} = req.params
        const {reason} = req.body

        const User = await prisma.sellerProfile.update({
            where : {
                id : Number(id),
            },
            data : {
                sellerStatus : 'rejected',
                rejectReason : reason
            }
            
        }).then((resp=>{
            return res.json(resp)
        })).catch((err)=>{
            return res.status(404).json(err)
        })
    })

export {AdminSellerRoute}