const express = require("express");
const pizzasRepository = require("../repositories/pizzas.repository");

const router = express.Router();

class PizzaDto {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }
}

router.get("/", (req, res) => {
  return res.status(200).json(pizzasRepository.obtenerTodos());
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const pizza = pizzasRepository.obtenerPorId(id);

  if (!pizza) {
    return res.status(404).json({ message: "Pizza no encontrada" });
  }

  return res.status(200).json(pizza);
});

// crear
router.post("/", (req, res) => {
  const { id, nombre } = req.body;
  if (!id || !nombre) {
    return res.status(400).json({ message: "El id y el nombre son obligatorios" });
  }
  const existe = pizzasRepository.obtenerPorId(id);
  if (existe) {
    return res.status(400).json({ message: "El id ya existe" });
  }
  const pizza = new PizzaDto(Number(id), nombre);
  pizzasRepository.crear(pizza);
  return res.status(201).json(pizzasRepository.obtenerTodos());
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  const pizzaActualizada = pizzasRepository.actualizar(id, { nombre });
  if (!pizzaActualizada) {
    return res.status(404).json({ message: "Pizza no encontrada" });
  }

  return res.status(200).json({ message: "Pizza actualizada con éxito", data: pizzaActualizada });
});

/* qué hueva alch */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const eliminada = pizzasRepository.eliminar(id);

  if (!eliminada) {
    return res.status(404).json({ message: "Pizza no encontrada" });
  }

  return res.status(200).json({ message: "Pizza eliminada con éxito", data: eliminada });
});

module.exports = router;