# 🎵 Harmony Music-Room: Real-Time Collaborative Music Room

**Harmony** is a full-stack web application designed for synchronized music listening experiences. It leverages WebSockets to bridge a Django-powered backend with a React frontend, ensuring that users in the same virtual "Room" hear exactly the same thing at the exact same time.

---

## 🚀 Core Features

* **Synchronized Playback:** Real-time synchronization of play, pause, and seek actions across all connected clients.
* **Host-Follower Model:** Specialized logic ensuring followers stay within milliseconds of the host's playback timestamp.
* **Dynamic Room Creation:** Unique room codes allow users to join specific sessions effortlessly.
* **Live Chat & Interaction:** Integrated real-time chat functionality using WebSocket layers.
* **Permissions System:** Hosts can toggle participant controls (e.g., "Guest Playback" permissions).

---

## 🛠 Tech Stack

### Frontend
* **React.js:** Component-based UI with Hooks for state management.
* **Tailwind CSS:** Responsive, high-contrast UI design.
* **Lucide React:** Iconography for a professional look.
* **Socket.io-client:** Robust WebSocket client for handling event broadcasts.

### Backend
* **Django:** Robust Python framework for API and business logic.
* **Django Channels:** Extends Django to handle WebSockets and long-running connections.
* **Redis:** Used as the backing store (Channel Layer) for real-time message passing.
* **PostgreSQL:** Relational database for user data and room persistence.

---

## 📐 Architecture Overview

The system utilizes an **Event-Driven Architecture**:

1.  **Action:** A user (Host) clicks "Play."
2.  **Transmission:** React sends a JSON payload to the Django WebSocket Consumer.
3.  **Broadcast:** Django Channels utilizes Redis to broadcast that event to every client in that specific Room Group.
4.  **Sync:** Every follower's React state updates, triggering the local audio player to match the host's timestamp.

---

## 🔧 Installation & Local Setup

### Prerequisites
* Python 3.10+
* Node.js & npm
* Redis Server (Running on port 6379)

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

2. Frontend Setup


```Bash
cd frontend
npm install
npm run dev
```
## 📝 Roadmap
[ ] Spotify API integration for premium users.

[ ] Collaborative voting for the next song in the queue.

[ ] Support for YouTube audio streaming.

## 🤝 Contact
**Developed by Zelalem Getnet** [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zelalem3)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/zelalem-getnet-533326246/)

* **Email:** [zgetnet24@gmail.com](mailto:zgetnet24.com)


