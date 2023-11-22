const Sequelize = require('sequelize');

class Cult extends Sequelize.Model {
  static init(sequelize) {
    super.init({
      titular: {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: false,
        validate: {
          len: {
            args: [2, 255],
            msg: 'O nome do titular deve ter entre 2 e 255 caracteres',
          }
        }
      }, 
      numero: {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: false,
        validate: {
          len: {
            args: [16, 16],
            msg: 'O número do cartão deve ter 16 caracteres',
          }
        }
      },
      mes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'O mês mínimo é 1',
          },
          max: {
            args: [12],
            msg: 'O mês máximo é 12',
          }
        }
      },
      ano: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
          min: {
            args: [new Date().getFullYear()],
            msg: 'O ano mínimo é o ano atual',
          },
          max: {
            args: [new Date().getFullYear() + 10],
            msg: 'O ano máximo é o ano atual + 10',
          }
        }
      },
      cvv: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
          min: {
            args: [100],
            msg: 'O CVV mínimo é 100',
          },
          max: {
            args: [999],
            msg: 'O CVV máximo é 999',
          }
        }
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: {
          msg: 'Este usuário já possui um cartão cadastrado',
        }
      }
    }, {
      sequelize,
      tableName: 'cults',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', through: 'cults' });
  }
}

module.exports = Cult;