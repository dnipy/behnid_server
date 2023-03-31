import express from "express"
import { getRandomIntInclusive } from "../../../funcs/RandomInt.js"
import jwt from "jsonwebtoken"
import { VerifyNumber } from "../../../funcs/VerifyPhone.js"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { authorizeMiddleware } from "../../../middlewares/authorizeMiddleware.middlewares.js"
import { makeid } from "../../../funcs/PassGen.js"
import bycript from "bcrypt"
import  { CronJob } from "cron"
import cron from 'node-cron'
config()


const prisma = new PrismaClient()
const AuthRoute = express.Router()

AuthRoute.get("/", (req, res) => {
    console.log(process.env.ACCESS_TOKEN_SEC)
    res.json("/api/auth")
})

AuthRoute.post("/register", async (req, res) => {
    const { phone } = req.body
    if (phone?.length != 11)
        return res.json({ err: "لطفا شماره تلفن صحیح وارد کنید" })

    const user = await prisma.user.findFirst({ where: { phone: phone } })

    try {
        if (user != null) {
            return res.json({ err: "حساب کاربری به این نام موجود است" })
        } else {
            const Vcode = getRandomIntInclusive(100000, 999999)

            await prisma.passwdReg
                .upsert({
                    where: { phone },
                    update: { verifyCode: Vcode },
                    create: {
                        phone,
                        verifyCode: Vcode,
                    },
                })
                .then(() => {
                    VerifyNumber(phone, Vcode)
                    console.log(Vcode)
                   

                   

                    return res.json({ msg: "کد تایید ارسال شد" })
                })
                .catch(() => {
                    return res.json({ err: "مشکلی پیش آمده است" })
                })
        }
    } catch {
        return res.status(500).json({ err: "مشکلی در پنل اس ام اس پیش آمده" })
    }
})

AuthRoute.post("/register-confirm", async (req, res) => {
    const { phone, code } = req.body

    if (phone?.length != 11)
        return res.status(400).json({ err: "شماره تلفن وارد شده ۱۱ رقم نیست" })
    if (code?.length != 6)
        return res.status(400).json({ err: "کد وارد شده اشتباه است" })

    const codeGendb = await prisma.passwdReg
        .findFirst({
            where: {
                phone,
            },
        })
        .catch(() => {
            return res.json({ err: "اطلاعات وارد شده صحیح نمیباشد" })
        })

    if (code == codeGendb?.verifyCode) {
        const user = await prisma.user
            .create({ data: { phone: phone, password: "" , xp_score : 1500 } })
            .catch(() => {
                return res.json({ err: "مشکل در ساخت یوزر" })
            })
        console.log(user)
        const accessToken = jwt.sign(
            { userPhone: phone },
            process.env.ACCESS_TOKEN_SEC
        )
        return res.status(200).json({ accessToken })
    } else {
        return res.json({ err: "مشکلی پیش آمده است" })
    }

    // console.log(codeGen,code)
})

AuthRoute.post("/forgot-password", async (req, res) => {
    const { phone } = req.body
    if (phone?.length != 11)
        return res.json({ err: "شماره وارد شده اشتباه است" })

    const user = await prisma.user.findFirst({ where: { phone: phone } })

    try {
        if (user != null) {
            return res
                .status(401)
                .json({ err: "حساب کاربری به این نام موجود است" })
        } else {
            const Vcode = getRandomIntInclusive(100000, 999999)

            await prisma.passwdReset
                .upsert({
                    where: { phone },
                    update: { verifyCode: Vcode },
                    create: {
                        phone,
                        verifyCode: Vcode,
                    },
                })
                .then(() => {
                    VerifyNumber(phone, Vcode)
                    console.log(Vcode)
                    return res.json({ msg: "کد تایید ارسال شد" })
                })
                .catch(() => {
                    return res.json({ err: "مشکلی پیش آمده است" })
                })
        }
    } catch {
        return res.status(500).json({ err: "مشکلی در پنل اس ام اس پیش آمده" })
    }
})


AuthRoute.post("/forgot-confirm", async (req, res) => {
    const { phone, code, newPassword } = req.body

    if (phone?.length != 11) return res.status(400)
    if (code?.length != 6) return res.status(400)
    if (newPassword?.length < 8)
        return res.json({ err: "password under 8 length in not accepted!" })

    const codeGendb = await prisma.passwdReg
        .findFirst({
            where: {
                phone,
            },
        })
        .catch(() => {
            return res.json({ err: "اطلاعات وارد شده صحیح نمیباشد" })
        })

    if (code == codeGendb?.verifyCode) {
        const GenPass = getRandomIntInclusive(100000, 999999)
        await prisma.user
            .update({ where: { phone: phone }, data: { password: GenPass } })
            .catch(() => {
                return res.json({ err: "مشکل در اپدیت یوزر" })
            })
        return res.status(200).json({ newPass: GenPass })
    } else {
        return res.json({ err: "مشکلی پیش آمده است" })
    }
})


