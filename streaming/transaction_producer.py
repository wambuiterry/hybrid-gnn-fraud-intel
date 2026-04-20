"""
Transaction Producer: Simulates real-time M-Pesa transactions
Publishes to Kafka topic 'transactions' for consumption by graph_consumer.py
"""

import json
import random
import time
from datetime import datetime
from kafka import KafkaProducer

KAFKA_BROKER = 'localhost:9092'
KAFKA_TOPIC = 'transactions'

def create_producer():
    """Initialize Kafka producer"""
    try:
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_BROKER,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            acks='all',
            retries=3
        )
        print(f"✅ Producer connected to Kafka broker: {KAFKA_BROKER}")
        return producer
    except Exception as e:
        print(f"❌ Failed to connect to Kafka: {e}")
        print("   Make sure Docker is running: docker-compose up -d")
        return None

def generate_transaction():
    """Generate a synthetic transaction"""
    return {
        "transaction_id": f"TXN_{int(time.time() * 1000)}_{random.randint(1000, 9999)}",
        "timestamp": datetime.now().isoformat(),
        "sender_id": f"USER_{random.randint(1, 1000)}",
        "receiver_id": f"USER_{random.randint(1, 1000)}",
        "amount": round(random.uniform(100, 50000), 2),
        "agent_id": f"AGENT_{random.randint(1, 100)}",
        "device_id": f"DEVICE_{random.randint(1, 500)}",
        "transactions_last_24hr": random.randint(1, 10),
        "hour": datetime.now().hour
    }

def main():
    """Main producer loop"""
    producer = create_producer()
    if not producer:
        return
    
    print("📨 Starting Transaction Producer...")
    print(f"   Topic: {KAFKA_TOPIC}")
    print("   Publishing new transactions every 2 seconds...")
    print("   Press Ctrl+C to stop\n")
    
    try:
        count = 0
        while True:
            tx = generate_transaction()
            future = producer.send(KAFKA_TOPIC, value=tx)
            try:
                future.get(timeout=10)
                count += 1
                print(f"[{count}] 📤 {tx['transaction_id']} | ${tx['amount']} | {tx['sender_id']} → {tx['receiver_id']}")
            except Exception as e:
                print(f"❌ Failed: {e}")
            time.sleep(2)
    except KeyboardInterrupt:
        print(f"\n🛑 Producer stopped. Sent {count} transactions.")
    finally:
        producer.close()

if __name__ == "__main__":
    main()
