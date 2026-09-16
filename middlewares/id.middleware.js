const convertirId = (valor) => {
  if (typeof valor !== "string" && typeof valor !== "number") {
    return null;
  }

  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

const transformarIdParametro = (req, res, next) => {
  const id = convertirId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      message: 'El id debe ser un entero positivo',
    });
  }

  req.id = id;
  return next();
}

const transformarIdCuerpo = (req, res, next) => {
  const id = convertirId(req.body.id);

  if (id === null) {
    return res.status(400).json({
      message: "El id debe ser un entero positivo",
    });
  }

  req.body.id = id;
  return next();
}

module.exports = {
  transformarIdParametro,
  transformarIdCuerpo,
};