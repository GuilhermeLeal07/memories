import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const baseURL = `${configuredBaseURL.replace(/\/+$/, "")}/`;

const api = axios.create({
  baseURL,
  timeout: 10000,
});

export default api;
