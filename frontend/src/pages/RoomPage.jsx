import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function RoomPage() {
  const { code } = useParams();
  const [musicName, setMusicName] = useState("");
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [token, setToken] = useState(null); // State for the Spotify token
  const [searchResults, setSearchResults] = useState([]); // State for search results

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/get-room/?code=${code}`);
        setRoom(response.data);
      } catch {
        navigate("/");
      }
    };

    const fetchToken = async () => {
      try {
        const response = await api.get("get-token/");
        setToken(response.data.access_token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchRoom();
    fetchToken(); // Fetch the token when the component mounts
  }, [code, navigate]);

  if (!room || !token) return <p>Loading...</p>;

  const handleSearchChange = (event) => {
    setMusicName(event.target.value);
  };

  const searchMusic = async () => {
    if (!musicName) return;

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(musicName)}&type=track`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching music:", errorData);
      return;
    }

    const data = await response.json();
    setSearchResults(data.tracks.items); // Store the results in state
  };

 const play_music = async (trackUri) => {
  if (!trackUri) return; // Ensure a track URI is provided

  const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: 'PUT', // Use PUT method for play
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Specify content type
    },
    body: JSON.stringify({
      uris: [trackUri], // Send the track URI in the body
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching music:", errorData);
    return; // Handle error appropriately
  }

  console.log("Music is playing!"); // Optional success message
};




  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-2">
      <input 
        placeholder="Search Music" 
        onChange={handleSearchChange} 
        onKeyDown={(e) => e.key === 'Enter' && searchMusic()} // Search on Enter
      />
      
      <h2 className="text-2xl font-bold">Room Code: {room.code}</h2>
      <p>Host: {room.host}</p>
      <p>Guest Can Pause: {room.guest_can_pause ? "Yes" : "No"}</p>
      <p>Votes to Skip: {room.votes_to_skip}</p>
      
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-gray-400 text-white rounded mt-4"
      >
        Leave Room
      </button>

      <div className="mt-4">
  <h3 className="text-xl font-bold">Search Results:</h3>
  <ul>
    {searchResults.map((track) => (
      <li key={track.id} className="flex justify-between items-center">
        <p>{track.name} by {track.artists.map(artist => artist.name).join(", ")}</p>
        <button
          onClick={() => play_music(track.uri)} // Call play_music with the track URI
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          Play
        </button>
      </li>
    ))}
  </ul>
</div>
    </div>
  );
}