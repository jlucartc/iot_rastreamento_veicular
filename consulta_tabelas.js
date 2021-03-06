const { Client,Pool } = require('pg')

const pool = new Pool({
	host:'127.0.0.1',
	user:'iot',
	password:'123',
	database:'iot'
})

Array.prototype.vazio = function(){
	if(this.length > 0){
		return false
	}else{
		return true
	}
}

Array.prototype.lista_vazia = function(){
	return []
}

async function executa_consulta(consulta,parametros){
	resultados_da_consulta = await pool.query(consulta,parametros)
	if(resultados_da_consulta.rows.vazio()){
		return resultados_da_consulta.rows.lista_vazia()
	}else{
		return resultados_da_consulta.rows
	}
}

module.exports.carrega_dados_da_aplicacao = async function carrega_dados_da_aplicacao(dados){
	dispositivos = await executa_consulta("select \"dispositivos\".dispositivo as \"dispositivo\",\"dispositivos_data\".data as \"data\",\"dispositivos_payload\".payload as \"payload\" from (select dispositivo from mensagens group by dispositivo) as \"dispositivos\" inner join (select dispositivo,max(data) as \"data\" from mensagens group by dispositivo) as \"dispositivos_data\" on \"dispositivos_data\".dispositivo = \"dispositivos\".dispositivo inner join (select * from mensagens) as \"dispositivos_payload\" on \"dispositivos_payload\".dispositivo = \"dispositivos_data\".dispositivo and \"dispositivos_payload\".data = \"dispositivos_data\".data")
	regioes = await executa_consulta("SELECT regioes.id,regioes.nome,(center(regioes.circulo))[0] as \"latitude\",(center(regioes.circulo))[1] as \"longitude\" FROM regioes")
	registros = await executa_consulta("SELECT * FROM registros")
	eventos = await executa_consulta("SELECT * FROM eventos")
	return {dispositivos: dispositivos,regioes: regioes,registros: registros,eventos: eventos}
}

