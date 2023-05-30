import express from "express"
import { PrismaClient } from "@prisma/client"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"
import { excludePass } from "../../../funcs/ExcludePass.js"

const requestsRoute = express.Router()
const prisma = new PrismaClient()

requestsRoute.get("/", (req, res) => {
    res.send("/api/requests")
})

requestsRoute.post("/FreeRequest", authorizeMiddleware, async (req, res) => {
    const { name, catID, describe, CityID , keywords , unit , quantity , expire_date } = req.body
    console.log(req.body)

    await prisma.user
        .update({
            where: {
                phone: req.userData.userPhone,
            },
            data: {
                freeRequests: {
                    create: {
                        name,
                        categorie : {
                            connect: {
                                id : Number(catID)
                            }
                        },
                        describe: describe,
                        imgsrc: "",
                        city : {
                            connect : {
                                id : Number(CityID)
                            }
                        },
                        keywords : {
                            createMany :{
                                data : keywords
                            } 
                        },
                        unit : {
                            connect : {
                                id : unit ? Number(unit) : 1
                            }
                        },
                        quantity : quantity ? Number(quantity) : 1,
                        request_expire_date : expire_date ? expire_date : 'نامشخص',
                        status : 'pending',
                        isShown : false
                    },
                },
            },
        })
        .then(() => {
            return res.json({ msg: "تایید" })
        })
        .catch((e) => {
            return res.json({ err: "خطا در ارسال پارامتر" ,e})
        })
})


requestsRoute.post("/update", authorizeMiddleware, async (req , res) => {
    const {id ,name, catID, describe, CityID , keywords , unit , quantity , expire_date } = req.body
    console.log(req.body)

    await prisma.user
        .update({
            where: {
                phone: req.userData.userPhone,
            },
            data: {
                freeRequests: {
                    update: {
                        where : {
                            id : Number(id)
                        },
                        data : {
                            name,
                            categorie : {
                                connect: {
                                    id : Number(catID)
                                }
                            },
                            describe: describe,
                            imgsrc: "",
                            city : {
                                connect : {
                                    id : Number(CityID)
                                }
                            },
                            keywords : {
                                createMany :{
                                    data : keywords.map(elm=>{
                                        return ({
                                            name : elm.name
                                        })
                                    })
                                } 
                            },
                            unit : {
                                connect : {
                                    id : unit ? Number(unit) : 1
                                }
                            },
                            quantity : quantity ? Number(quantity) : 1,
                            request_expire_date : expire_date ? expire_date : 'نامشخص',
                            status : 'pending'
                    },

                    },
                },
            },
        })
        .then(() => {
            return res.json({ msg: "تایید" })
        })
        .catch((e) => {
            return res.json({ err: "خطا در ارسال پارامتر" ,e})
        })
})

requestsRoute.get("/single-mine",authorizeMiddleware ,async (req, res) => {
    const { id } = req.query
    if (!id) return res.json({ err: "ایدی درخواست وارد نشده" })
    const IntId = parseInt(id)

    await prisma.user.findFirst({
        where : {
            phone : req.userData?.userPhone
        },
        include : {
            freeRequests : {
                where : {
                    id : Number(id),
                },
                include : {
                    categorie : true,
                    city : true,
                    keywords : true,
                    unit : true
                }
            }
        }
    })
        .then((data) => {
            excludePass(data,['password'])
            // excludePass(data,['phone'])
            console.log(data)
            return res.json(data?.freeRequests?.at(0) ? data?.freeRequests?.at(0) : {err : 'درخواست یافت نشد یا شما صاحب درخواست نیستید'} )
        })
        .catch(() => {
            return res.json({ err: "درخواست مورد نظر موجود نیست" })
        })
})



