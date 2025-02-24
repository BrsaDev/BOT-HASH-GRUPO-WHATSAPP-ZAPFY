const axios = require('axios')
const idCarteiraAntiga = ""
const idCarteiraAtual = ""
let baseUrl = `https://apilist.tronscanapi.com/api/transfer/trc20?address=${idCarteiraAtual}&trc20Id=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&start=0&limit=20&direction=0&reverse=true&db_version=1&start_timestamp=&end_timestamp=`
const token = "efbbba09-7ef4-44a4-88e2-08e1fc64a060"

module.exports = {
    get_info_wallet: async () => {
        try {
            const options = {
                headers: {
                    "TRON-PRO-API-KEY": token,
                }
            }
            let response = await axios.get(baseUrl, options)
            return { transacoes: response.data.data, erro: false }
        } catch (erro) {
            return { erro }
        }
    }
}

