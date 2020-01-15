const { Router } = require('express');
const DevController = require('./controllers/DevController');

const routes = Router();

// Métodos HTTP, GET,POST, PUT, DELETE

// Tipo de parametros:

// Query Params: request.query  (Filtros, ordenação, paginação, ...)
// Route Params: request.params (Identificar um recurso na alteração ou remoção)
// Body:         request.body   (Dados para criação ou alteração de um registro )

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

module.exports = routes;
