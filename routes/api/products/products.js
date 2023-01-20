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
        packType,
        minOrder,
        customerPrice,
        producerPrice,
        weight,
        deliveryTime,
        keyword_list,
        cat_id,
        city_id,
        offPercent,
        freeDelivery,
        add_story
    } = req.body

    console.log(req.body)

    try {
            await prisma.user.update({
                    data: {
                        sellerProfile : {
                            upsert : {
                                    create : {
                                        shopIntro : "",
                                        products : {
                                            create : {
                                                title : title,
                                                categorie : {
                                                    connect : {
                                                        id : Number(cat_id)
                                                    }
                                                },
                                                keywords : {
                                                    createMany : {
                                                        data : keyword_list
                                                    }
                                            },
                                            minOrder : minOrder,
                                            packType : packType,
                                            price : price,
                                            customerPrice : customerPrice,
                                            producerPrice : producerPrice,
                                            describe : describe,
                                            freeDelivery : freeDelivery,
                                            weight : weight,
                                            deliveryTime : deliveryTime,
                                            city : {
                                                connect : {
                                                    id : Number(city_id)
                                                }
                                            },
                                            productStatus : "pending",
                                            offPercent : offPercent ? offPercent : null,
                                            isShown :false
                                        }
                                    }
                                },
                                update : {
                                        products : {
                                            create : {
                                                title : title,
                                                categorie : {
                                                    connect : {
                                                        id : Number(cat_id)
                                                    }
                                                },
                                                keywords : {
                                                    createMany : {
                                                        data : keyword_list
                                                    }
                                                },
                                                minOrder : minOrder,
                                                packType : packType,
                                                price : price,
                                                customerPrice : customerPrice,
                                                producerPrice : producerPrice,
                                                describe : describe,
                                                freeDelivery : freeDelivery,
                                                weight : weight,
                                                deliveryTime : deliveryTime,
                                                city : {
                                                    connect : {
                                                        id : Number(city_id)
                                                    }
                                                },
                                                productStatus : "pending",
                                                offPercent : offPercent ? offPercent : null,
                                                isShown :false
                                        }
                                }
                            }
                        }
                    }
                },
                include: {
                    sellerProfile : {
                        select : {
                            products : true
                        }
                    }
                },
                where : {
                    phone : req.userData.userPhone
                },
                })
                .then((data) => {
                    return res.json({
                        msg: "موفق",
                        id: data.sellerProfile.products.at(-1).id,
                    })
                })
    } catch (err) {
        console.log(err)
        return res.json({ err: "مشکلی پیش آمده است" })
    }
})

productsRoute.post("/update", authorizeMiddleware, async (req, res) => {
    const {
        id,
        describe,
        price,
        packType,
        minOrder,
        customerPrice,
        producerPrice,
        weight,
        deliveryTime,
        keyword_list,
        cat_id,
        city_id,
        offPercent,
        add_story
    } = req.body


    try {
            await prisma.user.update({
                where : {
                    phone : req.userData.userPhone
                },
                data : {
                    sellerProfile : {
                        update : {
                            products : {
                                update : {
                                    where : {
                                        id : Number(id)
                                    },
                                    data : {
                                        title : title,
                                        categorie : {
                                            connect : {
                                                id : Number(cat_id)
                                            }
                                        },
                                        keywords : {
                                            createMany : {
                                                data : keyword_list
                                            }
                                        },
                                        minOrder : minOrder,
                                        packType : packType,
                                        price : price,
                                        customerPrice : customerPrice,
                                        producerPrice : producerPrice,
                                        describe : describe,
                                        freeDelivery : freeDelivery,
                                        weight : weight,
                                        deliveryTime : deliveryTime,
                                        city : {
                                            connect : {
                                                id : Number(city_id)
                                            }
                                        },
                                        productStatus : "pending",
                                        offPercent : offPercent ? offPercent : null,
                                        isShown :false
                                    }
                                }
                            }
                        }
                    },
                    
                },
                include :{
                    sellerProfile : {
                        select : {
                            products : true
                        }
                    }
                }
            })
                .then(async(data) => {
                    return res.json({
                        msg: "موفق",
                        id: data.sellerProfile.products.at(-1).id,
                    })
                })
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
                // data.forEach(elm=>{
                //     excludePass(elm?.author,['password'])
                // })
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
        return res.json({ err: "need both start and length query-params!" })


    await prisma.user.findFirst({
        where : {
            phone : req.userData.userPhone
        },
        include : {
            sellerProfile : {
                select : {
                    products : true
                }
            }
        }
    }).then((resp)=>{
        return res.json(resp.sellerProfile.products)
    }).catch((e)=>{
        return res.json({err : "اشکال در لود دیتا" , e})
    })
    

})



productsRoute.get("/mine/rejected", authorizeMiddleware, async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ msg: "need both start and length query-params!" })
    
    
    await prisma.user.findFirst({
        where : {
            phone : req.userData.userPhone
        },
        include : {
            sellerProfile : {
                select : {
                    products : {
                        where : {
                            productStatus : "rejected"
                        }
                    }
                }
            }
        }
    }).then((resp)=>{
        return res.json(resp.sellerProfile.products)
    }).catch((e)=>{
        return res.json({err : "اشکال در لود دیتا" , e})
    })
})

