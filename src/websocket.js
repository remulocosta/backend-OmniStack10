const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

const connections = [];

let io;

exports.setupWebSocket = server => {
  io = socketio(server);

  io.on('connection', socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs),
    });
  });
};

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    return (
      console.log(connections),
      calculateDistance(coordinates, connection.coordinates) < 10 &&
        connection.techs.some(item => {
          const techsLowerCase = techs.map(tech => tech.toLowerCase());
          return techsLowerCase.includes(item.toLowerCase());
        })
    );
  });
};

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
};
