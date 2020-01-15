const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

const DevSchemav = mongoose.Schema({
  name: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  techs: [String],
  location: {
    type: PointSchema,
    createIndexes: '2dsphere',
  },
});

module.exports = mongoose.model('Dev', DevSchemav);
