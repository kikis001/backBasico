const express = require("express");
const { databaseService } = require("./config/database");

const pizzasRoutes = require("./routes/pizzas");
const tamaniosRoutes = require("./routes/tamanios");
const bebidasRoutes = require("./routes/bebidas");

const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.json());

app.get('/', (req, res) => {
  const saludo = 'app de kk'
  return res.status(200).json(saludo);
})

app.use('/api/v1/pizzas', pizzasRoutes);
app.use('/api/v1/tamanios', tamaniosRoutes);
app.use('/api/v1/bebidas', bebidasRoutes);

app.listen(PORT, async () => {
  await databaseService.conectar();
  console.log(`http://localhost:${PORT}`);
});