import webpush from "web-push"
// import { sendNotif } from "../configs/webpush.js"
import crypto from 'crypto'
// import { sendNotif } from "../configs/webpush.js"

const indexController = (req, res) => {
        // return res.json(webpush.generateVAPIDKeys())
        // sendNotif().then((res)=>{
        //     console.log('sent notif done!')
        //     console.log(res)
        // }).catch((err)=>{
        //     console.log('sent notif err!')
        //     console.log(err)
        // })
        // webpush.setVapidDetails('dnipy@protonmail.co,',"BAunpsSIpYbTmBW2aEm6c2ov5KoX1XSyLOIV83prWsrh745rXwAxsP-iTgDVAUMkNXX0opyBxCGhY1h8V6DVjJ4","R2ua6vI5Ac5QbCBpTBKyqtr6AaufbbvwGS847pzfSiI")

        // const localKeysCurve = crypto.createECDH('prime256v1');
        // localKeysCurve.generateKeys();
        // return res.json({
        //     public : localKeysCurve.getPublicKey(),
        //     private : localKeysCurve.getPrivateKey()
        // })
        return res.json('index')


}

export { indexController }
