var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const consulta_tabelas = require('../consulta_tabelas')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , message: 'Hello there!'});
});


router.get('/mensagens/:dispositivo',async function(req, res, next){
	res.json(await consulta_tabelas.mensagem_mais_recente_do_dispositivo(req.params.dispositivo))
});

router.get('/dispositivos',async function(req, res, next){
	res.json(await consulta_tabelas.lista_de_dispositivos())
});

router.get('/regioes',async function(req, res, next){
	res.json(await consulta_tabelas.lista_de_regioes())
});

router.get('/eventos',async function(req, res, next){
	res.json(await consulta_tabelas.lista_de_eventos())
});

router.get('/registros',async function(req, res, next){
	res.json(await consulta_tabelas.lista_de_registros())
})

router.post('/cria_evento',async function(req, res, next){
	res.json(await consulta_tabelas.cria_evento(req.body))
})

router.post('/cria_regiao',async function(req, res, next){
	res.json(await consulta_tabelas.cria_regiao(req.body))
})

module.exports = router;
