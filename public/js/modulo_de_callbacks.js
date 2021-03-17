import * as Mapas from './modulo_de_mapas.js'
import * as Estado from './modulo_de_estado.js'
import { cadastra_elemento_em_evento } from './modulo_de_cadastro_de_eventos.js'

Map.prototype.vazio = function(){
	if(this.size == 0){
		return true
	}else{
		return false
	}
}

function string_para_coordenadas(string){
	var coordenadas = atob(string).substring(0,string.length-1).split(';').map(function(item){ return parseFloat(item.trim()) })
	return coordenadas
}

function gera_novo_item(item,classes,atributos){
	var novo_item_da_lista = document.createElement('a')
	novo_item_da_lista.classList.add('list-group-item','list-group-item-action')
	classes.forEach(function(classe){ novo_item_da_lista.classList.add(classe) })
	atributos.forEach(function(valor,nome){ novo_item_da_lista.setAttribute(nome,valor) })
	novo_item_da_lista.innerHTML = item
	cadastra_elemento_em_evento(novo_item_da_lista,'click')
	return novo_item_da_lista
}

function insere_novos_itens_na_lista(nome_do_menu,nome_da_lista){
	var request = new XMLHttpRequest()
	var lista = document.querySelector('div#lista-de-itens')
	limpa_lista_de_itens()
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			JSON.parse(this.response).forEach(function(item,index){
				lista.appendChild(gera_novo_item(item.dispositivo,[nome_da_lista],new Map([])))
			})
		}
	}

	request.open('GET',Mapas.mapa_de_urls.get(nome_do_menu))
	request.send()
}

function limpa_lista_de_itens(){
	var itens_da_lista = document.querySelectorAll('div#lista-de-itens .list-group-item')
	itens_da_lista.forEach(function(item){ item.remove() })
}

function insere_dispositivo_no_mapa(nome_do_dispositivo,coordenadas){
	var mapa = Estado.mapa
	var dispositivo = L.marker(coordenadas,{icon: L.icon({iconUrl: '../icons/car-icon.png', iconSize: [20,20], iconAnchor: [20,20]}),title: nome_do_dispositivo})
	dispositivo.addTo(mapa)
}

function centraliza_mapa_no_dispositivo(coordenada){
	Estado.mapa.flyTo(coordenada)
}

function cadastra_regiao_no_banco(){
	var request = new XMLHttpRequest()
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			console.log(`Sucesso: ${this.response}`)
		}else{
			console.log(`Erro: ${JSON.parse(this.response)}`)
		}
	}

	request.open('POST','/cadastra_regiao')
	request.send(Estado.dados_da_regiao())
}

function cadastra_registro_no_banco(){
	var request = new XMLHttpRequest()
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			console.log(`Sucesso: ${JSON.parse(this.response)}`)
		}else{
			console.log(`Erro: ${JSON.parse(this.response)}`)
		}
	}

	request.open('POST','/cadastra_registro')
	request.send(Estado.dados_do_registro())
}

function cadastra_evento_no_banco(){
	var request = new XMLHttpRequest()
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			console.log(`Sucesso: ${JSON.parse(this.response)}`)
		}else{
			console.log(`Erro: ${JSON.parse(this.response)}`)
		}
	}

	request.open('POST','/cadastra_evento')
	request.send(Estado.dados_do_evento())
}

function cria_menu_dispositivos(){
	insere_novos_itens_na_lista('nav-dispositivos','lista-dispositivos')
}

function cria_menu_regioes(){
	insere_novos_itens_na_lista('nav-regioes','lista-regioes')
	var lista_de_regioes = document.querySelector('div#lista-de-itens')
	var link_de_criar_regiao = cria_link_de_criar_regiao()
	lista_de_regioes.appendChild(link_de_criar_regiao)
}

function cria_menu_eventos(){
	insere_novos_itens_na_lista('nav-eventos','lista-eventos')
	var lista_de_eventos = document.querySelector('div#lista-de-itens')
	var link_de_criar_evento = cria_link_de_criar_evento()
	lista_de_eventos.appendChild(link_de_criar_evento)
}

function cria_menu_registros(){
	insere_novos_itens_na_lista('nav-registros','lista-registros')
	var lista_de_registros = document.querySelector('div#lista-de-itens')
	var link_de_criar_registro = cria_link_de_criar_registro()
	lista_de_registros.appendChild(link_de_criar_registro)
}

