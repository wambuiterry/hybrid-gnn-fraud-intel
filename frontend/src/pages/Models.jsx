import { useState } from 'react';
import { BarChart3, Beaker, Zap } from 'lucide-react';
import ModelComparison from '../components/ModelComparison';
import TestCaseSampler from '../components/TestCaseSampler';
import BaselineMetricsPanel from '../components/BaselineMetricsPanel';
import AIBotButton from '../components/AIBotButton';

export default function Models() {
  const [expandedSection, setExpandedSection] = useState('baseline');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="text-brandPrimary" size={32} />
          Model Comparison & Analysis
        </h1>
        <p className="text-gray-600 mt-2">
          Compare XGBoost, GNN, and Stacked Hybrid models. Test with 5 fraud scenarios and view static baseline metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 1: BASELINE METRICS (Static Reference) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <div
              onClick={() => setExpandedSection(expandedSection === 'baseline' ? null : 'baseline')}
              className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap className="text-yellow-500" size={22} />
                Baseline Metrics
              </h2>
              <p className="text-xs text-gray-500 mt-1">Training-time reference (Static)</p>
            </div>
            {(expandedSection === 'baseline' || window.innerWidth > 1024) && (
              <div className="p-6">
                <BaselineMetricsPanel />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2 & 3: Model Comparison + Test Sampler (Main Area) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Model Comparison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="text-brandPrimary" size={22} />
                Model Comparison Tool
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Select a model to see detailed metrics, cases caught/missed, and specific strengths/shortcomings
              </p>
            </div>
            <div className="p-6">
              <ModelComparison />
            </div>
          </div>

          {/* Test Case Sampler */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Beaker className="text-purple-600" size={22} />
                Fraud Test Cases
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Test different models against 5 standardized fraud scenarios to understand trade-offs
              </p>
            </div>
            <div className="p-6">
              <TestCaseSampler />
            </div>
          </div>

          {/* AI Bot Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-sm border border-purple-300 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Interactive AI Analyst (Beta)</h3>
                <p className="text-purple-100 text-sm">
                  Get natural language explanations of fraud patterns and model recommendations
                </p>
              </div>
              <div className="flex-shrink-0 w-40">
                <AIBotButton onOpen={() => console.log('AI Bot coming soon')} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={20} />
          Quick Reference: Model Specializations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <p className="font-semibold text-gray-900">XGBoost</p>
            <p className="text-sm text-gray-600 mt-1">Best for: Velocity-based fraud, small transactions</p>
            <p className="text-xs text-gray-500 mt-2">Cases caught: 3/5</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-100">
            <p className="font-semibold text-gray-900">GNN</p>
            <p className="text-sm text-gray-600 mt-1">Best for: Network rings, fraud topology</p>
            <p className="text-xs text-gray-500 mt-2">Cases caught: 3/5</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <p className="font-semibold text-gray-900">Stacked Hybrid</p>
            <p className="text-sm text-gray-600 mt-1">Best for: All fraud types (production choice)</p>
            <p className="text-xs text-gray-500 mt-2">Cases caught: 5/5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
