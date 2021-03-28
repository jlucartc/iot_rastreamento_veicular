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

export function atualiza_app_periodicamente(){
	setTimeout(busca_novas_mensagens,5000)
}

function emite_mensagem_de_evento(evento,dispositivo,regiao){
	fetch('/emite_mensagem_de_evento',{method: 'POST',headers: {'content-type':'application/json'},body: JSON.stringify({dispositivo: dispositivo,regiao_id: regiao.id,evento_id: evento.id})})
}

function insere_status_do_dispositivo_na_regiao(regiao,dispositivo,esta_na_regiao){
	fetch('/insere_status_do_dispositivo_na_regiao',{method: 'POST',headers: {'content-type':'application/json'},body: JSON.stringify({regiao_id: regiao.id,dispositivo: dispositivo,esta_na_regiao: esta_na_regiao})})
}

function checa_se_ha_eventos_de_saida_na_regiao(regiao,dispositivo){
	fetch('/checa_se_ha_eventos_de_saida_na_regiao',{method: 'POST',headers: {'content-type':'application/json'},body: JSON.stringify({regiao_id: regiao.id})})
	.then(response => response.json())
	.then(eventos => {
		eventos.forEach(function(evento){
			fetch('/recupera_estado_do_dispositivo_na_regiao',{method: 'POST',header:{'content-type':'application/json'},body: JSON.stringify({dispositivo: dispositivo, regiao_id: regiao.id})})
			.then(response => response.json())
			.then(regioes_dispositivos => {
				regioes_dispositivos.forEach(
					function(regiao_dispositivo){
						if(regiao_dispositivo.esta_em_regiao == true && evento.criterio_id == '1'){
							emite_mensagem_de_evento(evento,dispositivo,regiao)
						}
					}
				)

				if(regioes_dispositivos.length == 0 && evento.criterio_id == '1'){
					insere_status_do_dispositivo_na_regiao(regiao,dispositivo,false)
					emite_mensagem_de_evento(evento,dispositivo,regiao)
				}else if(regioes_dispositivos.length == 0){
					insere_status_do_dispositivo_na_regiao(regiao,dispositivo,false)
				}

			})
		})
	})
}

function checa_se_ha_eventos_de_entrada_na_regiao(regiao,dispositivo){
	fetch('/checa_se_ha_eventos_de_entrada_na_regiao',{method: 'POST',headers:{'content-type':'application/json'},body: JSON.stringify({regiao_id: regiao.id})})
	.then(response => response.json())
	.then(eventos => {
		eventos.forEach(function(evento){
			fetch('/recupera_estado_do_dispositivo_na_regiao',{method: 'POST',headers:{'content-type':'application/json'},body: JSON.stringify({dispositivo: dispositivo, regiao_id: regiao.id})})
			.then(response => response.json())
			.then(regioes_dispositivos => {
				regioes_dispositivos.forEach(function(regiao_dispositivo){
					if(regiao_dispositivo.esta_em_regiao == false && evento.criterio_id == '2'){
						emite_mensagem_de_evento(evento,dispositivo,regiao)
					}
				})

				if(regioes_dispositivos.length == 0 && evento.criterio_id == '2'){
					insere_status_do_dispositivo_na_regiao(regiao,dispositivo,true)
					emite_mensagem_de_evento(evento,dispositivo,regiao)
				}else if(regioes_dispositivos.length == 0){
					insere_status_do_dispositivo_na_regiao(regiao,dispositivo,true)
				}

			})
		})
	})
}

async function processa_mensagem(mensagem){
	var coordenadas = string_para_coordenadas(mensagem.payload)
	fetch('/regioes_onde_o_dispositivo_esta_e_nao_estava',{method: 'POST',headers: {'content-type':'application/json'},body: JSON.stringify({dispositivo: mensagem.dispositivo, latitude: coordenadas[0], longitude: coordenadas[1]})})
	.then(res => res.json())
	.then(regioes => {
		regioes.forEach(function(regiao){ checa_se_ha_eventos_de_entrada_na_regiao(regiao,mensagem.dispositivo) })
	})

	fetch('/regioes_onde_o_dispositivo_estava_e_nao_esta_mais',{method: 'POST',headers: {'content-type':'application/json'},body: JSON.stringify({dispositivo: mensagem.dispositivo, latitude: coordenadas[0], longitude: coordenadas[1]})})
	.then(res => res.json())
	.then(regioes => {
		regioes.forEach(function(regioes){ checa_se_ha_eventos_de_saida_na_regiao(regiao,mensagem.dispositivo) })
	})
}

