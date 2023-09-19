import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  withCredentials: true, // Add this line to enable sending credentials with requests
});

export default instance;
