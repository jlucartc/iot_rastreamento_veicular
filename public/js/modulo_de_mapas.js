import * as Callbacks from './modulo_de_callbacks.js'

export const mapa_de_urls = new Map([
	['nav-dispositivos','/dispositivos'],
	['nav-regioes','/regioes'],
	['nav-eventos','/eventos'],
]);

const mapa_de_callbacks_de_click = new Map([
	['lista-dispositivos',Callbacks.item_dispositivos_click_callback],
	['lista-regioes',Callbacks.item_regioes_click_callback],
	['lista-eventos',Callbacks.item_eventos_click_callback],
	['nav-dispositivos',Callbacks.nav_dispositivos_click_callback],
	['nav-regioes',Callbacks.nav_regioes_click_callback],
	['nav-eventos',Callbacks.nav_eventos_click_callback]
]);

const mapa_de_callbacks_de_change = new Map([

]);

export const mapa_de_eventos = new Map([
	['click',mapa_de_callbacks_de_click],
	['change',mapa_de_callbacks_de_change]
]);