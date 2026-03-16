import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Home, Plus, BarChart3, Search, Settings, Lightbulb, AlertTriangle, Target, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

export function AnalyticsMockup() {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Month</div>
            <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">Year</div>
          </div>
        </div>

        {/* AI Insights */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI-Powered Insights</h3>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  icon: AlertTriangle,
                  title: 'High Spending Alert',
                  description: 'You spent 25% more on food this week.',
                  suggestion: 'Consider meal planning to reduce expenses.',
                  color: 'text-orange-600 bg-orange-50 border-orange-200',
                  accent: 'bg-orange-100'
                },
                {
                  icon: TrendingUp,
                  title: 'Great Progress!',
                  description: 'Transportation costs decreased by 15%.',
                  suggestion: 'Keep using public transport.',
                  color: 'text-green-600 bg-green-50 border-green-200',
                  accent: 'bg-green-100'
                },
                {
                  icon: Target,
                  title: 'Budget Goal',
                  description: 'You\'re 81% towards your monthly goal.',
                  suggestion: 'You can spend $653 more this month.',
                  color: 'text-purple-600 bg-purple-50 border-purple-200',
                  accent: 'bg-purple-100'
                }
              ].map((insight, index) => (
                <div key={index} className={`p-4 rounded-2xl border-2 ${insight.color}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${insight.accent}`}>
                      <insight.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs opacity-90 mb-2">{insight.description}</p>
                      <p className="text-xs font-medium">{insight.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
            
            {/* Chart Mockup */}
            <div className="h-48 relative">
              <svg className="w-full h-full" viewBox="0 0 320 180">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Line chart */}
                <polyline
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="40,120 80,80 120,100 160,60 200,90 240,40 280,70"
                />
                
                {/* Data points */}
                {[
                  { x: 40, y: 120 }, { x: 80, y: 80 }, { x: 120, y: 100 },
                  { x: 160, y: 60 }, { x: 200, y: 90 }, { x: 240, y: 40 }, { x: 280, y: 70 }
                ].map((point, index) => (
                  <circle key={index} cx={point.x} cy={point.y} r="4" fill="#6366f1" />
                ))}
                
                {/* Month labels */}
                {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, index) => (
                  <text key={index} x={40 + index * 40} y={170} textAnchor="middle" className="text-xs fill-gray-500">
                    {month}
                  </text>
                ))}
              </svg>
            </div>
            
            <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowUp className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">+8.5% vs last month</span>
              </div>
              <Badge variant="secondary" className="text-xs">January 2025</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Category Breakdown</h3>
            
            {/* Bar Chart Mockup */}
            <div className="space-y-4">
              {[
                { name: 'Food', thisMonth: 1150, lastMonth: 920, color: 'bg-red-500' },
                { name: 'Transport', thisMonth: 680, lastMonth: 800, color: 'bg-blue-500' },
                { name: 'Bills', thisMonth: 520, lastMonth: 500, color: 'bg-green-500' },
                { name: 'Shopping', thisMonth: 350, lastMonth: 280, color: 'bg-yellow-500' }
              ].map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{category.name}</span>
                    <span className="text-gray-500">${category.thisMonth}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden">
                      <div 
                        className={`h-full ${category.color} rounded-md`}
                        style={{ width: `${(category.thisMonth / 1200) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden">
                      <div 
                        className="h-full bg-gray-300 rounded-md"
                        style={{ width: `${(category.lastMonth / 1200) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>This Month</span>
                    <span>Last Month</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ArrowDown className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Best Category</p>
              <p className="font-semibold text-gray-900">Transport</p>
              <p className="text-xs text-green-600 font-medium">-15% saved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ArrowUp className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Needs Attention</p>
              <p className="font-semibold text-gray-900">Food</p>
              <p className="text-xs text-red-600 font-medium">+25% over</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="h-20 bg-white border-t border-gray-200 flex items-center justify-around px-4">
        {[
          { icon: Home, label: 'Home' },
          { icon: Plus, label: 'Add' },
          { icon: BarChart3, label: 'Analytics', active: true },
          { icon: Search, label: 'Search' },
          { icon: Settings, label: 'Settings' }
        ].map((item, index) => (
          <div key={index} className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg ${
            item.active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'
          }`}>
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}