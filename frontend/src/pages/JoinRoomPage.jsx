import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function JoinRoomPage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    try {
      const response = await api.post("/join-room/", { code });
      if (response.status === 200) {
        navigate(`/room/${code}`);
      }
    } catch (error) {
      alert("Invalid room code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-2xl font-bold">Join a Room</h2>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Enter Room Code"
        className="border p-2 rounded"
      />

      <button
        onClick={handleJoinRoom}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Join
      </button>
    </div>
  );
}
