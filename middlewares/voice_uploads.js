import multer from "multer"

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/voices/")
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


var uploadAudio = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "audio/wav" ||
            file.mimetype == "audio/webm" ||
            file.mimetype == "audio/ogg" ||
            file.mimetype == "audio/mp3"
           
        ) {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(
                JSON.stringify({
                    err: "Only .wav, .webm and .mp3 format allowed!",
                })
            )
        }
    },
})

export { uploadAudio }
