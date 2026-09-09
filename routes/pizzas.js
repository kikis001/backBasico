const express = require("express");

const router = express.Router();

const pizzas = [
  {
    id: 1,
    nombre: "Pepperoni",
  },
  {
    id: 2,
    nombre: "Hawaiana",
  },
  {
    id: 3,
    nombre: "Mexicana",
  },
];

class PizzaDto {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }
}

router.get("/", (req, res) => {
  return res.status(200).json(pizzas);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const pizza = pizzas.find((p) => p.id === Number(id));

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
  const existe = pizzas.some((p) => p.id === Number(id));
  if (existe) {
    return res.status(400).json({ message: "El id ya existe" });
  }
  const pizza = new PizzaDto(Number(id), nombre);
  pizzas.push(pizza);
  return res.status(201).json(pizzas);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  const pizza = pizzas.find((p) => p.id === Number(id));
  if (!pizza) {
    return res.status(404).json({ message: "Pizza no encontrada" });
  }

  pizza.nombre = nombre;
  return res.status(200).json({ message: "Pizza actualizada con éxito", data: pizza });
});

/* qué hueva alch */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = pizzas.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: "Pizza no encontrada" });
  }

  const eliminada = pizzas.splice(index, 1)[0];
  return res.status(200).json({ message: "Pizza eliminada con éxito", data: eliminada });
});

module.exports = router;