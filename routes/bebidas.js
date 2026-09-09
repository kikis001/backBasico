const express = require("express");
const bebidasRepository = require("../repositories/bebidas.repository");

const router = express.Router();

class BebidaDto {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }
}

router.get("/", (req, res) => {
  return res.status(200).json(bebidasRepository.obtenerTodos());
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const bebida = bebidasRepository.obtenerPorId(id);

  if (!bebida) {
    return res.status(404).json({ message: "Bebida no encontrada" });
  }

  return res.status(200).json(bebida);
});

// crear
router.post("/", (req, res) => {
  const { id, nombre } = req.body;
  if (!id || !nombre) {
    return res.status(400).json({ message: "El id y el nombre son obligatorios" });
  }
  const existe = bebidasRepository.obtenerPorId(id);
  if (existe) {
    return res.status(400).json({ message: "El id ya existe" });
  }
  const bebida = new BebidaDto(Number(id), nombre);
  bebidasRepository.crear(bebida);
  return res.status(201).json(bebidasRepository.obtenerTodos());
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  const bebidaActualizada = bebidasRepository.actualizar(id, { nombre });
  if (!bebidaActualizada) {
    return res.status(404).json({ message: "Bebida no encontrada" });
  }

  return res.status(200).json({ message: "Bebida actualizada con éxito", data: bebidaActualizada });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const eliminada = bebidasRepository.eliminar(id);

  if (!eliminada) {
    return res.status(404).json({ message: "Bebida no encontrada" });
  }

  return res.status(200).json({ message: "Bebida eliminada con éxito", data: eliminada });
});

module.exports = router;