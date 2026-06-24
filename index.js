const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
const port = 3000
const NOME_ARQUIVO = path.join(__dirname, "bd.json")

function lerBancoDeDados() {
    // Se o arquivo não existir, cria com colchetes
    if (!fs.existsSync(NOME_ARQUIVO)) {
        fs.writeFileSync(NOME_ARQUIVO, "[]", "utf8")
        return []
    }
    
    let conteudo = fs.readFileSync(NOME_ARQUIVO, "utf8").trim()
    
    // CORREÇÃO DEFINITIVA: Se o arquivo existir mas estiver vazio, corrige gravando "[]"
    if (conteudo === "") {
        fs.writeFileSync(NOME_ARQUIVO, "[]", "utf8")
        return []
    }
    
    return JSON.parse(conteudo)
}

app.get("/clientes", (req, res) => {
    try {
        const bd = lerBancoDeDados()
        res.status(200).json(bd)
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao ler banco de dados: " + erro.message })
    }
})

app.get("/clientes/:cpf", (req, res) => {
    const cpf = req.params.cpf
    try {
        const bd = lerBancoDeDados()
        const cliente = bd.find((cliente) => cliente.cpf == cpf)
        if (!cliente) {
            return res.status(404).json({ erro: "Cliente não existe no BD!" })
        }
        res.status(200).json({ resposta: cliente })
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar cliente: " + erro.message })
    }
})

app.listen(port, () => {
    console.log("-----------------------------------------")
    console.log(" API rodando com sucesso!")
    console.log(` Acesse no navegador: http://localhost:${port}/clientes`)
    console.log("-----------------------------------------")
})


