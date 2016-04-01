"use strict";

module.exports = function(sequelize, DataTypes) {
  var Entrepreneur = sequelize.define("Entrepreneur", {
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    photo: DataTypes.BLOB,
    interviewQ: DataTypes.ARRAY(DataTypes.TEXT),
    interviewR: DataTypes.ARRAY(DataTypes.TEXT),
    indices : DataTypes.ARRAY(DataTypes.TEXT)
  });
  return Entrepreneur;
};
