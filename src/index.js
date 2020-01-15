require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/*
ativa leitura da requisição em JSON para o express
*/
app.use(express.json());

/*
Cagrrega as rotas da aplicação
*/
app.use(routes);

app.listen(process.env.APP_PORT);
