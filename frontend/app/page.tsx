'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<Map<string, WeatherData>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
    const socket: Socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socket.on('weather-update', (message: string) => {
      try {
        const data: WeatherData = JSON.parse(message);
        setWeatherData((prev) => {
          const updated = new Map(prev);
          updated.set(data.city, data);
          return updated;
        });
      } catch (error) {
        console.error('Error parsing weather data:', error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Real-Time Weather Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Weather Cards Grid */}
        {weatherData.size === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Waiting for weather data...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from(weatherData.values()).map((weather) => (
              <div
                key={weather.city}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition-all hover:scale-105"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {weather.city}
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Temperature</span>
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {weather.temperature}°C
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Humidity</span>
                    <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                      {weather.humidity}%
                    </span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Updated: {formatTimestamp(weather.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
