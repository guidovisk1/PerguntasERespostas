const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const connection = require('./database/database')
const Pergunta = require('./database/pergunta')


//Conexão com o banco
connection.authenticate()
.then(() => { console.log('Conexão bem sucedida')})
.catch((err) =>{console.log('Erro')})

//Usar EJS
app.set('view engine','ejs')
app.use(express.static('public'))

//Body Parser - Pergar respostas do form
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//Rotas
app.get('/', (req,res) => {
    Pergunta.findAll({raw: true}).then(perguntas =>{  //SELECT
    console.log(perguntas)
    res.render('index',{
        perguntas: perguntas
    })
    })
})

app.get('/perguntar', (req,res) => {
    res.render('perguntar')
})

app.post('/salvarPerguntas', (req,res) => {

    var titulo = req.body.titulo  //Body Parser
    var descricao = req.body.descricao

  Pergunta.create({    // PUSH
    titulo: titulo,
    descricao: descricao
  }).then(()=>{
    res.redirect('/')
  })
})

app.listen(8181,()=>{console.log("Servidor funcionando")})