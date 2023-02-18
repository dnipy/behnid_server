import express from "express"
// import {io} from '../../index.js'
import { PrismaClient } from "@prisma/client"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"
import { uploads } from "../../../middlewares/upload.js"
import { uploadAudio } from "../../../middlewares/voice_uploads.js"
import { uploadPdf } from "../../../middlewares/pdf_upload.js"
import { excludePass } from "../../../funcs/ExcludePass.js"
import { lasthour } from "../../../funcs/last_h.js"

let prisma = new PrismaClient()

const chatRoute = express.Router()

chatRoute.get("/", (req, res) => {
    res.send("ok")
})

// chat routes

chatRoute.post("/newChat", authorizeMiddleware, async (req, res) => {
    const { userID } = req.body

    if (!userID) return res.json({ error: 1 })

    const my_id = await prisma.user
        .findUnique({ where: { phone: req.userData?.userPhone } })
        .catch((err) => {
            return res.json({ err: "ارور هنگام لود دیتا" })
        })

    const chat = await prisma.chats
        .findFirst({
            where: {
                OR: [
                    {
                        userOneId: Number(userID),
                        userTwoId: Number(my_id.id),
                    },
                    {
                        userOneId: Number(my_id.id),
                        userTwoId: Number(userID),
                    },
                ],
            },
            include: {
                message: true,
                userOne: {
                    include : {
                        profile : true
                    }
                },
                userTwo: {
                    include : {
                        profile : true
                    }
                },
            }
        })
        .catch((err) => {
            return res.json({ err: "2ارور هنگام لود دیتا" })
        })

    if (chat?.id) {
        excludePass(chat?.userOne,['password','phone'])
        excludePass(chat?.userTwo,['password','phone'])


        return res.json({
            id : chat.id,
            message: chat.message,
            userOne: chat.userOne,
            userTwo: chat.userTwo,
        })
    } else {
        await prisma.chats
            .create({
                data: {
                    userOne: {
                        connect: {
                            phone: req?.userData?.userPhone,
                        },
                    },
                    userTwo: {
                        connect: {
                            id: Number(userID),
                        },
                    },
                },
            })
            .then((resp) => {
                return res.json(resp)
            })
            .catch((e) => {
                return res.json({ e })
            })
    }
})






chatRoute.post("/newChat-with-number", authorizeMiddleware, async (req, res) => {
    const { userPhone } = req.body
    if (!userPhone) return res.json({ error: 1 })


    const my_id = await prisma.user
        .findUnique({ where: { phone: req.userData?.userPhone } })
        .catch((err) => {
            return res.json({ err: "ارور هنگام لود دیتا" })
    })
     
    const user_id = await prisma.user.findUnique({
        where : {
            phone : userPhone
        }
    }).catch((err) => {
        return res.json({ err: "یوزری با این شماره تلفن در بهنید یافت نشد" })
    })
    

    const chat = await prisma.chats
        .findFirst({
            where: {
                OR: [
                    {
                        userOneId: Number(user_id?.id),
                        userTwoId: Number(my_id?.id),
                    },
                    {
                        userOneId: Number(my_id?.id),
                        userTwoId: Number(user_id?.id),
                    },
                ],
            },
            include: {
                message: true,
                userOne: true,
                userTwo: true,
            }
        })
        .catch((err) => {
            return res.json({ err: "2ارور هنگام لود دیتا" })
        })

    if (chat?.id) {
        return res.json({
            id : chat.id,
            message: chat.message,
            userOne: chat.userOne,
            userTwo: chat.userTwo,
        })
    } else {
        await prisma.chats
            .create({
                data: {
                    userOne: {
                        connect: {
                            phone: req?.userData?.userPhone,
                        },
                    },
                    userTwo: {
                        connect: {
                            id: Number(user_id?.id),
                        },
                    },
                },
            })
            .then((resp) => {
                return res.json(resp)
            })
            .catch((e) => {
                return res.json({ e })
            })
    }
})


