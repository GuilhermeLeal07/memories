import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios-config";
import "./AddMemory.css";

const AddMemory = () => {
  const [inputs, setInputs] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputs.title.trim() || !inputs.description.trim() || !image) {
      toast.error("Preencha o título, a descrição e selecione uma imagem.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(image.type)) {
      toast.error("Envie uma imagem JPEG ou PNG.");
      return;
    }
    if (image.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", inputs.title.trim());
    formData.append("description", inputs.description.trim());

    setSubmitting(true);
    try {
      const response = await axios.post("/memories", formData);
      toast.success(response.data.msg);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Não foi possível criar a memória.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (event) => {
    if (event.target.name === "image") {
      setImage(event.target.files?.[0] || null);
    } else {
      setInputs((currentInputs) => ({
        ...currentInputs,
        [event.target.name]: event.target.value,
      }));
    }
  };

  return (
    <div className="add-memory-page">
      <h2>Crie uma nova memória</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Título:</p>
          <input
            type="text"
            name="title"
            placeholder="Defina um título"
            onChange={handleChange}
            value={inputs.title}
            maxLength={120}
            required
          />
        </label>
        <label>
          <p>Descrição:</p>
          <textarea
            name="description"
            placeholder="Explique o que aconteceu..."
            onChange={handleChange}
            value={inputs.description}
            maxLength={2000}
            required
          />
        </label>
        <label>
          <p>Foto (JPEG ou PNG, até 5 MB):</p>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png"
            onChange={handleChange}
            required
          />
        </label>
        <input
          className="btn"
          type="submit"
          value={submitting ? "Enviando..." : "Enviar"}
          disabled={submitting}
        />
      </form>
    </div>
  );
};

export default AddMemory;
