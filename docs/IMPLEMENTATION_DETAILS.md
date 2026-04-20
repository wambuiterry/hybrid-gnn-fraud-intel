# Implementation Details - Real Data Model Comparison System

## Backend Implementation (FastAPI)

### New Endpoints Added

#### 1. `/run-model-evaluation/{model_type}` - GET

**Purpose:** Execute actual model scripts and return metrics

```python
@app.get("/run-model-evaluation/{model_type}")
async def run_model_evaluation(model_type: str):
    # Validates model_type in ['xgboost', 'gnn', 'stacked_hybrid']
    # Constructs path to Python script
    # Runs via subprocess.run() with model data
    # Returns: {metrics, cases_caught, cases_missed}
```

**Key Implementation Details:**
- Uses `subprocess.run()` to execute Python model scripts
- Scripts must exist at: `ml_pipeline/models/[baseline_xgboost.py|evaluate_gnn.py|stacked_hybrid.py]`
- Run from project root so relative paths work
- Captures stdout/stderr for error handling
- Returns JSON metrics directly

**Response Format:**
```json
{
  "model": "xgboost",
  "metrics": {
    "precision": 0.92,
    "recall": 0.88,
    "f1": 0.90,
    "accuracy": 0.85
  },
  "cases_caught": 42,
  "cases_missed": 8
}
```

---

#### 2. `/upload-transaction-file` - POST

**Purpose:** Parse uploaded CSV/PDF/Word files and extract transactions

```python
@app.post("/upload-transaction-file")
async def upload_transaction_file(file: UploadFile = File(...)):
    # Receives multipart/form-data with file
    # Determines file type (.csv, .pdf, .docx, .doc)
    # Calls appropriate parser function
    # Returns extracted transaction records
```

**File Type Handling:**
- **CSV:** Uses `pandas.read_csv()` → converts to dict
- **PDF:** Uses `PyPDF2.PdfReader()` → extracts table text → parses
- **DOCX:** Uses `python-docx` → extracts table rows → parses
- **Error Handling:** Try/except with informative messages

**Response Format:**
```json
{
  "file_type": "csv",
  "transaction_count": 5,
  "transactions": [
    {
      "amount": 5000.0,
      "velocity": 3,
      "sender_id": "U123",
      "receiver_id": "U456",
      "hour": 14
    }
  ]
}
```

---

#### 3. `/run-transaction-comparison` - POST

**Purpose:** Run single transaction through all 3 models simultaneously

```python
@app.post("/run-transaction-comparison")
async def run_transaction_comparison(transaction_data: dict):
    # Input: {amount, velocity, sender_id, receiver_id, hour}
    # Prepare feature vector
    # Get XGBoost score from hybrid_model.predict()
    # Get GNN score (simulated at 0.45 + noise)
    # Calculate Hybrid: 0.6 * XGB + 0.4 * GNN
    # Compute consensus (FRAUD if 2+ models > 0.5)
    # Return all scores and verdict
```

**Consensus Logic:**
```
Models flagged := count(scores > 0.5)
IF models_flagged >= 2:
    consensus = "FRAUD"
    confidence = "HIGH" if models_flagged == 3 else "MEDIUM"
ELSE:
    consensus = "CLEAN"
    confidence = "HIGH" if models_flagged == 0 else "MEDIUM"
```

**Response Format:**
```json
{
  "xgboost_score": 0.85,
  "gnn_score": 0.72,
  "hybrid_score": 0.81,
  "consensus": "FRAUD",
  "models_flagged": 3,
  "confidence": "HIGH"
}
```

---

#### 4. `/ai-explain-model/{model_type}` - GET

**Purpose:** Provide AI-generated explanations for each model

```python
@app.get("/ai-explain-model/{model_type}")
async def ai_explain_model(model_type: str):
    # Returns detailed explanation dictionary
    # Contains: what_it_does, how_it_works, strengths, weaknesses, etc.
```

**Response Format:**
```json
{
  "model": "xgboost",
  "what_it_does": "XGBoost is a gradient boosting ensemble...",
  "how_it_works": "Uses decision trees stacked sequentially...",
  "strengths": [
    "Fast inference",
    "Handles imbalanced data",
    "Feature importance interpretable"
  ],
  "weaknesses": [
    "No inherent graph structure",
    "Requires feature engineering",
    "Memory intensive for large datasets"
  ],
  "best_for": "Traditional tabular features",
  "performance_on_cases": {
    "Case 1 (High value)": "✓ Caught",
    "Case 2 (Network ring)": "✗ Missed"
  },
  "improvements": "Add network features, ensemble with GNN"
}
```

---

#### 5. `/ai-explain-transaction/{tx_id}` - GET

**Purpose:** Explain specific transaction decision

```python
@app.get("/ai-explain-transaction/{tx_id}")
async def ai_explain_transaction(tx_id: str):
    # Fetch transaction details
    # Get model scores for transaction
    # Generate explanation of verdict
```

**Response Format:**
```json
{
  "transaction_id": "TXN_001",
  "verdict": "FRAUD",
  "why_flagged": "High amount combined with zero account velocity",
  "model_agreement": {
    "xgboost": "FRAUD (0.85)",
    "gnn": "FRAUD (0.72)",
    "hybrid": "FRAUD (0.81)"
  },
  "risk_factors": [
    "Amount > 2x avg",
    "Midnight hour",
    "New receiver"
  ],
  "next_steps": "Review receiver profile, contact account holder"
}
```

---

## Frontend Components

### Models Page (`frontend/src/pages/Models.jsx`)

**Layout:**
- Left sidebar: Baseline metrics (sticky)
- Main area: Model comparison tool with "Run Real Model Evaluation" button
- Tabs for XGBoost / GNN / Stacked Hybrid
- Displays metrics after model execution

### AI Bot Page (`frontend/src/pages/AIBot.jsx`)

**Two Sections:**
1. **Model Explainer:** Select model → displays what it does, how it works, strengths, weaknesses
2. **Transaction Explainer:** Enter TX ID → explains why flagged/cleared

### Transaction Page (`frontend/src/pages/Transaction.jsx`)

**Three Sections:**
1. **File Upload:** CSV/PDF/Word doc extraction
2. **Simulator Form:** Amount, velocity, sender, receiver, hour
3. **Model Comparison Grid:** All 3 model scores with color coding

---

## Commits Made

1. ✅ Add real model execution endpoints
2. ✅ Add file upload with CSV/PDF/Word parsing
3. ✅ Add transaction comparison endpoint
4. ✅ Add AI explanation endpoints
5. ✅ Create AIBot.jsx page
6. ✅ Update Transaction.jsx with file upload
7. ✅ Update ModelComparison.jsx with real execution
8. ✅ Update Layout.jsx navigation
9. ✅ Update App.jsx routing
