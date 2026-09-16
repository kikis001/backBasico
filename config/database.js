const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../.env.dev'),
  quiet: true,
});

const { MongoClient } = require('mongodb');

const usuario = process.env.MONGO_INITDB_ROOT_USERNAME;
const contrasenia = process.env.MONGO_INITDB_ROOT_PASSWORD;
const credenciales =
  usuario && contrasenia
    ? `${encodeURIComponent(usuario)}:${encodeURIComponent(contrasenia)}@`
    : "";
const MONGODB_CONNECTION_STRING =
  process.env.MONGODB_URI ||
  `mongodb://${credenciales}localhost:27017/?authSource=admin`;

const databaseConfig = Object.freeze({
  uri: MONGODB_CONNECTION_STRING,
  databaseName: process.env.MONGODB_DATABASE || 'pizzeria',
});

class DatabaseService {
  constructor(config = databaseConfig) {
    this.config = config;
    this.client = new MongoClient(config.uri);
    this.database = null;
    this.isConnected = false;
  }

  async conectar() {
    if (this.isConnected) {
      return this;
    }

    await this.client.connect();
    this.database = this.client.db(this.config.databaseName);
    await this.database.command({ ping: 1 });
    this.isConnected = true;

    console.log(
      `Conexion con exito a MongoDB, base "${this.config.databaseName}"`,
    );

    return this;
  }

  obtenerBaseDatos() {
    if (!this.isConnected || !this.database) {
      throw new Error('La conexion a MongoDB no se ha inicializado');
    }

    return this.database;
  }

  obtenerColeccion(nombreColeccion) {
    return this.obtenerBaseDatos().collection(nombreColeccion);
  }

  async cerrar() {
    await this.client.close();
    this.database = null;
    this.isConnected = false;
  }
}

const databaseService = new DatabaseService();

module.exports = {
  MONGODB_CONNECTION_STRING,
  databaseConfig,
  DatabaseService,
  databaseService,
};
