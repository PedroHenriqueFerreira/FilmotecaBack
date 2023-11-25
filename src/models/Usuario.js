const Sequelize = require('sequelize');

const bcryptjs = require('bcryptjs');

class Usuario extends Sequelize.Model {
  static init(sequelize) {
    super.init({
      apelido: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [2, 100],
            msg: 'O apelido deve ter entre 2 e 100 caracteres',
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'Este email já está em uso',
        },
        validate: {
          isEmail: {
            msg: 'Este email é inválido',
          },
        },
      },
      senha_hash: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      senha: {
        type: Sequelize.VIRTUAL,
        defaultValue: '',
        validate: {
          len: {
            args: [8, 50],
            msg: 'A senha precisa ter entre 8 e 50 caracteres',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'usuarios',
    });

    this.addHook('beforeSave', async (user) => {
      if (user.senha) {
        user.senha_hash = await bcryptjs.hash(user.senha, 8);
      }
    });

    return this;
  }

  validarSenha(senha) {
    return bcryptjs.compare(senha, this.senha_hash);
  }

  static associate(models) {
    this.hasMany(models.Assiste, { foreignKey: 'usuario_id' });
    this.hasMany(models.Favorita, { foreignKey: 'usuario_id' });
    this.hasMany(models.Comentario, { foreignKey: 'usuario_id' });
    
    this.hasOne(models.Cult, { foreignKey: 'usuario_id' });
  }
}

module.exports = Usuario;