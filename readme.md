# Real-Time Weather Data Pipeline

A lightweight, real-time data pipeline and visualization tool demonstrating real-time data flow, inter-service communication via Redis Pub/Sub, and basic concurrency patterns.

## System Architecture

The system consists of three main components:

1. **Python Publisher** - Multi-threaded script that generates mock weather data and publishes to Redis
2. **Node.js Backend** - WebSocket broker that relays messages from Redis to web clients
3. **Frontend Dashboard** - Next.js application that displays live weather updates

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher) and npm/yarn
- **Python** (v3.8 or higher) and pip
- **Redis** (installed and running on Ubuntu)

### Installing Redis on Ubuntu

```bash
# Update package list
sudo apt update

# Install Redis
sudo apt install redis-server

# Start Redis service
sudo systemctl start redis-server

# Enable Redis to start on boot
sudo systemctl enable redis-server

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

## Project Structure

```
.
├── python-publisher/       # Python data generator
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── node-backend/          # Node.js WebSocket broker
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── task/                  # Next.js frontend (renamed from 'frontend')
│   ├── app/
│   │   └── page.tsx
│   ├── package.json
│   └── .env.example
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. Environment Configuration

Each service requires environment variables. Copy the `.env.example` files to `.env` in each directory:

```bash
# Python Publisher
cp python-publisher/.env.example python-publisher/.env

# Node Backend
cp node-backend/.env.example node-backend/.env

# Frontend
cp task/.env.example task/.env
```

**Default Configuration:**
- Redis Host: `localhost`
- Redis Port: `6379`
- WebSocket Port: `3001`
- Frontend Dev Port: `3000`

### 3. Install Dependencies

#### Python Publisher

```bash
cd python-publisher
pip install -r requirements.txt
cd ..
```

#### Node.js Backend

```bash
cd node-backend
npm install
cd ..
```

#### Frontend

```bash
cd task
npm install
cd ..
```

## Running the Application

You need to run each service in a separate terminal window. Follow these steps in order:

### Terminal 1: Start Redis (if not already running)

```bash
# Check if Redis is running
redis-cli ping

# If not running, start it
sudo systemctl start redis-server
```

### Terminal 2: Start Python Publisher

```bash
cd python-publisher
python main.py
```

You should see output like:
```
Starting Python Weather Data Publisher...
Redis: localhost:6379
Channel: weather-updates
--------------------------------------------------
[Publisher Thread] Connected to Redis at localhost:6379
[Logger Thread] Started
[LOG] - Published data for Tokyo
[LOG] - Published data for London
...
```

### Terminal 3: Start Node.js Backend

```bash
cd node-backend
npm run dev
```

You should see output like:
```
Starting Node.js WebSocket Broker...
Redis: localhost:6379
WebSocket Port: 3001
--------------------------------------------------
[Redis] Connected successfully
[Redis] Subscribed to channel: weather-updates
[WebSocket] Server listening on port 3001
```

### Terminal 4: Start Frontend

```bash
cd task
npm run dev
```

You should see output like:
```
  ▲ Next.js 16.1.0
  - Local:        http://localhost:3000
```

### 5. Access the Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the real-time weather dashboard updating every 5 seconds with data from different cities.

## How It Works

1. **Data Generation**: The Python publisher generates mock weather data for random cities every 5 seconds using two threads:
   - **Publisher Thread**: Generates weather data and publishes to Redis
   - **Logger Thread**: Logs publishing events from a thread-safe queue

2. **Message Relay**: The Node.js backend subscribes to the Redis `weather-updates` channel and broadcasts all messages to connected WebSocket clients

3. **Real-Time Display**: The frontend establishes a WebSocket connection and dynamically updates the UI whenever new weather data arrives

## Features

- ✅ Multi-threaded Python data publisher with thread-safe queue
- ✅ Redis Pub/Sub for inter-service communication
- ✅ Stateless Node.js WebSocket broker
- ✅ Real-time frontend updates without page refresh
- ✅ Responsive grid layout for multiple cities
- ✅ Connection status indicator
- ✅ Dark mode support

## Troubleshooting

### Redis Connection Issues

If you see Redis connection errors:

```bash
# Check if Redis is running
sudo systemctl status redis-server

# Check Redis logs
sudo journalctl -u redis-server -n 50

# Test Redis connection
redis-cli ping
```

### Port Already in Use

If ports 3000 or 3001 are already in use:

1. Change the port in the respective `.env` file
2. Update the `NEXT_PUBLIC_WEBSOCKET_URL` in `task/.env` to match the new backend port
3. Restart the services

### WebSocket Connection Failed

1. Ensure the Node.js backend is running before starting the frontend
2. Check that the `NEXT_PUBLIC_WEBSOCKET_URL` in `task/.env` matches the backend WebSocket port
3. Check browser console for connection errors

## Technology Stack

- **Backend**: Node.js, TypeScript, Socket.IO, Redis
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Data Pipeline**: Python 3, Threading, Redis Pub/Sub

## License

MIT