function cria_link_de_criar_evento(){
	var link_de_criar_evento = document.createElement('a')
	link_de_criar_evento.className = "list-group-item list-group-item-action list-group-item-success cria-evento"
	link_de_criar_evento.id = "cria-evento"
	link_de_criar_evento.innerHTML = 'Criar novo evento'
	cadastra_elemento_em_evento(link_de_criar_evento,'click')
	return link_de_criar_evento
}

function cria_link_de_criar_regiao(){
	var link_de_criar_regiao = document.createElement('a')
	link_de_criar_regiao.className = "list-group-item list-group-item-action list-group-item-success cria-regiao"
	link_de_criar_regiao.id = "cria-regiao"
	link_de_criar_regiao.innerHTML = 'Criar nova regiao'
	cadastra_elemento_em_evento(link_de_criar_regiao,'click')
	return link_de_criar_regiao
}

function cria_link_de_criar_registro(){
	var link_de_criar_registro = document.createElement('a')
	link_de_criar_registro.className = "list-group-item list-group-item-action list-group-item-success cria-registro"
	link_de_criar_registro.id = "cria-registro"
	link_de_criar_registro.innerHTML = 'Criar novo registro'
	cadastra_elemento_em_evento(link_de_criar_registro,'click')
	return link_de_criar_registro
}

function cria_formulario_de_novo_evento(){
	var container_do_formulario = document.createElement('div')
	container_do_formulario.className = "list-group-item"
	container_do_formulario.id = "evento"

	var titulo_do_formulario = document.createElement('p')
	titulo_do_formulario.innerHTML = "Criar Evento"

	var formulario = document.createElement('form')
	formulario.className = "form"

	var form_group_do_nome = document.createElement('div')
	var label_do_nome = document.createElement('label')
	label_do_nome.className = "form-label"
	label_do_nome.innerHTML = 'Nome'

	var input_do_nome = document.createElement('input')
	input_do_nome.className = "form-control"
	input_do_nome.setAttribute('type','text')
	input_do_nome.setAttribute('name','nome')

	var form_group_da_regiao = document.createElement('div')
	form_group_da_regiao.className = "form-group"

	var label_da_regiao = document.createElement('label')
	label_da_regiao.className = "form-label"
	label_da_regiao.innerHTML = "Região"

	var select_da_regiao = document.createElement('select')
	select_da_regiao.className = "form-select formulario-evento-regiao"
	select_da_regiao.setAttribute('name','regiao')
	var options_da_regiao = []

	var form_group_do_criterio = document.createElement('div')
	form_group_do_criterio.className = "form-group"

	var label_do_criterio = document.createElement('label')
	label_do_criterio.className = "form-label"
	label_do_criterio.innerHTML = 'Critério'

	var select_do_criterio = document.createElement('select')
	select_do_criterio.className = 'form-select formulario-evento-criterio'
	select_do_criterio.setAttribute('name','criterio')
	var options_do_criterio = []

	var form_group_da_mensagem = document.createElement('div')
	form_group_da_mensagem.className = "form-group"

	var label_da_mensagem = document.createElement('label')
	label_da_mensagem.className = "form-label"
	label_da_mensagem.innerHTML = "Mensagem"

	var input_da_mensagem = document.createElement('textarea')
	input_da_mensagem.className = "form-control formulario-evento-mensagem"
	input_da_mensagem.setAttribute('name','mensagem')

	var div_dos_botoes = document.createElement('div')
	div_dos_botoes.className = "container-fluid mt-3 px-0"

	var row_dos_botoes = document.createElement('div')
	row_dos_botoes.className = 'row px-0'

	var coluna_do_botao_de_criar = document.createElement('div')
	coluna_do_botao_de_criar.className = "col-3"

	var coluna_do_botao_de_cancelar = document.createElement('div')
	coluna_do_botao_de_cancelar.className = "col-3"

	var botao_de_criar = document.createElement('button')
	botao_de_criar.className = 'btn btn-success btn-block envia-formulario-evento'
	botao_de_criar.innerHTML = "Criar"
	botao_de_criar.setAttribute('type','button')

	var botao_de_cancelar = document.createElement('button')
	botao_de_cancelar.className = 'btn btn-primary btn-block cancela-formulario-evento'
	botao_de_cancelar.innerHTML = "Cancelar"
	botao_de_cancelar.setAttribute('type','button')
	
	cadastra_elemento_em_evento(input_do_nome,'change')
	cadastra_elemento_em_evento(select_da_regiao,'change')
	cadastra_elemento_em_evento(select_do_criterio,'change')
	cadastra_elemento_em_evento(input_da_mensagem,'change')
	cadastra_elemento_em_evento(botao_de_cancelar,'click')
	cadastra_elemento_em_evento(botao_de_criar,'click')

	coluna_do_botao_de_cancelar.appendChild(botao_de_cancelar)
	coluna_do_botao_de_criar.appendChild(botao_de_criar)

	row_dos_botoes.appendChild(coluna_do_botao_de_criar)
	row_dos_botoes.appendChild(coluna_do_botao_de_cancelar)

	div_dos_botoes.appendChild(row_dos_botoes)

	form_group_do_nome.appendChild(label_do_nome)
	form_group_do_nome.appendChild(input_do_nome)

	form_group_da_regiao.appendChild(label_da_regiao)
	form_group_da_regiao.appendChild(select_da_regiao)

	form_group_do_criterio.appendChild(label_do_criterio)
	form_group_do_criterio.appendChild(select_do_criterio)

	form_group_da_mensagem.appendChild(label_da_mensagem)
	form_group_da_mensagem.appendChild(input_da_mensagem)

	formulario.appendChild(form_group_do_nome)
	formulario.appendChild(form_group_da_regiao)
	formulario.appendChild(form_group_do_criterio)
	formulario.appendChild(form_group_da_mensagem)
	formulario.appendChild(div_dos_botoes)

	container_do_formulario.appendChild(titulo_do_formulario)
	container_do_formulario.appendChild(formulario)

	return container_do_formulario
}

