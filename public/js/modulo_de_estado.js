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

function adiciona_layer(){
	var layer = new L.StamenTileLayer("toner");
	mapa.addLayer(layer)
}

function limpa_regiao(){
	regiao.remove()
	regiao = undefined
}

function cria_regiao_no_mapa(e){
	if(flag_criando_regiao === true){
		if(regiao === undefined){
			regiao = L.circle(e.latlng,1000)
			regiao.addTo(mapa)
		}else{
			regiao.remove()
			regiao = L.circle(e.latlng,1000)
			regiao.addTo(mapa)
		}
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
	limpa_regiao
}