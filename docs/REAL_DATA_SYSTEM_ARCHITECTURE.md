# Comprehensive System Architecture - Real Data Model Comparison & AI Bot

## Overview
This document describes the complete system architecture with real model execution, file upload capabilities, AI Bot explainer, and comprehensive model comparison.

## Architecture Changes

### 1. Backend Endpoints (backend/main.py)

#### Model Execution Endpoints
```
GET /run-model-evaluation/{model_type}
  - Runs actual Python scripts: baseline_xgboost.py, evaluate_gnn.py, stacked_hybrid.py
  - Returns real metrics from model training/evaluation
  - Supported models: 'xgboost', 'gnn', 'stacked_hybrid'
```

#### File Upload & Parsing
```
POST /upload-transaction-file
  - Accepts: CSV, PDF, Word documents
  - Extracts transaction data from uploaded files
  - Returns structured transaction records
  - Used to populate transaction simulator with real data
```

#### Transaction Comparison
```
POST /run-transaction-comparison
  - Runs single transaction through all 3 models
  - Returns predictions from XGBoost, GNN, and Stacked Hybrid
  - Computes consensus verdict
  - Shows confidence scores and risk levels
```

#### AI Explainer Endpoints
```
GET /ai-explain-model/{model_type}
  - Returns detailed explanation: what it does, how it works
  - Shows strengths, weaknesses, best use cases
  - Includes performance on 5 test cases
  - Provides improvement recommendations

GET /ai-explain-transaction/{tx_id}
  - Explains why a specific transaction was flagged/cleared
  - Shows model agreement/disagreement
  - Lists risk factors
  - Recommends next steps
```

### 2. Navigation Structure

**Sidebar Menu (Left):**
```
Home
Transactions
Fraud Network
Alerts
Models ← Model comparison & testing
AI Bot ← Explainer engine
Reports
Settings
```

### 3. Frontend Pages

#### **Transactions Page** (Enhanced)
**New Features:**
- 📁 **File Upload Section**
  - Upload CSV/PDF/Word docs
  - Auto-extract transaction data
  - Pre-populate form fields
  
- 🎯 **Live Simulation**
  - Enter transaction details manually or from file
  - Shows Stacked Hybrid prediction
  
- 📊 **Model Comparison** (After prediction)
  - Side-by-side comparison of all 3 models
  - Visual risk score bars
  - Consensus verdict
  - Which models agree/disagree

**Flow:**
```
Upload File (optional)
    ↓
Enter/Confirm Transaction Details
    ↓
Click "Process Transaction & Compare Models"
    ↓
See Stacked Hybrid Result + All 3 Models Comparison
```

#### **Models Page** (Real Data)
**Three Sections:**
1. **Left Sidebar (Sticky)**
   - Baseline Metrics Panel (static training reference)
   
2. **Main Area (Scrollable)**
   - **Model Comparison Tool**
     - Select model tab (XGBoost / GNN / Hybrid)
     - **"Run Real Model Evaluation" Button**
       - Executes actual Python script
       - Loads real metrics
       - Shows live computation status
     - Display:
       - Precision, Recall, F1, Accuracy
       - Cases caught/missed
       - Strengths & weaknesses
   
   - **Fraud Test Cases**
     - 5 scenarios to test each model
     - Select case and model
     - See prediction results
   
   - **AI Bot Preview**
     - Button to open full AI Bot page
   
   - **Quick Reference Card**
     - Model specializations at-a-glance

#### **AI Bot Page** (New - Dedicated)
**Two Main Sections:**

1. **Model Explainer (Left + Main)**
   - Select model: XGBoost / GNN / Stacked Hybrid
   - Get AI-generated explanations:
     - What the model does
     - How it works internally
     - Strengths (📊 performance focused)
     - Weaknesses (❌ explicit limitations)
     - Best use cases
     - Performance on 5 test cases
     - Improvement recommendations

2. **Transaction Explainer (Bottom)**
   - Enter transaction ID
   - Get detailed explanation:
     - Why was it flagged?
     - How each model voted
     - Specific risk factors
     - What action to take next

### 4. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERACTIONS                          │
└─────────────────────────────────────────────────────────────────┘
           ↓                           ↓                      ↓
    ┌─────────────┐            ┌──────────────┐      ┌──────────────┐
    │ Transactions│            │    Models    │      │    AI Bot    │
    │   (Upload)  │            │  (Compare)   │      │ (Explainer)  │
    └─────────────┘            └──────────────┘      └──────────────┘
           ↓                           ↓                      ↓
    ┌─────────────────┐      ┌──────────────────┐   ┌──────────────────┐
    │ File Parsing    │      │ Real Model       │   │ AI Explanations  │
    │ (CSV/PDF/Word)  │      │ Execution        │   │ (Descriptions)   │
    └─────────────────┘      └──────────────────┘   └──────────────────┘
           ↓                           ↓                      ↓
    ┌─────────────────────┐  ┌──────────────────────┐        │
    │ Transaction Compare │  │ baseline_xgboost.py  │        │
    │ (All 3 Models)      │  │ evaluate_gnn.py      │        │
    └─────────────────────┘  │ stacked_hybrid.py    │        │
           ↓                  └──────────────────────┘        │
    ┌──────────────────────┐           ↓                      │
    │ XGBoost Score        │  ┌─────────────────────┐         │
    │ GNN Score            │  │ Real Metrics:       │         │
    │ Hybrid Score         │  │ - Precision         │         │
    │ Consensus Verdict    │  │ - Recall            │         │
    └──────────────────────┘  │ - F1                │         │
                              │ - Accuracy          │         │
                              └─────────────────────┘         │
                                       ↓                      │
                              Display on Models Page       Display in
                              + Update metrics              AI Bot
