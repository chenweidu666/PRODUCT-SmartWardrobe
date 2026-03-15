import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Home, Plus, BarChart3, Search, Settings, Sparkles, Filter, SortDesc } from 'lucide-react';

export function SearchMockup() {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <h1 className="text-2xl font-semibold text-gray-900">Search & Filter</h1>
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Filter className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        {/* Smart Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
              <div className="h-12 bg-gray-50 rounded-xl border-2 border-blue-500 flex items-center pl-10 pr-12">
                <span className="text-gray-900">Show coffee expenses this month</span>
              </div>
            </div>
            
            {/* AI Examples */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span>Try natural language:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  '"Transport costs over $50"',
                  '"All food purchases last week"',
                  '"Credit card expenses today"'
                ].map((example, index) => (
                  <div key={index} className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                    {example}
                  </div>
                ))}
              </div>
            </div>
            
            {/* AI Processing Badge */}
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Processing...
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Filters */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Quick Filters</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'This Week', active: false },
                { label: 'This Month', active: true },
                { label: 'Food', active: true },
                { label: 'Over $20', active: false }
              ].map((filter, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter.active
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {filter.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">8 Results</h3>
            <Badge variant="secondary">Filtered</Badge>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <SortDesc className="h-4 w-4 text-gray-600" />
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-3">
          {[
            { icon: '☕', name: 'Starbucks Coffee', category: 'Food', amount: 12.50, date: '2025-01-30', payment: 'Credit Card' },
            { icon: '☕', name: 'Coffee Bean & Tea', category: 'Food', amount: 8.75, date: '2025-01-29', payment: 'Cash' },
            { icon: '☕', name: 'Local Coffee Shop', category: 'Food', amount: 6.50, date: '2025-01-28', payment: 'Digital Wallet' },
            { icon: '☕', name: 'Dunkin\' Donuts', category: 'Food', amount: 4.99, date: '2025-01-27', payment: 'Credit Card' },
            { icon: '☕', name: 'Café Mocha', category: 'Food', amount: 11.25, date: '2025-01-25', payment: 'Credit Card' }
          ].map((transaction, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-xl">
                    {transaction.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{transaction.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        {transaction.category}
                      </Badge>
                      <span>•</span>
                      <span>{transaction.payment}</span>
                      <span>•</span>
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">-${transaction.amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total Summary */}
        <Card className="bg-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Total Coffee Expenses</span>
              <span className="text-xl font-bold text-gray-900">-$43.99</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">8 transactions this month</p>
          </CardContent>
        </Card>

        <div className="pb-6"></div>
      </div>

      {/* Bottom Navigation */}
      <div className="h-20 bg-white border-t border-gray-200 flex items-center justify-around px-4">
        {[
          { icon: Home, label: 'Home' },
          { icon: Plus, label: 'Add' },
          { icon: BarChart3, label: 'Analytics' },
          { icon: Search, label: 'Search', active: true },
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