function busca_novas_mensagens(){
	var mensagens = fetch('/busca_novas_mensagens',{method: 'POST',headers: {'content-type':'application/json'},body: JSON.stringify({ultima_consulta_em: Estado.ultima_consulta_em})})
	.then(response => { return response.json() }).then(data => { data.forEach(processa_mensagem) })
	Estado.atualiza_ultima_consulta()
	setTimeout(busca_novas_mensagens,10000)
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

function insere_regioes_na_lista(){
	var nome_do_menu = 'nav-regioes'
	var nome_da_lista = 'lista-regioes'
	var request = new XMLHttpRequest()
	var lista = document.querySelector('div#lista-de-itens')
	limpa_lista_de_itens()
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			JSON.parse(this.response).forEach(function(item,index){
				Estado.salva_regiao(item)
				lista.appendChild(gera_novo_item(item.nome,[nome_da_lista],new Map([['id',item.id]])))
			})
		}
	}

	request.open('GET',Mapas.mapa_de_urls.get(nome_do_menu))
	request.send()
}

function insere_dispositivos_na_lista(){
	var nome_do_menu = 'nav-dispositivos'
	var nome_da_lista = 'lista-dispositivos'
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

function insere_eventos_na_lista(){
	var nome_do_menu = 'nav-eventos'
	var nome_da_lista = 'lista-eventos'
	var request = new XMLHttpRequest()
	var lista = document.querySelector('div#lista-de-itens')
	limpa_lista_de_itens()
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			JSON.parse(this.response).forEach(function(item,index){
				Estado.salva_evento(item)
				lista.appendChild(gera_novo_item(item.nome,[nome_da_lista],new Map([['id',item.id]])))
			})
		}
	}

	request.open('GET',Mapas.mapa_de_urls.get(nome_do_menu))
	request.send()
}

function insere_registros_na_lista(){
	var nome_do_menu = 'nav-registros'
	var nome_da_lista = 'lista-registros'
	var request = new XMLHttpRequest()
	var lista = document.querySelector('div#lista-de-itens')
	limpa_lista_de_itens()
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			JSON.parse(this.response).forEach(function(registro,index){
				Estado.salva_registro(registro)
				lista.appendChild(gera_novo_item(`Evento: ${registro.evento_nome}, Regiao: ${registro.regiao_nome}`,[nome_da_lista],new Map([['id',registro.id]])))
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

function insere_regiao_no_mapa(regiao){
	regiao.addTo(Estado.mapa)
}

function centraliza_mapa_em_coordenada(coordenada){
	Estado.mapa.flyTo(coordenada)
}

function cadastra_regiao_no_banco(){
	var request = new XMLHttpRequest()
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			console.log(`Sucesso: ${this.response}`)
		}else{
			console.log(`Erro`)
		}
	}

	request.open('POST','/cadastra_regiao')
	request.setRequestHeader('content-type','application/json')
	request.send(JSON.stringify(Estado.dados_da_regiao()))
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
	request.setRequestHeader('content-type','application/json')
	request.send(JSON.stringify(Estado.dados_do_registro()))
}

function cadastra_evento_no_banco(){
	var request = new XMLHttpRequest()
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			console.log(`Sucesso: ${JSON.parse(this.response)}`)
		}
	}

	request.open('POST','/cadastra_evento')
	request.setRequestHeader('content-type','application/json')
	request.send(JSON.stringify(Estado.dados_do_evento()))
}

function cria_menu_de_dispositivos(){
	insere_dispositivos_na_lista()
}

function cria_menu_de_regioes(){
	insere_regioes_na_lista()
	var lista_de_regioes = document.querySelector('div#lista-de-itens')
	var link_de_criar_regiao = cria_link_de_criar_regiao()
	lista_de_regioes.appendChild(link_de_criar_regiao)
}

