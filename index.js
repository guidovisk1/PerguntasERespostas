const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const connection = require('./database/database')
const Pergunta = require('./database/pergunta')
const Resposta = require('./database/resposta')


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
    Pergunta.findAll({raw: true, order:[
      ["id","DESC"] // ordem decrescente pelo mais novo id, ou seja, o maior pro meno - ASC = crescente
    ]}).then(perguntas =>{  //SELECT
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

app.get('/pergunta/:id', (req,res) => {
  var id = req.params.id

  Pergunta.findOne({
    where: {id: id}
  }).then(pergunta =>{
    if(pergunta != undefined){ // Achou uma pergunta

      Resposta.findAll({
        where: {perguntaId: pergunta.id},
        order: [['id','DESC']]
      }).then(respostas =>{
        res.render('pergunta',{
          pergunta: pergunta,
          respostas: respostas
      });
      });
    }else{
      res.redirect('/')
    }
  });
})

app.post('/responder', (req,res) =>{
  var corpo = req.body.corpo
  var perguntaId = req.body.pergunta

  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(()=>{
    res.redirect('/pergunta/'+perguntaId)
  })
})

app.listen(8181,()=>{console.log("Servidor funcionando")})