productsRoute.get("/mine/pending", authorizeMiddleware, async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ msg: "need both start and length query-params!" })
    
    
    await prisma.user.findFirst({
        where : {
            phone : req.userData.userPhone
        },
        include : {
            sellerProfile : {
                select : {
                    products : {
                        where : {
                            productStatus : "pending"
                        }
                    }
                }
            }
        }
    }).then((resp)=>{
        return res.json(resp.sellerProfile.products)
    }).catch((e)=>{
        return res.json({err : "اشکال در لود دیتا" , e})
    })
})


productsRoute.get("/mine/accepted", authorizeMiddleware, async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ msg: "need both start and length query-params!" })
    
    
    await prisma.user.findFirst({
        where : {
            phone : req.userData.userPhone
        },
        include : {
            sellerProfile : {
                select : {
                    products : {
                        where : {
                            productStatus : "accepted"
                        }
                    }
                }
            }
        }
    }).then((resp)=>{
        return res.json(resp.sellerProfile.products)
    }).catch((e)=>{
        return res.json({err : "اشکال در لود دیتا" , e })
    })
})



productsRoute.get("/mine-single", authorizeMiddleware, async (req, res) => {
    const {id} = req.query
    
    await prisma.user.findFirst({
        where : {
            phone : req.userData.userPhone
        },
        include : {
            sellerProfile : {
                select : {
                    products : {
                        where : {
                            id : Number(id)
                        },
                        include : {
                            categorie : true,
                            city : true,
                            comments : true,
                            author : true,
                            keywords : true,
                            pictures : true,
                            sendArea : true,
                        }
                    }
                }
            }
        }
    }).then((resp)=>{
        return res.json(resp.sellerProfile.products.at(0))
    }).catch((e)=>{
        return res.json({err : "محصول یافت نشد"  , e})
    })
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
                   sellerProfile : {
                       update : {
                           products : {
                               update : {
                                   where : {
                                       id : Number(id)
                                   },
                                   data : {
                                       isShown : false
                                   }
                               }
                           }
                       }
                   }
                },
            })
            .then(() => {
                return res.json(`product with id => ${id} deleted`)
            })
    } catch (e) {
        return res.json({err : "مشکلی پیش آمده است" , e})
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
                        subCategory : {
                            select : {
                                name : true,
                                mainCatName : true
                            }
                        }
                    },
                },
            },
        })
        // excludePass(product.author,['password'])
        return res.json(product)
    } catch (error) {
        return res.json({ err: "محصول مورد نظر موجود نیست" })
    }
})

// productsRoute.post("/set-request", authorizeMiddleware, async (req, res) => {
//     const { id } = req.query
//     const INTid = parseInt(id)
//     const { message, quantity } = req.body

//     try {
//         const product = await prisma.product.update({
//             where: {
//                 id: INTid,
//             },
//             data: {
//                 requests: {
//                     create: {
//                         quantity,
//                         message,
//                         RequestAuthor: {
//                             connect: {
//                                 phone: req.userData?.userPhone,
//                             },
//                         },
//                     },
//                 },
//             },
//         })
//         return res.json({ msg: "موفق" })
//     } catch (error) {
//         return res.json({ err: "محصول مورد نظر موجود نیست" })
//     }
// })

productsRoute.get("/add-seen", async (req, res) => {
    const { id } = req.query


    try {
        const product = await prisma.product.findFirst({
            where: {
                id  : Number(id)
            },
        }).catch((e)=>{
            return res.json({err: "خطا در یافت محصول",e})
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
