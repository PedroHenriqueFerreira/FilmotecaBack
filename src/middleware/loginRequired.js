const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Cult = require('../models/Cult');

const loginRequired = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      errors: ['O login é requerido'],
    });
  }

  const [, token] = authorization.split(' ');
  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id } = dados;

    const usuario = await Usuario.findOne({ where: { id } });
    
    if (!usuario) {
      return res.status(404).json({
        errors: ['Usuário não encontrado'],
      });
    }
    
    req.usuarioId = id;

    const cult = await Cult.findOne({ where: { usuario_id: id } });

    if (cult) {
      req.isCult = true;
    } else {
      req.isCult = false;
    }

    return next();
  } catch (e) {
    console.log(e);

    return res.status(401).json({
      errors: ['Token expirado ou inválido.'],
    });
  }
};

module.exports = loginRequired;