requestsRoute.get("/all", async (req, res) => {
    const { start } = req.query
    if (!start )
        return res.json({ err: "پارامتر های درخواست کامل نیست" })

    await prisma.freeRequests
        .findMany({
            where : {
                isShown : true,
                status : 'accepted'
            },
            skip: parseInt(start) - 1,
            take: 10,
            orderBy : {
                date : 'desc'
            },
            include: {
                Author: {
                    include  : {
                        profile  :true,
                    }
                },
                categorie: {
                    distinct: ["name"],
                },
                city: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        })
        .then((data) => {
            data.forEach(elm=>{
                excludePass(elm?.Author,['password'])
            })
            return res.json(data)
        })
        .catch((e) => {
            return res.json({ err: "خطا" })
        })
})


requestsRoute.get("/all-on-my-catgory", authorizeMiddleware ,async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ err: "need both start and length query-params!" })

    const me = await prisma.user.findUnique({
        where: {
            phone: req.userData.userPhone,
        },
    }).catch((err)=>{
        return res.json({err})
    })

    await prisma.freeRequests
        .findMany({
            where : {
                isShown : true,
            },
            skip: parseInt(start) - 1,
            take: parseInt(length),
            include: {
                Author: {
                    include : {
                        profile : true
                    }
                },
                categorie: {
                    distinct: ["name"],
                },
                city: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        })
        .then((data) => {
            data.forEach(elm=>{
                excludePass(elm?.Author,['password'])
            })
            return res.json(data)
        })
        .catch((e) => {
            return res.json({ err: "خطا" })
        })
})

requestsRoute.get("/my-req", authorizeMiddleware, async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ msg: "need both start and length query-params!" })

    const IntLength = parseInt(length)

    await prisma.user
        .findUnique({
            where: {
                phone: req.userData.userPhone,
            },
            select: {
                freeRequests: {
                    select: {
                        name: true,
                        seenTime: true,
                        describe: true,
                        id: true,
                    },
                },
            },
        })
        .then((data) => {
            return res.json(data.freeRequests)
        })
        .catch((e) => {
            return res.json({ msg: e })
        })
})



requestsRoute.get('/all-mine',authorizeMiddleware,async(req,res)=>{
    const {userPhone} = req.userData

    const rejected = await prisma.user
        .findUnique({
            where: {
                phone: req.userData.userPhone,
            },
            select: {
                freeRequests: {
                    where : {
                        status : "rejected"
                    },
                    select: {
                        name: true,
                        seenTime: true,
                        describe: true,
                        id: true,
                    },
                },
            },
        }).catch((e) => {
            return res.json({ msg: e , e : 'خطا هنگام دریافت رد شده ها' })
    })

    const accepted = await prisma.user
        .findUnique({
            where: {
                phone: req.userData.userPhone,
            },
            select: {
                freeRequests: {
                    where : {
                        status : "accepted"
                    },
                    select: {
                        name: true,
                        seenTime: true,
                        describe: true,
                        id: true,
                    },
                },
            },
        }).catch((e) => {
            return res.json({ msg: e , e : 'خطا هنگام دریافت تایید شده ها' })
    })

    const pending = await prisma.user
        .findUnique({
            where: {
                phone: req.userData.userPhone,
            },
            select: {
                freeRequests: {
                    where : {
                        status : "pending"
                    },
                    select: {
                        name: true,
                        seenTime: true,
                        describe: true,
                        id: true,
                    },
                },
            },
        }).catch((e) => { 
            return res.json({ msg: e , e : 'خطا هنگام دریافت در انتظار ها' })
    })


    try {
        const response = {accepted,rejected,pending}
        return res.json(response)
    } 
    catch {
        return res.json({err : 'خطا هنگام ارسال پاسخ از سمت سرور'})
    }
    
})

requestsRoute.get("/my-rejected-req", authorizeMiddleware, async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ msg: "مقادیر شروع و مقدار وارد نشده است" })

    const IntLength = parseInt(length)

    await prisma.user
        .findUnique({
            where: {
                phone: req.userData.userPhone,
            },
            select: {
                freeRequests: {
                    where : {
                        status : "rejected"
                    },
                    select: {
                        name: true,
                        seenTime: true,
                        describe: true,
                        id: true,
                    },
                },
            },
        })
        .then((data) => {
            return res.json(data.freeRequests)
        })
        .catch((e) => {
            return res.json({ msg: e })
        })
})



