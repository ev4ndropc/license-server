const { Sequelize, DataTypes } = require("sequelize");
const connection = require('../database');

const User = connection.define('Customers',{
  name:{
      type: Sequelize.STRING,
      allowNull: false
  },
  email:{
      type: Sequelize.STRING,
      allowNull: false
  },
  product:{
    type: Sequelize.STRING,
    allowNull: false
  },
  domain:{
    type:Sequelize.STRING,
    allowNull: false
  },
  domain:{
    type:Sequelize.STRING,
    allowNull: false
  },
  date:{
    type: Sequelize.STRING,
    allowNull: false
  },
  isBanned:{
    type:Sequelize.STRING,
    allowNull: false,
  },
  key:{
      type:Sequelize.STRING,
  }
})

User.sync({ force: false });

module.exports = User;
