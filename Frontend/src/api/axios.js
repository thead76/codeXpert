import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // this points to your backend
});

export default API;
