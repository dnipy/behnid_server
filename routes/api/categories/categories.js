import express from "express"
import { PrismaClient } from "@prisma/client"
const categoriesRoute = express.Router()
const prisma = new PrismaClient()
categoriesRoute.get("/", (req, res) => {
    return res.send("/api/categories")
})

const categoriesList = {
    "مواد غذایی": {
        "کالای اساسی": [],
        لبنیات: [],
        "کنسرو و غذای آماده": [],
        چاشنی: [],
        نوشیدنی: [],
        تنقلات: [],
        "آجیل و شیرینی": [],
        کشاورزی: [],
    },

    "شستشو نظافت": {
        "بهداشت محیط": [],
        "شستشو لباس": [],
        "شستشو ظرف": [],
    },

    "آرایشی بهداشتی": {
        "بهداشت و مراقبت بدن": [],
        "بهداشت کودک": [],
        دستمال: [],
        "بهداشت بانوان": [],
        "اصلاح مو": [],
        آرایش: [],
    },

    "خانه و آشپزخانه": {
        منزل: [],
        آشپزخانه: [],
    },

    "برق و روشنایی": {
        خودرو: [],
        خانه: [],
    },

    "لوازم تحریر اداری": {
        "لوازم تحریر": [],
        "ملزومات اداری": [],
    },

    "سلامت محور": {
        "محصولات سلامت": [],
    },
    "بدون دسته بندی": {},
}

categoriesRoute.get("/all", async (req, res) => {
    await prisma.category
        .findMany({})
        .then((data) => {
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "خطا" })
        })
})


categoriesRoute.get("/all-sub", async (req, res) => {
    await prisma.subCategory
        .findMany({})
        .then((data) => {
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "خطا" })
        })
})


categoriesRoute.get("/all-main", async (req, res) => {
    await prisma.mainCategory
        .findMany({})
        .then((data) => {
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "خطا" })
        })
})

categoriesRoute.get("/all-city", async (req, res) => {
    await prisma.city
        .findMany({})
        .then((data) => {
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "خطا" })
        })
})


categoriesRoute.get("/all-proviences", async (req, res) => {
    await prisma.provience
        .findMany({})
        .then((data) => {
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "خطا" })
        })
})

categoriesRoute.get("/all-units", async (req, res) => {
    await prisma.unit
        .findMany({})
        .then((data) => {
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "خطا" })
        })
})

export { categoriesRoute }
