const express = require("express");
const tamaniosRepository = require("../repositories/tamanios.repository");
const { transformarIdParametro, transformarIdCuerpo } = require("../middlewares/id.middleware");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json(tamaniosRepository.obtenerTodos());
});

router.get("/:id", transformarIdParametro, (req, res) => {
  const { id } = req;
  const tamanio = tamaniosRepository.obtenerPorId(id);

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

router.post("/", transformarIdCuerpo, (req, res) => {
  const { id, nombre } = req.body;
  if (!id || !nombre) {
    return res.status(400).json({ message: 'El id y el nombre son obligatorios' });
  }
  const existe = tamaniosRepository.obtenerPorId(id);
  if (existe) {
    return res.status(400).json({ message: 'El id ya existe' });
  }
  const tamanio = new TamanioDto(id, nombre);
  tamaniosRepository.crear(tamanio);
  return res.status(201).json(tamaniosRepository.obtenerTodos());
});

router.put("/:id", transformarIdParametro, (req, res) => {
  const { id } = req;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }

  const tamanioActualizado = tamaniosRepository.actualizar(id, { nombre });
  if (!tamanioActualizado) {
    return res.status(404).json({ message: 'Tamaño no encontrado' });
  }

  return res.status(200).json({ message: 'Tamaño actualizado con éxito', data: tamanioActualizado });
});

router.delete("/:id", transformarIdParametro, (req, res) => {
  const { id } = req;
  const eliminado = tamaniosRepository.eliminar(id);

  if (!eliminado) {
    return res.status(404).json({ message: 'Tamaño no encontrado' });
  }

  return res.status(200).json({ message: 'Tamaño eliminado con éxito', data: eliminado });
});

module.exports = router;
