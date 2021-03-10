// Remove todos os itens da lista
// Checa qual é o menu atual
// Busca os itens do menu atual
// Insere os itens do menu atual

const dispositivos_callback = function(){ console.log('Dispositivos!'); insere_novos_itens_na_lista('Dispositivos') }
const regioes_callback = function(){ console.log('Regiões!'); insere_novos_itens_na_lista('Regiões') }
const eventos_callback = function(){ console.log('Eventos!'); insere_novos_itens_na_lista('Eventos') }

const mapa_de_menus = new Map([
	["Dispositivos",{callback: dispositivos_callback,url: 'http://localhost:3000/dispositivos'}],
	['Regiões',{callback: regioes_callback,url: 'http://localhost:3000/regioes'}],
	['Eventos',{callback: eventos_callback,url: 'http://localhost:3000/eventos'}]
]);

NodeList.prototype.primeiro = function(){
	return this[0]
}

HTMLCollection.prototype.primeiro = function(){
	return this[0]
}

Element.prototype.recupera_nome_do_menu = function(){
	return this.children.primeiro().innerHTML
}

function existe(objeto){
	if(objeto === undefined){
		return false
	}else{
		return true
	}
}

function menu_nao_foi_cadastrado(){
	alert(`O menu não foi cadastrado!`)
}

function adiciona_clique_listener_no_menu(callback,menu){
	menu.addEventListener('click',callback)
}

function limpa_lista_de_itens(){
	itens_da_lista = document.querySelectorAll('div#lista_de_itens li.list-group-item')
	itens_da_lista.forEach(function(item){ item.remove() })
}

function gera_novo_item(item){
	novo_item_da_lista = document.createElement('li')
	novo_item_da_lista.classList.add('list-group-item')
	novo_item_da_lista.innerHTML = item
	return novo_item_da_lista
}

function insere_novos_itens_na_lista(nome_do_menu){
	var xhttp = new XMLHttpRequest()
	lista = document.querySelector('div#lista_de_itens')
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			limpa_lista_de_itens()
			JSON.parse(this.response).forEach(function(item,index){
				lista.appendChild(gera_novo_item(item.dispositivo))
			})
		}else{
			console.log('Erro')
		}
	}

	xhttp.open('GET',mapa_de_menus.get(nome_do_menu).url)
	xhttp.send()
}

function configura_eventos_do_menu(menu,index){
	var nome_do_menu = menu.recupera_nome_do_menu()
	var informacoes_do_menu = mapa_de_menus.get(nome_do_menu)

	if(existe(informacoes_do_menu)){
		adiciona_clique_listener_no_menu(informacoes_do_menu.callback,menu)
	}else{
		adiciona_clique_listener_no_menu(menu_nao_foi_cadastrado,menu)
	}
}

document.addEventListener("DOMContentLoaded",(event) => {
	itens_da_lista = document.querySelectorAll('div#lista_de_itens li.list-group-item')
	menus_de_navegacao = document.querySelectorAll('ul.navbar-nav li.nav-item')
	menus_de_navegacao.forEach(configura_eventos_do_menu)
});