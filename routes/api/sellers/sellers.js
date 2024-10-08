import express from "express"
import { PrismaClient } from "@prisma/client"
import { excludePass } from "../../../funcs/ExcludePass.js"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"

const prisma = new PrismaClient()
const sellersRoute = express.Router()

sellersRoute.get("/", (req, res) => {
    res.send("/api/sellers")
})

sellersRoute.get("/all", async (req, res) => {
    const { start, length } = req.query
    if (!start || !length)
        return res.json({ err: "کوئری پارام های شروع و طول وارد نشده!" })

    await prisma.user
        .findMany({
            skip: parseInt(start) - 1,
            take: parseInt(length),
            where: {
                Role: "Seller"
            },
            include : {
                sellerProfile : true
            }
        })
        .then((data) => {
            data.forEach(elm=>{
                excludePass(elm,['password'])
            })
            return res.json(data)
        })
        .catch((e) => {
            return res.json({ err: e })
        })
})


sellersRoute.get("/single", async (req, res) => {
    const { SellerID } = req.query
    if (!SellerID) return res.json({ err: "آیدی فروشنده را وارد کنید" })


    await prisma.sellerProfile
        .findFirst({
            where: {
                id: Number(SellerID),
                // Role : "Seller"
            },
            include: {   
                // sellerProfile: {
                    // include : {
                        comments : {
                            include : {
                                commentAuthor : {
                                    include : {
                                        profile : true
                                    }
                                }
                            }
                        },
                        rates : true,
                        user : {
                            include : {
                                profile : true
                            }
                        },
                        products: {
                            include : {
                                city : true,
                                categorie : true,
                                unit : true,
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
                        
                //     }
                // },
                // profile: true,
                // freeRequests: {
                //     include: {
                //         categorie: true,
                //         city: true,
                //     },
                //     take: 3,
                // },
            },
        })
        .then((data) => {
            // console.log('data')
            data.products.forEach((elm)=>{
                excludePass(elm.author.user,['password','phone'])
            })
            data.comments.map((comment)=>{
                excludePass(comment.commentAuthor ,['password','phone'] )
            })
            excludePass(data.user,['password','phone'])
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "فروشنده مورد نظر موجود نمیباشد" })
        })
})