AuthRoute.post("/login", async (req, res) => {
    const { phone, password } = req.body
    console.log({ phone , password })

    if (phone?.length != 11)
        return res.json({ err: "شماره تلفن باید ۱۱ رقم باشد" })
    if (password?.length < 8)
        return res.json({ err: "رمز عبور باید بالای ۸ رقم باشد" })

    await prisma.user
        .findFirst({ where: { phone: phone } })
        .then(async(usr) => {

            const compare = await bycript.compare(password, usr.password)

            if (compare) {
                await prisma.user.update({where : {phone : usr.phone}, data : {isShown : true , status : true}})
                const accessToken = jwt.sign(
                    { userPhone: phone },
                    process.env.ACCESS_TOKEN_SEC
                )
                console.log(accessToken)
                return res.status(200).json({ accessToken })
            } else {
                return res.json({ err: "پسورد اشتباه است" })
            }
        })
        .catch((error) => {
            return res.json({ err: "یوزر پیدا نشد یا پسورد اشتباه است" , error })
        })
})

AuthRoute.post("/change-password", authorizeMiddleware, async (req, res) => {
    const { password, newPassword } = req.body
    const phone = req.userData?.userPhone

    if (password?.length < 8)
        return res.status(400).json({ err: "رمز قدیمی اشتباه است" })
    if (newPassword?.length < 8)
        return res
            .status(400)
            .json({ err: "رمز عبور  جدید باید بالای ۸ رقم باشد" })

    const usr = await prisma.user.findFirst({ where: { phone: phone } })
    const compare = await bycript.compare(password, usr.password)

        if (compare) {
            bycript.hash(newPassword,9,async(e,hash)=>{

                await prisma.user
                .update({
                    where: { phone: phone },
                    data: { password: hash , },
                })
                .then(() => {
                    return res.json({ msg: "موفق" })
                })
                .catch(() => {
                    return res.json({ err: "یوزر پیدا نشد" })
                })

            })
            } else {
                return res.json({ err: "پسورد وارد شده اشتباه است" })
            }
            
        })

AuthRoute.get("/check-access-token", authorizeMiddleware, async (req, res) => {
    const phone = req.userData?.userPhone

    await prisma.user
        .findUnique({
            where: {
                phone,
            },
            select: {
                id: true,
            },
        })
        .then((res) => {
            return res.json({ res })
        })
        .catch((e) => {
            return res.json({ err: "مشکلی پیش آمده است" })
        })
})

AuthRoute.post("/profile-setup", authorizeMiddleware, async (req, res) => {
    const phone = req.userData?.userPhone
    console.log(phone)
    const { password, name , lastname } = req.body

    if (!password) return res.json({ err: "پسورد لازم است" })
    if (!lastname) return res.json({ err: "نام خانوادگی لازم است" })
    if (!name) return res.json({ err: "نام لازم است" })

    if (password?.length < 8)
        return res.status(400).json({ err: "رمز وارد شده باید بالای 8 رقم باشد" })


    bycript.hash(password,9,async(e,hash)=>{
                if (e) return res.json({err : 'ارور هنگام انکود' , e })
                try {
                    await prisma.user
                        .update({
                            where: { phone: phone },
                            data: {
                                password : hash,

                                profile : {
                                    create : {
                                        name : name,
                                        family : lastname,
                                    }
                                },
                                sellerProfile : {
                                    create : {
                                        shopIntro : "",
                                        userPhone : phone
                                    }
                                }
                            },
                        })
                        .then(async () => {
                            console.log('done')
                            await prisma.connections.create({
                                data: {
                                    author: {
                                        connect: {
                                            phone: phone,
                                        },
                                    },
                                },
                            })
                        })
                        .then(() => {
                            return res.json({ msg: "موفق" })
                        })
                        .catch(() => {
                            return res.json({ err: "قبلا تنظیم شده" })
                        })
                } catch {
                    return res.status(500)
                }

    })
})

AuthRoute.post("/profile-setup-two", authorizeMiddleware, async (req, res) => {
    const phone = req.userData?.userPhone
    console.log(phone)
    const { workNumber, instaAcc, address, name, family } = req.body

    try {
        await prisma.user
            .update({
                where: { phone: String(phone).trim() },
                data: {
                    profile: {
                        create: {
                            workNumber: String(workNumber),
                            instaAcc: instaAcc,
                            address: address,
                            name: name,
                            family: family,
                        },
                    },
                },
            })
            .then(() => {
                return res.json({ msg: "موفق" })
            })
            .catch((e) => {
                return res.json({ err: "ارور" })
            })
    } catch {
        return res.status(500)
    }
})



