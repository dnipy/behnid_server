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
        quantity,
        cat_id,
        city_id,
        sendArea_list,
        unit,
        offPercent,
        offCount,
        freeDelivery,
        add_story
    } = req.body


    if (!title || !describe || !price || !customerPrice || !producerPrice){
        return res.json({err : 'مقادیر ارسالی کم'})
    }

    console.log(req.body)
    await prisma.user.findFirst({
         where : {
             phone : req.userData.userPhone
         }
    })
    .then(async(usr)=>{
        
        await prisma.product.create({
            data : {
                author : {
                    connect : {
                        userPhone : usr.phone
                    }
                },
                city : {
                    connect : {
                        id : city_id ?  Number(city_id) : 1160
                    },
                },
                keywords : {
                    createMany : {
                        data : keyword_list
                    },
                },
                categorie : {
                    connect : {
                        id : cat_id ?  Number(cat_id) : 1
                    }
                },
                off : {
                    create : {
                        off_count : offCount && offPercent ? Number(offCount) : 0,
                        off_percent : offCount && offPercent ? Number(offPercent) : 0,
                    }
                },
                // categorieID : Number(cat_id),
                sendArea : {
                    connect : sendArea_list
                },
                unit : {
                    connect : {
                        id : unit ? Number(unit) : 1
                    }
                },  
                customerPrice : Number(customerPrice),
                producerPrice : Number(producerPrice),
                price : Number(price),
                minOrder : minOrder ?  Number(minOrder) : 1,
                weight : weight ? String(weight) : '',
                describe : describe,
                title : title,
                deliveryTime : deliveryTime ?  String(deliveryTime).trim() : '1',
                packType : packType ? packType : "kg",
                freeDelivery : freeDelivery ? freeDelivery : false,
                quantity : quantity ? Number(quantity) : 1,
            },
        }).then((data) => {
                return res.json({
                    msg: "موفق",
                    id: data.id,
                })
        }).catch((e)=>{
            console.log({e})
            return res.json({err : 'افزودن محصول فقط برای فروشندگان مقدور است \n اگر از فروشنده بودن خود اطمینان دارید لطفا بعدا مجددا امتحان فرمایید',e})
        })
    })
    .catch(()=>{
        return res.json({err : 'یوزر یافت نشد'})
    })

})

productsRoute.post("/update", authorizeMiddleware, async (req, res) => {
    const {
        id,
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
        quantity,
        cat_id,
        city_id,
        sendArea_list,
        unit,
        offPercent,
        offCount,
        freeDelivery,
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
                                        city : {
                                            connect : {
                                                id : city_id ?  Number(city_id) : 1160
                                            },
                                        },
                                        keywords : {
                                            createMany : {
                                                data : keyword_list.map(elm=>{
                                                    return (
                                                        {
                                                            name : elm.name
                                                        }
                                                    )
                                                })
                                            },
                                        },
                                        categorie : {
                                            connect : {
                                                id : cat_id ?  Number(cat_id) : 1
                                            }
                                        },
                                        off : {
                                            create : {
                                                off_count : offCount && offPercent ? Number(offCount) : 0,
                                                off_percent : offCount && offPercent ? Number(offPercent) : 0,
                                            }
                                        },
                                        // categorieID : Number(cat_id),
                                        sendArea : {
                                            connect : sendArea_list
                                        },
                                        unit : {
                                            connect : {
                                                id : unit ? Number(unit) : 1
                                            }
                                        },  
                                        customerPrice : Number(customerPrice),
                                        producerPrice : Number(producerPrice),
                                        price : Number(price),
                                        minOrder : minOrder ?  Number(minOrder) : 1,
                                        weight : weight ? String(weight) : '',
                                        describe : describe,
                                        title : title,
                                        deliveryTime : deliveryTime ?  String(deliveryTime).trim() : '1',
                                        packType : packType ? packType : "kg",
                                        freeDelivery : freeDelivery ? freeDelivery : false,
                                        quantity : quantity ? Number(quantity) : 1,
                                    },
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
        return res.json({ err: "محصول موجود نیست یا شما صاحب محصول نیستید" })
    }
})