function cria_menu_de_eventos(){
	insere_eventos_na_lista()
	var lista_de_eventos = document.querySelector('div#lista-de-itens')
	var link_de_criar_evento = cria_link_de_criar_evento()
	lista_de_eventos.appendChild(link_de_criar_evento)
}

function cria_menu_de_registros(){
	insere_registros_na_lista()
	var lista_de_registros = document.querySelector('div#lista-de-itens')
	var link_de_criar_registro = cria_link_de_criar_registro()
	lista_de_registros.appendChild(link_de_criar_registro)
}

function options_do_select_de_regioes_do_evento(){
	var select = document.querySelector('select.form-select.formulario-evento-regiao')
	var options = []
	Estado.regioes.forEach(function(regiao){
		var nova_option = document.createElement('option')
		nova_option.innerHTML = regiao.nome
		nova_option.value = regiao.id
		options.push(nova_option)
	})

	options.forEach(function(option){
		select.appendChild(option)
	})
	options[0].selected = true
}

function options_do_select_de_regioes_do_registro(){
	var select = document.querySelector('select.form-select.formulario-registro-regiao')
	var options = []
	Estado.regioes.forEach(function(regiao){
		var nova_option = document.createElement('option')
		nova_option.innerHTML = regiao.nome
		nova_option.value = regiao.id
		options.push(nova_option)
	})

	options.forEach(function(option){
		select.appendChild(option)
	})
	options[0].selected = true
}

function options_do_select_de_eventos_do_registro(){
	var select = document.querySelector('select.form-select.formulario-registro-evento')
	var options = []
	Estado.eventos.forEach(function(evento){
		var nova_option = document.createElement('option')
		nova_option.innerHTML = evento.nome
		nova_option.value = evento.id
		options.push(nova_option)
	})

	options.forEach(function(option){
		select.appendChild(option)
	})
	options[0].selected = true
}

function options_do_select_de_criterios_do_evento(){
	var request = new XMLHttpRequest()
	var select = document.querySelector('select.form-select.formulario-evento-criterio')
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			JSON.parse(this.response).forEach(function(option){
				var nova_option = document.createElement('option')
				nova_option.innerHTML = option.nome
				nova_option.value = option.id
				select.appendChild(nova_option)
			})
		}
	}
	request.open('GET','/criterios')
	request.send()
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
	input_do_nome.className = "form-control formulario-evento-nome"
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

	var form_group_do_criterio = document.createElement('div')
	form_group_do_criterio.className = "form-group"

	var label_do_criterio = document.createElement('label')
	label_do_criterio.className = "form-label"
	label_do_criterio.innerHTML = 'Critério'

	var select_do_criterio = document.createElement('select')
	select_do_criterio.className = 'form-select formulario-evento-criterio'
	select_do_criterio.setAttribute('name','criterio')

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

	//form_group_da_regiao.appendChild(label_da_regiao)
	//form_group_da_regiao.appendChild(select_da_regiao)

	form_group_do_criterio.appendChild(label_do_criterio)
	form_group_do_criterio.appendChild(select_do_criterio)

	form_group_da_mensagem.appendChild(label_da_mensagem)
	form_group_da_mensagem.appendChild(input_da_mensagem)

	formulario.appendChild(form_group_do_nome)
	//formulario.appendChild(form_group_da_regiao)
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

export function clica_em_item_da_lista_de_dispositivos(elemento){
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
				centraliza_mapa_em_coordenada(coordenadas)
			})
		}
	}
	request.send()
}

export function clica_em_item_da_lista_de_regioes(elemento){
	console.log('Click no item de regiões!')
	var regiao = Estado.recupera_regiao_por_id(elemento.id).circulo
	insere_regiao_no_mapa(regiao)
	centraliza_mapa_em_coordenada([regiao.getLatLng().lat,regiao.getLatLng().lng])
}

export function clica_em_item_da_lista_de_eventos(elemento){
	console.log('Click no item de eventos!')
}

export function clica_em_menu_de_dispositivos(elemento){
	console.log('Dispositivos!')
	cria_menu_de_dispositivos()
}

export function clica_em_menu_de_regioes(elemento){
	console.log('Regiões!')
	Estado.reseta_flags_e_dados()
	cria_menu_de_regioes()
}

