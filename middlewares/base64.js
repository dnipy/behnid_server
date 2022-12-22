import fs from "fs"
export const uploadImage = async (req, res) => {
    try {
        // to declare some path to store your converted image
        const path = `./uploads/${Date.now()}.png`
        console.log({ path })

        const imgdata = req.body.base64image

        // to convert base64 format into random filename
        const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "")

        fs.writeFileSync(path, base64Data, { encoding: "base64" })

        return res.json(path)
    } catch (e) {
        return res.json({ 1: "err", e })
    }
}
