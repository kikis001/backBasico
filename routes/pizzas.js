const express = require("express");
const pizzasRepository = require("../repositories/pizzas.repository");
const { transformarIdParametro, transformarIdCuerpo } = require("../middlewares/id.middleware");

const router = express.Router();

class PizzaDto {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }
}

router.get("/", async (req, res) => {
  const pizzas = await pizzasRepository.obtenerTodos();
  return res.status(200).json(pizzas);
});

router.get("/:id", transformarIdParametro, async (req, res) => {
  const { id } = req;
  const pizza = await pizzasRepository.obtenerPorId(id);

  if (!pizza) {
    return res.status(404).json({ message: "Pizza no encontrada" });
  }

  return res.status(200).json(pizza);
});

router.post("/", transformarIdCuerpo, async (req, res) => {
  const { id, nombre } = req.body;

  if (typeof nombre !== "string") {
    return res.status(400).json({
      message: "El nombre debe de ser un string",
    });
  }

  const existe = await pizzasRepository.existePorId(id);
  if (existe) {
    return res.status(409).json({ message: "El id ya existe" });
  }

  const pizza = new PizzaDto(id, nombre.trim());
  await pizzasRepository.crear(pizza);

  return res.status(201).json(await pizzasRepository.obtenerTodos());
});

router.put("/:id", transformarIdParametro, async (req, res) => {
  const { id } = req;
  const { nombre } = req.body;

  if (typeof nombre !== "string") {
    return res.status(400).json({ message: "El nombre debe de ser un string" });
  }

  const pizzaActualizada = await pizzasRepository.actualizar(id, {
    nombre: nombre.trim(),
  });

  if (!pizzaActualizada) {
    return res.status(404).json({ message: "Pizza no encontrada" });
  }

  return res.status(200).json({
    message: "Pizza actualizada con exito",
    data: pizzaActualizada,
  });
});

router.delete("/:id", transformarIdParametro, async (req, res) => {
  const { id } = req;
  const eliminada = await pizzasRepository.eliminar(id);

  if (!eliminada) {
    return res.status(404).json({ message: "Pizza no encontrada" });
  }

  return res.status(200).json({
    message: "Pizza eliminada con exito",
    data: eliminada,
  });
});

module.exports = router;