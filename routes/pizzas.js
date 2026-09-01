const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
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

  return res.status(200).json(pizzas);
});

module.exports = router;