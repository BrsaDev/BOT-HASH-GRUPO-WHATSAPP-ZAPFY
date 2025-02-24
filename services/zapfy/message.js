const axios = require("axios")


const instanceKey = ""
const instanceToken = ""
const baseUrl = `https://api.zapfy.me/v1/instance/${instanceKey}/token/${instanceToken}`
module.exports = {
    zapfySendMessage: async (destination, message) => {
        try {
            let url = `${baseUrl}/message?type=text`
            let resultMessage = await axios.post(url, {
                text: message,//"https://tronscan.org/#/transaction/3fc8a3936782e192796cd9a3b2946d3d443985d4c8adf7ce037bfffaeb5ceba6\n\n10,000.000000",
                destination   //"+55 22 99223-8683"
            })
            console.log(resultMessage.data)
            return {resultado: resultMessage.data}
        }catch(erro) {
            return {erro}
        }
       
    }
}



