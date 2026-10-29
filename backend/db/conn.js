const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true);

async function connectDatabase() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error("A variável MONGODB_URI não foi definida no arquivo .env.");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB conectado com sucesso.");
}

module.exports = connectDatabase;
