import express from "express"
import { PrismaClient } from "@prisma/client"
const categoriesRoute = express.Router()
const prisma = new PrismaClient()
categoriesRoute.get("/", (req, res) => {
    return res.send("/api/categories")
})


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


categoriesRoute.get("/whole-country", async (req, res) => {
    await prisma.provience
        .findMany({
            include : {
                cities : {
                    select : {
                        id : true , 
                        name : true
                    }
                }
            }
        })
        .then((data) => {
            return res.json(data)
        })
        .catch(() => {
            return res.json({ err: "خطا" })
        })
})


categoriesRoute.get("/whole-categories", async (req, res) => {
    await prisma.mainCategory
        .findMany({
            include : {
               subCategories : {
                   include : {
                       categories : true
                   }
               }
            }
        })
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
