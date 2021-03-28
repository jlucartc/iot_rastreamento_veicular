import { cadastra_elemento_em_evento } from './modulo_de_cadastro_de_eventos.js'
import * as Estado from './modulo_de_estado.js'
import * as Callbacks from './modulo_de_callbacks.js'

function configura_menu_de_navegacao(menu,index){
	console.log(menu)
	cadastra_elemento_em_evento(menu,'click')
}

document.addEventListener("DOMContentLoaded",(event) => {
	var itens_da_lista = document.querySelectorAll('div#lista_de_itens a.list-group-item.list-group-item-action')
	var menus_de_navegacao = document.querySelectorAll('ul.navbar-nav li.nav-item')
	menus_de_navegacao.forEach(configura_menu_de_navegacao)
	Estado.cria_mapa()
	Callbacks.atualiza_app_periodicamente()
});