const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

connection 
    .authenticate()
    .then(() => {
      console.log("conectado no banco com sucesso!")
    })
    .catch((msgError) =>{
      console.log(msgError);
    } )

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/", (req, res  ) => {
  Pergunta.findAll({raw: true, order:[
    ['id', 'DESC']
  ]}).then(pergunta =>{
    res.render("index",{
      pergunta: pergunta
    });
  });
  
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req,res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;

  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect("/perguntar");
  });
});

app.get("/pergunta/:id",(req, res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: {id: id}
    }).then(pergunta => {
      if(pergunta != undefined){

        Resposta.findAll({
          where: {perguntaId: pergunta.id},
          order:[['id','DESC']]
        }).then(resposta => {
          res.render("pergunta", {
            pergunta: pergunta,
            resposta: resposta
        });
        });
      }else{
        res.redirect("/");
      }
    })
});

app.post("/responder",(req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() =>{
    res.redirect("/pergunta/"+perguntaId);
  });

});

app.listen(8080,() => {
  console.log("APP Rodando");
});