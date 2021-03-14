var mapa = undefined

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

document.onreadystatechange = function(evento){
	cria_mapa()
}