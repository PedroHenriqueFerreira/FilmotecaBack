const Sequelize = require('sequelize');

class Favorita extends Sequelize.Model {
  static init(sequelize) {
    super.init({}, {
      sequelize,
      tableName: 'favoritas',
    });

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Usuario, { foreignKey: 'usuario_id', through: 'favoritas' });
    this.belongsToMany(models.Filme, { foreignKey: 'filme_id', through: 'favoritas' });
  }
}

module.exports = Favorita;