chatRoute.get("/my-chats", authorizeMiddleware, async (req, res) => {
    prisma.chats
        .findMany({
            where: {
                OR: [
                    {
                        userOne: {
                            phone: req?.userData?.userPhone,
                        },
                    },
                    {
                        userTwo: {
                            phone: req?.userData?.userPhone,
                        },
                    },
                ],
            },

            include: {
                userOne: {
                    include  : {
                        profile : true
                    }
                },
                userTwo: {
                    include : {
                        profile : true
                    }
                },
                message: {
                    distinct: ["date"],
                    orderBy: {
                        date: "desc",
                    },
                   
                },
            },
            orderBy : {
                message : {
                    _count  : 'desc'
                }
            }


        })
        .then((resp) => {
            if (!resp) return res.json({ err: "مکالمه ایی یافت نشد" })
            resp.forEach(elm=>{
                excludePass(elm.userOne,['password','phone'])
                excludePass(elm.userTwo,['password','phone'])
                elm.lastMessageText = elm.message.at(0)?.text ? elm.message.at(-1)?.text : ''
                elm.lastMessageDate = elm.message.at(0)?.date ? elm.message.at(-1)?.date : ''
            })
            const resp2 = resp.sort((elm_1 , elm_2)=> elm_1.message?.at(-1)?.date != elm_2.message?.at(-1)?.date )
            console.log(resp2)
            return res.json(resp2)
        })
        .catch((e) => {
            return res.status(500).json({ e })
        })
})



chatRoute.get("/my-contacts", authorizeMiddleware, async (req, res) => {
    await prisma.user
        .findFirst({
            where: {
                phone: req.userData.userPhone,
            },
            select: {
                contacts: true,
            },
        })
        .then(async(resp) => {
            const ContactsInBehnid = []
            const ContactNum = []
            let founded_users = []


            resp.contacts.forEach((elm)=>{
                if (elm.contactNumber.startsWith('+98')) {
                    const newWithoutCode = elm.contactNumber.slice(3)
                    const newNumber = `0${newWithoutCode}`
                    elm.contactNumber = newNumber;
                    ContactNum.push(newNumber)
                    ContactsInBehnid.push(elm)
                }
                else {
                    console.log(elm.contactNumber)
                    ContactNum.push(elm.contactNumber)
                    ContactsInBehnid.push(elm)
                }
            })

            await prisma.user.findMany({
                where : {
                    phone : {
                        in : ContactNum
                    }
                }
            }).then((users)=>{
                users.forEach(elm=>{
                    excludePass(elm,['password'])
                })
                founded_users = users
            })

            
            return res.json({contacts : ContactsInBehnid , founded_users})
        })
        .catch(() => {
            return res.json({ err: "خطا در پایگاه داده" })
        })
})

// message routes

chatRoute.post("/new-message", authorizeMiddleware, async (req, res) => {
    const { chatID, message, reciverID , replyedTo } = req.body

    if (!chatID || !message) return res.json({ error: 1 })

    console.log(req.body)

    await prisma.chats
        .update({
            where: {
                id: Number(chatID),
            },
            data: {
                message: {
                    create: {
                        sender: {
                            connect: {
                                phone: req?.userData?.userPhone,
                            },
                        },
                        reciever: {
                            connect: {
                                id: Number(reciverID),
                            },
                        },
                        text: message,
                        replyedTo : replyedTo ? replyedTo : null
                    },
                },
            },
            include: {
                message: true,
                userOne : true,
                userTwo : true
            },
        })
        .then((resp) => {
            excludePass(resp.userOne,['password'])
            excludePass(resp.userTwo,['password'])
            
            return res.json(resp.message?.at(-1))
        })
        .catch((e) => {
            return res.json({ err: "ارور در ساخت پیام" })
        })
})




chatRoute.post("/send-product", authorizeMiddleware, async (req, res) => {
    const { chatID, productID , reciverID  } = req.body

    if (!chatID || !productID , !reciverID ) return res.json({ error: "مقادیر وارد شده کافی نیست" })

    console.log(req.body)

    await prisma.chats
        .update({
            where: {
                id: Number(chatID),
            },
            data: {
                message: {
                    create: {
                        sender: {
                            connect: {
                                phone: req?.userData?.userPhone,
                            },
                        },
                        reciever: {
                            connect: {
                                id: Number(reciverID),
                            },
                        },
                        product : {
                            connect : {
                                id : Number(productID)
                            }
                        }
                    },
                },
            },
            include: {
                message: true,
                userOne : true,
                userTwo : true,
            },
        })
        .then((resp) => {
            excludePass(resp.userOne,['password'])
            excludePass(resp.userTwo,['password'])
            
            return res.json(resp)
        })
        .catch((e) => {
            return res.json({ err: "ارور در ساخت پیام" })
        })
})




