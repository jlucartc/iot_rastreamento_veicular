import * as Mapas from './modulo_de_mapas.js'

function procura_callback_para_evento(evento){
	var mapa_de_callbacks = Mapas.mapa_de_eventos.get(evento.type)
	var elemento = evento.target
	elemento.classList.forEach(function(classe){
		var callback_do_elemento = mapa_de_callbacks.get(classe)
		if(callback_do_elemento != undefined){
			callback_do_elemento(elemento)
		}
	})
}

function cadastra_elemento_em_evento(elemento,evento){
	elemento.addEventListener(evento,procura_callback_para_evento)
}

export { cadastra_elemento_em_evento }