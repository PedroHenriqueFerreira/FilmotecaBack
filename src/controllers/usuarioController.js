const jwt = require('jsonwebtoken');

const Usuario = require('../models/Usuario');
const Cult = require('../models/Cult');

module.exports = {
  async register(req, res) {
    try {
      const { apelido = '', email = '', senha = '' } = req.body;

      // Criar um novo usuário
      await Usuario.create({ apelido, email, senha });
  
      // Enviar resposta de sucesso
      return res.json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },

  async login(req, res) {
    try {
      const { email = '', senha = '' } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ errors: ['Email e senha são obrigatórios'] });
      }

      // Verifica se o usuário existe com base no email
      const usuario = await Usuario.findOne({ where: { email } });

      if (usuario) {
        // Verifica se a senha corresponde à senha armazenada no banco de dados
        if (await usuario.validarSenha(senha)) {
          // Usuário autenticado com sucesso, você pode retornar as informações do usuário

          const token = jwt.sign({ id: usuario.id }, process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRATION,
          });

          res.json({ message: 'Usuário autenticado com sucesso', token });
        } else {
          res.status(401).json({ errors: ['Senha incorreta'] });
        }
      } else {
        res.status(404).json({ errors: ['Usuário não encontrado'] });
      }      
    } catch (e) {

      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },

  async perfil(req, res) {
    try {
      const usuario = await Usuario.findOne(
        {
          include: [{
            model: Cult,
          }],
          where: {
            id: req.usuarioId
          }
        }   
      );

      if (!usuario) {
        return res.status(404).json({ errors: ['Usuário não encontrado'] });
      }

      const isCult = usuario.Cult ? true : false;

      const { id, apelido, email } = usuario;

      return res.json({ id, apelido, email, isCult, cult: usuario.Cult });
    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },

  async atualizar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.usuarioId);

      if (!usuario) {
        return res.status(404).json({ errors: ['Usuário não encontrado'] });
      }

      const { senha_atual = '', senha = '' } = req.body;

      if ((!senha_atual && senha) || (senha_atual && !senha)) {
        return res.status(401).json({ errors: ['Senha atual e nova senha são obrigatórias'] });
      }

      if (senha_atual && !(await usuario.validarSenha(senha_atual))) {
        return res.status(401).json({ errors: ['Senha atual incorreta'] });
      }

      await usuario.update(req.body);

      return res.json({ message: 'Usuário atualizado com sucesso!' });
    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },

  async deletar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.usuarioId);

      if (!usuario) {
        return res.status(404).json({ errors: ['Usuário não encontrado'] });
      }

      await usuario.destroy();

      return res.json({ message: 'Usuário deletado com sucesso!' });
    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },

  async assinar(req, res) {
    try {
      const { titular = '', numero = '', mes = 0, ano = 0, cvv = 0 } = req.body;
      
      const cult = await Cult.findOne({ where: { usuario_id: req.usuarioId } });

      if (cult) {
        return res.status(400).json({ errors: ['O usuário já é um Cult'] });
      }

      await Cult.create({ usuario_id: req.usuarioId, titular, numero, mes, ano, cvv });

      return res.json({ message: 'Assinatura criada com sucesso!' });
    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },

  async cancelar(req, res) {
    try {
      const cult = await Cult.findOne({ where: { usuario_id: req.usuarioId } });

      await cult.destroy();

      return res.json({ message: 'Assinatura cancelada com sucesso!' });
    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}