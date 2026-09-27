const { databaseService } = require("../config/database");

class PizzasRepository {
  constructor(database) {
    this.database = database;
    this.collectionName = "pizzas";
  }

  obtenerColeccion() {
    return this.database.obtenerColeccion(this.collectionName);
  }

  convertirAPizza(document) {
    if (!document) {
      return null;
    }

    return {
      id: document._id,
      nombre: document.nombre,
      isActive: document.isActive,
    };
  }

  async obtenerTodos() {
    const documents = await this.obtenerColeccion().find({ isActive: 1 }).sort({ _id: 1 }).toArray();
    // verificar ese map -> no es necesario, ya que la función convertirAPizza se puede aplicar directamente en el find
    return documents.map((document) => this.convertirAPizza(document));
  }


  async obtenerPorId(id) {
    const document = await this.obtenerColeccion().findOne({
      _id: id,
      isActive: 1,
    });
    return this.convertirAPizza(document);
  }

  async existePorId(id) {
    const document = await this.obtenerColeccion().findOne(
      { _id: id },
      { projection: { _id: 1 } },
    );

    return document !== null;
  }

  async crear(data) {
    const document = {
      _id: data.id,
      nombre: data.nombre,
      isActive: 1,
    };

    await this.obtenerColeccion().insertOne(document);
    return this.convertirAPizza(document);
  }

  async actualizar(id, data) {
    const document = await this.obtenerColeccion().findOneAndUpdate(
      { _id: id, isActive: 1 },
      { $set: { nombre: data.nombre } },
      { returnDocument: "after" },
    );

    return this.convertirAPizza(document);
  }

  async eliminar(id) {
    const document = await this.obtenerColeccion().findOneAndUpdate(
      { _id: id, isActive: 1 },
      { $set: { isActive: 0 } },
      { returnDocument: "after" },
    );

    return this.convertirAPizza(document);
  }
}

module.exports = new PizzasRepository(databaseService);