function cria_formulario_de_novo_registro(){
	var container_do_formulario = document.createElement('div')
	container_do_formulario.className = "list-group-item"
	container_do_formulario.id = 'registro'

	var titulo_do_formulario = document.createElement('p')
	titulo_do_formulario.innerHTML = "Cria Registro"

	var formulario = document.createElement('form')
	formulario.className = "form"

	var form_group_do_evento = document.createElement('div')
	form_group_do_evento.className = "form-group"

	var label_do_evento = document.createElement('label')
	label_do_evento.className = "form-label"
	label_do_evento.innerHTML = 'Evento'

	var select_do_evento = document.createElement('select')
	select_do_evento.className = "form-select formulario-registro-evento"
	select_do_evento.setAttribute('name','evento')
	var options_do_evento = []

	var form_group_da_regiao = document.createElement('div')
	form_group_da_regiao.className = "form-group"

	var label_da_regiao = document.createElement('label')
	label_da_regiao.className = "form-label"
	label_da_regiao.innerHTML = "Região"

	var select_da_regiao = document.createElement('select')
	select_da_regiao.className = "form-select formulario-registro-regiao"
	select_da_regiao.setAttribute('name','regiao')
	var options_da_regiao = []

	var div_dos_botoes = document.createElement('div')
	div_dos_botoes.className = "container-fluid mt-3 px-0"

	var row_dos_botoes = document.createElement('row')
	row_dos_botoes.className = "row px-0"

	var coluna_do_botao_de_criar = document.createElement('col')
	coluna_do_botao_de_criar.className = "col-3"

	var coluna_do_botao_de_cancelar = document.createElement('col')
	coluna_do_botao_de_cancelar.className = "col-3"

	var botao_de_criar = document.createElement('button')
	botao_de_criar.className = "btn btn-success btn-block envia-formulario-registro"
	botao_de_criar.innerHTML = "Criar"
	botao_de_criar.setAttribute('type','button')

	var botao_de_cancelar = document.createElement('button')
	botao_de_cancelar.className = "btn btn-primary btn-block cancela-formulario-registro"
	botao_de_cancelar.innerHTML = "Cancelar"
	botao_de_cancelar.setAttribute('type','button')

	cadastra_elemento_em_evento(select_do_evento,'change')
	cadastra_elemento_em_evento(select_da_regiao,'change')
	cadastra_elemento_em_evento(botao_de_cancelar,'click')
	cadastra_elemento_em_evento(botao_de_criar,'click')

	coluna_do_botao_de_cancelar.appendChild(botao_de_cancelar)
	coluna_do_botao_de_criar.appendChild(botao_de_criar)

	row_dos_botoes.appendChild(coluna_do_botao_de_criar)
	row_dos_botoes.appendChild(coluna_do_botao_de_cancelar)

	div_dos_botoes.appendChild(row_dos_botoes)

	form_group_da_regiao.appendChild(label_da_regiao)
	form_group_da_regiao.appendChild(select_da_regiao)

	form_group_do_evento.appendChild(label_do_evento)
	form_group_do_evento.appendChild(select_do_evento)

	formulario.appendChild(form_group_do_evento)
	formulario.appendChild(form_group_da_regiao)
	formulario.appendChild(div_dos_botoes)

	container_do_formulario.appendChild(titulo_do_formulario)
	container_do_formulario.appendChild(formulario)

	return container_do_formulario
}

