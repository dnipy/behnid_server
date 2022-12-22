import { getRandomIntInclusive } from "../funcs/RandomInt"

function VcodeMid(req, res, next) {
    const code = getRandomIntInclusive(100000, 999999)
    req.GeneratedCode = code
    next
}
