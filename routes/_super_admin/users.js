import express from "express"
import { PrismaClient } from "@prisma/client"

const adminUsersRoutes = express.Router()
const prisma = new PrismaClient()

adminUsersRoutes.get("/", (req, res) => {
    res.render("pages/users/users_base")
})

adminUsersRoutes.post("/delete", async (req, res) => {
    const { id } = req.query

    if (!id) return res.render("pages/server-response/error")

    await prisma.user
        .delete({
            where: {
                id: Number(id),
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

// adminUsersRoutes.post("/update",async(req,res)=>{
//     const { id } = req.query
//     const { name } = req.body

//     if (!id) return res.render('pages/server-response/error')

//     await prisma.category.update({
//         where : {
//             id : Number(id)
//         },
//         data : {
//             name
//         }
//     }).then((resp)=>{
//         return res.render('pages/server-response/succes')
//     }).catch((e)=>{
//         console.log(e)
//         return res.render('pages/server-response/error')
//     })
// })

adminUsersRoutes.get("/all", async (req, res) => {
    await prisma.user
        .findMany({})
        .then((resp) => {
            console.log(resp)
            return res.render("pages/users/users_base", { users: resp })
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminUsersRoutes.get("/single", async (req, res) => {
    const { id } = req.query

    if (!id) return res.render("pages/server-response/error")

    await prisma.user
        .findUnique({
            where: {
                id: Number(id),
            },
            include: {
                profile: true,
            },
        })
        .then((resp) => {
            console.log(resp)
            return res.render("pages/users/user_single", { user: resp })
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

export { adminUsersRoutes }