requestsRoute.get("/my-pending-req", authorizeMiddleware, async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ msg: "مقادیر شروع و مقدار وارد نشده است" })

    const IntLength = parseInt(length)

    await prisma.user
        .findUnique({
            where: {
                phone: req.userData.userPhone,
            },
            select: {
                freeRequests: {
                    where : {
                        status : "pending"
                    },
                    select: {
                        name: true,
                        seenTime: true,
                        describe: true,
                        id: true,
                    },
                },
            },
        })
        .then((data) => {
            return res.json(data.freeRequests)
        })
        .catch((e) => {
            return res.json({ msg: e })
        })
})



requestsRoute.get("/my-accepted-req", authorizeMiddleware, async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ msg: "مقادیر شروع و مقدار وارد نشده است" })

    const IntLength = parseInt(length)

    await prisma.user
        .findUnique({
            where: {
                phone: req.userData.userPhone,
            },
            select: {
                freeRequests: {
                    where : {
                        status : "accepted"
                    },
                    select: {
                        name: true,
                        seenTime: true,
                        describe: true,
                        id: true,
                    },
                },
            },
        })
        .then((data) => {
            return res.json(data.freeRequests)
        })
        .catch((e) => {
            return res.json({ msg: e })
        })
})


requestsRoute.post("/edit", authorizeMiddleware, async (req, res) => {
    const { id } = req.query
    const { describe, name, quantity } = req.body
    if (!id) return res.json({ err: "آیدی لازم است!" })

    await prisma.user
        .update({
            where: {
                phone: req.userData.userPhone,
            },
            data: {
                freeRequests: {
                    update: {
                        where: {
                            id: Number(id),
                        },
                        data: {
                            describe,
                            name,
                            quantity,
                        },
                    },
                },
            },
        })
        .then((dta) => {
            return res.json(dta.freeRequests)
        })
        .catch((e) => {
            return res.json({ msg: e })
        })
})

requestsRoute.get("/single", async (req, res) => {
    const { id } = req.query
    if (!id) return res.json({ err: "ایدی درخواست وارد نشده" })
    const IntId = parseInt(id)

    await prisma.freeRequests
        .findFirst({
            where: {
                id: IntId,
            },
            include: {
                Author: true,
                city: true,
                categorie: true,
            },
        })
        .then((data) => {
            excludePass(data?.Author,['password'])
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "درخواست مورد نظر موجود نیست" })
        })
})

requestsRoute.post("/delete", authorizeMiddleware, async (req, res) => {
    const { id } = req.body
    if (!id) return res.json({ msg: "ایدی درخواست وارد نشده است" })

    await prisma.user
        .update({
            where: {
                phone: req.userData.userPhone,
            },
            data: {
                freeRequests: {
                    update : {
                        where : {
                            id : Number(id)
                        },
                        data : {
                            isShown : false
                        }
                    }
                },
            },
        })
        .then((dta) => {
            return res.json({
                dta,
                msg: "موفق",
            })
        })
        .catch((e) => {
            return res.json({ err: 1, e })
        })
})

requestsRoute.get("/add-seen", async (req, res) => {
    const { id } = req.query
    const INTid = parseInt(id)

    try {
        const requests = await prisma.freeRequests.findFirst({
            where: {
                id: INTid,
            },
        })
        if (requests) {
            await prisma.freeRequests.update({
                where: {
                    id: INTid,
                },
                data: {
                    seenTime: requests.seenTime + 1,
                },
            })
            res.statusCode(200)
        }
        return res.statusCode(400)
    } catch (error) {
        return res.json({ err: "درخواست مورد نظر موجود نیست" })
    }
})

export { requestsRoute }
