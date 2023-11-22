const Sequelize = require('sequelize');

class Assiste extends Sequelize.Model {
  static init(sequelize) {
    super.init({}, {
      sequelize,
      tableName: 'assistes',
    });

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Usuario, { foreignKey: 'usuario_id', through: 'assistes' });
    this.belongsToMany(models.Filme, { foreignKey: 'filme_id', through: 'assistes' });
  }
}

module.exports = Assiste;