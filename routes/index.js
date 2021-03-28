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

router.get('/criterios',async function(req, res, next){
	res.json(await consulta_tabelas.lista_de_criterios())
})

router.post('/cadastra_evento',async function(req, res, next){
	res.json(await consulta_tabelas.cria_evento(req.body))
})

router.post('/cadastra_regiao',async function(req, res, next){
	res.json(await consulta_tabelas.cria_regiao(req.body))
})

router.post('/cadastra_registro',async function(req, res, next){
	res.json(await consulta_tabelas.cria_registro(req.body))
})

router.post('/busca_novas_mensagens',async function(req, res, next){
	res.json(await consulta_tabelas.busca_mensagens_publicadas_apos_data(req.body))
})

router.post('/cria_mensagem_de_evento',async function(req, res, next){
	res.json(await consulta_tabelas.cria_mensagem_de_evento(req.body))
})

router.post('/procura_evento_registrado_em_regiao',async function(req, res, next){
	res.json(await consulta_tabelas.procura_evento_registrado_em_regiao(req.body))
})

router.post('/procura_regioes_que_contem_ponto',async function(req, res, next){
	res.json(await consulta_tabelas.procura_regioes_que_contem_ponto(req.body))
})

router.post('/busca_mensagens_publicadas_apos_data',async function(req, res, next){
	res.json(await consulta_tabelas.busca_mensagens_publicadas_apos_data(req.body))
})

router.post('/recupera_estado_do_dispositivo_na_regiao',async function(req, res, next){
	res.json(await consulta_tabelas.recupera_estado_do_dispositivo_na_regiao(req.body))
})

router.post('/regioes_onde_o_dispositivo_esta_e_nao_estava',async function(req, res, next){
	res.json(await consulta_tabelas.regioes_onde_o_dispositivo_esta_e_nao_estava(req.body))
})

router.post('/regioes_onde_o_dispositivo_estava_e_nao_esta_mais',async function(req, res, next){
	res.json(await consulta_tabelas.regioes_onde_o_dispositivo_estava_e_nao_esta_mais(req.body))
})

router.post('/checa_se_ha_eventos_de_entrada_na_regiao',async function(req, res, next){
	res.json(await consulta_tabelas.checa_se_ha_eventos_de_entrada_na_regiao(req.body))
})

router.post('/checa_se_ha_eventos_de_saida_na_regiao',async function(req, res, next){
	res.json(await consulta_tabelas.checa_se_ha_eventos_de_saida_na_regiao(req.body))
})

router.post('/emite_mensagem_de_evento',async function(req, res, next){
	res.json(await consulta_tabelas.emite_mensagem_de_evento(req.body))
})

router.post('/insere_status_do_dispositivo_na_regiao',async function(req, res, next){
	res.json(await consulta_tabelas.insere_status_do_dispositivo_na_regiao(req.body))
})

module.exports = router;
