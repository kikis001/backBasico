const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
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

  return res.status(200).json(bebidas);
});

module.exports = router;