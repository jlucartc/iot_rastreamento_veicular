# iot_rastreamento_veicular
Aplicação de visualização de dados de rastreamento veicular

# Executando a aplicação
Para rodar a aplicação, instale as dependências com `npm install` e execute `DEBUG=iot-rastreamento-veicular-app:* npm start`

# Objetivos
- Inicializar mapa com dados mais recentes(ultimos 10 minutos)
- Utilizar AJAX e Postgres LISTEN/NOTIFY para atualizar o mapa de acordo com a chegada dos pontos
- Os eventos serão criados pelo próprio postgres via trigger

# Configuração do ambiente
- Instale o Postgres(https://linuxize.com/post/how-to-install-postgresql-on-ubuntu-20-04/)
- Instale o pgadmin(https://computingforgeeks.com/how-to-install-pgadmin-4-on-ubuntu/)
- Instale o PostGIS(Passos de 1 até 4: https://computingforgeeks.com/how-to-install-postgis-on-ubuntu-debian/)
- Crie uma ROLE chamada `iot` com o comando `CREATE ROLE iot WITH LOGIN SUPERUSER CREATEDB CREATEROLE INHERIT REPLICATION CONNECTION LIMIT -1 PASSWORD '123';`
- Crie uma database chamada `ìot` com o comando `CREATE DATABASE iot;`
- Execute o comando `psql -d iot -f <caminho-desse-repositorio>/banco.sql` para criar as tabelas e inserir os dados no banco
- Rode a aplicação

# Teste
- Acesse a pagina da aplicação na TTN
- Acesse o dispositivo da aplicação
- Envie uma mensagem de uplink com o payload `2d 33 2e 37 34 36 35 35 38 3b 20 2d 33 38 2e 35 37 39 31 39 31 30`
- Cheque se a aplicação emitiu um evento de entrada
- Envie outra mensagem de uplink com o payload `2d 33 2e 37 34 36 35 35 38 3b 20 2d 33 38 2e 35 38 30 31 39 31 30`
- Cheque se a aplicação emitiu um evento de saida