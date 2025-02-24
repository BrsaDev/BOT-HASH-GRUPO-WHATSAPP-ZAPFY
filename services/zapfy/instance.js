const axios = require("axios")


const instanceKey = "30c616e9-a091-46a9-9279-34a7a7f396d7"
const instanceToken = "ed14fa07-6014-42d1-aaed-fddcbfb670b3"
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



