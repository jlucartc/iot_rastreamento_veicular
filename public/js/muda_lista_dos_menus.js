// Remove todos os itens da lista
// Checa qual é o menu atual
// Busca os itens do menu atual
// Insere os itens do menu atual

const dispositivos_callback = function(){ console.log('Dispositivos!') }
const regioes_callback = function(){ console.log('Regiões!') }
const eventos_callback = function(){ console.log('Eventos!') }

const mapa_de_menus = new Map([
	["Dispositivos",{callback: dispositivos_callback,url: 'http://localhost:3000/mensagens/1'}],
	['Regiões',{callback: regioes_callback,url: 'http://localhost:3000/mensagens/1'}],
	['Eventos',{callback: eventos_callback,url: 'http://localhost:3000/mensagens/1'}]
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
	//console.log(`${objeto} === ${undefined} -> ${objeto === undefined}`)
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

function insere_novos_itens_na_lista(nome_do_menu){
	recupera_itens = pega_dados_do_banco(mapa_de_menus.get(nome_do_menu).url)
	console.log(recupera_itens)
}

function pega_dados_do_banco(url){
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange  = function(){
		if(this.readyState == 4 && this.status == 200){
			console.log('Sucesso!')
		}else{
			console.log('Erro')
		}
	}

	xhttp.open('GET',url)
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
	console.log(itens_da_lista)

	menus_de_navegacao = document.querySelectorAll('ul.navbar-nav li.nav-item')
	menus_de_navegacao.forEach(configura_eventos_do_menu)

});