import express from "express"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"
import { PrismaClient } from "@prisma/client"
import { excludePass } from "../../../funcs/ExcludePass.js"
import { lastDay } from "../../../funcs/last-24-h.js"

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
                tickets: true,
                sellerProfile: {
                    include : {
                        products : true,
                        stories : {
                            where : {
                                date : {
                                    gte : new Date(lastDay).toISOString()
                                }
                            }
                        }
                    }
                },         
            },
        })
        .then((data) => {
            console.log('data')
            const sent_data = {data,password_seted : true}

            if (data?.password) {
                sent_data.password_seted = true
            }
            else {
                sent_data.password_seted = false
            }


            excludePass(sent_data.data,['password'])
            console.log('sent')
            return res.json(sent_data)
        })
        .catch((e) => {
            return res.json({ err: 'کاربر یافت نشد' })
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




profileRoute.post("/update-profile-detailes", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const { name , family } = req.body

    await prisma.user
        .update({
            where: { phone: userPhone },
            data: {
                profile: {
                    update : {
                        name : name ? name : 'کاربر بدون نام',
                        family : family ? family : 'مشخص نشده'
                    }
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


profileRoute.post("/update-bio", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const { bio } = req.body

    await prisma.user
        .update({
            where: { phone: userPhone },
            data: {
                bio : bio ? bio : ''
            },
        })
        .then(() => {
            return res.json({ msg: "اپدیت با موفقیت انجام شد" })
        })
        .catch(() => {
            return res.json({ err: "ارور در فیلد های ارسال شده" })
        })
})


profileRoute.post("/update-publics", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const { address , workNumber , instaAcc } = req.body

    await prisma.user
        .update({
            where: { phone: userPhone },
            data: {
                profile : {
                    update : {
                        address : address ,
                        instaAcc : instaAcc ,
                        workNumber : workNumber 
                    }
                }
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
    const { name, bio, email } = req.body

    await prisma.user
        .update({
            where: { phone: userPhone },
            data: {
                name,
                bio,
                email,
            },
        })
        .then(() => {
            return res.json({ msg: "اپدیت با موفقیت انجام شد" })
        })
        .catch(() => {
            return res.json({ err: "ارور در فیلد های ارسال شده" })
        })
})


profileRoute.post("/update-city", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const { cityID } = req.body

    await prisma.user
        .update({
            where: { phone: userPhone },
            data: {
                city : {
                    connect : {
                        id : Number(cityID)
                    }
                }
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


profileRoute.get("/my-intresting-products", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    await prisma.user
        .findUnique({
            where: { phone: userPhone },
            include : {
                savedProducts : {
                    include: {
                        city: true,
                        author: {
                            select : {
                                id : true,
                                user : {
                                    include : {
                                        profile : {
                                            select : {
                                                name : true, 
                                                family : true
                                            }
                                        }
                                    }
                                },
                                
                            }
                        },
                    }
                },
            },
        })
        .then((data) => {
            return res.json(data.savedProducts)
        })
        .catch(() => {
            return res.json({ err: 'ارور هنگام لود دیتا' })
        })
})


profileRoute.post("/add-to-intresting-products", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const {id} = req.body
    await prisma.user
        .update({
            where : {
                phone : userPhone
            },
            data : {
                savedProducts : {
                    connect : {
                        id : Number(id)
                    },
                    
                }
            }
        })
        .then((data) => {
            return res.json({msg : 'محصول با موفقیت به علاقمندی ها اضافه شد'})
        })
        .catch(() => {
            return res.json({ err: 'ارور هنگام لود دیتا' })
        })
})

profileRoute.post("/delete-from-intresting-products", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const {id} = req.body
    await prisma.user
        .update({
            where : {
                phone : userPhone
            },
            data : {
                savedProducts : {
                    delete : {
                        id : Number(id)
                    }
                }
            }
        })
        .then((data) => {
            return res.json({msg : 'محصول با موفقیت از علاقمندی ها حذف شد'})
        })
        .catch(() => {
            return res.json({ err: 'ارور هنگام لود دیتا' })
        })
})

profileRoute.post("/become-seller", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req?.userData
    const {ShopName , shopIntro } = req.body

    if ( !shopIntro | !ShopName ) return res.json({msg : "نام فروشگاه و اینترو فروشگاه وارد نشده"})

    const user = await prisma.user.findUnique({
        where: { phone: userPhone },
        include : {profile : true}
    })
    if (user.Role == "Seller") return res.json({ msg: "شما فروشنده هستید" })

    await prisma.user
        .update({
            where: { phone: userPhone },
            data: {
                Role: "Seller",
                sellerProfile : {
                    upsert : {
                        create : {
                            shopName : ShopName ? ShopName :  ` فروشگاه ${user.profile.name}` ,
                            shopIntro : shopIntro ? shopIntro : "",
                            userPhone : user.phone
                        },
                        update : {
                            shopName : ShopName ? ShopName : ` فروشگاه ${user.profile.name}`,
                            shopIntro : shopIntro ? shopIntro : "",
                        },
                    },
                },
            },
        })
        .then((dta) => {
            return res.json({ msg: "موفق" })
        })
        .catch((e) => {
            return res.json({ err: 1 ,e })
        })
})




export { profileRoute }
