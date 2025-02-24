const axios = require('axios')

module.exports = {
    google_infos_clientes: async () => {
        try {
            let response = await axios.get("https://script.google.com/macros/s/AKfycbz0dMKEr0OvNl0P3CdYQV0Yew0E2etA_jquJjLohwedzP9xHHgFbCb20BVCUf2QGQ3H/exec")
            return { data: response.data, erro: false }
        }catch(erro) {
            return { erro }
        }
    },
    google_include_cliente: async (id_grupo, taxa, numero_comandos) => {
        console.log('include => ', id_grupo, taxa, numero_comandos)
        try {
            let response = await axios.get("https://script.google.com/macros/s/AKfycbz0dMKEr0OvNl0P3CdYQV0Yew0E2etA_jquJjLohwedzP9xHHgFbCb20BVCUf2QGQ3H/exec?id_grupo="+id_grupo+"&numero_comandos="+numero_comandos+"&taxa="+taxa)
            if ( response.data.resultado == "OK" ) {
                return { resultado: "OK", erro: false }
            }
            return { erro: true }
        }catch(erro) {
            return { erro }
        }
    },
    google_salvar_transacao: async (dadosTransacao) => {
        try {
            let response = await axios.get(`https://script.google.com/macros/s/AKfycbzad9BjynbV28up5XEmunBrNj5Ekh-XDJjJNTuVc0XojfO-J0AsQJPBFSh7h0p9JBtZBw/exec?data=${dadosTransacao.data}&hora=${dadosTransacao.hora}&cliente=${dadosTransacao.cliente}&fluxo=${dadosTransacao.fluxo}&usdt=${dadosTransacao.usdt}&venda=${dadosTransacao.venda}&id_operacao=${dadosTransacao.id_operacao}`)
            if ( response.data.ultimoRegistro ) {
                return { ultimoRegistro: response.data.ultimoRegistro, erro: false }
            }
            return { erro: true }
        }catch(erro) {
            return { erro }
        }
    },
    google_cancelar_transacao: async (numeroTransacao) => {
        try {
            let response = await axios.get(`https://script.google.com/macros/s/AKfycbzad9BjynbV28up5XEmunBrNj5Ekh-XDJjJNTuVc0XojfO-J0AsQJPBFSh7h0p9JBtZBw/exec?cancel=${numeroTransacao}`)
            if ( response.data.cancelou == "SIM" ) {
                return { cancelou: response.data.cancelou, erro: false }
            }
            return { erro: true }
        }catch(erro) {
            return { erro }
        }
    },
    google_info_conta_banco: async (id_banco) => {
        try {
            let response = await axios.get("https://script.google.com/macros/s/AKfycbz0dMKEr0OvNl0P3CdYQV0Yew0E2etA_jquJjLohwedzP9xHHgFbCb20BVCUf2QGQ3H/exec?id_banco="+id_banco)
            if ( Object.keys(response.data.conta_banco).length > 0 ) {
                return { conta_banco: response.data.conta_banco, erro: false }
            }
            return { erro: true }
        }catch(erro) {
            return { erro }
        }
    },
    google_info_wallets: async () => {
        try {
            let response = await axios.get("https://script.google.com/macros/s/AKfycbz0dMKEr0OvNl0P3CdYQV0Yew0E2etA_jquJjLohwedzP9xHHgFbCb20BVCUf2QGQ3H/exec?wallet=true")
            if ( Object.keys(response.data.wallets).length > 0 ) {
                return { wallets: response.data.wallets, erro: false }
            }
            return { erro: true }
        }catch(erro) {
            return { erro }
        }
    },
    google_consulta_transacao_wallet: async () => {
        try {
            let response = await axios.get(`https://script.google.com/macros/s/AKfycbzad9BjynbV28up5XEmunBrNj5Ekh-XDJjJNTuVc0XojfO-J0AsQJPBFSh7h0p9JBtZBw/exec?consulta_wallet=true`)
            if ( response.data.bd ) { return { bd: response.data.bd, erro: false }}
            return { erro: true }
        }catch(erro) {
            return { erro }
        }
    },
    google_insert_transacao_wallet: async (obj, cliente, urlComprovante) => {
        try {
            let data = new Date(obj.block_timestamp)
            let response = await axios.get(`https://script.google.com/macros/s/AKfycbzad9BjynbV28up5XEmunBrNj5Ekh-XDJjJNTuVc0XojfO-J0AsQJPBFSh7h0p9JBtZBw/exec?gravar_wallet=true&de=${obj.from}&para=${obj.to}&amount=${obj.amount_parse}&hash=${obj.hash}&confirmed=${obj.confirmed}&data=${data}&cliente=${cliente}&urlComprovante=${urlComprovante}`)
            if ( response.data.insert ) { return { insert: true, erro: false }}
            return { erro: true }
        }catch(erro) {
            return { erro }
        }
    },
    google_consulta_escrita_dados_bd: async (cliente) => {
        try {
            let response = await axios.get(`https://script.google.com/macros/s/AKfycbzad9BjynbV28up5XEmunBrNj5Ekh-XDJjJNTuVc0XojfO-J0AsQJPBFSh7h0p9JBtZBw/exec?consulta_escrita=true&cliente=${cliente}`)
            if ( response.data.dados_escrita ) {
                return { dados_escrita: response.data.dados_escrita, erro: false }
            }
            return { erro: true }
        }catch(erro) {
            return { erro }
        }
    }
}