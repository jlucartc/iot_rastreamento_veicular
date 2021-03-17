var mapa = undefined
var regioes = undefined
var eventos = undefined
var dispositivos = undefined
var data_ultima_consulta = undefined
var ultima_posicao = undefined
var nova_regiao = undefined
var novo_evento = undefined
var novo_registro = undefined
var formulario_de_registro = undefined
var formulario_de_regiao = undefined
var formulario_de_evento = undefined
var flag_criando_regiao = undefined
var regiao = undefined

function dados_do_evento(){
	var dados = {nome: undefined, regiao_id: undefined, criterio_id: undefined, mensagem: undefined}
	var input_do_nome = document.querySelector('input.formulario-evento-nome')
	var input_da_regiao = document.querySelector('select.formulario-evento-regiao')
	var input_do_criterio = document.querySelector('select.formulario-evento-criterio')
	var input_da_mensagem = document.querySelector('textarea.formulario-evento-mensagem')

	if(input_do_nome != undefined){ dados.nome = input_do_nome.value }
	if(input_da_regiao != undefined){ dados.regiao_id = input_da_regiao.value }
	if(input_do_criterio != undefined){ dados.criterio_id = input_do_criterio.value }
	if(input_da_mensagem != undefined){ dados.mensagem = input_da_mensagem.value }

	return dados
}

function dados_do_registro(){
	var dados = {regiao_id: undefined, evento_id: undefined}
	var input_da_regiao = document.querySelector('select.formulario-registro-regiao')
	var input_do_evento = document.querySelector('select.formulario-registro-evento')

	if(input_da_regiao != undefined){ dados.regiao_id = input_da_regiao.value }
	if(input_do_evento != undefined){ dados.evento_id = input_do_evento.value }

	return dados
}

function dados_da_regiao(){
	var dados = {nome: undefined, raio: undefined, latitude: undefined, longitude: undefined}

	if(regiao.regiao != undefined){
		dados.nome = regiao.nome
		dados.raio = regiao.regiao.getRadius()
		dados.latitude = regiao.regiao.getLatLng()[0]
		dados.longitude = regiao.regiao.getLatLng()[1]
	}

	return dados
}

function adiciona_layer(){
	var layer = new L.StamenTileLayer("toner");
	mapa.addLayer(layer)
}

function limpa_regiao(){
	if(regiao != undefined){
		regiao.regiao.remove()
		regiao = undefined
	}
}

function reseta_flags_e_dados(){
	flag_criando_regiao = undefined
	formulario_de_evento = undefined
	formulario_de_regiao = undefined
	formulario_de_registro = undefined
	if(regiao != undefined){
		regiao.regiao.remove()
		regiao = undefined
	}
}

function cria_regiao_no_mapa(e){
	var input_de_nome = document.querySelector('input.formulario-regiao-nome')
	var input_de_raio = document.querySelector('input.formulario-regiao-raio')
	if(flag_criando_regiao === true){
		if(regiao === undefined){
			regiao = {regiao: L.circle(e.latlng,1000), nome: ''}
			if(input_de_nome != undefined){
				regiao.nome = input_de_nome.value
			}
			if(input_de_raio != undefined){
				regiao.regiao.setRadius(input_de_raio.value)
			}
			regiao.regiao.addTo(mapa)
		}else{
			regiao.regiao.setLatLng(e.latlng)
		}
	}else{

	}
}

function cria_mapa(id,lat,lng){
	if(mapa === undefined){
		mapa = L.map('mapa')
		mapa.setView([51.505,-0.09],9)
		adiciona_layer()
	}else{
		mapa.remove()
		mapa = L.map('mapa')
		mapa.setView([51.505,-0.09],9)
		adiciona_layer()
	}
	mapa.addEventListener('click',cria_regiao_no_mapa)
}

function set_nome_da_regiao(nome){
	if(regiao != undefined){
		regiao.nome = nome
	}
}

function set_raio_da_regiao(raio){
	if(regiao != undefined){
		regiao.regiao.setRadius(raio)
		console.log(regiao.regiao.getRadius())
	}
}

function set_formulario_de_registro(formulario){
	formulario_de_registro = formulario
}

function set_formulario_de_regiao(regiao){
	formulario_de_regiao = regiao
}

function set_formulario_de_evento(evento){
	formulario_de_evento = evento
}

function set_campos_do_novo_registro(campos){
	novo_registro = campos
}

function set_campos_da_nova_regiao(campos){
	nova_regiao = campos
}

function set_campos_do_novo_evento(campos){
	novo_evento = campos
}

function toggle_flag_criando_regiao(){
	if(flag_criando_regiao === undefined || flag_criando_regiao === false){
		flag_criando_regiao = true
	}else{
		flag_criando_regiao = false
	}
}

export { 
	mapa,
	regioes,
	eventos,
	dispositivos,
	data_ultima_consulta,
	ultima_posicao,
	nova_regiao,
	novo_evento,
	novo_registro,
	formulario_de_registro,
	formulario_de_regiao,
	formulario_de_evento,
	cria_mapa,
	set_formulario_de_registro,
	set_formulario_de_regiao,
	set_formulario_de_evento,
	set_campos_do_novo_registro,
	set_campos_da_nova_regiao,
	set_campos_do_novo_evento,
	toggle_flag_criando_regiao,
	flag_criando_regiao,
	regiao,
	limpa_regiao,
	set_nome_da_regiao,
	set_raio_da_regiao,
	reseta_flags_e_dados,
	dados_da_regiao,
	dados_do_evento,
	dados_do_registro
}