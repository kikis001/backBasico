// Configuración centralizada de base de datos (estilo NestJS)
const databaseConfig = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNC === 'true' || true,
};

class DatabaseService {
  constructor(config = databaseConfig) {
    this.config = config;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.isConnected = true;
      console.log(
        `conexión con éxito a "${this.config.database}" (${this.config.type}) en ${this.config.host}:${this.config.port}`
      );
      return this;
    } catch (error) {
      console.error('error al conectar a la base de datos:', error);
      throw error;
    }
  }

  getConnection() {
    if (!this.isConnected) {
      console.warn('la conexión no se ha inicializado');
    }
    return this;
  }
}

const databaseService = new DatabaseService();

module.exports = {
  databaseConfig,
  DatabaseService,
  databaseService,
};