chatRoute.post("/send-free-request", authorizeMiddleware, async (req, res) => {
    const { chatID, requestID , reciverID  } = req.body

    if (!chatID || !requestID , !reciverID ) return res.json({ error: "مقادیر وارد شده کافی نیست" })

    console.log(req.body)

    await prisma.chats
        .update({
            where: {
                id: Number(chatID),
            },
            data: {
                message: {
                    create: {
                        sender: {
                            connect: {
                                phone: req?.userData?.userPhone,
                            },
                        },
                        reciever: {
                            connect: {
                                id: Number(reciverID),
                            },
                        },
                        request : {
                            connect : {
                                id : Number(requestID)
                            }
                        }
                    },
                },
            },
            include: {
                message: true,
                userOne : true,
                userTwo : true,
            },
        })
        .then((resp) => {
            excludePass(resp.userOne,['password'])
            excludePass(resp.userTwo,['password'])
            
            return res.json(resp)
        })
        .catch((e) => {
            return res.json({ err: "ارور در ساخت پیام" })
        })
})




chatRoute.post("/like-message", authorizeMiddleware, async (req, res) => {
    const { chatID, messageID} = req.body

    if (!chatID || !messageID) return res.json({ error: 1 })

    console.log(req.body)

    prisma.chats
        .update({
            where: {
                id: Number(chatID),
            },
            data: {
                message: {
                    update : {
                        where : {
                            id : Number(messageID)
                        },
                        data : {
                            liked : true
                        }
                    }
                },
            },
            include: {
                message: true,
                userOne : true,
                userTwo : true
            },
        })
        .then((resp) => {
            excludePass(resp.userOne,['password'])
            excludePass(resp.userTwo,['password'])
            
            return res.json({msg : 'موفق'})
        })
        .catch((e) => {
            return res.json({ err: "ارور در ساخت پیام" })
        })
})


chatRoute.post('/edit-message',authorizeMiddleware,async(req,res)=>{
    const {userPhone} = req.userData
    const {msgID,new_msg} = req.body

    const message = await prisma.message.findFirst({
        where : {
            id : Number(msgID),
            date : {
                gte : lasthour
            }
        }
    }).catch((e)=>{
        return res.json({err : 'بیش از یک ساعت'})
    })


    
    if (message){
        await prisma.user.update({
            where : {
                phone : userPhone
            },
            data : {
                sender : {
                    update  : {
                        where : {
                            id : Number(msgID)
                        },
                        data : {
                            text : new_msg
                        }
                    }
                }
            }
        }).then(()=>{
            res.json({msg : 'موفق'})
        }).catch((e)=>{
            return res.json({err : 'مشکل'})
        })
    }
})


chatRoute.post('/delete-message',authorizeMiddleware,async(req,res)=>{
    const {userPhone} = req.userData
    const {msgID} = req.body

    const message = await prisma.message.findFirst({
        where : {
            id : Number(msgID),
            date : {
                gte : lasthour
            }
        }
    }).catch((e)=>{
        return res.json({err : 'بیش از یک ساعت'})
    })


    
    if (message){
        await prisma.user.update({
            where : {
                phone : userPhone
            },
            data : {
                sender : {
                    delete : {
                            id : Number(msgID)
                    }
                }
            }
        }).then(()=>{
            res.json({msg : 'موفق'})
        }).catch((e)=>{
            return res.json({err : 'مشکل'})
        })
    }
})



// +> /new-img-message
chatRoute.post(
    "/new-img-message",
    authorizeMiddleware,
    uploads.single("chat_image"),
    async (req, res) => {
        const { chatID , reciverID , caption , replyedTo } = req.body

        if (!chatID) return res.json({ err: 1 })
        if (!req.file?.path) return res.json({ err: " عکس مورد نیاز یافت نشد " })

        await prisma.chats
            .update({
                where: {
                    id: Number(chatID),
                },
                data: {
                    message: {
                        create: {
                            sender: {
                                connect: {
                                    phone: req?.userData?.userPhone,
                                },
                            },
                            reciever: {
                                connect: {
                                    id: Number(reciverID),
                                },
                            },
                            text: caption ? String(caption) : '',
                            image: "/" + req?.file?.path,
                            replyedTo : replyedTo ? Number(replyedTo) : null
                        },
                    },
                },
                include: {
                    message: true,
                },
            })
            .then((rsp) => {
                return res.json(rsp.message.at(-1))
            })
            .catch((e) => {
                return res.json({ err: "ارور در ساخت پیام", e })
            })
    }
)

