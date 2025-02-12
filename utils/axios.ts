import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  },
});

export default apiClient;
