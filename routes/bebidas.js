const express = require("express");

const router = express.Router();

const bebidas = [
  {
    id: 1,
    nombre: "Coca-Cola",
  },
  {
    id: 2,
    nombre: "Sprite",
  },
  {
    id: 3,
    nombre: "Agua",
  },
];

class BebidaDto {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }
}

router.get("/", (req, res) => {
  return res.status(200).json(bebidas);
});

router.post("/", (req, res) => {
  const { id, nombre } = req.body;
  if (!id || !nombre) {
    return res.status(400).json({ message: "El id y el nombre son obligatorios" });
  }
  const existe = bebidas.some((b) => b.id === Number(id));
  if (existe) {
    return res.status(400).json({ message: "El id ya existe" });
  }
  const bebida = new BebidaDto(Number(id), nombre);
  bebidas.push(bebida);
  return res.status(201).json(bebidas);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  const bebida = bebidas.find((b) => b.id === Number(id));
  if (!bebida) {
    return res.status(404).json({ message: "Bebida no encontrada" });
  }

  bebida.nombre = nombre;
  return res.status(200).json({ message: "Bebida actualizada con éxito", data: bebida });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = bebidas.findIndex((b) => b.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: "Bebida no encontrada" });
  }

  const eliminada = bebidas.splice(index, 1)[0];
  return res.status(200).json({ message: "Bebida eliminada con éxito", data: eliminada });
});

module.exports = router;