function cria_formulario_de_nova_regiao(){
	var container_do_formulario = document.createElement('div')
	container_do_formulario.className = "list-group-item"
	container_do_formulario.id = "regiao"

	var titulo_do_formulario = document.createElement('p')
	titulo_do_formulario.innerHTML = "Criar região"

	var formulario = document.createElement('form')
	formulario.className = "form"

	var form_group_do_nome = document.createElement('div')
	form_group_do_nome.className = "form-group"
	
	var label_do_nome = document.createElement('label')
	label_do_nome.className = 'form-label'
	label_do_nome.innerHTML = 'Nome'

	var input_do_nome = document.createElement('input')
	input_do_nome.className = 'form-control formulario-regiao-nome'
	input_do_nome.setAttribute('type','text')

	var form_group_do_raio = document.createElement('div')
	form_group_do_raio.className = 'form-group'

	var label_do_raio = document.createElement('label')
	label_do_raio.className = 'form-label'
	label_do_raio.innerHTML = 'Raio da região'

	var input_do_raio = document.createElement('input')
	input_do_raio.className = 'form-control formulario-regiao-raio'
	input_do_raio.setAttribute('type','text')

	var div_dos_botoes = document.createElement('div')
	div_dos_botoes.className = "container-fluid mt-3 px-0"

	var row_dos_botoes = document.createElement('div')
	row_dos_botoes.className = "row px-0"

	var coluna_do_botao_de_criar = document.createElement('div')
	coluna_do_botao_de_criar.className = "col-3"

	var coluna_do_botao_de_cancelar = document.createElement('div')
	coluna_do_botao_de_cancelar.className = "col-3"

	var botao_de_criar = document.createElement('button')
	botao_de_criar.className = "btn btn-success btn-block envia-formulario-regiao"
	botao_de_criar.innerHTML = 'Criar'
	botao_de_criar.setAttribute('type','button')

	var botao_de_cancelar = document.createElement('button')
	botao_de_cancelar.className = "btn btn-primary btn-block cancela-formulario-regiao"
	botao_de_cancelar.innerHTML = 'Cancelar'
	botao_de_cancelar.setAttribute('type','button')

	cadastra_elemento_em_evento(input_do_nome,'change')
	cadastra_elemento_em_evento(input_do_raio,'change')
	cadastra_elemento_em_evento(botao_de_criar,'click')
	cadastra_elemento_em_evento(botao_de_cancelar,'click')

	coluna_do_botao_de_cancelar.appendChild(botao_de_cancelar)
	coluna_do_botao_de_criar.appendChild(botao_de_criar)
	
	row_dos_botoes.appendChild(coluna_do_botao_de_criar)
	row_dos_botoes.appendChild(coluna_do_botao_de_cancelar)

	div_dos_botoes.appendChild(row_dos_botoes)

	form_group_do_nome.appendChild(label_do_nome)
	form_group_do_nome.appendChild(input_do_nome)

	form_group_do_raio.appendChild(label_do_raio)
	form_group_do_raio.appendChild(input_do_raio)

	formulario.appendChild(form_group_do_nome)
	formulario.appendChild(form_group_do_raio)
	formulario.appendChild(div_dos_botoes)

	container_do_formulario.appendChild(titulo_do_formulario)
	container_do_formulario.appendChild(formulario)

	return container_do_formulario
}

export function item_dispositivos_click_callback(elemento){
	console.log('Click no item de dispositivos!')
	var request = new XMLHttpRequest()
	var nome_do_dispositivo = elemento.innerHTML
	var url = `/mensagens/${nome_do_dispositivo}`
	request.open('GET',url)
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			JSON.parse(this.response).forEach(function(response){
				var coordenadas = string_para_coordenadas(response.payload)
				insere_dispositivo_no_mapa(nome_do_dispositivo,coordenadas)
				centraliza_mapa_no_dispositivo(coordenadas)
			})
		}
	}
	request.send()
}

export function item_regioes_click_callback(elemento){
	console.log('Click no item de regiões!')
}

export function item_eventos_click_callback(elemento){
	console.log('Click no item de eventos!')
}

export function nav_dispositivos_click_callback(elemento){
	console.log('Dispositivos!')
	cria_menu_dispositivos()
}

