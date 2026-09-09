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

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const tamanio = tamanios.find((t) => t.id === Number(id));

  if (!tamanio) {
    return res.status(404).json({ message: "Tamaño no encontrado" });
  }

  return res.status(200).json(tamanio);
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
  if (!id || !nombre) {
    return res.status(400).json({ message: 'El id y el nombre son obligatorios' });
  }
  const existe = tamanios.some((t) => t.id === Number(id));
  if (existe) {
    return res.status(400).json({ message: 'El id ya existe' });
  }
  const tamanio = new TamanioDto(Number(id), nombre);
  tamanios.push(tamanio);
  return res.status(201).json(tamanios);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }

  const tamanio = tamanios.find((t) => t.id === Number(id));
  if (!tamanio) {
    return res.status(404).json({ message: 'Tamaño no encontrado' });
  }

  tamanio.nombre = nombre;
  return res.status(200).json({ message: 'Tamaño actualizado con éxito', data: tamanio });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = tamanios.findIndex((t) => t.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Tamaño no encontrado' });
  }

  const eliminado = tamanios.splice(index, 1)[0];
  return res.status(200).json({ message: 'Tamaño eliminado con éxito', data: eliminado });
});

module.exports = router;
