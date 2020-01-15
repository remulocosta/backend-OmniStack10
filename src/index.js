require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

// Métodos HTTP, GET,POST, PUT, DELETE

// Tipo de parametros:

// Query Params: request.query  ( Filtros, ordenação, paginação, ... )
// Route Params: request.params ( Identificar um recurso na alteração ou remoção )
// Body:         request.body   ( Dados para criação ou alteração de um registro )

app.post('/users', (request, response) => {
  console.log(request.body);
  return response.status(200).json({ message: 'Hello OmniStack' });
});

app.listen(process.env.APP_PORT);
