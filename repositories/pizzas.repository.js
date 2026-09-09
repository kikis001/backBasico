class PizzasRepository {
  constructor() {
    this.pizzas = [
      { id: 1, nombre: "Pepperoni" },
      { id: 2, nombre: "Hawaiana" },
      { id: 3, nombre: "Mexicana" },
    ];
  }

  obtenerTodos() {
    return this.pizzas;
  }

  obtenerPorId(id) {
    return this.pizzas.find((p) => p.id === Number(id));
  }

  crear(data) {
    this.pizzas.push(data);
    return data;
  }

  actualizar(id, data) {
    const pizza = this.obtenerPorId(id);
    if (!pizza) return null;
    if (data.nombre) pizza.nombre = data.nombre;
    return pizza;
  }

  eliminar(id) {
    const index = this.pizzas.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    return this.pizzas.splice(index, 1)[0];
  }
}

module.exports = new PizzasRepository();
