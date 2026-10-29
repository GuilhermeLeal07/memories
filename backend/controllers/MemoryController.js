const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const Memory = require("../models/Memory");

const removeOldImage = async (memory) => {
  if (!memory?.src) return;

  // O banco armazena caminhos relativos como "images/nome-do-arquivo.png".
  const imagesDirectory = path.resolve(__dirname, "../public/images");
  const filePath = path.resolve(__dirname, "../public", memory.src);

  // Impede que um caminho inesperado saia da pasta de imagens.
  if (!filePath.startsWith(`${imagesDirectory}${path.sep}`)) {
    console.warn("Caminho de imagem ignorado por segurança:", memory.src);
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Não foi possível remover a imagem:", error.message);
    }
  }
};

const isValidId = (id) => mongoose.isValidObjectId(id);
const errorResponse = (res, error, message = "Ocorreu um erro interno. Tente novamente.") => {
  console.error(error);
  return res.status(500).json({ msg: message });
};

const createMemory = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ msg: "Preencha o título e a descrição." });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Envie uma imagem JPEG ou PNG." });
    }

    const newMemory = await Memory.create({
      title: title.trim(),
      description: description.trim(),
      src: `images/${req.file.filename}`,
    });

    return res.status(201).json({ msg: "Memória criada com sucesso!", newMemory });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    return errorResponse(res, error);
  }
};

const getMemories = async (_req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    return res.status(200).json(memories);
  } catch (error) {
    return errorResponse(res, error, "Não foi possível carregar as memórias.");
  }
};

const getMemoryById = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ msg: "Identificador de memória inválido." });
  }

  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ msg: "Memória não encontrada!" });
    return res.status(200).json(memory);
  } catch (error) {
    return errorResponse(res, error, "Não foi possível carregar esta memória.");
  }
};

const updateMemory = async (req, res) => {
  if (!isValidId(req.params.id)) {
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
    return res.status(400).json({ msg: "Identificador de memória inválido." });
  }

  try {
    const { title, description } = req.body;
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ msg: "Memória não encontrada!" });
    }

    const oldImage = memory.src;
    if (title !== undefined && !title.trim()) {
      if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ msg: "O título não pode ficar vazio." });
    }
    if (description !== undefined && !description.trim()) {
      if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ msg: "A descrição não pode ficar vazia." });
    }
    if (title !== undefined) memory.title = title.trim();
    if (description !== undefined) memory.description = description.trim();
    if (req.file) memory.src = `images/${req.file.filename}`;

    await memory.save();

    // Só remove a imagem antiga depois de salvar a atualização no banco.
    if (req.file && oldImage !== memory.src) {
      await removeOldImage({ src: oldImage });
    }

    return res.status(200).json(memory);
  } catch (error) {
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
    return errorResponse(res, error, "Não foi possível atualizar a memória.");
  }
};

const deleteMemory = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ msg: "Identificador de memória inválido." });
  }

  try {
    const memory = await Memory.findByIdAndDelete(req.params.id);
    if (!memory) return res.status(404).json({ msg: "Memória não encontrada!" });

    await removeOldImage(memory);
    return res.status(200).json({ msg: "Memória excluída com sucesso." });
  } catch (error) {
    return errorResponse(res, error, "Não foi possível excluir a memória.");
  }
};

const toggleFavorite = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ msg: "Identificador de memória inválido." });
  }

  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ msg: "Memória não encontrada!" });

    memory.favorite = !memory.favorite;
    await memory.save();

    return res.status(200).json({
      msg: memory.favorite ? "Memória adicionada aos favoritos." : "Memória removida dos favoritos.",
      memory,
    });
  } catch (error) {
    return errorResponse(res, error, "Não foi possível atualizar os favoritos.");
  }
};

const addComment = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ msg: "Identificador de memória inválido." });
  }

  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!name || !text) {
      return res.status(400).json({ msg: "Preencha seu nome e o comentário." });
    }

    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ msg: "Memória não encontrada!" });

    memory.comments.push({ name, text });
    await memory.save();

    return res.status(201).json({ msg: "Comentário adicionado!", memory });
  } catch (error) {
    return errorResponse(res, error, "Não foi possível adicionar o comentário.");
  }
};

module.exports = {
  createMemory,
  getMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
  toggleFavorite,
  addComment,
};
