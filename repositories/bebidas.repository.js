class BebidasRepository {
  constructor() {
    this.bebidas = [
      { id: 1, nombre: "Coca-Cola" },
      { id: 2, nombre: "Sprite" },
      { id: 3, nombre: "Agua" },
    ];
  }

  obtenerTodos() {
    return this.bebidas;
  }

  obtenerPorId(id) {
    return this.bebidas.find((b) => b.id === Number(id));
  }

  crear(data) {
    this.bebidas.push(data);
    return data;
  }

  actualizar(id, data) {
    const bebida = this.obtenerPorId(id);
    if (!bebida) return null;
    if (data.nombre) bebida.nombre = data.nombre;
    return bebida;
  }

  eliminar(id) {
    const index = this.bebidas.findIndex((b) => b.id === Number(id));
    if (index === -1) return null;
    return this.bebidas.splice(index, 1)[0];
  }
}

module.exports = new BebidasRepository();
