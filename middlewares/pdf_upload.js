import multer from "multer"

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/pdf/")
    },
    filename: function (req, file, cb) {
        if (file) {
            cb(
                null,
                file.fieldname + "_" + Date.now() + "." + file.mimetype.split('/').at(1)
            )
        } else {
            console.log("err")
        }
    },
})


var uploadPdf = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf") {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(
                JSON.stringify({
                    err: "Only .pdf format allowed!",
                })
            )
        }
    },
})

export { uploadPdf }
