const express = require("express");
const router = express.Router();
const {
  createMemory,
  getMemories,
  getMemoryById,
  deleteMemory,
  updateMemory,
  toggleFavorite,
  addComment,
} = require("./controllers/MemoryController");
const upload = require("./helpers/upload");

router.post("/", upload.single("image"), createMemory);
router.get("/", getMemories);
router.patch("/favorite/:id", toggleFavorite);
router.patch("/:id/comment", addComment);
router.get("/:id", getMemoryById);
router.delete("/:id", deleteMemory);
router.patch("/:id", upload.single("image"), updateMemory);

module.exports = router;
