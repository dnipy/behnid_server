import { Smsir } from "smsir-js"

const apiKEY =
    "iR5VZMbCZwDuIVhITGd5V2BgvYtwfkP3p8fhcjxKMQxuey7skCWvijyjYaVGvRxc"
const smsir = new Smsir(apiKEY, 10000003961)

function VerifyNumber(phone, Vcode) {
    smsir
        .SendVerifyCode(phone, 100000, [{ name: "CODE", value: Vcode }])
        .then((res) => console.log(res))
        .catch((e) => console.log(e))
}

export { VerifyNumber }