// AuthRoute.post("/reset-password", async (req, res) => {
//     const { phone } = req.body
//     console.log(phone)

//     if (phone?.length != 11 )
//         return res.json({ err: "شماره تلفن اشتباه است" })
    

//     const user = await prisma.user.findFirst({ where: { phone: phone } })
//     if (!user) return res.json({err : "یوزری یافت نشد"})


//     const PassGen = makeid(6)
//     bycript.hash(PassGen,9,async(e,hash)=>{
//         if (e) return res.json({err : 'ارور هنگام انکود' , e })
//         try {
//             await prisma.user.update({
//                 where : {
//                     phone
//                 },
//                 data : {
//                     password : hash,
//                     status : true , 
//                     isShown : true
//                 }
//             }).then(()=>{
//                 VerifyNumber(phone,PassGen)
//                 return res.json({msg : 'موفق'})
//             }).catch(()=>{
//                 return res.json({err : "یوزر پیدا نشد   "})
//             })
//         } catch {
//             return res.json({ err: "ارور از سرور" })
//         }
//     })
// })



AuthRoute.post("/reset-password", async (req, res) => {
    const { phone } = req.body
    console.log(phone)

    if (phone?.length != 11 )
        return res.json({ err: "شماره تلفن اشتباه است" })
    

    const user = await prisma.user.findFirst({ where: { phone: phone } })
    if (!user) return res.json({err : "کاربری با این شماره یافت نشد"})

    const Vcode = getRandomIntInclusive(100000, 999999)


    // const PassGen = makeid(6)
    await prisma.passwdReset.upsert({
        where : {
            phone ,
        },
        update : {
            verifyCode : Vcode
        },
        create : {
            verifyCode : Vcode ,
            phone : phone,
        }
    }).then(()=>{
        VerifyNumber(phone,Vcode)
        return res.json({msg : 'کد تایید ارسال شد'})
    }).catch((e)=>{
        return res.json({err : 'خطا هنگام ارسال کد تایید', e})
    })
    
})


AuthRoute.post("/reset-password-confirm", async (req, res) => {
    const { phone , code , pass } = req.body
    console.log(phone)

    if (phone?.length != 11 )
        return res.json({ err: "شماره تلفن اشتباه است" })
    
    if (!pass || String(pass).length < 8) {
        return res.json({err : 'پسورد کوتاه است'})
    }

    const user = await prisma.user.findFirst({ where: { phone: phone } })
    if (!user) return res.json({err : "کاربری با این شماره یافت نشد"})



    // const PassGen = makeid(6)
    await prisma.passwdReset.findFirst({
        where : {
            phone ,
        },
    }).then((resp)=>{
        console.log(pass)
        if (resp.verifyCode == code)  {
            bycript.hash(pass,9,async(e,hash)=>{
                if (e){
                    return res.json({err : 'خطا هنگام ساخت پسورد'})
                } 
                else {

                    prisma.user.update({
                        where : {
                            phone
                        },
                        data : {
                            password : hash
                        }
                    }).then(()=>{
                        console.log('done')
                        return res.json({msg : 'پسورد با موفقیت تغییر پیدا کرد'})
                    }).catch((e)=>{
                        return res.json({err : 'خطا هنگام بروزرسانی پسورد'})
                    })
                }

            })

        }
        else {
            return res.json({err : 'کد ارسال شده اشتباه است'})
        }
    }).catch((e)=>{
        return res.json({err : 'خطا هنگام ارسال کد تایید', e})
    })
    
})

AuthRoute.post("/deactive", authorizeMiddleware ,async (req, res) => {
    const { password } = req.body
    const { userPhone } = req.userData

    await prisma.user
        .findFirst({ where: { phone: userPhone } })
        .then(async(usr) => {

            const compare = await bycript.compare(password, usr.password)

            if (compare) {
                await prisma.user.update({
                    where : {
                        phone : userPhone
                    },
                    data : {
                        isShown : false,
                        status : false
                    }
                }).then(()=>{
                    return res.status(200).json({ msg : 'موفق' })
                }).catch(()=>{
                    return res.json({err : 'امکان غیرفعال کردن حساب در این موقعیت وجود ندارد'})
                })
            } else {
                return res.json({ err: "پسورد اشتباه است" })
            }
        })
        .catch((error) => {
            return res.json({ err: "یوزر پیدا نشد یا پسورد اشتباه است" })
        })
})

AuthRoute.get("/logout",async(req,res)=>{
    return res.clearCookie('jwt').json({msg : 'موفق'})
})


export { AuthRoute }
