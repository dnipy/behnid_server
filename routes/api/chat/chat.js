import express from "express"
// import {io} from '../../index.js'
import { PrismaClient } from "@prisma/client"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"
import { uploads } from "../../../middlewares/upload.js"
import { uploadAudio } from "../../../middlewares/voice_uploads.js"
import { excludePass } from "../../../funcs/ExcludePass.js"

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
                userOne: true,
                userTwo: true,
                message: {
                    distinct: ["date"],
                    orderBy: {
                        date: "desc",
                    },
                    take: 1,
                },
            },
            orderBy : {
                message : {
                    _count  : 'desc'
                }
            }


        })
        .then((resp) => {
            if (!resp) return res.json({ err: "یوزر پیدا نشد" })
            resp.forEach(elm=>{
                excludePass(elm.userOne,['password'])
                excludePass(elm.userTwo,['password'])
            })
            console.log({resp})
            // resp.sort((a,b)=>a.message.at(-1).date > b.message.at(-1).date)
            console.log({resp2 : resp})
            return res.json(resp)
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
    const { chatID, message, reciverID } = req.body

    if (!chatID || !message) return res.json({ error: 1 })

    console.log(req.body)

    prisma.chats
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
            
            return res.json(resp)
        })
        .catch((e) => {
            return res.json({ err: "ارور در ساخت پیام" })
        })
})

chatRoute.post(
    "/new-img-message",
    authorizeMiddleware,
    uploads.single("chat_image"),
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
                            image: "/" + req?.file?.path,
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
                userOne: true,
                userTwo: true,
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

export { chatRoute }
