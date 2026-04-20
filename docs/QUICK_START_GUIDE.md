# Quick Start Guide - Running the System

## Prerequisites Verified

✅ Backend framework: FastAPI  
✅ Frontend framework: React + Tailwind CSS  
✅ Navigation: Models & AI Bot added to sidebar  
✅ Routes: All configured  
✅ Endpoints: 5 new endpoints added  
✅ Components: All created and connected  

## Step 1: Start the Backend

```bash
# Terminal 1
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
Uvicorn running on http://0.0.0.0:8000
Uvicorn running under application framework: FastAPI
Application startup complete
```

## Step 2: Start the Frontend

```bash
# Terminal 2 (different directory)
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
  VITE v4.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Step 3: Test the System

### Test 1: Navigate to Models Page
1. Open http://localhost:5173
2. Click "Models" in left sidebar
3. **Expected:** Models page loads with model tabs (XGBoost | GNN | Stacked Hybrid)
4. **Status:** ✓ Navigation working

### Test 2: Run Model Evaluation
1. On Models page, click "Run Real Model Evaluation" button
2. **Watch for:** Loading spinner appears
3. **Expected:** 
   - 15-30 seconds pass
   - Metrics populate: Precision, Recall, F1, Accuracy
   - Cases caught/missed display
4. **Status:** ✓ Real model execution working

### Test 3: Navigate to AI Bot
1. Click "AI Bot" in left sidebar
2. **Expected:** AI Bot page loads with model selector
3. Select "XGBoost" button
4. **Expected:** Explanation loads showing:
   - What it does
   - How it works
   - Strengths list
   - Weaknesses list
5. **Status:** ✓ AI Bot working

### Test 4: Transactions with File Upload
1. Click "Transactions" in sidebar
2. Scroll down to "Upload Transaction File"
3. Create test CSV:
   ```csv
   amount,velocity,sender_id,receiver_id,hour
   50000.00,0,U789,U999,23
   ```
4. Upload CSV
5. **Expected:** Form fields auto-populate
6. Click "Process Transaction & Compare Models"
7. **Expected:** See all 3 model scores + consensus

### Test 5: AI Bot Transaction Explanation
1. Click "AI Bot" in sidebar
2. Scroll to "Explain Specific Transaction" section
3. Enter transaction ID (e.g., "TXN_001")
4. Click "Explain"
5. **Expected:** See why it was flagged/cleared

---

## Troubleshooting During Tests

### Issue: Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill process and try again
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
python -m uvicorn main:app --port 8001
```

### Issue: Frontend won't connect to backend
```bash
# Check backend is running
curl http://localhost:8000/

# Check CORS is configured (it should be in main.py)
# If not, add:
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Model evaluation times out
```
# Check model script exists
ls ml_pipeline/models/baseline_xgboost.py

# Try running it manually
python ml_pipeline/models/baseline_xgboost.py

# If it doesn't run, check:
# 1. Dependencies installed
# 2. Data files exist in data/processed/
# 3. Model file exists in models/saved/
```

### Issue: File upload fails
```bash
# Check multipart form data is accepted
curl -X OPTIONS -H "Access-Control-Request-Method: POST" \
  http://localhost:8000/upload-transaction-file

# For PDF support install:
pip install PyPDF2

# For DOCX support install:
pip install python-docx
```

### Issue: Models page shows "Models" tab but nothing displays
```
# Check React Router is working
# In browser console:
console.log(window.location.pathname)
# Should show: /models

# Verify Models.jsx is imported in App.jsx
# Search for: import Models from...
```

---

## System Architecture Quick View

```
┌─────────────────────────────────────────────────────┐
│              Your Fraud Detection System             │
└─────────────────────────────────────────────────────┘

Frontend (React + Vite at :5173)
├── Home - Main dashboard
├── Transactions - Upload files, simulate, compare models
├── Fraud Network - Graph visualization
├── Alerts - Alert management
├── Models ← NEW - Compare & evaluate models
├── AI Bot ← NEW - Explainer engine
├── Reports - Analytics
└── Settings - Configuration

Backend (FastAPI at :8000)
├── /predict - Basic prediction
├── /run-model-evaluation/{model} - Execute real scripts
├── /upload-transaction-file - Parse CSV/PDF/Word
├── /run-transaction-comparison - All 3 models at once
├── /ai-explain-model/{type} - Model explanations
└── /ai-explain-transaction/{id} - Transaction explanations

