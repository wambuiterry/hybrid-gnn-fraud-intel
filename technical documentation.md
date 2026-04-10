# Technical Documentation: Hybrid GNN Fraud Intelligence System

## 1. Goal and Thesis
Build a production-ready fraud detection platform for mobile money ecosystems that combines:
- **Graph Neural Networks (GNNs)** for detecting complex fraud topologies (rings, mule networks, fast cash-outs)
- **XGBoost** for velocity-based and amount-pattern fraud detection
- **AI-powered explanations** for analyst-driven Tier 2 investigations
- **Real model execution** with live performance comparison
- **File upload & extraction** for transaction data import (CSV, PDF, Word)

**Core Hypothesis:** A hybrid GNN + XGBoost ensemble with AI explainability outperforms pure tabular baselines while maintaining real-time interpretability for fraud analysts.

## 2. Current System Status
✅ **Backend (FastAPI)** - All 11 endpoints operational
✅ **Frontend (React)** - All 8 pages operational with real model execution
✅ **Database (Neo4j + SQLite)** - Live graph + transaction persistence
✅ **ML Models** - Real XGBoost, GNN, Hybrid ensemble executable
✅ **File Upload** - CSV/PDF/Word document parsing
✅ **AI Bot** - Model explanations and transaction analysis
✅ **Models Comparison** - Live evaluation with real metrics

## 3. Quick Architecture Overview

### Five Fraud Scenarios (Production Dataset)
Data generation creates 5 distinct fraud patterns with specific topologies:
1. **Fraud Rings (25%)** - Cyclic transactions between 4+ users
2. **Mule/SIM Swap (20%)** - Star topology with shared device
3. **Fast Cash-out (20%)** - High-velocity bursts (<60 seconds)
4. **Loan Fraud (15%)** - Synthetic identities with homophilous defaults
5. **Business Fraud (20%)** - Money laundering through business accounts

**Dataset Size:** 100,000 transactions across 10,000 users over 45 days (2.5% fraud rate)

## 4. Backend Implementation (FastAPI)

### All 11 API Endpoints

#### ✅ Core Prediction Endpoints
1. **POST `/predict`** - Core fraud detection (XGBoost single transaction)
2. **GET `/live-graph`** - Neo4j transaction network visualization
3. **POST `/resolve-alert/{tx_id}?action={approve|deny}`** - Alert resolution

