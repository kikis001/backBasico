const express = require("express");

const router = express.Router();

const tamanios = [
  {
    id: 1,
    nombre: "Chica",
  },
  {
    id: 2,
    nombre: "Mediana",
  },
  {
    id: 3,
    nombre: "Grande",
  },
];

router.get("/", (req, res) => {
  return res.status(200).json(tamanios);
});

// dto
class TamanioDto {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }
}

router.post("/", (req, res) => {
  const { id, nombre } = req.body;
  if (id <= tamanios.length) {
    return res.status(400).json({ message: 'El id ya existe' });
  }
  if (!id || !nombre) {
    return res.status(400).json({ message: 'El id y el nombre son obligatorios' });
  }
  const tamanio = new TamanioDto(id, nombre);
  tamanios.push(tamanio);
  return res.status(201).json(tamanios);
});

module.exports = router;
