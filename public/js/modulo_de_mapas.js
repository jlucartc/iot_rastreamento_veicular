import * as Callbacks from './modulo_de_callbacks.js'

export const mapa_de_urls = new Map([
	['nav-dispositivos','/dispositivos'],
	['nav-regioes','/regioes'],
	['nav-eventos','/eventos'],
	['nav-registros','/registros']
]);

const mapa_de_callbacks_de_click = new Map([
	['lista-dispositivos',Callbacks.item_dispositivos_click_callback],
	['lista-regioes',Callbacks.item_regioes_click_callback],
	['lista-eventos',Callbacks.item_eventos_click_callback],
	['nav-dispositivos',Callbacks.nav_dispositivos_click_callback],
	['nav-regioes',Callbacks.nav_regioes_click_callback],
	['nav-eventos',Callbacks.nav_eventos_click_callback],
	['nav-registros',Callbacks.nav_registros_click_callback],
	['cria-evento',Callbacks.cria_evento_click_callback],
	['cria-regiao',Callbacks.cria_regiao_click_callback],
	['cria-registro',Callbacks.cria_registro_click_callback],
	['envia-formulario-registro',Callbacks.envia_formulario_registro_click_callback],
	['envia-formulario-regiao',Callbacks.envia_formulario_regiao_click_callback],
	['envia-formulario-evento',Callbacks.envia_formulario_evento_click_callback],
	['cancela-formulario-registro',Callbacks.cancela_formulario_registro_click_callback],
	['cancela-formulario-regiao',Callbacks.cancela_formulario_regiao_click_callback],
	['cancela-formulario-evento',Callbacks.cancela_formulario_evento_click_callback]
]);

const mapa_de_callbacks_de_change = new Map([
	['formulario-registro-evento',Callbacks.formulario_registro_evento_change_callback],
	['formulario-registro-regiao',Callbacks.formulario_registro_regiao_change_callback],
	['formulario-evento-nome',Callbacks.formulario_evento_nome_change_callback],
	['formulario-evento-criterio',Callbacks.formulario_evento_criterio_change_callback],
	['formulario-evento-regiao',Callbacks.formulario_evento_regiao_change_callback],
	['formulario-evento-mensagem',Callbacks.formulario_evento_mensagem_change_callback],
	['formulario-regiao-nome',Callbacks.formulario_regiao_nome_change_callback],
	['formulario-regiao-raio',Callbacks.formulario_regiao_raio_change_callback]
]);

export const mapa_de_eventos = new Map([
	['click',mapa_de_callbacks_de_click],
	['change',mapa_de_callbacks_de_change]
]);