// => /new-remittance-message
chatRoute.post(
    "/new-remittance-message",
    authorizeMiddleware,
    uploads.single("chat_remittance_image"),
    async (req, res) => {
        const { chatID , reciverID , caption , replyedTo } = req.body

        if (!chatID) return res.json({ err: 1 })
        if (!req.file?.path) return res.json({ err: " عکس مورد نیاز یافت نشد " })

        await prisma.chats
            .update({
                where: {
                    id: Number(chatID),
                },
                data: {
                    message: {
                        create: {
                            sender: {
                                connect: {
                                    phone: req?.userData?.userPhone,
                                },
                            },
                            reciever: {
                                connect: {
                                    id: Number(reciverID),
                                },
                            },
                            messageType : 'remittance',
                            text: caption ? String(caption) : '',
                            image: "/" + req?.file?.path,
                            replyedTo : replyedTo ? Number(replyedTo) : null
                        },
                    },
                },
                include: {
                    message: true,
                },
            })
            .then((rsp) => {
                return res.json(rsp.message.at(-1))
            })
            .catch((e) => {
                return res.json({ err: "ارور در ساخت پیام", e })
            })
    }
)

// => /new-audio-message
chatRoute.post(
    "/new-audio-message",
    authorizeMiddleware,
    uploadAudio.single("audio_image"),
    async (req, res) => {
        const { chatID, reciverID } = req.query

        if (!chatID) return res.json({ err: 1 })
        if (!req.file?.path) return res.json({ err: "فایل مورد نیاز " })

        await prisma.chats
            .update({
                where: {
                    id: Number(chatID),
                },
                data: {
                    message: {
                        create: {
                            sender: {
                                connect: {
                                    phone: req?.userData?.userPhone,
                                },
                            },
                            reciever: {
                                connect: {
                                    id: Number(reciverID),
                                },
                            },
                            text: "",
                            voice : "/" + req?.file?.path,
                        },
                    },
                },
                include: {
                    message: true,
                },
            })
            .then((rsp) => {
                return res.json(rsp)
            })
            .catch((e) => {
                return res.json({ err: "ارور در ساخت پیام", e })
            })
    }
)

// => /new-pdf-message
chatRoute.post(
    "/new-pdf-message",
    authorizeMiddleware,
    uploadPdf.single("pdf_file"),
    async (req, res) => {
        const { chatID, reciverID  , caption , replyedTo} = req.query

        if (!chatID) return res.json({ err: 1 })
        if (!req.file?.path) return res.json({ err: "فایل مورد نیاز " })

        await prisma.chats
            .update({
                where: {
                    id: Number(chatID),
                },
                data: {
                    message: {
                        create: {
                            sender: {
                                connect: {
                                    phone: req?.userData?.userPhone,
                                },
                            },
                            reciever: {
                                connect: {
                                    id: Number(reciverID),
                                },
                            },
                            text: caption ? String(caption) : '',
                            pdf : "/" + req?.file?.path,
                            replyedTo : replyedTo ? Number(replyedTo) : null
                        },
                    },
                },
                include: {
                    message: true,
                },
            })
            .then((rsp) => {
                return res.json(rsp)
            })
            .catch((e) => {
                return res.json({ err: "ارور در ساخت پیام", e })
            })
    }
)


chatRoute.get("/chat-messages", authorizeMiddleware, async (req, res) => {
    const { chatID } = req.query
    if (!chatID) return res.json({ error: 1 })

    const intChatID = parseInt(chatID)

    prisma.chats
        .findUnique({
            where: {
                id: intChatID,
            },
            include: {
                message: true,
                userOne: {
                    include : {
                        profile : {
                            select : {
                                name : true,
                                family : true
                            }
                        }
                    }
                },
                userTwo: {
                    include : {
                        profile : {
                            select : {
                                name : true,
                                family : true
                            }
                        }
                    }
                },
            },
        })
        .then((resp) => {
            excludePass(resp.userOne,['password'])
            excludePass(resp.userTwo,['password'])
            return res.json(resp)
        })
        .catch((e) => {
            return res.json({ e })
        })
})


