class Evento{
	constructor(json){
		this.id = json.id
		this.nome = json.nome
		this.texto = json.texto
		this.criterio_id = json.criterio_id
	}
}

class Dispositivos{
	constructor(json){
		this.nome = json.nome
	}
}

class Regioes{
	constructor(json){
		this.id = json.id
		this.nome = json.nome
		this.circulo = json.circulo
	}
}

class Registros{
	constructor(json){
		this.id = json.id
		this.evento_id = json.evento_id
		this.regiao_id = json.regiao_id
	}
}

class Criterios{
	constructor(json){
		this.id = json.id
		this.nome = json.nome
	}
}

class MensagemEvento{
	constructor(json){
		this.id = json.id
		this.evento_id = json.evento_id
		this.regiao_id = json.regiao_id
		this.dispositivo = json.dispositivo
		this.data = json.data
	}
}
