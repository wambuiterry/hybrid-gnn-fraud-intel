import { TrendingDown, TrendingUp, Zap } from 'lucide-react';

export default function BaselineMetricsPanel() {
  // Static baseline metrics (not moving)
  const baselineMetrics = {
    model: "Stacked Hybrid XGBoost + GNN",
    updated: "Baseline - Training Set (2024-11)",
    metrics: {
      precision: 0.85,
      recall: 0.84,
      f1: 0.84,
      accuracy: 0.88,
      roc_auc: 0.91
    },
    by_fraud_type: {
      "Network Rings": { precision: 0.89, recall: 0.87 },
      "Velocity-Based": { precision: 0.82, recall: 0.81 },
      "Device Fraud": { precision: 0.84, recall: 0.85 },
      "Money Laundering": { precision: 0.87, recall: 0.86 }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Zap size={20} />
          Baseline Model Performance
        </h2>
        <p className="text-indigo-200 text-sm mt-1">{baselineMetrics.updated}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Metrics Summary */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Overall Metrics (Static Reference)</h3>
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: 'Precision', value: (baselineMetrics.metrics.precision * 100).toFixed(1), icon: TrendingUp, color: 'indigo' },
              { label: 'Recall', value: (baselineMetrics.metrics.recall * 100).toFixed(1), icon: TrendingUp, color: 'green' },
              { label: 'F1 Score', value: (baselineMetrics.metrics.f1 * 100).toFixed(1), icon: TrendingUp, color: 'blue' },
              { label: 'Accuracy', value: (baselineMetrics.metrics.accuracy * 100).toFixed(1), icon: TrendingUp, color: 'purple' },
              { label: 'ROC-AUC', value: (baselineMetrics.metrics.roc_auc * 100).toFixed(1), icon: TrendingUp, color: 'amber' }
            ].map((metric, idx) => {
              const Icon = metric.icon;
              const colorMap = {
                indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
                green: 'bg-green-50 border-green-200 text-green-700',
                blue: 'bg-blue-50 border-blue-200 text-blue-700',
                purple: 'bg-purple-50 border-purple-200 text-purple-700',
                amber: 'bg-amber-50 border-amber-200 text-amber-700'
              };

              return (
                <div key={idx} className={`${colorMap[metric.color]} p-3 rounded-lg border`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} />
                    <span className="text-xs font-medium">{metric.label}</span>
                  </div>
                  <div className="text-2xl font-bold">{metric.value}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance by Fraud Type */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Performance by Fraud Type</h3>
          <div className="space-y-2">
            {Object.entries(baselineMetrics.by_fraud_type).map(([fraudType, scores]) => (
              <div key={fraudType} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">{fraudType}</span>
                  <span className="text-xs text-gray-600">
                    Avg: {(((scores.precision + scores.recall) / 2) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex gap-3 text-xs">
                  <div className="flex-1">
                    <div className="text-gray-600 mb-1">Precision</div>
                    <div className="bg-white rounded border border-gray-300 overflow-hidden h-6 flex items-center px-2">
                      <div
                        className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-full rounded"
                        style={{ width: `${scores.precision * 100}%` }}
                      ></div>
                      <span className="ml-auto text-gray-700 font-semibold">
                        {(scores.precision * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-600 mb-1">Recall</div>
                    <div className="bg-white rounded border border-gray-300 overflow-hidden h-6 flex items-center px-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded"
                        style={{ width: `${scores.recall * 100}%` }}
                      ></div>
                      <span className="ml-auto text-gray-700 font-semibold">
                        {(scores.recall * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Static Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Note:</span> These are static baseline metrics from model training. 
            Compare with live model performance in the model selector panel to evaluate real-time effectiveness.
          </p>
        </div>
      </div>
    </div>
  );
}
