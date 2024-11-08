# P2P File Share

A real-time peer-to-peer file sharing web application built with Next.js and WebRTC that enables direct file transfers between browsers.

## 🌐 Live Demo

Check out the live application: [P2P File Share](https://p2p-fileshare.vercel.app/)

## ✨ Features

-   Browser-based P2P file sharing using WebRTC
-   Real-time communication with Socket.IO
-   No server storage - direct peer-to-peer transfers
-   Modern, responsive UI built with React
-   Real-time file transfer progress
-   No file size limitations (browser constraints may apply)

## 🛠️ Tech Stack

### Frontend

-   Next.js
-   React
-   WebRTC for peer-to-peer connections
-   Socket.IO Client

### Backend

-   Node.js
-   Express
-   Socket.IO Server

### Languages

-   JavaScript (84.3%)
-   CSS (15.7%)

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/Aninda001/p2p-fileshare.git
```

2. Navigate to the project directory

```bash
cd p2p-fileshare
```

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm run dev
```

## 💡 How to Use

1. Open the application in your browser
2. Share your unique connection ID with the recipient
3. Connect with the recipient using their ID
4. Select and send files directly to the connected peer
5. Files are transferred directly between peers using WebRTC

## 👥 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Aninda001/p2p-fileshare/issues).

## 🔧 Environment Setup

Make sure you have the following installed:

-   Node.js (14.x or higher)
-   npm or yarn

## ⚙️ Environment Variables

Create a `.env` file in the root directory with:

```
NEXT_PUBLIC_SOCKET_URL=your_socket_server_url
```

---
