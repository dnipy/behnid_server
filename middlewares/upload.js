import multer from "multer"

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        if (file) {
            cb(
                null,
                file.fieldname + "_" + Date.now() + "." + file.mimetype.slice(6)
            )
        } else {
            console.log("err")
        }
    },
})
var uploads = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(
                JSON.stringify({
                    err: "Only .png, .jpg and .jpeg format allowed!",
                })
            )
        }
    },
})

export { uploads }
