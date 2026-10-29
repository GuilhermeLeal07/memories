import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios-config";
import "./Home.css";

const Home = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const getMemories = async () => {
      try {
        const response = await axios.get("/memories");
        if (isMounted) setMemories(response.data);
      } catch (requestError) {
        const message = requestError.response?.data?.msg || "Não foi possível carregar as memórias. Verifique se a API está disponível.";
        if (isMounted) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getMemories();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div className="home"><p>Carregando memórias...</p></div>;
  if (error) return <div className="home"><p role="alert">{error}</p></div>;

  return (
    <div className="home">
      <h2>Confira as últimas memórias</h2>
      {memories.length === 0 ? (
        <p>Ainda não há memórias. Que tal criar a primeira?</p>
      ) : (
        <div className="memories-container">
          {memories.map((memory) => (
            <div className="memory" key={memory._id}>
              <img
                src={`${axios.defaults.baseURL}${memory.src}`}
                alt={memory.title}
                loading="lazy"
              />
              <p>{memory.title}</p>
              <Link className="btn" to={`/memories/${memory._id}`}>
                Ver memória
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
