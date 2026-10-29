const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./db/conn");
const memoryRoutes = require("./routes");

const app = express();
const port = Number(process.env.PORT) || 3000;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : true;

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/memories", memoryRoutes);

app.use((err, _req, res, _next) => {
  console.error("Erro não tratado na API:", err);
  res.status(err.status || 500).json({
    msg: err.status ? err.message : "Ocorreu um erro interno. Tente novamente.",
  });
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Servidor iniciado na porta ${port}.`);
    });
  } catch (error) {
    console.error("Não foi possível iniciar a aplicação:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