sellersRoute.get("/all-stories", authorizeMiddleware , async (req, res) => {

    await prisma.user
        .findFirst({
            where: {
                Role: "Seller",
                phone : req.userData.userPhone
            },
            include : {
                profile : true,
                sellerProfile : {
                    include : {
                        stories : {
                            include :{
                                product : {
                                    include : {
                                        city : true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        .then((data) => {
            excludePass(data,['password'])
            if (data.Role === 'Buyer') return res.json({err : 'شما فروشنده نیستید'})
            else {
                return res.json(data)
            }
        })
        .catch((e) => {
            return res.json({ err: e })
        })
})


sellersRoute.post("/delete-story", authorizeMiddleware , async (req, res) => {
    // const { start, length } = req.query
    // if (!start || !length)
    //     return res.json({ err: "کوئری پارام های شروع و طول وارد نشده!" })
    const {id} = req.body

    if (!id) return res.json({err : 'ایدی استوری وارد نشده است'})

    await prisma.user
        .update({
            where: {
                phone : req.userData.userPhone
            },
            data : {
                sellerProfile : {
                    update : {
                        stories : {
                            delete : {
                                id : Number(id)
                            }
                        }
                    }
                }
            }
        })
        .then(() => {
            return res.json({msg : 'موفق'})
        })
        .catch((e) => {
            return res.json({ err: 'خطا هنگام حذف استوری' })
        })
})

sellersRoute.get("/by-name", async (req, res) => {
    const { SellerName } = req.query
    if (!SellerName) return res.json({ err: "آیدی فروشنده را وارد کنید" })


    await prisma.sellerProfile
        .findFirst({
            where: {
                shopURLname : SellerName
                // Role : "Seller"
            },
            include: {   
                // sellerProfile: {
                    // include : {
                        comments : {
                            include : {
                                commentAuthor : {
                                    include : {
                                        profile : true
                                    }
                                }
                            }
                        },
                        rates : true,
                        user : {
                            include : {
                                profile : true
                            }
                        },
                        products: {
                            include : {
                                city : true,
                                categorie : true,
                                unit : true,
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
                        
                //     }
                // },
                // profile: true,
                // freeRequests: {
                //     include: {
                //         categorie: true,
                //         city: true,
                //     },
                //     take: 3,
                // },
            },
        })
        .then((data) => {
            // console.log('data')
            data.products.forEach((elm)=>{
                excludePass(elm.author.user,['password','phone'])
            })
            data.comments.map((comment)=>{
                excludePass(comment.commentAuthor ,['password','phone'] )
            })
            excludePass(data.user,['password','phone'])
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "فروشنده مورد نظر موجود نمیباشد" })
        })
})


sellersRoute.post("/rate",authorizeMiddleware,async (req, res) => {
    const { SellerID , rate } = req.body
    const { userPhone } = req?.userData
    if (!SellerID) return res.json({ err: "آیدی فروشنده را وارد کنید" })


        await prisma.ratesForSellers.create({
            data : {
                ratesAuthor : {
                    connect : {
                        phone : userPhone
                    }
                },
                seller :{
                    connect : {
                        id : Number(SellerID),
                    }
                },
                rates : String(rate)
            }
        })
        .then((data) => {
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "فروشنده مورد نظر موجود نمیباشد" })
        })
})


sellersRoute.post("/add-comment",authorizeMiddleware,async (req, res) => {
    const { SellerID , comment } = req.body
    const { userPhone } = req?.userData
    if (!SellerID) return res.json({ err: "آیدی فروشنده را وارد کنید" })


        await prisma.commentsForSellers.create({
            data : {
                seller : {
                    connect : {
                        id : Number(SellerID)
                    }
                },
                commentAuthor : {
                    connect : {
                        phone : userPhone
                    }
                },
                message : comment,
                
            },
            include : {
                commentAuthor : {
                     include : {
                         profile : true
                     }
                }
            }
        })
        .then((data) => {
            return res.json(data)
        })
        .catch((e) => {
            return res.json({ err: "فروشنده مورد نظر موجود نمیباشد",e })
        })
})


sellersRoute.post("/answer-comment",authorizeMiddleware,async (req, res) => {
    const { commentID , comment } = req.body
    const { userPhone } = req?.userData
    if (!commentID , !comment ) return res.json({err : "ایدی کامنت و متن کامنت لازم است"})

    const user = await prisma.user.findUnique({
        where : {
            phone : userPhone
        },
        include : {
            sellerProfile : true
        }
    })

    if (!user.sellerProfile?.id) return res.json({err : "شما صاحب فروشگاه نیستید"})
        
        await prisma.user.update({
            where : {
                phone : userPhone
            },
            data : {
                sellerProfile : {
                    // connect : {
                    //     userID : user.id
                    // },
                    update : {
                        comments : {
                            update : {
                                where : {
                                    id : Number(commentID)
                                },
                                data : {
                                    response : comment
                                }
                            }
                        }
                    }
                }
            }
        })
        .then((data) => {
            return res.json({msg : "موفق"})
        })
        .catch(() => {
            return res.json({ err: "فروشنده مورد نظر موجود نمیباشد" })
        })
})


sellersRoute.post("/add-city",authorizeMiddleware,async (req, res) => {
    const { SellerID , city_list } = req.body
    const { userPhone } = req?.userData
    if (!SellerID) return res.json({ err: "آیدی فروشنده را وارد کنید" })
    if (!city_list ) return res.json({err : "شهر انتخاب نشده"})

    const user = await prisma.user.findUnique({
        where : {
            phone : userPhone
        },
        include : {
            sellerProfile : true
        }
    })

    if (!user.sellerProfile.id) return res.json({err : "شما صاحب فروشگاه نیستید"})
        
        await prisma.user.update({
            where : {
                phone : userPhone
            },
            data : {
                sellerProfile : {
                    update : {
                        responseToCities : {
                            connect : city_list
                        }
                    }
                }
            }
        })
        .then((data) => {
            return res.json({msg : "موفق"})
        })
        .catch(() => {
            return res.json({ err: "فروشنده مورد نظر موجود نمیباشد" })
        })
})


sellersRoute.post("/add-cat",authorizeMiddleware,async (req, res) => {
    const { cat_list } = req.body
    const { userPhone } = req?.userData
    if (!cat_list ) return res.json({err : "دسته بندی انتخاب نشده"})

    console.log(cat_list)

    const user = await prisma.user.findUnique({
        where : {
            phone : userPhone
        },
        include : {
            sellerProfile : true
        }
    })

    const categories = await prisma.mainCategory.findUnique({
        where : {
            id : cat_list?.at(0)?.id
        },
        select : {
            name : true,
            subCategories : {
                select : {
                    categories : {
                        select : {id : true}
                    }
                }
            }
        }
    }).catch((err)=>{
        return res.json({err : 'خطا در پیدا کردن دسته بندی'})
    })

    const all_selected = []

    categories?.subCategories?.forEach(elm=>{
        // console.log(elm)
        elm?.categories?.forEach(sub_elm=>{
            all_selected.push(sub_elm)
        })
    })

    console.log(all_selected)

    if (!user.sellerProfile.id) return res.json({err : "شما صاحب فروشگاه نیستید"})
        
        await prisma.sellerProfile.update({
            where : {
                userPhone : userPhone
            },
            data : {
                ActivityCategory : {
                    set : all_selected
                }
            }
        })

        await prisma.user.update({
            where : {
                phone : userPhone
            },
            data : {
                sellerProfile : {
                    update : {
                       ActivityCategory : {
                           connect : all_selected
                       }
                    }
                }
            }
        })
        .then((data) => {
            return res.json({msg : "موفق"})
        })
        .catch(() => {
            return res.json({ err: "فروشنده مورد نظر موجود نمیباشد" })
        })
})


sellersRoute.post("/add-shop-name",authorizeMiddleware,async (req, res) => {
    const {  name } = req.body
    const { userPhone } = req?.userData
    if (!name ) return res.json({err : "نام فروشگاه انتخاب نشده"})

    const user = await prisma.user.findUnique({
        where : {
            phone : userPhone
        },
        include : {
            sellerProfile : true
        }
    })

    if (!user.sellerProfile.id) return res.json({err : "شما صاحب فروشگاه نیستید"})
        
        await prisma.user.update({
            where : {
                phone : userPhone
            },
            data : {
                sellerProfile : {
                    update : {
                        shopName : name,
                    }
                }
            }
        })
        .then((data) => {
            return res.json({msg : "موفق"})
        })
        .catch(() => {
            return res.json({ err: "فروشنده مورد نظر موجود نمیباشد" })
        })
})


sellersRoute.post("/add-shop-intro",authorizeMiddleware,async (req, res) => {
    const {  intro } = req.body
    const { userPhone } = req?.userData
    if (!intro || String(intro).length < 19 ) return res.json({err : "توضیحات فروشگاه باید بالای 20 رقم باشد"})

    const user = await prisma.user.findUnique({
        where : {
            phone : userPhone
        },
        include : {
            sellerProfile : true
        }
    })

    if (!user.sellerProfile.id) return res.json({err : "شما صاحب فروشگاه نیستید"})
        
        await prisma.user.update({
            where : {
                phone : userPhone
            },
            data : {
                sellerProfile : {
                    update : {
                        shopIntro : String(intro)
                    }
                }
            }
        })
        .then((data) => {
            return res.json({msg : "موفق"})
        })
        .catch(() => {
            return res.json({ err: "فروشنده مورد نظر موجود نمیباشد" })
        })
})


sellersRoute.post("/add-shop-url",authorizeMiddleware,async (req, res) => {
    const {  name } = req.body
    const { userPhone } = req?.userData

    if (!name || String(name).length < 3 ) return res.json({err : "نام فروشگاه انتخاب نشده یا کوتاه است"})

    
    const user = await prisma.user.findUnique({
        where : {
            phone : userPhone
        },
        include : {
            sellerProfile : true
        }
    })

    if (!user.sellerProfile.id) return res.json({err : "شما صاحب فروشگاه نیستید"})
        
        await prisma.user.update({
            where : {
                phone : userPhone
            },
            data : {
                sellerProfile : {
                    update : {
                        shopURLname : name,
                    }
                }
            }
        })
        .then((data) => {
            return res.json({msg : "موفق"})
        })
        .catch(() => {
            return res.json({ err: "نام دیگری انتخاب د" })
        })
})

sellersRoute.post("/add-shop",authorizeMiddleware,async (req, res) => {
    const {  shopName , shopId , bio } = req.body
    const { userPhone } = req?.userData

    if (!shopName || String(shopName).length < 4 ) return res.json({err : "نام فروشگاه انتخاب نشده یا کوتاه است"})
    if (!shopId || String(shopId).length < 4 ) return res.json({err : "آیدی فروشگاه انتخاب نشده یا کوتاه است"})
    if (!bio || String(bio).length < 4 ) return res.json({err : "بیوگرافی فروشگاه انتخاب نشده یا کوتاه است"})

    
    const user = await prisma.user.findUnique({
        where : {
            phone : userPhone
        },
        include : {
            sellerProfile : true
        }
    })

    await prisma.sellerProfile.findUnique({
        where : {
            shopURLname : shopId
        }
    }).then((data)=>{
        if (data?.shopURLname){
            return res.json({err : 'آیدی انتخاب شده در دسترس نمی باشد . لطفا آیدی دیگری انتخاب فرمایید'})
        }

    }).catch((err)=>{
        console.log(err)
    })

    if (!user.sellerProfile.id) return res.json({err : "شما صاحب فروشگاه نیستید"})
        await prisma.user.update({
            where : {
                phone : userPhone
            },
            data : {
                sellerProfile : {
                    update : {
                        shopURLname : String(shopId),
                        shopName : String(shopName),
                        shopIntro : String(bio)
                    }
                },
                Role :'Seller'
            } 
        })
        .then((data) => {
            return res.json({msg : "موفق"})
        })
        .catch(() => {
            return res.json({ err: "نام دیگری انتخاب د" })
        })
})



export { sellersRoute }
