const fs = require("fs")
const path = require('path')
const { get_info_wallet } = require("./services/tronscan")
const { google_info_wallets, google_consulta_transacao_wallet, google_insert_transacao_wallet } = require("./services/google")
const { zapfySendMessage } = require("./services/zapfy/message")
let { objWalletsClient, objTransacoes, controleAcesso } = require('./conexaoClienteCache')


function apenasZeros(valor) {
    zeros = ""
    for ( v of valor ) {
        if ( v == '0' ) {
            zeros += v
        }
    }
    return zeros.length == 6 ? ".000000" : '.' + valor
}
function parseValor(valor) {
    if ( valor.slice(0, -6).length == 6 ) {
        let final = apenasZeros(valor.slice(-6))
        return valor.slice(0, 3) +','+ valor.slice(3, 6) + final
    }
    if ( valor.slice(0, -6).length == 5 ) {
        let final = apenasZeros(valor.slice(-6))
        return valor.slice(0, 2) +','+ valor.slice(2, 5) + final
    }
    if ( valor.slice(0, -6).length == 4 ) {
        let final = apenasZeros(valor.slice(-6))
        return valor.slice(0, 1) +','+ valor.slice(1, 4) + final
    }
    if ( valor.slice(0, -6).length == 3 ) {
        let final = apenasZeros(valor.slice(-6))
        return valor.slice(0, 3) + final
    }
    if ( valor.slice(0, -6).length == 2 ) {
        let final = apenasZeros(valor.slice(-6))
        return valor.slice(0, 2) + final
    }
}
module.exports = {
    notificacao_transacao_financeira: async() => {
        let horas = {"10": true,"15": true,"18": true,"21": true,"23": true}
        let minutos = { "00": true, "01": true }
        let date = new Date()
        console.log('controle de acesso = ', controleAcesso)
        if ( typeof horas[date.getHours()] != "undefined" && typeof minutos[date.getMinutes] != "undefined" || Object.keys(objTransacoes).length == 0 || Object.keys(objWalletsClient).length == 0 ) {
            console.log('entrada - 1')
            let bdTransacoes = await google_consulta_transacao_wallet()
            objTransacoes = bdTransacoes.bd

            let clientes = await google_info_wallets()
            objWalletsClient = clientes.wallets
            console.log("\nAtualizados os dados em: ", date, "\n")

        }else if ( controleAcesso == 1 ) {
            console.log('entrada - 2')
            let transacoesWallet = await get_info_wallet()
            for ( let transacao  of transacoesWallet.transacoes ) {
                controleAcesso = 0

                if ( typeof objTransacoes[transacao.hash] == 'undefined' ) {
                    transacao.amount_parse = parseValor(transacao.amount)
                    if ( transacao.contract_ret == "SUCCESS" && transacao.confirmed == '1' && typeof objTransacoes[transacao.hash] == 'undefined' && typeof objWalletsClient[transacao.to] != 'undefined' && transacao.from == "TShYDnJ4RD77sHVuXUi62DBf4N1DuBVNeS" ) {
                        objTransacoes[transacao.hash] = true
                        console.log(transacao, '------1')
                        await zapfySendMessage(objWalletsClient[transacao.to].grupo, `$${transacao.amount_parse}\n\nhttps://tronscan.org/#/transaction/${transacao.hash}`) 
                        let response = await google_insert_transacao_wallet(transacao, objWalletsClient[transacao.to].nome, encodeURI(`https://tronscan.org/#/transaction/${transacao.hash}`))
                        // console.log(response)
                    }
                    if ( transacao.contract_ret == "SUCCESS" && transacao.confirmed == '1' && typeof objTransacoes[transacao.hash] == 'undefined' && transacao.to == "TShYDnJ4RD77sHVuXUi62DBf4N1DuBVNeS" ) {
                        objTransacoes[transacao.hash] = true
                        let response = await google_insert_transacao_wallet(transacao, objWalletsClient[transacao.to].nome, encodeURI(`https://tronscan.org/#/transaction/${transacao.hash}`))
                        console.log('\n\n-----ENTRADA NA CARTEIRA EMPRESA -------\n', transacao.hash, '\n\n')
                    }
                }
                controleAcesso = 1
            }        
        }
    },
    atualizaDadosDaPlanilha: async () => {
        try {
            console.log('entrada para atualizar dados da planilha em cache')
            let bdTransacoes = await google_consulta_transacao_wallet()
            objTransacoes = bdTransacoes.bd

            let clientes = await google_info_wallets()
            objWalletsClient = clientes.wallets
            return true
        }catch(erro) {
            return false
        }
        
    }
}