```

## How to Use - Complete Workflows

### Workflow 1: Upload File & Simulate

1. **Go to Transactions page**
2. **Upload File**
   - Click "Upload CSV, PDF, or Word doc"
   - Select file from computer
   - System extracts transaction records
3. **Populate Form**
   - Fields auto-fill from first extracted record
   - Modify as needed
4. **Process**
   - Click "Process Transaction & Compare Models"
5. **View Results**
   - See Stacked Hybrid prediction
   - See comparison grid with all 3 models
   - Consensus verdict shown

### Workflow 2: Run Real Model Evaluation

1. **Go to Models page**
2. **Select Model Tab**
   - Choose XGBoost, GNN, or Stacked Hybrid
3. **Click "Run Real Model Evaluation"**
   - System runs actual Python script
   - Loads real metrics from training data
   - Shows progress/loading state
4. **View Results**
   - See 4 key metrics (Precision, Recall, F1, Accuracy)
   - View which 5 test cases it caught/missed
   - Read strengths and shortcomings
5. **Switch Models**
   - Compare XGBoost vs GNN vs Hybrid
   - Understand trade-offs

### Workflow 3: Understand Model Performance (AI Bot)

1. **Go to AI Bot page**
2. **Select Model**
   - Click XGBoost / GNN / Stacked Hybrid
3. **Read Explanations**
   - "What it does" - Plain English description
   - "How it works" - Technical explanation
   - Strengths & Weaknesses
   - Best use cases
4. **Understand Test Performance**
   - See which 5 cases it caught/missed
   - Learn why (e.g., "Misses network fraud rings")
5. **Get Recommendations**
   - "How to improve this model"
   - Actionable next steps

### Workflow 4: Explain Specific Transaction

1. **On AI Bot page (bottom section)**
2. **Enter Transaction ID**
   - Box to paste TXN_123456
3. **Click "Explain"**
4. **Get Details**
   - Why was it flagged?
   - How did each model vote?
   - What risk factors were detected?
   - What should you do next?

## Key Features

✅ **Real Model Execution**
- Runs actual Python scripts (baseline_xgboost.py, evaluate_gnn.py, stacked_hybrid.py)
- Displays real metrics from model training
- Live computation with progress indicators

✅ **File Upload & Extraction**
- Support for CSV, PDF, Word documents
- Auto-parsing of transaction data
- Pre-population of simulation forms

✅ **Model Comparison**
- All 3 models side-by-side
- Visual comparison charts
- Consensus verdict
- Understanding which models agree/disagree

✅ **AI Explainer**
- Plain English explanations
- No technical jargon needed
- Specific examples and use cases
- Actionable recommendations

✅ **Separate Concerns**
- Transactions: Live simulation & comparison
- Models: Model evaluation & testing
- AI Bot: Explanations & understanding

## Commits Made

1. Add AI Bot to sidebar navigation
2. Add real model execution, file upload, AI explanation endpoints (Backend)
3. Add AI Bot explainer page with model explanations (Frontend)
4. Add file upload and model comparison to Transaction page
5. Update ModelComparison to run real model scripts

## Next Steps

1. **Test File Upload**
   - Upload sample CSV with transactions
   - Verify field extraction works
   
2. **Run Model Scripts**
   - Ensure baseline_xgboost.py, evaluate_gnn.py, stacked_hybrid.py are working
   - Check that metrics files are saved in models/saved/
   
3. **Test Model Comparison**
   - Click each model
   - Verify "Run Real Model Evaluation" executes scripts
   - Confirm metrics display correctly
   
4. **Test AI Bot**
   - Navigate to AI Bot page
   - Select each model
   - Verify explanations are detailed and helpful
   - Test transaction explanation with real TX IDs

5. **Monitor Performance**
   - Track time to run model scripts
   - Consider caching if too slow
   - Monitor for API timeouts

## Architecture Benefits

🎯 **Clear Separation** - Different pages for different purposes
📊 **Real Data** - No mock data, everything runs actual algorithms
💡 **Understanding** - AI explanations for all decisions
🔄 **Workflow** - Easy progression from raw data → comparison → understanding
📈 **Scalability** - Can add more models, test cases, explanations
