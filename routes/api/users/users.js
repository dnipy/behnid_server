import express from "express"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { excludePass } from "../../../funcs/ExcludePass.js"
import { lastDay } from '../../../funcs/last-24-h.js'
import { Categories , Cities , MainCategories , SubCategories , proviences  } from "../../../static/_index.js"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"

config()

const usersRoute = express.Router()
const prisma = new PrismaClient()

usersRoute.get("/", (req, res) => {
    res.send("/api/users")
})

usersRoute.get("/all", async (req, res) => {
    const { start, length } = req.query

    if (!start || !length)
        return res.json({ msg: "کوئری پارامتر های شروع و پایان اجباری است" })

    await prisma.user.findMany({
        where : {
            isShown : true
        },
        skip: parseInt(start) - 1,
        take: parseInt(length),
    }).then(data=>{
        data.forEach(elm=>{
            excludePass(elm,['password'])
        })
        return res.json(data)
    }).catch(()=>{
        return res.json({err : '500'})
    })
})






usersRoute.get("/single", authorizeMiddleware ,async (req, res) => {
    const { userID } = req.query
    const { userPhone } = req?.userData

    if (!userID) return res.json({ err: "یوزر ایدی را وارد کنید" })
    const intUserId = parseInt(userID)
    await prisma.user.findFirst({
        where: {
                 id: intUserId ,
        },
        include : {
            connection : {
                include : {
                    follower :{
                        select : {
                            id : true,
                            phone : true
                        }
                    },
                    following :{
                        select : {
                            id : true
                        }
                    },
                }
            },
            profile : {
                select : {
                    name : true,
                    family : true
                }
            },
            freeRequests : {
                take : 3,
                include : {
                    city : true
                } 
            },
            sellerProfile : {
                include : {
                    products : {
                        include : {
                            city : true,
                            unit : true,
                        }
                    }
                }
            },
            
        }
    }).then(data=>{
        excludePass(data,['password'])
        data.connection.follower.forEach(elm=>{
            excludePass(elm,['password'])
        })
        data.connection.following.forEach(elm=>{
            excludePass(elm,['password'])
        })
        data?.connection?.follower?.forEach((elm)=>{
            if (elm.phone == userPhone) {
                data.FollowedByME = true
                excludePass(elm,['phone'])
            }
            else {
                data.FollowedByME = false
                excludePass(elm,['phone'])
            }
        })
        return res.json(data)
    }).catch(()=>{
        return res.json({err : 'کاربری پیدا نشد'})
    })
})


usersRoute.get("/single/mine", authorizeMiddleware ,async (req, res) => {
    const { userPhone } = req?.userData

    await prisma.user.findFirst({
        where: {
                 phone : userPhone
        },
        include : {
            connection : {
                include : {
                    follower :{
                        select : {
                            id : true,
                            phone : true
                        }
                    },
                    following :{
                        select : {
                            id : true
                        }
                    },
                }
            },
            profile : {
                select : {
                    name : true,
                    family : true
                }
            },
            freeRequests : {
                take : 3,
                include : {
                    city : true
                } 
            },
            sellerProfile : {
                include : {
                    products : {
                        include : {
                            city : true,
                            unit : true,
                        }
                    }
                }
            },
            
        }
    }).then(data=>{
        excludePass(data,['password'])
        data.connection.follower.forEach(elm=>{
            excludePass(elm,['password'])
        })
        data.connection.following.forEach(elm=>{
            excludePass(elm,['password'])
        })
        data?.connection?.follower?.forEach((elm)=>{
            if (elm.phone == userPhone) {
                data.FollowedByME = true
                excludePass(elm,['phone'])
            }
            else {
                data.FollowedByME = false
                excludePass(elm,['phone'])
            }
        })
        return res.json(data)
    }).catch(()=>{
        return res.json({err : 'کاربری پیدا نشد'})
    })
})


usersRoute.get("/story", async (req, res) => {
    const { userID } = req.query

    if (!userID) return res.json({ err: "یوزر ایدی را وارد کنید" })
    const intUserId = parseInt(userID)

    const user = await  prisma.user.findFirst({
        where : {
            id : intUserId
        }
    }).catch((err)=>{
        return res.json({err : 'کاربری یافت نشد',role : 'Not-Found'})
    })

    if (user?.Role == "Buyer") {
        console.log(user?.Role)
        return res.json({err : 'استوری یافت نشد',role : 'Buyer'})
    }

    await prisma.user.findFirst({
        where: {
                 id: intUserId ,
        },
        include : {
            sellerProfile : {
                include : {
                    stories : {
                        where : {
                            date : {
                                gte : new Date(lastDay).toISOString()
                            },
                        },
                        include : {
                            product : {
                                include : {
                                    city : true
                                }
                            },    
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
    }).then(data=>{
        console.log('err')
        // excludePass(data,['password'])
        return res.json(data?.sellerProfile?.stories)
    }).catch((e)=>{
        console.log(e)
        return res.json({err : 'خطا در لود استوری'})
    })
})

usersRoute.delete("/delete", async (req, res) => {
    const { userID } = req.query

    if (!userID) return res.json({ err: "ایدی وارد نشده است" })

    await prisma.user
        .update({
            where: {
                id: Number(id),
            },
            data : {
                isShown : false
            }
        }).then(()=>{
            return res.json({msg : 'موفق'})
        })
        .catch(() => {
            return res.send("کاربری با مشخصات زیر موجود نیست")
        })
})

usersRoute.get('/add-prov',async(req,res)=>{
    await prisma.provience.createMany({
        data : proviences
    }).then(resp=>{
        return res.json({resp})
    }).catch((err)=>{
        return res.json({err})    
    }) 
})


usersRoute.get('/add-city',async(req,res)=>{
    await prisma.city.createMany({
        data : Cities,
    }).then(resp=>{
        return res.json({resp})
    }).catch((err)=>{
        return res.json({err})    
    }) 
})


usersRoute.get('/add-main-cat',async(req,res)=>{
    await prisma.mainCategory.createMany({
        data : MainCategories,
    }).then(resp=>{
        return res.json({resp})
    }).catch((err)=>{
        return res.json({err})    
    }) 
})


usersRoute.get('/add-sub-cat',async(req,res)=>{
    await prisma.subCategory.createMany({
        data : SubCategories,
    }).then(resp=>{
        return res.json({resp})
    }).catch((err)=>{
        return res.json({err})    
    }) 
})



usersRoute.get('/add-down-cat',async(req,res)=>{
    await prisma.category.createMany({
        data : Categories,
    }).then(resp=>{
        return res.json({resp})
    }).catch((err)=>{
        return res.json({err})    
    }) 
})




export { usersRoute }
