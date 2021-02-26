# iot_rastreamento_veicular
Aplicação de visualização de dados de rastreamento veicular

# Executando a aplicação
Para rodar a aplicação, instale as dependências com `npm install` e execute `DEBUG=iot-rastreamento-veicular-app:* npm start`

# Objetivos
- Inicializar mapa com dados mais recentes(ultimos 10 minutos)
- Utilizar AJAX e Postgres LISTEN/NOTIFY para atualizar o mapa de acordo com a chegada dos pontos
- Os eventos serão criados pelo próprio postgres via trigger
