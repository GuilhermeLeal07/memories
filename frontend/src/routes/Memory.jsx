import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios-config";
import "./Memory.css";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.msg || fallback;

const Memory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getMemory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/memories/${id}`);
        if (isMounted) {
          setMemory(response.data);
          setComments(response.data.comments || []);
        }
      } catch (error) {
        const message = getErrorMessage(error, "Erro ao carregar a memória.");
        if (isMounted) toast.error(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getMemory();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Preencha seu nome e o comentário.");
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await axios.patch(`/memories/${id}/comment`, {
        name: name.trim(),
        text: text.trim(),
      });
      const updatedComments = response.data.memory.comments || [];
      setComments(updatedComments);
      setMemory(response.data.memory);
      setName("");
      setText("");
      toast.success(response.data.msg);
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao enviar o comentário."));
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que quer excluir esta memória?")) return;

    try {
      const response = await axios.delete(`/memories/${id}`);
      toast.success(response.data.msg);
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao excluir a memória."));
    }
  };

  if (loading) return <p>Carregando memória...</p>;
  if (!memory) return <p>Não foi possível encontrar esta memória.</p>;

  return (
    <div className="memory-page">
      <img src={`${axios.defaults.baseURL}${memory.src}`} alt={memory.title} />
      <h2>{memory.title}</h2>
      <p>{memory.description}</p>
      <button className="btn btn-delete" onClick={handleDelete}>
        Excluir memória
      </button>

      <div className="comment-form">
        <h3>Envie seu comentário:</h3>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Seu nome</span>
            <input
              type="text"
              placeholder="Seu nome"
              onChange={(event) => setName(event.target.value)}
              value={name}
              maxLength={80}
              required
            />
          </label>
          <label>
            <span>Comentário</span>
            <textarea
              placeholder="Seu comentário"
              onChange={(event) => setText(event.target.value)}
              value={text}
              maxLength={1000}
              required
            />
          </label>
          <input
            className="btn"
            type="submit"
            value={submittingComment ? "Enviando..." : "Enviar"}
            disabled={submittingComment}
          />
        </form>
      </div>

      <div className="comments-container">
        <h3>Comentários ({comments.length})</h3>
        {comments.length === 0 ? (
          <p>Não há comentários ainda.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p className="comment-name">{comment.name}</p>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Memory;
