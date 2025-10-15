import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function CreateRoomPage() {
  const [roomName, setRoomName] = useState(""); // New state for room name
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [error, setError] = useState(""); 
  const [isAuthenticated,setIsAuthenticated] = useState(false);

   useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await api.get("/isAuthenticated/");
        console.log("Auth response:", response.data);

        // If backend returns { status: true } or similar
        setIsAuthenticated(response.data.status);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      }
    };

    checkLogin(); // Call the async function
  }, [])


  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      const response = await api.post("/create-room/", {
        host: roomName, // Include room name in the request
        guest_can_pause: guestCanPause,
        votes_to_skip: votesToSkip,
      });
      navigate(`/room/${response.data.code}`);
    } catch (error) {
      console.error("Error creating room:", error);
      setError("Failed to create room. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-2xl font-bold">Create a Room</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* New input field for room name */}
      <label>
        Room Name:
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="ml-2 border p-1 w-64"
          required // Optional: Make it a required field
        />
      </label>

      <label>
        Guest Can Pause:
        <select
          value={guestCanPause}
          onChange={(e) => setGuestCanPause(e.target.value === "true")}
          className="ml-2 border p-1"
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </label>

      <label>
        Votes to Skip:
        <input
          type="number"
          min="1"
          value={votesToSkip}
          onChange={(e) => setVotesToSkip(Math.max(1, Number(e.target.value)))}
          className="ml-2 border p-1 w-20"
        />
      </label>

      <button
        onClick={handleCreateRoom}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Create Room
      </button>
    </div>
  );
}