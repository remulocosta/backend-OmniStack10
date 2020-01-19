require('dotenv/config');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const http = require('http');
const { setupWebSocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors());

/*
ativa leitura da requisição em JSON para o express
*/
app.use(express.json());

/*
Cagrrega as rotas da aplicação
*/
app.use(routes);

server.listen(process.env.APP_PORT);
