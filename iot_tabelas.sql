create table mensagens(
	id bigserial unique,
	aplicacao text,
	dispositivo text,
	payload text,
	data timestamptz,
	primary key(aplicacao,dispositivo,payload,data)
);

create table eventos(
	id bigserial unique,
	nome text unique,
	texto text,
	criterio_id bigint,
	primary key(nome)
);

create table criterios(
	id bigserial unique,
	nome text unique,
	primary key(nome)
);

create table registros(
	id bigserial unique,
	evento_id bigint,
	regiao_id bigint,
	primary key(regiao_id,evento_id)
);

create table regioes(
	id bigserial unique,
	nome text unique,
	circulo circle,
	primary key(nome)
);

create table mensagens_eventos(
	id bigserial unique,
	evento_id bigint,
	regiao_id bigint,
	dispositivo text,
	data timestamp,
	primary key(evento_id,regiao_id,dispositivo,data)
);

create extension postgis;

create or replace function notifica_pontos() RETURNS trigger AS
$$
	BEGIN
		PERFORM pg_notify('nova_mensagem',row_to_json(NEW)::text);
		RETURN NEW;
	END
$$ language plpgsql;

create trigger alerta_novo_ponto AFTER INSERT ON mensagens
EXECUTE FUNCTION notifica_pontos();

insert into criterios (nome) values ('Entrou na região');
insert into criterios (nome) values ('Saiu da região');

--select ST_Buffer(ST_Point(-38.457067,-4.086444)::geography,5000,'quad_segs=8') -- Cria circulo centrado no ponto e com raio igual a 5 Km
--select ST_SetSRID(ST_Point(-38.457067,-4.086444),4326) -- plota ponto

--select ST_IsEmpty(ST_Intersection(ST_Buffer(ST_Point(-38.457067,-4.086444)::geography,5000,'quad_segs=8'),ST_Point(-38.413757,-4.048884))::geometry) -- Quando o ponto pertence à regiao
--select ST_IsEmpty(ST_Intersection(ST_Buffer(ST_Point(-38.457067,-4.086444)::geography,5000,'quad_segs=8'),ST_Point(-38.457067,-4.086444))::geometry) -- Quando o ponto não pertence à região

--insert into mensagens (aplicacao,dispositivo,payload,data) values ('App1','D1','IC0zLjc0NjU1ODsgLTM4LjU3ODE5MQA=',NOW())

--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzQ2NTU4OyAtMzguNTc5MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzQ2NTU4OyAtMzguNTgwMTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzQ2NTU4OyAtMzguNTgxMTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzQ2NTU4OyAtMzguNTgyMTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzQ2NTU4OyAtMzguNTgzMTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzQ2NTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzQ3NTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzQ4NTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzQ5NTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzUwNTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzUxNTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzUyNTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzUzNTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU0NTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1NTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1NTU4OyAtMzguNTg0MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1NTU4OyAtMzguNTgzMTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1NTU4OyAtMzguNTgyMTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1NTU4OyAtMzguNTgxMTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1NTU4OyAtMzguNTgwMTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1NTU4OyAtMzguNTc5MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1NTU4OyAtMzguNTc4MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1NTU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1NDU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1MzU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1MjU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1MTU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU1MDU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU0OTU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU0ODU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU0NzU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU0NjU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU0NTU4OyAtMzguNTc3MTkxMA==',now())
--INSERT INTO mensagens (aplicacao,dispositivo,payload,data) values ('AppV3','d1','LTMuNzU0NDU4OyAtMzguNTc3MTkxMA==',now())