export function clica_em_menu_de_eventos(elemento){
	console.log('Eventos!')
	Estado.reseta_flags_e_dados()
	cria_menu_de_eventos()
}

export function clica_em_menu_de_registros(elemento){
	console.log('Registros!')
	Estado.reseta_flags_e_dados()
	cria_menu_de_registros()
}

export function cria_formulario_de_evento(elemento){
	if(Estado.formulario_de_evento === undefined){ 
		console.log('Criando novo evento!')
		var formulario_de_evento = cria_formulario_de_novo_evento()
		var lista_de_itens = document.querySelector('div#lista-de-itens')
		lista_de_itens.appendChild(formulario_de_evento)
		Estado.set_formulario_de_evento(formulario_de_evento)
		options_do_select_de_criterios_do_evento()
	}
}

export function cria_formulario_de_regiao(elemento){
	if(Estado.formulario_de_regiao === undefined){
		console.log('Criando nova regiao!')
		var formulario_de_regiao = cria_formulario_de_nova_regiao()
		var lista_de_itens = document.querySelector('div#lista-de-itens')
		lista_de_itens.appendChild(formulario_de_regiao)
		Estado.set_formulario_de_regiao(formulario_de_regiao)
		Estado.toggle_flag_criando_regiao()
	}
}

export function cria_formulario_de_registro(elemento){
	if(Estado.formulario_de_registro === undefined){
		console.log('Criando novo registro!')
		var formulario_de_registro = cria_formulario_de_novo_registro()
		var lista_de_itens = document.querySelector('div#lista-de-itens')
		lista_de_itens.appendChild(formulario_de_registro)
		Estado.set_formulario_de_registro(formulario_de_registro)
		options_do_select_de_regioes_do_registro()
		options_do_select_de_eventos_do_registro()
	}
}

export function confirma_criacao_de_registro(elemento){
	console.log('Enviando formulario de registro!')
	cadastra_registro_no_banco()
}

export function confirma_criacao_de_regiao(elemento){
	console.log('Enviando formulario de regiao!')
	cadastra_regiao_no_banco()
}

export function confirma_criacao_de_evento(elemento){
	console.log('Enviando formulario de evento!')
	cadastra_evento_no_banco()
}

export function cancela_criacao_de_registro(elemento){
	console.log('Cancelando formulario de registro!')
	if(Estado.formulario_de_registro != undefined){
		Estado.formulario_de_registro.remove()
		Estado.set_formulario_de_registro(undefined)
	}
}

export function cancela_criacao_de_regiao(elemento){
	console.log('Cancelando formulario de regiao!')
	if(Estado.formulario_de_regiao != undefined){
		Estado.formulario_de_regiao.remove()
		Estado.set_formulario_de_regiao(undefined)
		Estado.limpa_regiao()
		Estado.toggle_flag_criando_regiao()
	}
}

export function cancela_criacao_de_evento(elemento){
	console.log('Cancelando formulario de evento!')
	if(Estado.formulario_de_evento != undefined){
		Estado.formulario_de_evento.remove()
		Estado.set_formulario_de_evento(undefined)
	}
}

export function atualiza_evento_do_registro(elemento){
	console.log('Mudou evento do registro!')
	Estado.set_evento_do_registro(elemento.value)
}

export function atualiza_nome_da_regiao(elemento){
	console.log('Mudou nome da regiao!')
	Estado.set_nome_da_regiao(elemento.value)
}

export function atualiza_raio_da_regiao(elemento){
	console.log('Mudou raio da regiao!')
	Estado.set_raio_da_regiao(elemento.value)
}

export function atualiza_nome_do_evento(elemento){
	console.log('Atualiza nome do evento!')
	Estado.set_nome_do_evento(elemento.value)
}

export function atualiza_regiao_do_evento(elemento){
	console.log('Atualiza região do evento!')
	Estado.set_regiao_do_evento(elemento.value)
}

export function atualiza_criterio_do_evento(elemento){
	console.log('Atualiza critério do evento!')
	Estado.set_criterio_do_evento(elemento.value)
}

export function atualiza_mensagem_do_evento(elemento){
	console.log('Atualiza mensagem do evento')
	Estado.set_mensagem_do_evento(elemento.value)
}