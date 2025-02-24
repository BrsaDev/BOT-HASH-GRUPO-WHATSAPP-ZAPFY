const axios = require("axios")


const instanceKey = ""
const instanceToken = ""
const baseUrl = `https://api.zapfy.me/v1/instance/${instanceKey}/token/${instanceToken}`
module.exports = {
    conectar_instance: async () => {
        try {
            let url = `${baseUrl}/connect`
            let qr = await axios.post(url)
            return qr.data.result
        }catch(erro) {
            return {erro}
        }
    },
    desconectar_instance: async () => {
        try {
            let url = `${baseUrl}/disconnect`
            let disconnect = await axios.post(url)
            return disconnect.data.result
        }catch(erro) {
            return {erro}
        }
    },
    status_instance: async () => {
        try {
            let url = `${baseUrl}/getState`
            let qr = await axios(url)
            return qr.data.result
        }catch(erro) {
            return {erro}
        }
        
    }
}



