const Sequelize = require('sequelize');
const databaseConfig = require('../config/database');

const Usuario = require('../models/Usuario');
const Filme = require('../models/Filme');
const Assiste = require('../models/Assiste');
const Favorita = require('../models/Favorita');
const Comentario = require('../models/Comentario');
const Cult = require('../models/Cult');

const models = [Usuario, Filme, Assiste, Favorita, Comentario, Cult];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));