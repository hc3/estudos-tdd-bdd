import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

let database = null;

export default (app) => {
  if(!database) {
    const config = app.config,
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config.params
    );
    database = {
      sequelize,
      Sequelize,
      models: {}
    };
    
    sequelize.sync().done() => {
      return database;
    };
  }
  return database;
};
