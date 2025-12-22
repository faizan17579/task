import { Server } from 'socket.io';
import { createClient } from 'redis';


const REDIS_HOST =  'localhost';
const REDIS_PORT = 6379;
const WEBSOCKET_PORT = 3001;
const REDIS_CHANNEL = 'weather-updates';

async function main() {
  console.log('Starting Node.js ');
  console.log(`Redis: ${REDIS_HOST}:${REDIS_PORT}`);
  console.log(`WebSocket Port: ${WEBSOCKET_PORT}`);
  console.log('-'.repeat(50));
  

  const io = new Server(WEBSOCKET_PORT, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });


  const subscriber = createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT
    }
  });

  subscriber.on('error', (err: Error) => {
    console.error('[Redis] Error:', err);
  });

  await subscriber.connect();
  console.log('[Redis] Connected successfully');

  await subscriber.subscribe(REDIS_CHANNEL, (message: string) => {
    console.log(`[Redis] Received message: ${message}`);
  
    io.emit('weather-update', message);
    console.log(`[WebSocket] Broadcasted to ${io.engine.clientsCount} clients`);
  });

  console.log(`[Redis] Subscribed to channel: ${REDIS_CHANNEL}`);

  // Handle WebSocket connections
  io.on('connection', (socket: any) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  console.log(`[WebSocket] Server listening on port ${WEBSOCKET_PORT}`);
}

main().catch((err: Error) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
