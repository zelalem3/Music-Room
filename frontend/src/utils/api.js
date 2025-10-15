import axios from "axios";

const api = axios.create({
  baseURL: "https://auditive-unsegmentally-karter.ngrok-free.dev/api/room",
  withCredentials: true, 
});

export default api;
