import express from "express"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"
import { PrismaClient } from "@prisma/client"
import { excludePass } from "../../../funcs/ExcludePass.js"

const profileRoute = express.Router()
const prisma = new PrismaClient()

profileRoute.get("/", (req, res) => {
    res.send("/api/profile")
})

profileRoute.get("/my-data", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    console.log(userPhone)

    await prisma.user
        .findFirst({
            where: {
                phone: userPhone,
            },
            include: {
                profile: true,
                freeRequests: true,
                products: true,
                tickets: true,
                sellerProfile: true,
            },
        })
        .then((data) => {
            
            excludePass(data,['password'])
            return res.json(data)
        })
        .catch((e) => {
            return res.json({ msg: e })
        })
})

profileRoute.post("/update", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const { profileName, address, family, workNumber, instaAcc } = req.body

    await prisma.user
        .update({
            where: { phone: userPhone },
            data: {
                profile: {
                    upsert: {
                        create: {
                            name: profileName,
                            address: address,
                            family: family,
                            workNumber: workNumber,
                            instaAcc: instaAcc,
                        },
                        update: {
                            name: profileName,
                            address: address,
                            family: family,
                            workNumber: workNumber,
                            instaAcc: instaAcc,
                        },
                    },
                },
            },
        })
        .then(() => {
            return res.json({ msg: "اپدیت با موفقیت انجام شد" })
        })
        .catch(() => {
            return res.json({ err: "ارور در فیلد های ارسال شده" })
        })
})

profileRoute.post("/update-uniqe", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const { name, bio, email, phone } = req.body

    await prisma.user
        .update({
            where: { phone: userPhone },
            data: {
                name,
                bio,
                email,
                phone,
            },
        })
        .then(() => {
            return res.json({ msg: "اپدیت با موفقیت انجام شد" })
        })
        .catch(() => {
            return res.json({ err: "ارور در فیلد های ارسال شده" })
        })
})

profileRoute.get("/my-role", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const user = await prisma.user
        .findUnique({
            where: { phone: userPhone },
        })
        .then((data) => {
            return res.json({ role: data.Role })
        })
        .catch(() => {
            return res.json({ err: 1 })
        })
})

profileRoute.get("/my-avatar", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const user = await prisma.user
        .findUnique({
            where: { phone: userPhone },
        })
        .then((data) => {
            return res.json({ avatar: data.avatar })
        })
        .catch(() => {
            return res.json({ err: 1 })
        })
})

profileRoute.post("/become-seller", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData

    const user = await prisma.user.findUnique({
        where: { phone: userPhone },
    })
    if (user.Role == "Seller") return res.json({ msg: "شما فروشنده هستید" })

    await prisma.user
        .update({
            where: { phone: userPhone },
            data: {
                Role: "Seller",
            },
        })
        .then((dta) => {
            return res.json({ msg: "successfull" })
        })
        .catch(() => {
            return res.json({ error: 1 })
        })
})

export { profileRoute }
