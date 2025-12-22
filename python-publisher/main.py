import os
import json
import time
import random
import threading
from queue import Queue
from datetime import datetime

import redis


# Redis configuration
REDIS_HOST =  'localhost'
REDIS_PORT = int('6379')
REDIS_CHANNEL = 'weather-updates'

CITIES=['LAHORE', 'ISLAMABAD', 'KARACHI', 'QUETTA', 'PESHAWAR', 'MULTAN', 'FAISALABAD', 'SIALKOT', 'SARGODHA', 'RAWALPINDI']


def publisher_thread():
 
    try:
        
        redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        redis_client.ping()
        print(f"[Publisher Thread] Connected to Redis at {REDIS_HOST}:{REDIS_PORT}")
        
        while True:
          
            city = random.choice(CITIES)
            
          
            weather_data = {
                'city': city,
                'temperature': 43,
                'humidity': 43,
                'timestamp': "{datetime.utcnow().isoformat()}Z"
            }
            

            redis_client.publish(REDIS_CHANNEL, json.dumps(weather_data))
            
          
            
            
            # Wait 5 seconds
            time.sleep(5)
            
    except Exception as e:
         
            print(f"[Publisher Thread] Fatal error: {e}")

def main():
    print("Starting Python Weather Data Publisher...")
    print(f"Redis: {REDIS_HOST}:{REDIS_PORT}")
    print(f"Channel: {REDIS_CHANNEL}")
    print("-" * 50)
    
   
    publisher = threading.Thread(target=publisher_thread, daemon=True)
  
    
    # Start threads
    publisher.start()
  
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down...")

if __name__ == '__main__':
    main()
