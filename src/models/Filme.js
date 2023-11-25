const Sequelize = require('sequelize');

class Filme extends Sequelize.Model {
  static init(sequelize) {
    super.init({
      poster: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255], 
            msg: 'O poster deve ter entre 3 e 255 caracteres',
          },
          is: {
            args: /http.*\.(gif|jpe?g|tiff?|png|webp|bmp)$/i,
            msg: 'O poster deve ser uma imagem válida',
          }
        }
      },
      avaliacao: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'A avaliação mínima é 0',
          },
          max: {
            args: [10],
            msg: 'A avaliação máxima é 10',
          }
        },
      },
      genero: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [2, 255],
            msg: 'O gênero deve ter entre 2 e 255 caracteres',
          }
        }
      },
      ano: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          min: {
            args: [1888],
            msg: 'O ano mínimo é 1888',
          },
          max: {
            args: [new Date().getFullYear()],
            msg: 'O ano máximo é o ano atual',
          }
        }
      },
      titulo: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'Este título já está em uso',
        },
        validate: {
          len: {
            args: [2, 255],
            msg: 'O título deve ter entre 2 e 255 caracteres',
          }
        }
      },
      sinopse: {
        type: Sequelize.TEXT,
        defaultValue: '',
        validate: {
          len: {
            args: [2, 2000],
            msg: 'A sinopse deve ter entre 2 e 2000 caracteres',
          }
        }
      }
    }, {
      sequelize,
      tableName: 'filmes',
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Assiste, { foreignKey: 'filme_id' });
    this.hasMany(models.Favorita, { foreignKey: 'filme_id' });
    this.hasMany(models.Comentario, { foreignKey: 'filme_id' });
  }
}

module.exports = Filme;