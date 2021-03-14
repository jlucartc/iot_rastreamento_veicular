import { cadastra_elemento_em_evento } from './modulo_de_cadastro_de_eventos.js'
import * as Estado from './modulo_de_estado.js'

function configura_menu_de_navegacao(menu,index){
	cadastra_elemento_em_evento(menu,'click')
}

document.addEventListener("DOMContentLoaded",(event) => {
	var itens_da_lista = document.querySelectorAll('div#lista_de_itens a.list-group-item.list-group-item-action')
	var menus_de_navegacao = document.querySelectorAll('ul.navbar-nav li.nav-item')
	menus_de_navegacao.forEach(configura_menu_de_navegacao)
	Estado.cria_mapa()
});