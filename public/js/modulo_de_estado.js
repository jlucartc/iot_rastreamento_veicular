var mapa = undefined
var regioes = new Array
var eventos = new Array
var dispositivos = new Array
var data_ultima_consulta = undefined

function adiciona_layer(){
	var layer = new L.StamenTileLayer("toner");
	mapa.addLayer(layer)
}

function cria_mapa(id,lat,lng){
	if(mapa === undefined){
		mapa = L.map('mapa')
		mapa.setView([51.505,-0.09],9)
		adiciona_layer()
	}else{
		mapa.remove()
		mapa = L.map('mapa')
		mapa.setView([51.505,-0.09],9)
		adiciona_layer()
	}
}

export { mapa, regioes, eventos, dispositivos, data_ultima_consulta, cria_mapa }