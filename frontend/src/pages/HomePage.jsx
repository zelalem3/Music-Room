import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api"; // ✅ Make sure this path is correct

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated with Spotify
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/isAuthenticated/");
        setIsAuthenticated(response.data.status);
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkAuth();
  }, []);

const handleLogin = async () => {
  const loginUrl = `${import.meta.env.VITE_API_URL}/login/`; // Ensure this is correct
  console.log("Redirecting to:", loginUrl); // Debug log
  window.location.href = loginUrl; // Redirect to the login endpoint
};
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">🎵 Music Room</h1>
      <p className="text-gray-600">Create or join a room to start listening together.</p>

      <div className="space-x-4">
        <Link to="/join" className="px-4 py-2 bg-blue-500 text-white rounded">
          Join Room
        </Link>
        <Link to="/create" className="px-4 py-2 bg-green-500 text-white rounded">
          Create Room
        </Link>

        {!isAuthenticated ? (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Login with Spotify
          </button>
        ) : (
          <p className="text-green-600 font-semibold">✅ Logged in with Spotify</p>
        )}
      </div>
    </div>
  );
}
