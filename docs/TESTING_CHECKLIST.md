# Testing Checklist - Real Data Model Comparison System

## Pre-Testing Setup

### 1. Check Backend Dependencies
```bash
# From project root
pip list | grep -E "fastapi|pydantic|xgboost|torch|pandas"
```

**Required packages:**
- fastapi
- pydantic
- xgboost
- pandas
- torch (for GNN)
- torch_geometric
- neo4j
- sqlalchemy

**Optional (for PDF/Word parsing):**
- PyPDF2
- python-docx

### 2. Verify Model Scripts Exist
Check these files exist and are executable:
```
ml_pipeline/models/baseline_xgboost.py
ml_pipeline/models/evaluate_gnn.py
ml_pipeline/models/stacked_hybrid.py
ml_pipeline/models/hybrid_xgboost.py
```

### 3. Verify Data Files Exist
```
data/processed/final_model_data.csv
data/processed/gnn_probabilities.csv
data/processed/hetero_graph.pt
```

## Testing Workflows

### Test 1: Backend API Endpoints

#### 1a. Test Model Execution Endpoint
```bash
# Terminal 1 - Start backend
cd backend
python -m uvicorn main:app --reload

# Terminal 2 - Test XGBoost execution
curl "http://localhost:8000/run-model-evaluation/xgboost"

# Expected Response:
{
  "model": "xgboost",
  "metrics": {
    "precision": 0.XX,
    "recall": 0.XX,
    "f1": 0.XX,
    "accuracy": 0.XX
  },
  "cases_caught": 5,
  "cases_missed": 3
}
```

#### 1b. Test File Upload
```bash
# Create test CSV
cat > test_transaction.csv << 'EOF'
amount,velocity,sender_id,receiver_id,hour
1500.50,2,U123,U456,10
50000.00,0,U789,U999,23
EOF

# Upload file
curl -X POST -F "file=@test_transaction.csv" \
  "http://localhost:8000/upload-transaction-file"

# Expected Response:
{
  "file_type": "csv",
  "transaction_count": 2,
  "transactions": [
    {"amount": 1500.5, "velocity": 2, ...},
    {"amount": 50000.0, "velocity": 0, ...}
  ]
}
```

#### 1c. Test Transaction Comparison
```bash
# Create test transaction JSON
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "velocity": 0,
    "sender_id": "U789",
    "receiver_id": "U999",
    "hour": 23
  }' \
  "http://localhost:8000/run-transaction-comparison"

# Expected Response:
{
  "xgboost_score": 0.85,
  "gnn_score": 0.78,
  "hybrid_score": 0.82,
  "consensus": "FRAUD",
  "models_flagged": 3,
  "confidence": "HIGH"
}
```

#### 1d. Test AI Explanations
```bash
# Get model explanation
curl "http://localhost:8000/ai-explain-model/xgboost"

# Expected Response:
{
  "model": "xgboost",
  "what_it_does": "...",
  "how_it_works": "...",
  "strengths": ["Fast", "Handles imbalance", ...],
  "weaknesses": ["No feature explanation", ...],
  "best_for": "...",
  "performance_on_cases": {...},
  "improvements": "..."
}
```

### Test 2: Frontend UI

#### 2a. Test Sidebar Navigation
- [ ] Go to http://localhost:3000
- [ ] Verify "Models" appears in left sidebar (above Reports)
- [ ] Verify "AI Bot" appears in left sidebar (below Models)
- [ ] Click "Models" → page loads without errors
- [ ] Click "AI Bot" → page loads without errors

#### 2b. Test Models Page
- [ ] Click "Models" in sidebar
- [ ] Verify "Baseline Metrics Panel" displays on left
- [ ] Verify model tabs visible (XGBoost | GNN | Stacked Hybrid)
- [ ] **Click "Run Real Model Evaluation" button**
  - [ ] Button shows loading state
  - [ ] Metrics update after script runs
  - [ ] Precision, Recall, F1, Accuracy values appear
  - [ ] "Cases caught" and "Cases missed" show
  - [ ] No errors in browser console

#### 2c. Test AI Bot - Model Explanation
- [ ] Click "AI Bot" in sidebar
- [ ] Select "XGBoost" button
- [ ] Verify explanations load:
  - [ ] "What it does" section visible
  - [ ] "How it works" section visible
  - [ ] Strengths list shows (3-5 items)
  - [ ] Weaknesses list shows (3-5 items)
  - [ ] Best uses section visible
  - [ ] Performance on 5 cases section visible
- [ ] Click "GNN" button → explanations update (different content)
- [ ] Click "Stacked Hybrid" → explanations update

#### 2d. Test AI Bot - Transaction Explanation
- [ ] Scroll to bottom of AI Bot page
- [ ] Find "Explain Specific Transaction" section
- [ ] Enter transaction ID (e.g., "TXN_001")
- [ ] Click "Explain"
- [ ] Verify results show:
  - [ ] Why was it flagged?
  - [ ] Model agreement score
  - [ ] Risk factors listed
  - [ ] Next steps recommended

