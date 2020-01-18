const axios = require('axios');

const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

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
    }

    return response.json(dev);
  },

  async update(request, response) {
    // Name, avatar, localização, tecnologias.
    const { id } = request.params;
    const { name, avatar_url, techs, latitude, longitude } = request.body;

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
          avatar_url,
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