productsRoute.post("/update-to-not-show", authorizeMiddleware, async (req, res) => {
    const {
        id,
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
                                        isShown : false
                                    }
                                }
                            }
                        }
                    }
                }
            })
                .then(async(data) => {
                    return res.json({
                        msg: "موفق",

                    })
                })
    } catch (err) {
        console.log(err)
        return res.json({ err: "محصول موجود نیست یا شما صاحب محصول نیستید" })
    }
})

productsRoute.post("/update-to-show", authorizeMiddleware, async (req, res) => {
    const {
        id,
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
                                        isShown : true
                                    }
                                }
                            }
                        }
                    }
                }
            })
                .then(async(data) => {
                    return res.json({
                        msg: "موفق",
                    })
                })
    } catch (err) {
        console.log(err)
        return res.json({ err: "محصول موجود نیست یا شما صاحب محصول نیستید" })
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
                    isShown : true,
                    productStatus : "accepted"
                },
                skip: Number(start) - 1,
                take: Number(length),
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
                    categorie: {
                        include : {
                            subCategory : {
                                include : {
                                    mainCategory : true
                                }
                            }
                        }
                    },
                },
                orderBy : {
                    addDate :'desc'
                }
            })
            .then((data) => {
                data.forEach(elm=>{
                    excludePass(elm?.author?.user,['password'])
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
    await prisma.user.findFirst({
        where : {
            phone : req.userData.userPhone
        },
        include : {
            sellerProfile : {
                select : {
                    products : {
                        include : {
                            city : true,
                            author : {
                                include : {
                                    user : {
                                        include : {
                                            profile : true
                                        }
                                    }
                                }
                            }
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

productsRoute.get("/mine-single", authorizeMiddleware, async (req, res) => {
    const {id} = req.query

    await prisma.product.findFirst({
        where : {
            id : Number(id),
            author : {
                user : {
                    phone : req.userData.userPhone
                }
            }
        }
    }).catch(()=>{
        return res.json({err : 'محصول موجود نیست یا شما صاحب محصول نمی باشید'})
    })
    
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
                            city : true,
                            author : {
                                include : {
                                    user : {
                                        include : {
                                            profile : true
                                        }
                                    }
                                }
                            },
                            categorie : true,
                            keywords : true,
                            off : true,
                            sendArea : true,
                            
                        },
                    }
                }
            }
        }
    }).then((resp)=>{
        return res.json(resp.sellerProfile.products.length == 0 ? {err  : 'محصولی یافت نشد یا شما صاحب محصول نمی باشید'} : resp.sellerProfile?.products?.at(0))
    }).catch((e)=>{
        return res.json({err : "اشکال در لود دیتا" , e})
    })
    

})

productsRoute.get("/saved-products", authorizeMiddleware, async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ err: "need both start and length query-params !" })


    await prisma.user.findFirst({
        where : {
            phone : req.userData.userPhone
        },
        include : {
            savedProducts : true,
        }
    }).then((resp)=>{
        return res.json(resp.savedProducts)
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
                        },
                    
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

productsRoute.get("/mine/all-status", authorizeMiddleware, async (req, res) => {
    
    const accepted = await prisma.user.findFirst({
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
    }).catch((e)=>{
        return res.json({err : "اشکال در لود دیتا" , e })
    })


    const rejected = await prisma.user.findFirst({
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
    }).catch((e)=>{
        return res.json({err : "اشکال در لود دیتا" , e })
    })


    const pending = await prisma.user.findFirst({
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
    }).catch((e)=>{
        return res.json({err : "اشکال در لود دیتا" , e })
    })


    try {
        const response = {accepted ,rejected,pending}
        return res.json(response)
    } 
    catch { 
        return res.json({err : 'خطا هنگام ارسال اطلاعات از سمت سرور'})
    }
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
                                profile : {
                                    select : {
                                        name : true,
                                        address : true
                                    }
                                }
                            },
                        },
                        date: true,
                        message: true,
                        repliedComments: true,
                    },
                },
                author: {
                    include : {
                        user : {
                            include : {
                                profile : {
                                    select : {
                                        family : true,
                                        name : true ,
                                    }
                                }
                            }
                        }
                    }
                },
                city : true,
                sendArea : true,
                keywords : true ,
                unit : true,
                off : true,
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
        excludePass(product.author,['phone'])
        excludePass(product.author.user,['phone'])
        excludePass(product.author.user,['password'])

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
