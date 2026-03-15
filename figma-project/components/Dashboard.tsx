import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard, ChevronRight, BarChart3 } from 'lucide-react';

const categoryData = [
  { name: 'Food', value: 35, color: '#FF6B6B', amount: 1250 },
  { name: 'Transport', value: 25, color: '#4ECDC4', amount: 890 },
  { name: 'Bills', value: 20, color: '#45B7D1', amount: 720 },
  { name: 'Shopping', value: 15, color: '#96CEB4', amount: 540 },
  { name: 'Others', value: 5, color: '#FFEAA7', amount: 180 }
];

const recentTransactions = [
  { id: 1, description: 'Starbucks Coffee', category: 'Food', amount: 12.50, date: '2025-01-30', icon: '☕' },
  { id: 2, description: 'Uber Ride', category: 'Transport', amount: 18.75, date: '2025-01-30', icon: '🚗' },
  { id: 3, description: 'Grocery Store', category: 'Food', amount: 89.20, date: '2025-01-29', icon: '🛒' },
  { id: 4, description: 'Netflix Subscription', category: 'Bills', amount: 15.99, date: '2025-01-29', icon: '📺' },
  { id: 5, description: 'Gas Station', category: 'Transport', amount: 45.60, date: '2025-01-28', icon: '⛽' }
];

export function Dashboard() {
  const totalSpent = 3580;
  const monthlyBudget = 4000;
  const remainingBudget = monthlyBudget - totalSpent;
  const budgetProgress = (totalSpent / monthlyBudget) * 100;

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Mobile-Optimized Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-medium">Hello, John! 👋</h1>
          <p className="text-muted-foreground">Track your expenses wisely</p>
        </div>
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 rounded-2xl w-14 h-14 shadow-lg active:scale-95 transition-all duration-200"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Enhanced Monthly Summary Card */}
      <Card className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-foreground/80 text-sm">Total Spent This Month</p>
              <p className="text-4xl font-semibold">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary-foreground/10 rounded-2xl">
              <DollarSign className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-primary-foreground/90">
              <span>Budget: ${monthlyBudget.toLocaleString()}</span>
              <span>Remaining: ${remainingBudget.toLocaleString()}</span>
            </div>
            <Progress 
              value={budgetProgress} 
              className="bg-primary-foreground/20 h-3" 
            />
            <div className="flex justify-between text-xs text-primary-foreground/80">
              <span>{budgetProgress.toFixed(1)}% used</span>
              <span>{(31 - new Date().getDate())} days left</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Optimized Spending by Category */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Spending by Category</span>
            <Badge variant="secondary" className="text-xs px-3 py-1">January 2025</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${category.amount}</p>
                    <p className="text-xs text-muted-foreground">{category.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Recent Transactions */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 active:bg-muted/40 transition-colors duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                {transaction.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-base">{transaction.description}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {transaction.category}
                  </Badge>
                  <span>{transaction.date}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-base">-${transaction.amount}</p>
                <CreditCard className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Mobile-Optimized Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">vs Last Month</p>
            <p className="font-semibold text-lg text-green-600">+12.5%</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Days Left</p>
            <p className="font-semibold text-lg text-blue-600">31 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-16 flex-col gap-2 active:scale-95 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm">Quick Add</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex-col gap-2 active:scale-95 transition-all duration-200"
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm">View Report</span>
        </Button>
      </div>
    </div>
  );
}