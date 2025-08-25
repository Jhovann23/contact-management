'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.contacts, { 
      foreignKey: 'userId', // kolom di tabel Contacts yang menunjuk ke tabel Users
      as: 'contacts'   // alias saat melakukan include/join
    });
    }
  }
  users.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    refresh_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};