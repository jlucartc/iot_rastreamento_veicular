var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Client } = require('pg')
var mqtt = require('mqtt')

var client = mqtt.connect('mqtt://brazil.thethings.network',{password: 'ttn-account-v2.DPJ83OzXhKXzVJ278Z7VGRnkT58daccikh3jJQvFaE0', username: 'greatway-test'})

client.on('connect', function () {
  client.subscribe('+/devices/+/up', function (err) {
    if (!err) {
      console.log('ok')
    }else{
    	console.log('erro')
    }
  })
})

const conn = new Client({
		host: 'localhost',
    user: 'luca',
    password: '123',
    database: 'iot'
});

conn.connect()

function executa_query(query,params){
	conn.query(query,params).then(function(result){ console.log(result) },function(err){ console.log(err) })
}

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(JSON.parse(message.toString()))
  message = JSON.parse(message.toString())
  executa_query("INSERT INTO mensagens (aplicacao,dispositivo,payload,data) VALUES ($1,$2,$3,$4)",[message.app_id,message.hardware_serial,message.payload_raw,message.metadata.time])
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('files'))

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