#### 2e. Test Transactions Page - File Upload
- [ ] Click "Transactions" in sidebar
- [ ] Find file upload section
- [ ] Create test CSV:
  ```csv
  amount,velocity,sender_id,receiver_id,hour
  50000.00,0,U789,U999,23
  ```
- [ ] Upload CSV
- [ ] Verify:
  - [ ] File accepted
  - [ ] Form fields auto-populate
  - [ ] Transaction data shows below
- [ ] **Click "Process Transaction & Compare Models"**
- [ ] Verify results:
  - [ ] Stacked Hybrid prediction shows
  - [ ] XGBoost score displays
  - [ ] GNN score displays
  - [ ] Hybrid score displays
  - [ ] Consensus verdict shows
  - [ ] Color coding (red/orange/green) correct

#### 2f. Test Transactions Page - Manual Entry
- [ ] Clear form or refresh page
- [ ] Manually enter transaction:
  - Amount: 5000
  - Velocity: 3
  - Sender: U123
  - Receiver: U456
  - Hour: 14
- [ ] Click "Process Transaction & Compare Models"
- [ ] Verify all 3 model scores appear
- [ ] Consensus shows (usually CLEAN if conservative amounts)

### Test 3: Integration Tests

#### 3a. End-to-End: Upload → Compare → Explain
- [ ] Go to Transactions
- [ ] Upload CSV with multiple transactions
- [ ] Select first transaction
- [ ] Process it
- [ ] Confirm model scores appear
- [ ] Go to AI Bot
- [ ] Explain that transaction
- [ ] Verify explanation is relevant to scores

#### 3b. Model Evaluation vs Explanation Consistency
- [ ] Go to Models page
- [ ] Run XGBoost evaluation
- [ ] Note the metrics (precision, recall, F1)
- [ ] Go to AI Bot
- [ ] Read XGBoost explanation
- [ ] Verify explanation aligns with metrics shown on Models page

#### 3c. File Format Testing (if supported)
- [ ] Create test.pdf with transaction data table
  - [ ] Upload PDF
  - [ ] Verify extraction works
  - [ ] Compare with CSV extraction
  
- [ ] Create test.docx with transaction data table
  - [ ] Upload DOCX
  - [ ] Verify extraction works
  - [ ] Compare with CSV extraction

## Expected Results Summary

| Test | Expected | Status |
|------|----------|--------|
| XGBoost evaluation runs | Metrics returned | ⬜ |
| GNN evaluation runs | Metrics returned | ⬜ |
| Hybrid evaluation runs | Metrics returned | ⬜ |
| File upload (CSV) | Transactions extracted | ⬜ |
| File upload (PDF) | Transactions extracted | ⬜ |
| File upload (DOCX) | Transactions extracted | ⬜ |
| Model explanation loads | Detailed explanation | ⬜ |
| Transaction explanation | Specific reason shown | ⬜ |
| Models page renders | No errors, buttons clickable | ⬜ |
| AI Bot page renders | No errors, all sections visible | ⬜ |
| Transactions page comparison | All 3 scores + consensus | ⬜ |
| Consensus logic | Correct fraud verdict | ⬜ |

## Troubleshooting

### Model scripts don't execute
- [ ] Check file paths in backend/main.py are relative to project root
- [ ] Verify ml_pipeline/models/ directory exists
- [ ] Run script manually: `python ml_pipeline/models/baseline_xgboost.py`
- [ ] Check data files exist in data/processed/

### File upload fails
- [ ] Check backend accepts multipart/form-data
- [ ] Verify file size is reasonable (<10MB)
- [ ] For PDF: install `pip install PyPDF2`
- [ ] For DOCX: install `pip install python-docx`

### Model explanations are generic
- [ ] Explanations come from `/ai-explain-model/{model_type}` endpoint
- [ ] Currently generated by backend logic
- [ ] Can be expanded with more detailed content

### Performance issues
- [ ] Model scripts can take 10-30 seconds
- [ ] Add spinner/loading animation while waiting
- [ ] Consider caching results locally
- [ ] Monitor API response times

## Performance Benchmarks (Approximate)

| Operation | Expected Time |
|-----------|----------------|
| Run XGBoost evaluation | 15-30 seconds |
| Run GNN evaluation | 20-40 seconds |
| Run Hybrid evaluation | 15-25 seconds |
| Upload & parse CSV | 1-2 seconds |
| Upload & parse PDF | 2-5 seconds |
| Upload & parse DOCX | 2-5 seconds |
| Run transaction comparison | 3-5 seconds |
| Get model explanation | <1 second |
| Get transaction explanation | <1 second |

## Success Criteria

✅ All 3 models can be evaluated independently  
✅ File upload works for at least CSV  
✅ Model comparison shows all 3 scores  
✅ AI Bot displays explanations  
✅ Transaction explanation works with real IDs  
✅ No JavaScript errors in browser  
✅ No Python errors in backend logs  
✅ Consensus logic correct (majority vote)  
✅ Performance reasonable (<2 minutes for full workflow)
