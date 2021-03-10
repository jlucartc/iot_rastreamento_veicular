const { Client } = require('pg')

Array.prototype.vazio = function(){
	if(this.length > 0){
		return false
	}else{
		return true
	}
}

Array.prototype.json_vazio = function(){
	return {}
}

async function executa_consulta(consulta,parametros){
	conexao_com_banco = cria_conexao_com_banco()
	resultados_da_consulta = await conexao_com_banco.query(consulta,parametros)
	conexao_com_banco.end()
	if(resultados_da_consulta.rows.vazio()){
		return resultados_da_consulta.rows.json_vazio()
	}else{
		return resultados_da_consulta.rows
	}
}

function cria_conexao_com_banco(){
	conexao_com_banco = new Client({host:'localhost',user:'luca',password:'123',database:'iot'});
	conexao_com_banco.connect()
	return conexao_com_banco
}

module.exports.mensagem_mais_recente_do_dispositivo = async function mensagem_mais_recente_do_dispositivo(dispositivo){
	consulta = "SELECT * FROM mensagens WHERE dispositivo = $1 ORDER BY data DESC LIMIT 1"
	parametros = [dispositivo]
	ultima_mensagem = await executa_consulta(consulta,parametros)
	return ultima_mensagem
}

module.exports.lista_de_dispositivos = async function lista_de_dispositivos(){
	consulta = "SELECT dispositivo FROM mensagens GROUP BY dispositivo"
	parametros = []
	lista = await executa_consulta(consulta,parametros)
	return lista
}

module.exports.lista_de_eventos = async function lista_de_eventos(){
	consulta = "SELECT eventos.id,eventos.nome FROM eventos GROUP BY eventos.id,eventos.nome"
	parametros = []
	lista = await executa_consulta(consulta,parametros)
	return lista
}
module.exports.lista_de_regioes = async function lista_de_regioes(){
	consulta = "SELECT regioes.id,regioes.nome FROM regioes GROUP BY regioes.id,regioes.nome"
	parametros = []
	lista = await executa_consulta(consulta,parametros)
	return lista
}

