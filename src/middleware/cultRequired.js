const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const cultRequired = async (req, res, next) => {
  try {
    if (req.isCult) {
      return next();
    } else {
      return res.status(401).json({
        errors: ['É necessário ser um Cult para realizar esta ação'],
      });
    }
  } catch (e) {
    return res.status(401).json({
      errors: ['Houve algum erro'],
    });
  }
};

module.exports = cultRequired;