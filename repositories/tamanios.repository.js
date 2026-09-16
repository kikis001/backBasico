class TamaniosRepository {
  constructor() {
    this.tamanios = [
      { id: 1, nombre: "Chica" },
      { id: 2, nombre: "Mediana" },
      { id: 3, nombre: "Grande" },
    ];
  }

  obtenerTodos() {
    return this.tamanios;
  }

  obtenerPorId(id) {
    return this.tamanios.find((t) => t.id === id);
  }

  crear(data) {
    this.tamanios.push(data);
    return data;
  }

  actualizar(id, data) {
    const tamanio = this.obtenerPorId(id);
    if (!tamanio) return null;
    if (data.nombre) tamanio.nombre = data.nombre;
    return tamanio;
  }

  eliminar(id) {
    const index = this.tamanios.findIndex((t) => t.id === id);
    if (index === -1) return null;
    return this.tamanios.splice(index, 1)[0];
  }
}

module.exports = new TamaniosRepository();