chatRoute.get("/chat-remittance", authorizeMiddleware, async (req, res) => {
    const { chatID } = req.query
    if (!chatID) return res.json({ error: 1 })

    const intChatID = parseInt(chatID)

    prisma.chats
        .findFirst({
            where: {
                id: intChatID,
                message : {
                    every : {
                        messageType : 'remittance'
                    }
                }
            },
            include: {
                message: true,
                userOne: {
                    include : {
                        profile : {
                            select : {
                                name : true,
                                family : true
                            }
                        }
                    }
                },
                userTwo: {
                    include : {
                        profile : {
                            select : {
                                name : true,
                                family : true
                            }
                        }
                    }
                },
            },
        })
        .then((resp) => {
            excludePass(resp.userOne,['password'])
            excludePass(resp.userTwo,['password'])
            return res.json(resp)
        })
        .catch((e) => {
            return res.json({ e })
        })
})


chatRoute.post("/add-contacts", authorizeMiddleware, async (req, res) => {
    console.log(req.body)

    if (!req.body) return res.json({ err: "مخاطبی موجود نیست" })

    const user = await prisma.user.findUnique({
        where: { phone: req?.userData?.userPhone },
        include: { contacts: true },
    })

    if (user.contacts.length > 0) {
        await prisma.contacts.deleteMany({
            where: {
                user_Phone: req?.userData?.userPhone,
            },
        })
    }

    await prisma.user
        .update({
            where: { phone: req?.userData?.userPhone },
            data: {
                contacts: {
                    createMany: {
                        skipDuplicates: true,
                        data: req.body,
                    },
                },
            },
        })
        .then(() => {
            return res.json({ msg: "اضافه شد" })
        })
        .catch((e) => {
            return res.json({ err: "مشکل", e })
        })
})

chatRoute.post("/add-contact", authorizeMiddleware, async (req, res) => {
    const { contactName, contactNumber } = req.body

    if (!contactName || !contactNumber)
        return res.json({ err: "شماره و اسم مخاطب اجباری است" })

    await prisma.user
        .update({
            where: { phone: req?.userData?.userPhone },
            data: {
                contacts: {
                    create: {
                        contactName,
                        contactNumber,
                    },
                },
            },
        })
        .then(() => {
            return res.json({ msg: "اضافه شد" })
        })
        .catch((e) => {
            return res.json({ err: "مشکل", e })
        })
})







// ! GROUPS 




chatRoute.post("/newGroup", authorizeMiddleware, async (req, res) => {
    const {contact_numbers_list , name , describe} = req.body

    // contact_numbers_list = [ { phone : "09035095691" } ]

    const my_id = await prisma.user
        .findUnique({ where: { phone: req.userData?.userPhone } })
        .catch((err) => {
            return res.json({ err: "ارور هنگام لود دیتا" })
    })

    const chat = await prisma.chatGroup
        .findUnique({
            where: {
                group_Author_id : my_id?.id
            },
        })
        .catch((err) => {
            return res.json({ err: "2ارور هنگام لود دیتا" })
        })

    if (chat?.id) {
        return res.json({
            id : chat.id,
        })
    } else {
        await prisma.chatGroup
            .create({
                data: {
                    group_Author : {
                         connect : {
                            id : my_id?.id
                         }
                    },
                    group_members : {
                        connect : contact_numbers_list
                    },
                    
                    avatar : '',
                    describe : String(describe),
                    name : String(name)
                },
            })
            .then((resp) => {
                return res.json(resp)
            })
            .catch((e) => {
                return res.json({ err : 'ارور هنگام ایجاد گروه شما', e })
            })
    }
})


chatRoute.get("/my-groups", authorizeMiddleware, async (req, res) => {
    const my_id = await prisma.user
        .findUnique({ where: { phone: req.userData?.userPhone } })
        .catch((err) => {
            return res.json({ err: "ارور هنگام لود دیتا" })
    })

    await prisma.chatGroup
        .findMany({
            where: {
                OR: [
                    {
                        group_Author : {
                            id : my_id.id
                        },
                        group_members : {
                            some : {
                                id : my_id.id
                            }
                        }
                    }
                ],
            },

            include: {
                Messages: {
                    distinct: ["date"],
                    orderBy: {
                        date: "desc",
                    },
                    take: 1,
                },
            },
            orderBy : {
                messages : {
                    _count  : 'desc'
                }
            }
        })
        .then((resp) => {
            if (!resp) return res.json({ err: "یوزر پیدا نشد" })
            // resp.forEach(elm=>{
            //     excludePass(elm.,['password'])
            // })
            console.log({resp})
            // resp.sort((a,b)=>a.message.at(-1).date > b.message.at(-1).date)
            console.log({resp2 : resp})
            return res.json(resp)
        })
        .catch((e) => {
            return res.status(500).json({ e })
        })
})


export { chatRoute }
