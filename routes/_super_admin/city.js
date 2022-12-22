import express from "express"
import { PrismaClient } from "@prisma/client"

const adminCityRoutes = express.Router()
const prisma = new PrismaClient()

adminCityRoutes.post("/add-city", async (req, res) => {
    const { name, provinceID } = req.body

    if (!name || !provinceID) return res.render("pages/server-response/error")

    await prisma.provience
        .update({
            where: {
                id: Number(provinceID),
            },
            data: {
                cities: {
                    create: {
                        name,
                    },
                },
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCityRoutes.post("/delete-city", async (req, res) => {
    const { cityId } = req.body

    if (!cityId) return res.render("pages/server-response/error")

    await prisma.city
        .delete({
            where: {
                id: Number(cityId),
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCityRoutes.post("/update-city", async (req, res) => {
    const { name, cityID } = req.body

    if (!name || !cityID) return res.render("pages/server-response/error")

    await prisma.city
        .update({
            where: {
                id: Number(cityID),
            },
            data: {
                name,
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCityRoutes.get("/all-city", async (req, res) => {
    await prisma.category
        .findMany({})
        .then((resp) => {
            return res.render("pages/server-response/succes", {
                categories: resp,
            })
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCityRoutes.get("/single-city", async (req, res) => {
    const { id } = req.query

    if (!id) return res.render("pages/server-response/error")

    await prisma.city
        .findUnique({
            where: {
                id: Number(id),
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes", {
                category: resp,
            })
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

//  ! end city
//  * start province

adminCityRoutes.post("/add-provience", async (req, res) => {
    const { name } = req.body

    if (!name) return res.render("pages/server-response/error")

    await prisma.provience
        .create({
            data: {
                name,
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCityRoutes.post("/delete-provience", async (req, res) => {
    const { provienceId } = req.body

    if (!provienceId) return res.render("pages/server-response/error")

    await prisma.city
        .delete({
            where: {
                id: Number(provienceId),
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCityRoutes.post("/update-provience", async (req, res) => {
    const { name, provienceID } = req.body

    if (!name || !provienceID) return res.render("pages/server-response/error")

    await prisma.city
        .update({
            where: {
                id: Number(provienceID),
            },
            data: {
                name,
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes")
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCityRoutes.get("/all-provience", async (req, res) => {
    await prisma.provience
        .findMany({})
        .then((resp) => {
            return res.render("pages/server-response/succes", {
                proviences: resp,
            })
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

adminCityRoutes.get("/single-provience", async (req, res) => {
    const { id } = req.query

    if (!id) return res.render("pages/server-response/error")

    await prisma.provience
        .findUnique({
            where: {
                id: Number(id),
            },
        })
        .then((resp) => {
            return res.render("pages/server-response/succes", {
                provience: resp,
            })
        })
        .catch((e) => {
            console.log(e)
            return res.render("pages/server-response/error")
        })
})

export { adminCityRoutes }