#### ✅ Real Model Execution (Live)
4. **GET `/run-model-evaluation/{model_type}`** - Execute actual Python scripts
   - Supports: `xgboost`, `gnn`, `stacked_hybrid`
   - Returns: Real metrics (precision, recall, F1, accuracy) + cases caught/missed
   - Execution: Via subprocess.run() calling ml_pipeline/models/*.py

#### ✅ File Upload & Parsing
5. **POST `/upload-transaction-file`** - Parse CSV/PDF/Word documents
   - Supports: .csv, .pdf, .docx, .doc
   - Returns: Extracted transaction records as JSON array
   - CSV: pandas read_csv()
   - PDF: PyPDF2 with table extraction
   - Word: python-docx with table parsing

#### ✅ Model Comparison
6. **POST `/run-transaction-comparison`** - All 3 models simultaneously
   - Input: Single transaction {amount, velocity, sender_id, receiver_id, hour}
   - Returns: XGBoost score, GNN score, Hybrid score + consensus verdict
   - Consensus: FRAUD if 2+ models > 0.5

#### ✅ AI Explanation Endpoints
7. **GET `/ai-explain-model/{model_type}`** - Model explanation
   - Returns: what_it_does, how_it_works, strengths[], weaknesses[], best_for, performance_on_cases, improvements

8. **GET `/ai-explain-transaction/{tx_id}`** - Transaction decision explanation
   - Returns: verdict, why_flagged, model_agreement, risk_factors[], next_steps

#### Dashboard/Analytics
9. **GET `/dashboard-stats`** - Real-time KPIs from SQLite
10. **GET `/health`** - System health check
11. **Root `/`** - Service status

### Database Integration
- **Neo4j**: Real-time transaction graph (user nodes, SENT_MONEY edges)
- **SQLite**: fraud_intel.db with transaction history and decisions

### Model Loading
- Hybrid XGBoost model: `models/saved/hybrid_xgboost.pkl` loaded on startup
- GNN model: Simulated with 45% baseline score (can be upgraded to real PyTorch)
- Supports live evaluation of all 3 model scripts

## 5. Frontend Implementation (React)

### 8 Pages (All Operational)

1. **Home** - Real-time KPI dashboard with SQLite metrics
2. **Transactions** - Manual simulation + file upload (CSV/PDF/Word) + model comparison grid
3. **Fraud Network** - 5 case studies + live Neo4j topology visualization
4. **Models** - Model comparison tool with "Run Real Model Evaluation" button + fraud test cases
5. **AI Bot** - Model explanations + transaction explainer with risk factors
6. **Alerts** - Queue management with analyst actions (approve/deny)
7. **Reports** - Compliance dashboard (CBK AML format)
8. **Settings** - Configuration (risk thresholds, notifications, API keys)

### Key Components
- **ModelComparison.jsx** - Displays metrics for XGBoost/GNN/Hybrid with real evaluation button
- **AIBot.jsx** - Model selector + detailed explanations + transaction explainer
- **Transaction.jsx** - File upload, transaction simulator, comparison grid (all 3 models)
- **FraudNetwork.jsx** - Split view (Baseline vs Live) with force-directed layout
- **Layout.jsx** - Sidebar navigation with Models & AI Bot as main items

### Frontend Features
✅ Real model execution via subprocess buttons  
✅ File upload & parsing (CSV/PDF/Word)  
✅ Model comparison with consensus logic  
✅ AI explanations for models and transactions  
✅ Live Neo4j graph visualization  
✅ Alert management with analyst queue  
✅ 5-second auto-refresh on dashboard  
✅ Responsive design (Tailwind CSS)

### Functionality
- **Bulk UNWIND Inserts:** Uses Cypher UNWIND for efficient batch loading
- **Auto-ID Generation:** If transaction_id missing from CSV, auto-generates TXN_0, TXN_1, etc.
- **Deduplication:** MERGE ensures no duplicate users or transaction edges
- **Database Cleanup:** Optional clear function to wipe data before fresh load

### Data Pipeline
1. Loads `data/processed/final_model_data.csv` (output from data generation)
2. Batches rows for efficient Neo4j writes
3. Creates User nodes and SENT_MONEY transaction edges with amounts
4. Enables live graph visualization and real-time topology queries

## 6.8 Kafka Streaming Implementation (`streaming/`)
**Status:** ✅ **FULLY OPERATIONAL**

### Architecture Overview
Real-time transaction streaming pipeline with Kafka as the event backbone:
1. **Kafka Broker** (port 9092) — Centralized event hub
2. **Transaction Producer** — Publishes synthetic M-Pesa transactions every 2 seconds
3. **Graph Consumer** — Subscribes to transaction stream, updates Neo4j graph, calls FastAPI `/predict` endpoint
4. **Neo4j** — Live graph accumulates transactions with SENT_MONEY edges
5. **FastAPI** — Fraud scoring triggered per transaction
6. **SQLite** — Decision logging for audit trail

### Docker Compose Infrastructure (`docker-compose.yml`)

**Services:**
- **Zookeeper** (image: confluentinc/cp-zookeeper:7.0.0)
  - Port: 2181 (internal cluster coordination)
  - Environment: ZOOKEEPER_CLIENT_PORT=2181
  - Purpose: Manages broker leader election and partition metadata

- **Kafka Broker** (image: confluentinc/cp-kafka:7.0.0)
  - Port: 9092 (external client connections)
  - Port: 29092 (internal broker communication)
  - Environment: Auto-topic creation enabled (`AUTO_CREATE_TOPICS_ENABLE=true`)
  - Broker ID: 1
  - Zookeeper dependency: localhost:2181

**Bootstrap:**
```bash
docker-compose up -d
# Verify services running: docker-compose ps
# Logs: docker-compose logs -f kafka
```

### Transaction Producer (`streaming/transaction_producer.py`)

**Purpose:** Simulate real-time M-Pesa transaction stream

**Functionality:**
- Connects to Kafka broker at `localhost:9092`
- Generates synthetic transactions every 2 seconds
- Publishes to `transactions` topic (auto-created by Kafka)
- Transaction schema:
  ```
  {
    "transaction_id": "TXN_XXXXXX",
    "timestamp": "2026-04-09T15:30:45.000Z",
    "sender_id": "USER_1234",
    "receiver_id": "USER_5678",
    "amount": 15000.00,
    "device_id": "DEVICE_ABC",
    "agent_id": "AGENT_001"
  }
  ```

**Execution:**
```bash
python streaming/transaction_producer.py
# Output: "Sent transaction TXN_XXXXXX: sender_1234 → receiver_5678 (15000 KES)"
```

### Graph Consumer (`streaming/graph_consumer.py`)

**Purpose:** Real-time integration of Kafka transactions with Neo4j and fraud detection

**Dual Update Workflow:**

1. **Neo4j Graph Update:**
   - Consumes transaction from Kafka topic `transactions`
   - Creates/updates User nodes if not exists (sender, receiver)
   - Creates SENT_MONEY edge from sender → receiver with amount metadata
   - Graph grows organically as transactions stream in
   - Enables live network visualization via `/live-graph` endpoint

2. **FastAPI Prediction Call:**
   - Extracts transaction features from Kafka message
   - Constructs feature vector compatible with hybrid_xgboost.pkl
   - POSTs to `http://127.0.0.1:8000/predict` endpoint
   - Receives risk_score, decision (AUTO_FREEZE, CONFIRMED_FRAUD, etc.), and reason
   - Logs result to console with timestamp

**Consumer Configuration:**
- Kafka broker: `localhost:9092`
- Topic: `transactions`
- Group: `fraud-detection-group` (enables consumer offset tracking)
- Auto-commit: Enabled (commits offset after successful prediction)

**Execution:**
```bash
python streaming/graph_consumer.py
# Output example:
# Consumer started, listening to transactions topic...
# [15:30:45] Received TXN_XXXXXX from sender_1234
# Neo4j updated with SENT_MONEY edge
# [15:30:46] FastAPI /predict called, risk_score=0.72, decision=REQUIRE_HUMAN
```

### Data Flow Integration

```
[Transaction Producer]
         ↓
   Kafka Topic: transactions
         ↓
[Graph Consumer]
    ├→ Neo4j (graph updated)
    └→ FastAPI /predict
         ├→ Hybrid XGBoost inference
         ├→ AI Analyst Tier 2 rules
         └→ SQLite logging
              ↓
   [Dashboard refresh]
```

### Key Design Decisions

| Aspect | Choice | Rationale |
|--------|--------|----------|
| **Message Format** | JSON strings | Human-readable, easy to debug, standard Kafka convention |
| **Topic Name** | `transactions` | Semantic; matches M-Pesa use case |
| **Consumer Group** | `fraud-detection-group` | Enables horizontal scaling; multiple consumers can process different partitions |
| **Offset Commit** | Auto-commit enabled | Simplifies development; production should use manual commits for fine-grained control |
| **Publish Frequency** | 2 seconds | Balances realistic streaming with manageable volume for testing |
| **Error Handling** | Log & continue | Prevents cascading failures; failed predictions don't block Kafka consumption |

### Integration with Existing Components

**Backend (`backend/main.py`):** 
- No changes needed; FastAPI listens for consumer POSTs to `/predict`
- Consumer calls: `POST http://127.0.0.1:8000/predict`
- Returns fraud decision to consumer for logging

**Frontend (`frontend/`):**
- No direct Kafka coupling; consumes via FastAPI and SQLite
- Dashboard updates via `/dashboard-stats` endpoint (SQLite aggregations)
- No latency requirement; 5-second refresh rate sufficient

**Neo4j:**
- Consumer updates graph in real-time
- `/live-graph` endpoint returns latest topology for FraudNetwork page
- Enables dynamic fraud ring visualization as transactions stream

## 7. End-to-End Pipeline Flow
1. **Data Generation:** `generate_data.py` → `data/raw/p2p_transfers.csv`
2. **Feature Engineering:** Graph construction and tabular feature extraction
3. **Model Training:**
   - `baseline_xgboost.py` → Tabular baseline performance
   - `evaluate_gnn.py` → GNN training → `hetero_graph.pt`, `gnn_probabilities.csv`
   - `stacked_hybrid.py` → Hybrid stacking → `hybrid_xgboost.pkl` (saved model)
4. **Neo4j Population:** `populate_neo4j.py` → Batch-loads transactions into graph database
5. **Docker Infrastructure:** `docker-compose up -d` → Zookeeper + Kafka Broker startup
6. **API Deployment:** `backend/main.py` (FastAPI)
   - Loads hybrid model from pickle
   - Initializes SQLite fraud_intel.db
   - Starts listening on http://127.0.0.1:8000
7. **Kafka Streaming Pipeline:**
   - `transaction_producer.py` → Publishes synthetic M-Pesa transactions every 2 seconds to Kafka topic
   - `graph_consumer.py` → Subscribes to Kafka, updates Neo4j in real-time, calls FastAPI `/predict`
8. **Frontend Deployment:** `frontend/` (React)
   - Starts Vite dev server
   - Connects to FastAPI backend
   - Displays real-time dashboard with Neo4j network visualization
9. **Live Detection Pipeline:**
   - Kafka producer generates synthetic transaction
   - Consumer receives transaction, updates Neo4j graph
   - Consumer calls FastAPI `/predict` endpoint
   - Hybrid XGBoost inference + Tier 2 AI Analyst rules applied
   - Response + decision logged to SQLite
   - Dashboard auto-refreshes with updated metrics
   - Analyst reviews alerts in queue and resolves via UI
10. **Validation:** `test_gnn.py`, `test_hybrid_pipeline.py` → Architecture verification

## 8. Key Research Contributions
- **Empirical Proof:** Quantified performance gains on graph fraud vs tabular baselines
- **Scenario Analysis:** Per-topology recall metrics for fraud rings, fast cash-outs, etc.
- **Operational Feasibility:** Human-in-the-loop design with workload quantification
- **Scalability:** PyTorch Geometric for large graph processing
- **Explainability:** GNN architecture supports future GNNExplainer integration

## 9. Current Development Status
- ✅ Synthetic data generation with realistic fraud patterns
- ✅ Core ML models (baseline, GNN, hybrid) fully implemented
- ✅ Unit testing framework established
- ✅ **Backend FastAPI with full Neo4j integration (COMPLETE)**
- ✅ **Frontend React dashboard with all pages (COMPLETE)**
- ✅ **SQLite transaction database for persistence (COMPLETE)**
- ✅ **Tier 2 AI Analyst rules engine operational (COMPLETE)**
- ✅ **Live fraud network visualization from Neo4j (COMPLETE)**
- ✅ **Transaction prediction endpoint with hybrid model (COMPLETE)**
- ✅ **Alerts queue management system (COMPLETE)**
- ✅ **Dashboard analytics and KPI tracking (COMPLETE)**
- ✅ **Kafka streaming with real-time transaction producer/consumer (COMPLETE)**
- ✅ **Docker Compose for Zookeeper + Kafka infrastructure (COMPLETE)**
- ✅ **Full end-to-end streaming pipeline with Neo4j + FastAPI integration (COMPLETE)**

## 9.5 Recent Implementation Highlights (April 2026)

### Backend Achievements
- **Live Graph Integration:** FastAPI seamlessly integrates with Neo4j using UNWIND batch queries
- **Hybrid Model Serving:** XGBoost model loads on server startup for zero-latency inference
- **Persistent Storage:** All predictions logged to SQLite with timestamps, decisions, and AI reasoning
- **Multi-Tier Validation:** Tier 1 (ML model) + Tier 2 (AI Analyst rules) + Tier 3 (human review) workflow
- **Neo4j Topology Updates:** Real-time sender out-degree calculation for num_unique_recipients feature
- **CORS Enabled:** Full cross-origin request support for frontend-backend communication

### Frontend Achievements
- **Real-Time Dashboard:** Auto-refreshing KPI cards with SQLite aggregations every 5 seconds
- **Interactive Prediction:** Manual transaction form with instant risk assessment display
- **Network Visualization:** Force-graph rendering of fraud rings with case studies and live Neo4j data
- **Alert Management:** Analyst queue system with granular approve/deny actions
- **Responsive Design:** Mobile-friendly layout with Tailwind grid system
- **Compliance Reports:** CBK AML report templates and audit trail UI

### Testing Validated
- ✅ FastAPI endpoints operational (POST /predict, GET /dashboard-stats, POST /resolve-alert, GET /live-graph)
- ✅ SQLite schema and CRUD operations confirmed
- ✅ Neo4j bulk loading with transaction_id auto-generation
- ✅ React routing and component state management
- ✅ Hybrid model pickle serialization and deserialization
- ✅ CORS middleware passing browser pre-flight checks

## 10. How to Run (Current State)

### Step 1: Start Kafka Infrastructure
```bash
# Verify Docker running
docker-compose up -d

# Verify services running
docker-compose ps
# Output: zookeeper RUNNING, kafka RUNNING
```

### Step 2: Activate Environment & Generate Data
```bash
# Activate virtual environment
& venv\Scripts\Activate.ps1

# Generate synthetic data (creates data/raw/p2p_transfers.csv)
python ml_pipeline/data_gen/generate_data.py

# Build graph dataset tensor
python ml_pipeline/models/graph_dataset.py

# Extract GNN probabilities for hybrid model
python ml_pipeline/models/extract_gnn_probs.py

# Run full model training pipeline
python ml_pipeline/models/stacked_hybrid.py   # Produces hybrid_xgboost.pkl
python ml_pipeline/models/ai_fraud_analyst.py # Tier 2 analysis
```

### Step 3: Load Data into Neo4j
```bash
# Before running: Start Neo4j Desktop with credentials (uri: neo4j://localhost:7687, auth: neo4j/12345678)
python populate_neo4j.py   # Bulk-loads transactions into Neo4j graph
```

### Step 4: Start Backend API Server
```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
# API now live at http://127.0.0.1:8000
# Swagger docs: http://127.0.0.1:8000/docs
```

### Step 5: Start Kafka Streaming Pipeline (2 terminals)
```bash
# Terminal A: Transaction Producer
python streaming/transaction_producer.py
# Output: "Sent transaction TXN_XXXXXX: ..." every 2 seconds

# Terminal B: Graph Consumer
python streaming/graph_consumer.py
# Output: "Received TXN_XXXXXX from sender_1234..."
#         "Neo4j updated with SENT_MONEY edge"
#         "FastAPI /predict called, decision=..."
```

### Step 6: Start Frontend React Dashboard
```bash
cd frontend
npm install  # If first time
npm run dev  # Starts Vite dev server (default: http://localhost:5173)
```

### Step 7: Test the Full Stack
**Option A: Live Streaming Transaction Detection**
- Kafka producer auto-generates M-Pesa transactions
- Consumer updates Neo4j graph + calls FastAPI in real-time
- Navigate to http://localhost:5173/network → "LIVE" mode
- Watch fraud network grow as transactions stream
- Check Alerts queue for flagged transactions

**Option B: Use Transaction Form** (sends individual transactions)
- Navigate to http://localhost:5173/transactions
- Fill form and submit
- Observe risk score, decision, and AI reasoning
- Check Neo4j graph updated in /network page

**Option C: Use Alerts Queue**
- Transactions from Kafka producer appear in queue
- Navigate to /alerts to see pending review queue
- Approve/deny decisions persist to SQLite
- Check /reports for compliance metrics

**Option D: Monitor Kafka Pipeline**
```bash
# In separate terminal, watch Kafka messages
docker exec -it <kafka_container_id> kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic transactions \
  --from-beginning
```

### Full Stack Verification Checklist
- ✅ Zookeeper + Kafka running: `docker-compose ps`
- ✅ Neo4j graph has 100k+ nodes: Open Neo4j Desktop → query `MATCH (n) RETURN count(n)`
- ✅ FastAPI responding: `curl http://127.0.0.1:8000/docs` → Swagger UI loads
- ✅ Kafka producer generating: Check console output every 2 seconds
- ✅ Kafka consumer consuming: Check consumer logs show "Received TXN_XXXXXX..."
- ✅ Neo4j updating live: Query `MATCH (u)-[r:SENT_MONEY]->(v) RETURN count(r)` → count increasing
- ✅ SQLite persisting: Check `backend/fraud_intel.db` → transactions table growing
- ✅ Frontend displaying: http://localhost:5173 → Home dashboard shows live KPIs

### Automated Pipeline (Optional)
```bash
# Run full stack test without manual steps
python tests/test_hybrid_pipeline.py  # Validates all components
```

## 11. Critical Prerequisites & Configuration

### Environment Setup
- **Python 3.8+** with virtualenv
- **Node.js 16+** for npm/Vite frontend
- **Neo4j Desktop 5.x+** with active graph instance listening on neo4j://localhost:7687
- **Port Availability:** Ensure ports 8000 (FastAPI), 5173 (Vite), 7687 (Neo4j) are free

### Backend Configuration (backend/main.py)
```python
# Update these credentials if using remote Neo4j:
URI = "neo4j://localhost:7687"
AUTH = ("neo4j", "12345678")  # Change password if Neo4j password differs

# Model path (auto-resolves to models/saved/hybrid_xgboost.pkl)
MODEL_PATH = os.path.join(BASE_DIR, "models", "saved", "hybrid_xgboost.pkl")
```

### Frontend Configuration
- Backend URL: http://127.0.0.1:8000 (hardcoded in axios calls; update if deployment differs)
- Vite port: 5173 (editable in vite.config.js)

### Database Schema Initialization
- **SQLite:** Auto-created on first FastAPI startup (fraud_intel.db)
- **Neo4j:** Requires manual data load via `populate_neo4j.py` after startup

## 12. Known Limitations & Future Work

### Current Limitations
- **Horizontal Scaling:** Current implementation runs on single machine; multi-broker Kafka cluster untested
- **Consumer Error Handling:** Failed FastAPI predictions logged but not retried; no dead letter queue
- **Topic Partitioning:** Single partition per topic; production should partition for parallel consumption
- **Monitoring Dashboard:** No Kafka metrics in frontend; Kafka broker metrics not surfaced to UI
- **Production Protocols:** Plain-text Kafka communication; production should use SSL/TLS
- **Scalability:** Current implementation tested on single-machine setup; multi-instance deployment untested
- **Authentication:** No authentication layer; API is open to localhost
- **Frontend Deployment:** Vite used for development; production build and CDN deployment pending
- **GNN Mock Score:** Backend uses hardcoded mock_gnn_score = 0.45; should replace with actual GNN inference
- **Historical Data:** Dashboard area chart is mocked; real time-series aggregation from SQLite TODO

### Next Steps (Priority Order)
1. **Production Vite Build:** Create optimized build for deployment
2. **Docker Containerization:** Full docker-compose with PostgreSQL, Redis, Neo4j services
3. **Kubernetes Orchestration:** StatefulSet for Neo4j, Deployment for FastAPI/React
4. **Kafka Integration:** Wire streaming producer/consumer for real-time transaction ingestion
5. **Authentication/Authorization:** JWT tokens, role-based access for analyst tiers
6. **Monitoring & Observability:** Prometheus metrics, ELK stack for logs, Grafana dashboards
7. **Batch Predictions:** Endpoint for daily bulk model inference on transaction archives
8. **A/B Testing Framework:** Compare hybrid vs baseline model performance on live data
9. **Model Retraining Pipeline:** Scheduled retraining with new fraud patterns
10. **Compliance Audit Trail:** Immutable ledger of all analyst decisions for regulatory review

# Generate feature importance visualization
python ml_pipeline/models/visualize_importance.py

# Run tests
pytest tests/test_gnn.py
```

## 11. Future Development Roadmap
- Complete feature engineering pipeline (`ml_pipeline/features/`, `ml_pipeline/graph_builder/`)
- Implement Kafka streaming in `streaming/` folder
- Build FastAPI endpoints in `backend/`
- Develop React dashboard in `frontend/`
- Configure Docker Compose for full-stack deployment
- Add model monitoring and A/B testing capabilities

## 12. Model Evolution Summary

The `ml_pipeline/models/` folder contains 11 scripts representing a complete research-to-production pipeline:

**Phase 1: Foundation (Neo4j Integration)**
- `xgboost_classifier.py`: Initial proof-of-concept with database queries

**Phase 2: Graph Learning**
- `graph_dataset.py`: Data preparation for GNN training
- `gnn_embeddings.py`: Structural embedding generation
- `manual_inspect.py`: Architecture validation

**Phase 3: Hybrid Approaches**
- `baseline_xgboost.py`: Tabular baseline (upgraded)
- `hybrid_xgboost.py`: Direct embedding fusion
- `extract_gnn_probs.py`: Probability distillation for stacking
- `evaluate_gnn.py`: Standalone GNN evaluation
- `stacked_hybrid.py`: Production-ready stacked ensemble

**Phase 4: Operational Intelligence**
- `ai_fraud_analyst.py`: Automated Tier-2 analysis
- `visualize_importance.py`: Model interpretability

**Key Progression:**
1. **Tabular → Graph**: From basic features to structural embeddings
2. **Fusion → Stacking**: From direct concatenation to meta-learning
3. **Research → Production**: From evaluation to operational deployment
4. **Single Model → System**: From ML to human-AI collaboration

This evolution demonstrates the systematic development of hybrid GNN-XGBoost fraud detection, from initial experiments to production deployment with business logic integration.*