export function nav_regioes_click_callback(elemento){
	console.log('Regiões!')
	Estado.reseta_flags_e_dados()
	cria_menu_regioes()
}

export function nav_eventos_click_callback(elemento){
	console.log('Eventos!')
	Estado.reseta_flags_e_dados()
	cria_menu_eventos()
}

export function nav_registros_click_callback(elemento){
	console.log('Registros!')
	Estado.reseta_flags_e_dados()
	cria_menu_registros()
}

export function cria_evento_click_callback(elemento){
	if(Estado.formulario_de_evento === undefined){ 
		console.log('Criando novo evento!')
		var formulario_de_evento = cria_formulario_de_novo_evento()
		var lista_de_itens = document.querySelector('div#lista-de-itens')
		lista_de_itens.appendChild(formulario_de_evento)
		Estado.set_formulario_de_evento(formulario_de_evento)
	}
}

export function cria_regiao_click_callback(elemento){
	if(Estado.formulario_de_regiao === undefined){
		console.log('Criando nova regiao!')
		var formulario_de_regiao = cria_formulario_de_nova_regiao()
		var lista_de_itens = document.querySelector('div#lista-de-itens')
		lista_de_itens.appendChild(formulario_de_regiao)
		Estado.set_formulario_de_regiao(formulario_de_regiao)
		Estado.toggle_flag_criando_regiao()
	}
}

export function cria_registro_click_callback(elemento){
	if(Estado.formulario_de_registro === undefined){
		console.log('Criando novo registro!')
		var formulario_de_registro = cria_formulario_de_novo_registro()
		var lista_de_itens = document.querySelector('div#lista-de-itens')
		lista_de_itens.appendChild(formulario_de_registro)
		Estado.set_formulario_de_registro(formulario_de_registro)
	}
}

export function envia_formulario_registro_click_callback(elemento){
	console.log('Enviando formulario de registro!')
	cadastra_registro_no_banco()
}

export function envia_formulario_regiao_click_callback(elemento){
	console.log('Enviando formulario de regiao!')
	cadastra_regiao_no_banco()
}

export function envia_formulario_evento_click_callback(elemento){
	console.log('Enviando formulario de evento!')
	cadastra_evento_no_banco()
}

export function cancela_formulario_registro_click_callback(elemento){
	console.log('Cancelando formulario de registro!')
	if(Estado.formulario_de_registro != undefined){
		Estado.formulario_de_registro.remove()
		Estado.set_formulario_de_registro(undefined)
	}
}

export function cancela_formulario_regiao_click_callback(elemento){
	console.log('Cancelando formulario de regiao!')
	if(Estado.formulario_de_regiao != undefined){
		Estado.formulario_de_regiao.remove()
		Estado.set_formulario_de_regiao(undefined)
		Estado.limpa_regiao()
		Estado.toggle_flag_criando_regiao()
	}
}

export function cancela_formulario_evento_click_callback(elemento){
	console.log('Cancelando formulario de evento!')
	if(Estado.formulario_de_evento != undefined){
		Estado.formulario_de_evento.remove()
		Estado.set_formulario_de_evento(undefined)
	}
}

export function formulario_registro_evento_change_callback(elemento){
	console.log('Mudou evento do registro!')
	Estado.set_evento_do_registro(elemento.value)
}

export function formulario_registro_regiao_change_callback(elemento){
	console.log('Mudou regiao do registro')
	Estado.set_regiao_do_registro(elemento.value)
}

export function formulario_evento_nome_change_callback(elemento){
	console.log('Mudou nome do evento!')
	Estado.set_nome_do_evento(elemento.value)
}

export function formulario_evento_criterio_change_callback(elemento){
	console.log('Mudou criterio do evento!')
	Estado.set_criterio_do_evento(elemento.value)
}

export function formulario_evento_regiao_change_callback(elemento){
	console.log('Mudou regiao do evento!')
	Estado.set_regiao_do_evento(elemento.value)
}

export function formulario_evento_mensagem_change_callback(elemento){
	console.log('Mudou mensagem do evento!')
	Estado.set_mensagem_do_evento(elemento.value)
}

export function formulario_regiao_nome_change_callback(elemento){
	console.log('Mudou nome da regiao!')
	Estado.set_nome_da_regiao(elemento.value)
}

export function formulario_regiao_raio_change_callback(elemento){
	console.log('Mudou raio da regiao!')
	Estado.set_raio_da_regiao(elemento.value)
}