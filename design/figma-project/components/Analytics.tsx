import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Lightbulb, Target, AlertTriangle, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

const monthlyData = [
  { month: 'Sep', amount: 2800 },
  { month: 'Oct', amount: 3200 },
  { month: 'Nov', amount: 2900 },
  { month: 'Dec', amount: 3800 },
  { month: 'Jan', amount: 3580 }
];

const categoryTrendData = [
  { category: 'Food', thisMonth: 1250, lastMonth: 1100 },
  { category: 'Transport', thisMonth: 890, lastMonth: 750 },
  { category: 'Bills', thisMonth: 720, lastMonth: 680 },
  { category: 'Shopping', thisMonth: 540, lastMonth: 420 },
  { category: 'Others', thisMonth: 180, lastMonth: 150 }
];

const dailySpendingData = [
  { day: '1', amount: 45 },
  { day: '2', amount: 120 },
  { day: '3', amount: 80 },
  { day: '4', amount: 190 },
  { day: '5', amount: 65 },
  { day: '6', amount: 210 },
  { day: '7', amount: 95 }
];

const insightCards = [
  {
    id: 1,
    type: 'warning',
    icon: AlertTriangle,
    title: 'High Spending Alert',
    description: 'You spent 25% more on food this week compared to last week.',
    suggestion: 'Consider meal planning to reduce food expenses.',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    accent: 'bg-orange-100'
  },
  {
    id: 2,
    type: 'positive',
    icon: TrendingDown,
    title: 'Great Progress!',
    description: 'Your transportation costs decreased by 15% this month.',
    suggestion: 'Keep using public transport and carpooling.',
    color: 'text-green-600 bg-green-50 border-green-200',
    accent: 'bg-green-100'
  },
  {
    id: 3,
    type: 'tip',
    icon: Lightbulb,
    title: 'Smart Tip',
    description: 'You typically spend more on weekends.',
    suggestion: 'Set a weekend budget to stay on track.',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    accent: 'bg-blue-100'
  },
  {
    id: 4,
    type: 'goal',
    icon: Target,
    title: 'Budget Goal',
    description: 'You\'re 89% towards your monthly budget goal.',
    suggestion: 'You can spend $420 more this month.',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    accent: 'bg-purple-100'
  }
];

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Mobile Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-medium">Analytics</h1>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('week')}
            className="px-4 py-2 active:scale-95 transition-all duration-200"
          >
            Week
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('month')}
            className="px-4 py-2 active:scale-95 transition-all duration-200"
          >
            Month
          </Button>
        </div>
      </div>

      {/* Enhanced AI Insights */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
            </div>
            <span>AI-Powered Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insightCards.map((insight) => (
              <div
                key={insight.id}
                className={`p-5 rounded-2xl border-2 ${insight.color}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${insight.accent}`}>
                    <insight.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-2">{insight.title}</h4>
                    <p className="text-sm opacity-90 mb-3">{insight.description}</p>
                    <p className="text-sm font-medium">{insight.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Optimized Spending Trend */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Amount']}
                  labelStyle={{ color: '#666' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#030213" 
                  strokeWidth={3}
                  dot={{ fill: '#030213', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#030213' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between mt-6 p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowUp className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium">+12.5% vs last month</span>
            </div>
            <Badge variant="secondary" className="px-3 py-1">January 2025</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Optimized Category Analysis */}
      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="comparison" className="text-sm">Comparison</TabsTrigger>
          <TabsTrigger value="daily" className="text-sm">Daily Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Category Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="category" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [`$${value}`, name === 'thisMonth' ? 'This Month' : 'Last Month']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        fontSize: '14px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="lastMonth" fill="#E5E7EB" name="Last Month" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="thisMonth" fill="#030213" name="This Month" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Daily Spending (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySpendingData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        fontSize: '14px'
                      }}
                    />
                    <Bar 
                      dataKey="amount" 
                      fill="#030213" 
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <span className="text-sm font-medium">Average daily spending</span>
                  <span className="font-semibold text-lg">$115</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ArrowDown className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Best Category</p>
            <p className="font-semibold text-lg">Transport</p>
            <p className="text-xs text-green-600 font-medium">-15% this month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ArrowUp className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Needs Attention</p>
            <p className="font-semibold text-lg">Food</p>
            <p className="text-xs text-red-600 font-medium">+25% this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}