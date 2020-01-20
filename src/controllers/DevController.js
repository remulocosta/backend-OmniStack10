const axios = require('axios');

const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, latitude, longitude, techs } = request.body.data;

    let dev = await Dev.findOne({ github_username }).collation({
      locale: 'en',
      strength: 1,
    });

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });

      //filtrar as conexões que estão no máximo 10km de distância
      //e que o novo dev tenha pelo menos uma das tecnologias filtradas
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return response.json(dev);
  },

  async update(request, response) {
    // Name, avatar, localização, tecnologias.
    const { id } = request.params;
    const { name, techs, latitude, longitude } = request.body.data;

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    try {
      const dev = await Dev.findByIdAndUpdate(
        id,
        {
          name,
          techs: techsArray,
          location,
        },
        { new: true }
      );

      if (!dev) {
        throw 'Dev informado não foi localizado';
      }

      return response.json(dev);
    } catch (err) {
      return response.status(400).json({ Error: err });
    }
  },

  async destroy(request, response) {
    const { id } = request.params;
    try {
      const dev = await Dev.findByIdAndRemove(id);

      if (!dev) {
        throw 'Dev informado não foi localizado';
      }

      return response.json({ OK: 'Dev removido' });
    } catch (err) {
      return response.status(400).json({ Error: err });
    }
  },
};
