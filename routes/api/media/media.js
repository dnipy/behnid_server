import express from "express"
import { uploads } from "../../../middlewares/upload.js"
import { PrismaClient } from "@prisma/client"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"
import {
    company_authorize,
    Person_authorize,
} from "../../../configs/multiple_fields.js"
import { uploadAudio } from "../../../middlewares/voice_uploads.js"
import { uploadPdf } from "../../../middlewares/pdf_upload.js"

const mediaRoute = express.Router()
const prisma = new PrismaClient()

mediaRoute.get("/", (req, res) => {
    res.send("/api/media")
})

mediaRoute.post("/photo", uploads.single("up_file"), (req, res) => {
    return res.send("/" + req.file.path)
})

mediaRoute.post("/audio", uploadAudio.single("up_audio"), (req, res) => {
    return res.json({path : "/" + req.file.path})
})

mediaRoute.post("/pdf", uploadPdf.single("up_pdf"), (req, res) => {
    return res.json({path : "/" + req.file.path})
})

mediaRoute.post(
    "/authorize/sellers/person",
    authorizeMiddleware,
    uploads.fields(Person_authorize),
    async (req, res) => {
        const user_id = await prisma.user.findFirst({
            where: { phone: req?.userData?.userPhone },
        })

        // ! person_1 == تصویر کارت ملی
        // ! person_2 == تصویر متنی کارت ملی و تصویر شخص
        // ! person_3 == تصویر جواز کسب
        // ! person_4 == تصویر اجاره نامه یا سند کسب مالکیت محل کسب

        await prisma.sellerProfile
            .upsert({
                where: {
                    userID: user_id?.id,
                },
                update: {
                    sellerStatus: "pending",
                    sellerType: "person",
                    person_1: req.files.person_1
                        ? `/${req?.files?.person_1[0].path}`
                        : null,
                    person_2: req.files.person_2
                        ? `/${req?.files?.person_2[0].path}`
                        : null,
                    person_3: req.files.person_3
                        ? `/${req?.files?.person_3[0].path}`
                        : null,
                    person_4: req.files.person_4
                        ? `/${req?.files?.person_4[0].path}`
                        : null,
                },
                create: {
                    shopIntro: "",
                    sellerStatus: "pending",
                    sellerType: "person",
                    person_1: req.files.person_1
                        ? `/${req?.files?.person_1[0].path}`
                        : null,
                    person_2: req.files.person_2
                        ? `/${req?.files?.person_2[0].path}`
                        : null,
                    person_3: req.files.person_3
                        ? `/${req?.files?.person_3[0].path}`
                        : null,
                    person_4: req.files.person_4
                        ? `/${req?.files?.person_4[0].path}`
                        : null,
                    userID: user_id.id,
                },
            })
            .then((data) => {
                return res.json(data)
            })
            .catch((e) => {
                return res.json({ err: "ارور", e })
            })
    }
)

mediaRoute.post(
    "/authorize/sellers/company",
    authorizeMiddleware,
    uploads.fields(company_authorize),
    async (req, res) => {
        const user_id = await prisma.user.findFirst({
            where: { phone: req?.userData?.userPhone },
        })

        // ! company_1 == تصویر جواز تاسیس
        // ! company_2 == تصویر اساسنامه
        // ! company_3 == تصویر آخرین تغییرات روزنامه رسمی
        // ! company_4 == تصویر اجاره نامه یا سند کسب مالکیت محل کسب

        await prisma.sellerProfile
            .upsert({
                where: {
                    userID: user_id?.id,
                },
                update: {
                    sellerStatus: "pending",
                    sellerType: "company",
                    company_1: req.files.company_1
                        ? `/${req?.files?.company_1[0].path}`
                        : null,
                    company_2: req.files.company_2
                        ? `/${req?.files?.company_2[0].path}`
                        : null,
                    company_3: req.files.company_3
                        ? `/${req?.files?.company_3[0].path}`
                        : null,
                    company_4: req.files.company_4
                        ? `/${req?.files?.company_4[0].path}`
                        : null,
                },
                create: {
                    shopIntro: "",
                    sellerStatus: "pending",
                    sellerType: "company",
                    company_1: req.files.company_1
                        ? `/${req?.files?.company_1[0].path}`
                        : null,
                    company_2: req.files.company_2
                        ? `/${req?.files?.company_2[0].path}`
                        : null,
                    company_3: req.files.company_3
                        ? `/${req?.files?.company_3[0].path}`
                        : null,
                    company_4: req.files.company_4
                        ? `/${req?.files?.company_4[0].path}`
                        : null,
                    userID: user_id.id,
                },
            })
            .then((data) => {
                return res.json(data)
            })
            .catch((e) => {
                return res.json({ err: "ارور", e })
            })
    }
)

mediaRoute.post(
    "/photo/product",
    authorizeMiddleware,
    uploads.single("product_image"),
    async (req, res) => {
        const { productID } = req.query
        if (!productID) return res.json({ err: "need productID query" })
        if (!req.file?.path) return res.json({ err: "need file !" })
        console.log(req.file?.path)
        console.log(req.userData.userPhone)

        await prisma.user
            .update({
                where: {
                    phone: req.userData.userPhone,
                },
                data: {
                    products: {
                        update: {
                            where: {
                                id: Number(productID),
                            },
                            data: {
                                image: "/" + req.file?.path,
                            },
                        },
                    },
                },
            })
            .then(() => {
                return res.json({ msg: "تغییرات با موفقیت اعمال شد" })
            })
            .catch((e) => {
                return res.json({ err: "شما صاحب محصول نیستید", e })
            })
    }
)

mediaRoute.post(
    "/photo/avatar",
    authorizeMiddleware,
    uploads.single("profile_image"),
    async (req, res) => {
        if (!req.file?.path) return res.json({ err: "need file !" })
        console.log(req.file?.path)
        console.log(req.userData.userPhone)

        await prisma.user
            .update({
                where: {
                    phone: req.userData.userPhone,
                },
                data: {
                    avatar: "/" + req.file.path,
                },
            })
            .then(() => {
                return res
                    .status(200)
                    .json({ msg: "تغییرات با موفقیت اعمال شد", error: 0 })
            })
            .catch(() => {
                return res
                    .status(500)
                    .json({ msg: "اطلاعات وارد شده نامعتبر است", error: 1 })
            })
    }
)


mediaRoute.post(
    "/photo/story",
    authorizeMiddleware,
    uploads.single("story_image"),
    async (req, res) => {
        if (!req.file?.path) return res.json({ err: "need file !" })
        console.log(req.file?.path)
        console.log(req.userData.userPhone)

        await prisma.user
            .update({
                where: {
                    phone: req.userData.userPhone,
                },
                data: {
                    stories : {
                        create : {
                            imgSrc : "/" + req.file.path,
                        }
                    }
                },
            })
            .then(() => {
                return res
                    .status(200)
                    .json({ msg: "تغییرات با موفقیت اعمال شد", error: 0 })
            })
            .catch(() => {
                return res
                    .status(500)
                    .json({ msg: "اطلاعات وارد شده نامعتبر است", error: 1 })
            })
    }
)

mediaRoute.delete("/avatar/delete", authorizeMiddleware, async (req, res) => {
    await prisma.user
        .update({
            where: {
                phone: req.userData.userPhone,
            },
            data: {
                avatar: "",
            },
        })
        .then(() => {
            return res.status(200).json({ msg: "تغییرات با موفقیت اعمال شد" })
        })
        .catch(() => {
            return res.status(500).json({ err: "اطلاعات وارد شده نامعتبر است" })
        })
})

export { mediaRoute }