module.exports.atualiza_status_do_dispositivo_na_regiao = async function atualiza_status_do_dispositivo_na_regiao(dados){
	consulta = "UPDATE regioes_dispositivos SET esta_na_regiao = $1 WHERE dispositivo = $2 AND regiao_id = $3"
	parametros = [dados.esta_na_regiao,dados.dispositivo,dados.regiao_id]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.insere_status_do_dispositivo_na_regiao = async function insere_status_do_dispositivo_na_regiao(dados){
	consulta = "INSERT INTO regioes_dispositivos (regiao_id,dispositivo,esta_na_regiao) VALUES ($1,$2,$3)"
	parametros = [dados.regiao_id,dados.dispositivo,dados.esta_na_regiao]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.emite_mensagem_de_evento = async function emite_mensagem_de_evento(dados){
	data = new Date()
	consulta = "INSERT INTO mensagens_eventos (evento_id,regiao_id,dispositivo,data) VALUES ($1,$2,$3,$4)"
	parametros = [dados.evento_id,dados.regiao_id,dados.dispositivo,new Date().toISOString()]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.checa_se_ha_eventos_de_entrada_na_regiao = async function checa_se_ha_eventos_de_entrada_na_regiao(dados){
	consulta = "SELECT eventos.id,eventos.nome,criterio_id,evento_id,regiao_id FROM eventos INNER JOIN registros ON evento_id = eventos.id WHERE registros.regiao_id = $1 AND eventos.criterio_id = 1"
	parametros = [dados.regiao_id]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.checa_se_ha_eventos_de_saida_na_regiao = async function checa_se_ha_eventos_de_saida_na_regiao(dados){
	consulta = "SELECT eventos.id,eventos.nome,criterio_id,evento_id,regiao_id FROM eventos INNER JOIN registros ON evento_id = eventos.id WHERE registros.regiao_id = $1 AND eventos.criterio_id = 2"
	parametros = [dados.regiao_id]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.regioes_onde_o_dispositivo_esta_e_nao_estava = async function regioes_onde_o_dispositivo_esta_e_nao_estava(dados){
	consulta = "SELECT * FROM regioes WHERE (regioes.id IN (SELECT regiao_id FROM regioes_dispositivos WHERE dispositivo = $1 and esta_na_regiao is false) OR regioes.id  NOT IN (SELECT regiao_id FROM regioes_dispositivos WHERE dispositivo = $2)) and NOT ST_IsEmpty(ST_Intersection(ST_Buffer(ST_Point((center(regioes.circulo))[0],(center(regioes.circulo))[1])::geography,radius(regioes.circulo)),ST_Point($3,$4))::geometry)"
	parametros = [dados.dispositivo,dados.dispositivo,dados.longitude,dados.latitude]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.regioes_onde_o_dispositivo_estava_e_nao_esta_mais = async function regioes_onde_o_dispositivo_estava_e_nao_esta_mais(dados){
	consulta = "SELECT * FROM regioes WHERE regioes.id IN (SELECT regiao_id FROM regioes_dispositivos WHERE dispositivo = $1 and esta_na_regiao is true) and ST_IsEmpty(ST_Intersection(ST_Buffer(ST_Point((center(regioes.circulo))[0],(center(regioes.circulo))[1])::geography,radius(regioes.circulo)),ST_Point($2,$3))::geometry)"
	parametros = [dados.dispositivo,dados.longitude,dados.latitude]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.cria_mensagem_de_evento = async function cria_mensagem_de_evento(dados){
	consulta = "INSERT INTO mensagens_eventos (evento_id,regiao_id,dispositivo,data) values ($1,$2,$3,$4)"
	parametros = [dados.evento_id,dados.regiao_id,dados.dispositivo,dados.data]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.procura_evento_registrado_em_regiao = async function procura_evento_registrado_em_regiao(dados){
	consulta  = "SELECT * FROM eventos INNER JOIN registros ON registros.evento_id = eventos.id WHERE registros.regiao_id = $1"
	parametros = [dados.regiao_id]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.recupera_estado_do_dispositivo_na_regiao = async function recupera_estado_do_dispositivo_na_regiao(dados){
	consulta  = "SELECT * FROM regioes_dispositivos where dispositivo = $1 and regiao_id = $2"
	parametros = [dados.dispositivo,dados.regiao_id]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.busca_mensagens_publicadas_apos_data = async function busca_mensagens_publicadas_apos_data(dados){
	consulta = "SELECT * FROM mensagens where mensagens.data > $1"
	parametros = [dados.ultima_consulta_em]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.busca_mensagens_de_evento_publicadas_apos_data = async function busca_mensagens_de_evento_publicadas_apos_data(dados){
	consulta = "SELECT mensagens_eventos.id,mensagens_eventos.dispositivo,mensagens_eventos.data,eventos.texto,eventos.nome as \"evento_nome\",regioes.nome as \"regiao_nome\" FROM mensagens_eventos INNER JOIN eventos ON eventos.id = evento_id INNER JOIN regioes ON regioes.id = regiao_id WHERE mensagens_eventos.data > $1"
	parametros = [dados.ultima_consulta_em]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.cria_evento = async function cria_evento(dados){
	consulta = "INSERT INTO eventos (nome,texto,criterio_id) VALUES ($1,$2,$3);"
	parametros = [dados.nome,dados.mensagem,dados.criterio_id]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
}

module.exports.cria_regiao = async function cria_regiao(dados){
	consulta = "INSERT INTO regioes (nome,circulo) VALUES ($1,Circle(Point($2,$3),$4));"
	parametros = [dados.nome,dados.longitude,dados.latitude,dados.raio]
	resultado = await executa_consulta(consulta,parametros)
	return resultado	
}

module.exports.cria_registro = async function cria_registro(dados){
	consulta = "INSERT INTO registros (evento_id,regiao_id) VALUES ($1,$2);"
	parametros = [dados.evento_id,dados.regiao_id]
	resultado = await executa_consulta(consulta,parametros)
	return resultado
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
	lista.map(function(dispositivo){ return {titulo: dispositivo.nome } })
	return lista
}

module.exports.lista_de_eventos = async function lista_de_eventos(){
	consulta = "SELECT eventos.id,eventos.nome FROM eventos GROUP BY eventos.id,eventos.nome"
	parametros = []
	lista = await executa_consulta(consulta,parametros)
	lista.map(function(evento){ return {titulo: evento.nome, id: evento.id} })
	return lista
}

module.exports.lista_de_regioes = async function lista_de_regioes(){
	consulta = "SELECT regioes.id,regioes.nome,ST_Y(center(regioes.circulo)::geometry) as \"latitude\",ST_X(center(regioes.circulo)::geometry) as \"longitude\",radius(regioes.circulo) as \"raio\" FROM regioes GROUP BY regioes.id,regioes.nome"
	parametros = []
	lista = await executa_consulta(consulta,parametros)
	lista.map(function(regiao){ return {titulo: regiao.nome, id: regiao.id, latitude: regiao.latitude, longitude: regiao.longitude} })
	return lista
}

module.exports.lista_de_registros = async function lista_de_registros(){
	consulta = "SELECT registros.id,eventos.nome as \"evento_nome\",regioes.nome as \"regiao_nome\" FROM registros INNER JOIN eventos ON eventos.id = evento_id INNER JOIN regioes ON regioes.id = regiao_id"
	parametros = []
	lista = await executa_consulta(consulta,parametros)
	lista.map(function(registro){ return {titulo: registro.nome, id: registro.id} })
	return lista
}

module.exports.lista_de_criterios = async function lista_de_criterios(){
	consulta = "SELECT criterios.id,criterios.nome FROM criterios"
	parametros = []
	lista = await executa_consulta(consulta,parametros)
	lista.map(function(criterio){ return {nome: criterio.nome, id: criterio.id} })
	return lista
}