import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Home, Plus, BarChart3, Search, Settings, ArrowLeft, Camera, Sparkles, DollarSign } from 'lucide-react';

export function AddExpenseMockup() {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-2">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Add Expense</h1>
        </div>

        {/* AI Receipt Scanner */}
        <Card className="border-dashed border-2 border-indigo-300 bg-indigo-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Scan Receipt</h3>
            <p className="text-sm text-gray-600 mb-6">
              Use AI to automatically extract expense details
            </p>
            <div className="w-full h-12 bg-white border-2 border-indigo-600 rounded-xl flex items-center justify-center text-indigo-600 font-medium">
              <Camera className="h-5 w-5 mr-2" />
              Scan Receipt
            </div>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <Card>
          <CardContent className="p-6">
            <label className="text-lg font-medium text-gray-900 mb-4 block">Amount *</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <div className="h-16 bg-gray-50 rounded-xl border-2 border-indigo-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 pl-8">45.80</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description with AI Suggestion */}
        <Card>
          <CardContent className="p-6">
            <label className="text-lg font-medium text-gray-900 mb-4 block">Description *</label>
            <div className="h-12 bg-gray-50 rounded-xl border border-gray-300 flex items-center px-4">
              <span className="text-gray-900">Whole Foods Market</span>
            </div>
            
            {/* AI Suggestion */}
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-800">AI Suggestion</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                This looks like a Food & Dining expense
              </p>
              <div className="w-full h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                ⚡ Apply Suggestion
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Selection */}
        <Card>
          <CardContent className="p-6">
            <label className="text-lg font-medium text-gray-900 mb-4 block">Category *</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🍽️', name: 'Food & Dining', selected: true },
                { icon: '🚗', name: 'Transportation', selected: false },
                { icon: '⚡', name: 'Bills & Utilities', selected: false },
                { icon: '🛍️', name: 'Shopping', selected: false },
                { icon: '🏥', name: 'Healthcare', selected: false },
                { icon: '🎬', name: 'Entertainment', selected: false }
              ].map((category, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 text-left ${
                    category.selected
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium text-sm text-gray-700">{category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date and Payment */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
              <div className="h-10 bg-gray-50 rounded-lg border border-gray-300 flex items-center px-3 text-sm text-gray-900">
                Jan 30, 2025
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Payment</label>
              <div className="h-10 bg-gray-50 rounded-lg border border-gray-300 flex items-center px-3 text-sm text-gray-900">
                💳 Credit Card
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardContent className="p-6">
            <label className="text-lg font-medium text-gray-900 mb-4 block">Notes (Optional)</label>
            <div className="h-20 bg-gray-50 rounded-xl border border-gray-300 p-4">
              <span className="text-gray-500 text-sm">Weekly grocery shopping...</span>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="pt-4 pb-6">
          <div className="w-full h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-lg font-medium text-white">Add Expense</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="h-20 bg-white border-t border-gray-200 flex items-center justify-around px-4">
        {[
          { icon: Home, label: 'Home' },
          { icon: Plus, label: 'Add', active: true },
          { icon: BarChart3, label: 'Analytics' },
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