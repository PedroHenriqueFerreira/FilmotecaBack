const sequelize = require('sequelize');

const Filme = require('../models/Filme');
const Assiste = require('../models/Assiste');
const Favorita = require('../models/Favorita');
const Comentario = require('../models/Comentario');
const Usuario = require('../models/Usuario');

module.exports = {
  async criarComCodigo(req, res) {
    try {
      const url = `http://www.omdbapi.com/?apikey=22d3358b&i=${req.params.codigo}`;

      const response = await fetch(url);

      const data = await response.json();

      const poster = data['Poster'];
      const avaliacao = parseInt(data['imdbRating']);
      const genero = data['Genre'].split(', ')[0];
      const ano = parseInt(data['Year']);
      const titulo = data['Title'];
      const sinopse = data['Plot'];

      const filme = await Filme.findOne({ where: { titulo } });

      if (filme) {
        return res.status(400).json({ errors: ['Filme já cadastrado'] });
      }

      await Filme.create({ poster, avaliacao, genero, ano, titulo, sinopse });

      return res.json({ message: 'Filme cadastrado com sucesso!' });
    } catch(e) {

      // Lidar com erros
      return res.status(400).json({
        errors: ['Filme não encontrado'],
      });
    }
  },

  async criar(req, res) {
    try {
      const { 
        poster = '', 
        avaliacao = 0, 
        genero = '', 
        ano = 0, 
        titulo = '', 
        sinopse = '' 
      } = req.body;

      // Cria um novo filme
      await Filme.create({ poster, avaliacao, genero, ano, titulo, sinopse });

      return res.json({ message: 'Filme cadastrado com sucesso!' });

    } catch (e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },
  
  async assistir(req, res) {
    try {
      const filmeId = parseInt(req.params.filmeId);
      const usuarioId = req.usuarioId;

      const filme = await Filme.findByPk(filmeId);
      
      if (!filme) {
        return res.status(404).json({ errors: ['Filme não encontrado'] });
      }

      const assistido = await Assiste.findOne({ where: { usuario_id: usuarioId, filme_id: filmeId } });

      if (assistido) {
        await assistido.destroy();
        return res.json({ message: 'Filme removido dos assistidos' });

      } else {
        await Assiste.create({ usuario_id: usuarioId, filme_id: filmeId });
        return res.json({ message: 'Filme assistido com sucesso!' });
      }

    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },

  async favoritar(req, res) {
    try {
      const filmeId = parseInt(req.params.filmeId);
      const usuarioId = req.usuarioId;

      const filme = await Filme.findByPk(filmeId);
      
      if (!filme) {
        return res.status(404).json({ errors: ['Filme não encontrado'] });
      }

      const favorito = await Favorita.findOne({ where: { usuario_id: usuarioId, filme_id: filmeId } });

      if (favorito) {
        await favorito.destroy();
        return res.json({ message: 'Filme removido dos favoritos' });

      } else {
        await Favorita.create({ usuario_id: usuarioId, filme_id: filmeId });
        return res.json({ message: 'Filme favoritado com sucesso!' });
      }

    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },
  async filtrar(req, res) {
    try {
      const { titulo = '' } = req.query;

      const filmes = await Filme.findAll({ where: { titulo: {
        [sequelize.Op.like]: `%${titulo}%`
      } } });

      return res.json({ message: 'Filmes filtrados com sucesso!', filmes });
    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },
  async assistidos(req, res) {
    try {
      const usuarioId = req.usuarioId;

      const filmes = await Filme.findAll({
        include: [{
          model: Assiste,
          where: { usuario_id: usuarioId }
        }]
      });

      const filmesAleatorios = filmes.sort(() => Math.random() - Math.random());

      return res.json({ message: 'Assistidos encontrados com sucesso!', filmes: filmesAleatorios });
    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },
  async favoritos(req, res) {
    try {
      const usuarioId = req.usuarioId;

      const filmes = await Filme.findAll({
        include: [{
          model: Favorita,
          where: { usuario_id: usuarioId }
        }]
      });

      const filmesAleatorios = filmes.sort(() => Math.random() - Math.random());

      return res.json({ message: 'Favoritos encontrados com sucesso!', filmes: filmesAleatorios });
    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },

  async recomendacoes(req, res) {
    try {
      const usuarioId = req.usuarioId;

      const favoritos = await Favorita.findAll({ usuario_id: usuarioId });
      const assistidos = await Assiste.findAll({ usuario_id: usuarioId });

      const favoritosIds = favoritos.map((favorito) => favorito.filme_id);
      const assistidosIds = assistidos.map((assistido) => assistido.filme_id);

      const ids = [...favoritosIds, ...assistidosIds];

      // Filmes que o usuário não assistiu
      const filmes = await Filme.findAll({
        where: {
          id: {
            [sequelize.Op.notIn]: ids
          }
        }
      });

      const filmesAleatorios = filmes.sort(() => Math.random() - Math.random());

      return res.json({ message: 'Recomendações encontradas com sucesso!', filmes: filmesAleatorios });
    } catch(e) {
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },

  async populares(req, res) {
    try {
      // Filmes mais bem avaliados
      const filmes = await Filme.findAll({
        order: [
          ['avaliacao', 'DESC']
        ],
      });

      return res.json({ message: 'Filmes populares encontrados com sucesso!', filmes });
    } catch(e) {

      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },
  async comentar(req, res) {
    try {
      const filmeId = parseInt(req.params.filmeId);
      const usuarioId = req.usuarioId;

      const filme = await Filme.findByPk(filmeId);
      
      if (!filme) {
        return res.status(404).json({ errors: ['Filme não encontrado'] });
      }

      const { texto = '' } = req.body;

      await Comentario.create({ usuario_id: usuarioId, filme_id: filmeId, texto });

      return res.json({ message: 'Comentário criado com sucesso!' });

    } catch(e) {
      
      // Lidar com erros
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  },

  async buscarPorId(req, res) {
    try {
      const filmeId = parseInt(req.params.id);

      const filme = await Filme.findByPk(filmeId, {
        include: [{
          model: Comentario,
          include: [{
            model: Usuario,
            attributes: ['id', 'apelido']
          }]
        }, {
          model: Assiste,
        }, {
          model: Favorita,
        }],
      });
      
      if (!filme) {
        return res.status(404).json({ errors: ['Filme não encontrado'] });
      }

      return res.json({ message: 'Filme encontrado com sucesso!', filme });

    } catch(e) {
      
      // Lidar com erros
      return res.status(400).json({
        errors: ['Filme não encontrado'],
      });
    }
  },

  async generos(req, res) {
    try {
      const filmes = await Filme.findAll();

      const generos = filmes.map((filme) => filme.genero);

      const generosUnicos = [...new Set(generos)];

      const filmesPorGenero = generosUnicos.map((genero) => {
        return {
          genero,
          filmes: filmes.filter((filme) => filme.genero === genero)
        }
      });

      return res.json({ message: 'Filmes agrupados por gênero com sucesso!', generos: filmesPorGenero });

    } catch(e) {
      
      // Lidar com erros
      return res.status(400).json({
        errors: ['Filmes não encontrados'],
      });
    }
  }
}