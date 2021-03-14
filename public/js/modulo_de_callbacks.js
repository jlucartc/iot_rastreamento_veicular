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
	var lista = document.querySelector('div#lista_de_itens')
	request.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			limpa_lista_de_itens()
			JSON.parse(this.response).forEach(function(item,index){
				lista.appendChild(gera_novo_item(item.dispositivo,[nome_da_lista],new Map([])))
			})
		}
	}

	request.open('GET',Mapas.mapa_de_urls.get(nome_do_menu))
	request.send()
}

function limpa_lista_de_itens(){
	var itens_da_lista = document.querySelectorAll('div#lista_de_itens a.list-group-item.list-group-item-action')
	itens_da_lista.forEach(function(item){ item.remove() })
}

function apresenta_dispositivo_no_mapa(nome_do_dispositivo,coordenadas){
	var mapa = Estado.mapa
	var dispositivo = L.marker(coordenadas,{icon: L.icon({iconUrl: '../icons/car-icon.png', iconSize: [20,20], iconAnchor: [20,20]}),tooltip: nome_do_dispositivo})
	dispositivo.addTo(mapa)
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
				apresenta_dispositivo_no_mapa(nome_do_dispositivo,coordenadas)
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
	limpa_lista_de_itens()
	insere_novos_itens_na_lista('nav-dispositivos','lista-dispositivos')
}

export function nav_regioes_click_callback(elemento){
	console.log('Regiões!')
	limpa_lista_de_itens()
	insere_novos_itens_na_lista('nav-regioes','lista-regioes')
}

export function nav_eventos_click_callback(elemento){
	console.log('Eventos!')	
	limpa_lista_de_itens()
	insere_novos_itens_na_lista('nav-eventos','lista-eventos')
}