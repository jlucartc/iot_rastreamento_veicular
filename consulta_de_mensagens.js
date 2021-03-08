const { Client } = require('pg')

Array.prototype.primeiro = function(){
	return this[0];
}

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

Client.prototype.ultima_mensagem_do_dispositivo = async function(dispositivo){
	resultados_da_consulta  = await this.query("SELECT * FROM mensagens WHERE dispositivo = $1 ORDER BY data DESC LIMIT 1",[dispositivo])
	this.end()
	return resultados_da_consulta
}

function cria_conexao_com_banco(){
	conexao_com_banco = new Client({host:'localhost',user:'luca',password:'123',database:'iot'});
	conexao_com_banco.connect()
	return conexao_com_banco
}

module.exports.mensagem_mais_recente_do_dispositivo = async function mensagem_mais_recente_do_dispositivo(dispositivo){
	conexao_com_banco = cria_conexao_com_banco()
	resultados_da_consulta = await conexao_com_banco.ultima_mensagem_do_dispositivo(dispositivo)
	if(resultados_da_consulta.rows.vazio()){
		return resultados_da_consulta.rows.json_vazio()
	}else{
		return resultados_da_consulta.rows.primeiro()
	}
}




