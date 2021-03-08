var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const consulta_de_mensagens = require('../consulta_de_mensagens')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , message: 'Hello there!'});
});


router.get('/mensagens/:dispositivo',async function(req, res, next){
	res.json(await consulta_de_mensagens.mensagem_mais_recente_do_dispositivo(req.params.dispositivo))
});

module.exports = router;
