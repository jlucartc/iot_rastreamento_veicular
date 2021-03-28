import * as Callbacks from './modulo_de_callbacks.js'

export const mapa_de_urls = new Map([
	['nav-dispositivos','/dispositivos'],
	['nav-regioes','/regioes'],
	['nav-eventos','/eventos'],
	['nav-registros','/registros']
]);

const mapa_de_callbacks_de_click = new Map([
	['lista-dispositivos',Callbacks.clica_em_item_da_lista_de_dispositivos],
	['lista-regioes',Callbacks.clica_em_item_da_lista_de_regioes],
	['lista-eventos',Callbacks.clica_em_item_da_lista_de_eventos],
	['nav-dispositivos',Callbacks.clica_em_menu_de_dispositivos],
	['nav-regioes',Callbacks.clica_em_menu_de_regioes],
	['nav-eventos',Callbacks.clica_em_menu_de_eventos],
	['nav-registros',Callbacks.clica_em_menu_de_registros],
	['cria-evento',Callbacks.cria_formulario_de_evento],
	['cria-regiao',Callbacks.cria_formulario_de_regiao],
	['cria-registro',Callbacks.cria_formulario_de_registro],
	['envia-formulario-registro',Callbacks.confirma_criacao_de_registro],
	['envia-formulario-regiao',Callbacks.confirma_criacao_de_regiao],
	['envia-formulario-evento',Callbacks.confirma_criacao_de_evento],
	['cancela-formulario-registro',Callbacks.cancela_criacao_de_registro],
	['cancela-formulario-regiao',Callbacks.cancela_criacao_de_regiao],
	['cancela-formulario-evento',Callbacks.cancela_criacao_de_evento]
]);

const mapa_de_callbacks_de_change = new Map([
	['formulario-registro-evento',Callbacks.atualiza_evento_do_registro],
	['formulario-registro-regiao',Callbacks.atualiza_regiao_do_registro],
	['formulario-evento-nome',Callbacks.atualiza_nome_do_evento],
	['formulario-evento-criterio',Callbacks.atualiza_criterio_do_evento],
	['formulario-evento-regiao',Callbacks.atualiza_regiao_do_evento],
	['formulario-evento-mensagem',Callbacks.atualiza_mensagem_do_evento],
	['formulario-regiao-nome',Callbacks.atualiza_nome_da_regiao],
	['formulario-regiao-raio',Callbacks.atualiza_raio_da_regiao]
]);

export const mapa_de_eventos = new Map([
	['click',mapa_de_callbacks_de_click],
	['change',mapa_de_callbacks_de_change]
]);