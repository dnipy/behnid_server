import express from "express"
import { PrismaClient } from "@prisma/client"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"
import { excludePass } from "../../../funcs/ExcludePass.js";

const prisma = new PrismaClient();
const productsRoute = express.Router()

productsRoute.get("/", (req, res) => {
    res.send("/api/products")
})

productsRoute.post("/add", authorizeMiddleware, async (req, res) => {
    const {
        title,
        describe,
        price,
        sendArea,
        packType,
        minOrder,
        customerPrice,
        producerPrice,
        weight,
        deliveryTime,
        catName,
        City
    } = req.body

    console.log(req.body)

    const usr = await prisma.user.findFirst({
        where: { phone: req.userData.userPhone },
    })
    

    try {
        if (usr.Role === "Seller" || usr.Role === "Buyer") {
            await prisma.user.update({
                    data: {
                        products: {
                            create: {
                                title,
                                customerPrice: customerPrice,
                                deliveryTime,
                                describe,
                                packType,
                                minOrder,
                                price: price,
                                producerPrice: producerPrice,
                                weight,
                                sendArea,

                                categorie : {
                                    connect : {
                                        name : catName,
                                    } 
                                },
                                city : {
                                    connect : {
                                        id : City
                                    }
                                },
                                
                            },
                        },
                    },
                    include: {
                        products: true,
                    },
                    where : {
                        phone : usr.phone
                    },
                })
                .then((data) => {
                    return res.json({
                        msg: "موفق",
                        id: data.products.at(-1).id,
                    })
                })
        } else {
            return res.json({ err: "شما فروشنده نیستید" })
        }
    } catch (err) {
        console.log(err)
        return res.json({ err: "مشکلی پیش آمده است" })
    }
})

productsRoute.post("/update", authorizeMiddleware, async (req, res) => {
    const {
        id,
        title,
        describe,
        price,
        sendArea,
        packType,
        minOrder,
        customerPrice,
        producerPrice,
        weight,
        deliveryTime,
        catName,
    } = req.body

    console.log(req.body)

    const user = await prisma.user.findFirst({
        where: { phone: req.userData.userPhone },
    })

    try {
        if (user.Role === "Seller") {
            await prisma.user
                .update({
                    where: {
                        phone: req.userData.userPhone,
                    },
                    data: {
                        products: {
                            update: {
                                where: { id: Number(id) },
                                data: {
                                    title,
                                    customerPrice: Number(customerPrice),
                                    deliveryTime,
                                    describe,
                                    packType,
                                    minOrder: Number(minOrder),
                                    price: Number(price),
                                    producerPrice: Number(producerPrice),
                                    weight,
                                    sendArea,
                                    categorie : {
                                        connect : {
                                            name : catName
                                        }
                                    }
                                },
                            },
                        },
                    },
                    include: {
                        products: true,
                    },
                })
                .then((data) => {
                    return res.json({
                        msg: "موفق",
                        id: data.products.at(-1).id,
                    })
                })
        } else {
            return res.json({ err: "شما فروشنده نیستید" })
        }
    } catch (err) {
        console.log(err)
        return res.json({ err: "مشکلی پیش آمده است" })
    }
})

productsRoute.get("/all", async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ msg: "need both start and length query-params!" })



    try {
        await prisma.product
            .findMany({
                where: {
                    isShown : true
                },
                skip: Number(start) - 1,
                take: Number(length),
                include: {
                    author: true,
                    city: true,
                    categorie: true,
                },
                orderBy : {
                    addDate :'desc'
                }
            })
            .then((data) => {
                data.forEach(elm=>{
                    excludePass(elm?.author,['password'])
                })
                return res.json(data)
            })
            .catch((e) => {
                return res.json({ err: e })
            })
    } catch (err) {
        return res.json({ err: "ارور" })
    }
})

productsRoute.get("/mine", authorizeMiddleware, async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ msg: "need both start and length query-params!" })

    const IntLenght = parseInt(length)

    try {
        await prisma.product
            .findMany({
                where: {
                    author: {
                        phone: req.userData.userPhone,
                    },
                },
                skip: parseInt(start) - 1,
                take: parseInt(length),
                include: { author: true },
            })
            .then((data) => {
                data.forEach(elm=>{
                    excludePass(elm?.author,['password'])
                })
                return res.json(data)
            })
            .catch((e) => {
                return res.json({ err: e })
            })
    } catch (err) {
        return res.json({ err: "ارور" })
    }
})




productsRoute.get("/mine-single", authorizeMiddleware, async (req, res) => {
    const {id} = req.query
    
    try {
        await prisma.product
            .findFirst({
                where : {
                    AND : {
                        author : {
                            phone: req.userData.userPhone
                        },
                        id : Number(id)
                    }
                },
                include : {
                    requests : {
                        include : {
                            RequestAuthor : true
                        }
                    },
                    comments : true
                }
            })
            .then((data) => {
                
                excludePass(data.addDate,['password'])
                
                return res.json(data)
            })
            .catch((e) => {
                return res.json({ err: e })
            })
    } catch (err) {
        return res.json({ err: "ارور" })
    }
})


productsRoute.post("/delete", authorizeMiddleware, async (req, res) => {
    const { id } = req.body

    if (!id) return res.json({ err: "ایدی وارد نشده است" })


    try {
        await prisma.user
            .update({
                where: {
                    phone: req.userData.userPhone,
                },
                data: {
                    products: {
                        update : {
                            where : {
                                id : Number(id)
                            },
                            data : {
                                isShown : false
                            }
                        },
                        
                    },
                },
            })
            .then(() => {
                return res.json(`product with id => ${id} deleted`)
            })
    } catch (error) {
        return res.send(error)
    }
})

productsRoute.get("/single", async (req, res) => {
    const { id } = req.query
    const INTid = parseInt(id)

    try {
        const product = await prisma.product.findFirst({
            where: {
                id: INTid,
            },
            include: {
                comments: {
                    select: {
                        commentAuthor: {
                            select: {
                                avatar: true,
                                name: true,
                                id: true,
                            },
                        },
                        date: true,
                        message: true,
                        repliedComments: true,
                    },
                },
                author: true,
                requests: true,
                categorie: {
                    select: {
                        name: true,
                    },
                },
            },
        })
        excludePass(product.author,['password'])
        return res.json(product)
    } catch (error) {
        return res.json({ err: "محصول مورد نظر موجود نیست" })
    }
})

productsRoute.post("/set-request", authorizeMiddleware, async (req, res) => {
    const { id } = req.query
    const INTid = parseInt(id)
    const { message, quantity } = req.body

    try {
        const product = await prisma.product.update({
            where: {
                id: INTid,
            },
            data: {
                requests: {
                    create: {
                        quantity,
                        message,
                        RequestAuthor: {
                            connect: {
                                phone: req.userData?.userPhone,
                            },
                        },
                    },
                },
            },
        })
        return res.json({ msg: "موفق" })
    } catch (error) {
        return res.json({ err: "محصول مورد نظر موجود نیست" })
    }
})

productsRoute.get("/add-seen", async (req, res) => {
    const { id } = req.query
    const INTid = parseInt(id)

    try {
        const product = await prisma.product.findFirst({
            where: {
                id: INTid,
            },
        })
        if (product) {
            await prisma.product.update({
                where: {
                    id: INTid,
                },
                data: {
                    seenTime: product.seenTime + 1,
                },
            })
            res.statusCode(200)
        }
        return res.statusCode(400)
    } catch (error) {
        return res.json({ err: "محصول مورد نظر موجود نیست" })
    }
})

export { productsRoute }
