import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Home, Plus, BarChart3, Search, Settings, DollarSign, TrendingUp, Calendar } from 'lucide-react';

export function DashboardMockup() {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Hello, Sarah! 👋</h1>
            <p className="text-gray-600 text-sm">Track your expenses wisely</p>
          </div>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Monthly Summary Card */}
        <Card className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-indigo-100 text-sm">Total Spent This Month</p>
                <p className="text-4xl font-bold">$2,847</p>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-indigo-100">
                <span>Budget: $3,500</span>
                <span>Remaining: $653</span>
              </div>
              <Progress value={81.3} className="bg-white/20 h-3" />
              <div className="flex justify-between text-xs text-indigo-100">
                <span>81.3% used</span>
                <span>9 days left</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending by Category */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Spending by Category</h3>
              <Badge variant="secondary" className="text-xs">January 2025</Badge>
            </div>
            
            {/* Pie Chart Mockup */}
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="20"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="20" 
                          strokeDasharray="110" strokeDashoffset="25" className="drop-shadow-sm"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="20" 
                          strokeDasharray="70" strokeDashoffset="-85" className="drop-shadow-sm"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="20" 
                          strokeDasharray="50" strokeDashoffset="-155" className="drop-shadow-sm"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="20" 
                          strokeDasharray="30" strokeDashoffset="-205" className="drop-shadow-sm"/>
                </svg>
              </div>
              
              <div className="flex-1 space-y-3">
                {[
                  { name: 'Food', amount: 1150, color: 'bg-red-500', percent: '40%' },
                  { name: 'Transport', amount: 680, color: 'bg-blue-500', percent: '24%' },
                  { name: 'Bills', amount: 520, color: 'bg-green-500', percent: '18%' },
                  { name: 'Shopping', amount: 350, color: 'bg-yellow-500', percent: '12%' },
                  { name: 'Others', amount: 147, color: 'bg-gray-400', percent: '6%' }
                ].map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">${category.amount}</p>
                      <p className="text-xs text-gray-500">{category.percent}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
              <button className="text-sm text-indigo-600 font-medium">View All</button>
            </div>
            
            <div className="space-y-3">
              {[
                { icon: '☕', name: 'Starbucks Coffee', category: 'Food', amount: 8.75, date: 'Today' },
                { icon: '🚗', name: 'Uber Ride', category: 'Transport', amount: 22.50, date: 'Today' },
                { icon: '🛒', name: 'Whole Foods', category: 'Food', amount: 156.80, date: 'Yesterday' },
                { icon: '📱', name: 'Apple Music', category: 'Bills', amount: 9.99, date: 'Yesterday' }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm">
                    {transaction.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{transaction.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Badge variant="outline" className="text-xs px-2 py-0">{transaction.category}</Badge>
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">-${transaction.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mb-1">vs Last Month</p>
              <p className="font-semibold text-green-600">+8.5%</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Days Left</p>
              <p className="font-semibold text-blue-600">9 days</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="h-20 bg-white border-t border-gray-200 flex items-center justify-around px-4">
        {[
          { icon: Home, label: 'Home', active: true },
          { icon: Plus, label: 'Add' },
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