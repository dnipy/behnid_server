import express, { response } from "express"
import { PrismaClient } from "@prisma/client"

const AdminLoginRoute = express.Router()
const prisma = new PrismaClient()

AdminLoginRoute.post('/',async(req,res)=>{
    const {phone , password} = req.body

    await prisma.superUser.findFirst({where: {phone : String(phone),password : String(password)}})
        .then((response)=>{
            return res.json({token : '#4kvfbsfkldfkdvfsdvfadakl',phone : response.phone , name : response.name})
        })
        .catch(()=>{
            return res.json({error : 'تلاش غیرمجاز'})
        })
})


export {AdminLoginRoute}