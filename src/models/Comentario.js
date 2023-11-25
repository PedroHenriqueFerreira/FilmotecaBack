const Sequelize = require('sequelize');

class Comentario extends Sequelize.Model {
  static init(sequelize) {
    super.init({
      texto: {
        type: Sequelize.TEXT,
        defaultValue: '',
        allowNull: false,
        validate: {
          len: {
            args: [3, 2000],
            msg: 'O comentário deve ter entre 3 e 2000 caracteres',
          }
        }
      }
    }, {
      sequelize,
      tableName: 'comentarios',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
    this.belongsTo(models.Filme, { foreignKey: 'filme_id' });
  }
}

module.exports = Comentario;