const express = require('express')
const fs = require('fs')
const path = require('path')
const { notificacao_transacao_financeira, atualizaDadosDaPlanilha } = require('./utilsTronscan')
const { conectar_instance, desconectar_instance } = require('./services/zapfy/instance')
var { controleAcesso, interval } = require('./conexaoClienteCache')
const { zapfySendMessage } = require("./services/zapfy/message")



try {
    let port = 3020
    const app = express()
    // app.use(express.limit(100000000));
    app.use(express.urlencoded({ extended: false, limit: '50mb' }))
    app.use(express.json({ limit: '50mb' }));
    app.use(express.static('pages'))

    app.get('/bot-hash', (req, res) => {
        return res.sendFile(path.join(__dirname, '/pages/home.html'))
    })

    app.post('/bot-hash/check-user-conect', async (req, res) => {
        let config = JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json')))
        if ( config.instancia_conectada ) {
            return res.json({ status: 'connected' })
        }
        return res.json({ status: 'disconnected' })
    })

    app.post('/bot-hash/iniciar-sessao', async (req, res) => {
        let resultado = await conectar_instance()
        return res.json({resultado})
    })

    app.post('/bot-hash/fechar-sessao', async (req, res) => {
        let disconnect = await desconectar_instance()
        if ( !disconnect.erro ) {
            return disconnect.state
        }
    })

    /**
     *  rota para recebimento das mensagens whatsapp
     */

    app.post('/bot-hash/new-message', async (req, res) => {
        console.log('\n-------INÍCIO ---------\n\n--------------- 1 =>', req.body)
        try{
            console.log('--------------- 2 =>', req.body.data)
        }catch(e){}
        try{
            console.log('--------------- 3 =>', req.body.data.message.conversation, '\n\n----- FIM ----------\n\n')
        }catch(e){}
        
        if ( req.body.type == "NEW-MESSAGE" ) {
            if ( typeof req.body.data.message.extendedTextMessage != "undefined" ) { req.body.data.message.conversation = req.body.data.message.extendedTextMessage.text }

            var participant = ""
            if ( req.body.data.key.participant.toString().includes(':') ) {
                participant = req.body.data.key.participant.toString().split(':')[0]
            }
            if ( participant == "" && req.body.data.key.participant.toString().includes('@') ) {
                participant = req.body.data.key.participant.toString().split('@')[0]
            }

            var id_grupo = ""
            // verifica se o id do grupo está presente
            if ( req.body.data.key.remoteJid.toString().includes('@g.us') ) { id_grupo = req.body.data.key.remoteJid }
            // else { var id_grupo = msg.to }

            // verifica de a mensagem está vindo de um grupo, senão para por aqui mesmo
            if ( !id_grupo.includes("@g.us") ) { 
                console.log('Não veio como grupo = ', msg.data.key.remoteJid, new Date(), '\n\n')
                return true 
            }

            if ( req.body.data.message.conversation == "/att" && participant == "551151945513" || req.body.data.message.conversation == "/att" && participant == "551151947618" || req.body.data.message.conversation == "/att" && participant == "554199848327" ) {
                let att = await atualizaDadosDaPlanilha()
                if ( att ) {
                    await zapfySendMessage(id_grupo, "*BOT HASH:* Atualização dos dados da planilha feito com sucesso.")
                }else {
                    await zapfySendMessage(id_grupo, "*BOT HASH:* Houve um erro ao atualizar os dados, espere um pouco e tente novamente.")
                }
            }
        }
        if ( req.body.type == 'INSTANCE-CONNECTED' ) {
            if ( !interval || Object.keys(interval).length == 0 ) {
                interval = setInterval(async function() {
                    try {
                        await notificacao_transacao_financeira(client)
                    }catch(e) {
                        console.log("Houve um erro nas notificações de transação para whatsapp =>\n", e); 
                        controleAcesso = 1
                    }
                }, 10000)
            }
            
            let config = JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json')))
            config.instancia_conectada = true
            fs.writeFileSync(path.join(__dirname, '/config.json'), JSON.stringify(config))
        }
        if ( req.body.type == 'INSTANCE-DISCONNECTED' ) {
            clearInterval(interval)
            interval = {}
            let config = JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json')))
            config.instancia_conectada = false
            fs.writeFileSync(path.join(__dirname, '/config.json'), JSON.stringify(config))
        }
        return res.status(200).send({receiver: "OK"})
    })

    app.get('/bot-hash/controle-acesso', (req, res) => {
        if ( msg.query.acao == "1" ) {
            controleAcesso = 1
            return res.status(200).json({resultado: "controle de acesso está setado para = ", controleAcesso})
        }
        return res.status(200).send("Requisição feita com sucesso, mas sem mudar configurações.")
    })

    app.listen(port, () => { console.log('Rodando as rotas na porta: ' + port) })

    process.on('SIGINT', (e) => { console.log(e); process.exit() })
    process.on('SIGQUIT', (e) => { console.log(e); process.exit() })
    process.on('SIGTERM', (e) => { console.log(e); process.exit() })
    process.on('exit', (code) => {
        let config = JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json')))
        fs.writeFileSync(path.join(__dirname, '/config.json'), JSON.stringify(config))
        console.log('Fechando o processo com o código: ', code);
    });
} catch (e) {
    process.on('SIGINT', (e) => { console.log(e); process.exit() })
    process.on('SIGQUIT', (e) => { console.log(e); process.exit() })
    process.on('SIGTERM', (e) => { console.log(e); process.exit() })
    process.on('exit', (code) => {
        let config = JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json')))
        fs.writeFileSync(path.join(__dirname, '/config.json'), JSON.stringify(config))
        console.log('Fechando o processo com o código: ', code);
    });
}


function formatarValor(valor, depoisVirgula=false) {
    if ( depoisVirgula ) var minimumFractionDigits = 2
    else var minimumFractionDigits = 0
    return valor.toLocaleString('pt-BR', { minimumFractionDigits });
}