Models (Real Execution)
├── baseline_xgboost.py - XGBoost model
├── evaluate_gnn.py - GNN model
└── stacked_hybrid.py - Hybrid ensemble
```

---

## Data Files Required

For full functionality, ensure these files exist:

```
data/processed/
├── final_model_data.csv         (transaction training data)
├── gnn_probabilities.csv        (GNN outputs)
└── hetero_graph.pt              (graph structure for GNN)

models/saved/
├── xgboost_model.pkl            (trained XGBoost)
└── hybrid_model.pkl             (trained hybrid model)
```

If any are missing:
1. Run training pipeline: `python ml_pipeline/training/train_gnn.py`
2. Generate probabilities: `python ml_pipeline/models/extract_gnn_probs.py`
3. Train hybrid: `python ml_pipeline/models/hybrid_xgboost.py`

---

## Performance Expectations

| Operation | Time | Notes |
|-----------|------|-------|
| Page load | <1s | React component renders |
| File upload (CSV) | 1-2s | Parse and extract |
| File upload (PDF) | 2-5s | Requires PyPDF2 |
| Model evaluation | 15-30s | Runs actual Python script |
| Transaction comparison | 3-5s | 3 models sequential |
| AI explanation | <1s | Cached/pre-computed |

---

## Verifying Everything Works

Run this test sequence:

1. **Backend Ready?**
   ```bash
   curl http://localhost:8000/
   # Should return: {"message": "FastAPI successfully running"}
   ```

2. **Frontend Ready?**
   ```bash
   curl http://localhost:5173/
   # Should return HTML with React app
   ```

3. **Model Evaluation Works?**
   ```bash
   curl http://localhost:8000/run-model-evaluation/xgboost
   # Should return JSON with metrics
   ```

4. **File Upload Works?**
   ```bash
   # Create test.csv
   echo "amount,velocity,sender_id,receiver_id,hour
   5000,2,U123,U456,10" > test.csv
   
   curl -F "file=@test.csv" \
     http://localhost:8000/upload-transaction-file
   # Should return extracted transactions
   ```

5. **All Good?**
   - ✅ Backend responses are JSON (not HTML errors)
   - ✅ No CORS errors in network tab
   - ✅ Model script produces metrics
   - ✅ All 3 models can be selected
   - ✅ AI Bot shows explanations

---

## Next Actions After Verification

### Priority 1: Test Basic Flow
- [ ] Upload CSV file to Transactions page
- [ ] See model comparison appear
- [ ] Verify scores are between 0-1

### Priority 2: Test Model Evaluation
- [ ] Click "Run Real Model Evaluation" on Models page
- [ ] Wait for it to complete
- [ ] Verify metrics look reasonable

### Priority 3: Test AI Explanations
- [ ] Switch model selector on AI Bot
- [ ] Read explanations for each
- [ ] Enter transaction ID and get explanation

### Priority 4: Production Readiness
- [ ] Set longer timeout for model execution (30+ seconds)
- [ ] Add error boundaries in React
- [ ] Test with large CSV files
- [ ] Monitor memory usage during model evaluation

---

## Development Tips

### Hot Reload
- **Frontend:** Automatic (Vite)
- **Backend:** Use `--reload` flag or add `pip install python-watch`

### Debugging Backend
```python
# Add debug prints in main.py
@app.post("/run-transaction-comparison")
async def run_transaction_comparison(transaction_data: dict):
    print(f"DEBUG: Received transaction: {transaction_data}")  # Will show in terminal
    # ... rest of code
```

### Debugging Frontend
```javascript
// In React components
const handlePredict = async () => {
  console.log("DEBUG: Calling API with:", formData);  // Will show in browser console
  const response = await axios.post('/run-transaction-comparison', formData);
  console.log("DEBUG: API response:", response.data);
};
```

### Testing API Without Frontend
```bash
# Use curl or Postman to test endpoints directly
curl -X GET http://localhost:8000/run-model-evaluation/xgboost

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "velocity": 2, "sender_id": "U123", "receiver_id": "U456", "hour": 10}' \
  http://localhost:8000/run-transaction-comparison
```

---

## Success Checklist

When you see all these ✅, the system is working:

- [ ] ✅ Sidebar shows "Models" and "AI Bot"
- [ ] ✅ Models page loads without errors
- [ ] ✅ "Run Real Model Evaluation" button executes
- [ ] ✅ Metrics display (precision, recall, F1, accuracy)
- [ ] ✅ AI Bot page loads
- [ ] ✅ Model explanations display
- [ ] ✅ Transactions page file upload works
- [ ] ✅ Model comparison grid shows all 3 scores
- [ ] ✅ Consensus verdict displays
- [ ] ✅ Transaction explanation works with TX ID

**You're done! System is live and ready to test.** 🚀
