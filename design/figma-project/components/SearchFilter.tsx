import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Search, Filter, CalendarIcon, Sparkles, X, SortAsc, SortDesc } from 'lucide-react';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

const mockTransactions = [
  { id: 1, description: 'Starbucks Coffee', category: 'Food', amount: 12.50, date: '2025-01-30', payment: 'Credit Card', icon: '☕' },
  { id: 2, description: 'Uber Ride to Airport', category: 'Transport', amount: 45.75, date: '2025-01-29', payment: 'Digital Wallet', icon: '🚗' },
  { id: 3, description: 'Whole Foods Grocery', category: 'Food', amount: 89.20, date: '2025-01-29', payment: 'Debit Card', icon: '🛒' },
  { id: 4, description: 'Netflix Monthly Subscription', category: 'Bills', amount: 15.99, date: '2025-01-28', payment: 'Credit Card', icon: '📺' },
  { id: 5, description: 'Coffee Bean & Tea Leaf', category: 'Food', amount: 8.75, date: '2025-01-28', payment: 'Cash', icon: '☕' },
  { id: 6, description: 'Gas Station Fill-up', category: 'Transport', amount: 52.30, date: '2025-01-27', payment: 'Credit Card', icon: '⛽' },
  { id: 7, description: 'Amazon Prime Shopping', category: 'Shopping', amount: 67.99, date: '2025-01-26', payment: 'Credit Card', icon: '📦' },
  { id: 8, description: 'Movie Theater Tickets', category: 'Entertainment', amount: 24.00, date: '2025-01-25', payment: 'Digital Wallet', icon: '🎬' }
];

const categories = ['All', 'Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Travel', 'Other'];
const paymentMethods = ['All', 'Credit Card', 'Debit Card', 'Cash', 'Digital Wallet'];

const quickFilters = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 3 Months', value: '3months' }
];

const naturalLanguageExamples = [
  "Show coffee expenses this month",
  "Transport costs over $50",
  "All food purchases last week",
  "Credit card expenses today"
];

export function SearchFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [aiProcessing, setAiProcessing] = useState(false);

  const handleNaturalLanguageSearch = async (query: string) => {
    setSearchQuery(query);
    setAiProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let filtered = [...mockTransactions];
      
      // Simple natural language processing simulation
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('coffee')) {
        filtered = filtered.filter(t => t.description.toLowerCase().includes('coffee'));
      }
      if (lowerQuery.includes('food') || lowerQuery.includes('dining')) {
        filtered = filtered.filter(t => t.category === 'Food');
      }
      if (lowerQuery.includes('transport')) {
        filtered = filtered.filter(t => t.category === 'Transport');
      }
      if (lowerQuery.includes('over') || lowerQuery.includes('>')) {
        const amount = parseFloat(lowerQuery.match(/\d+/)?.[0] || '0');
        filtered = filtered.filter(t => t.amount > amount);
      }
      if (lowerQuery.includes('credit card')) {
        filtered = filtered.filter(t => t.payment === 'Credit Card');
      }
      if (lowerQuery.includes('this month')) {
        const thisMonth = new Date().getMonth();
        filtered = filtered.filter(t => new Date(t.date).getMonth() === thisMonth);
      }
      if (lowerQuery.includes('last week')) {
        const weekAgo = subWeeks(new Date(), 1);
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
      }
      
      setFilteredTransactions(filtered);
      setAiProcessing(false);
    }, 1000);
  };

  const applyFilters = () => {
    let filtered = [...mockTransactions];
    
    // Text search
    if (searchQuery && !aiProcessing) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    // Payment method filter
    if (selectedPayment !== 'All') {
      filtered = filtered.filter(t => t.payment === selectedPayment);
    }
    
    // Quick date filters
    if (selectedQuickFilter) {
      const now = new Date();
      let dateThreshold;
      
      switch (selectedQuickFilter) {
        case 'today':
          dateThreshold = now;
          break;
        case 'week':
          dateThreshold = subWeeks(now, 1);
          break;
        case 'month':
          dateThreshold = subMonths(now, 1);
          break;
        case '3months':
          dateThreshold = subMonths(now, 3);
          break;
        default:
          dateThreshold = null;
      }
      
      if (dateThreshold) {
        filtered = filtered.filter(t => new Date(t.date) >= dateThreshold);
      }
    }
    
    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
    
    if (!aiProcessing) {
      setFilteredTransactions(filtered);
    }
  };

  React.useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedPayment, selectedQuickFilter, sortOrder, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPayment('All');
    setSelectedQuickFilter('');
    setFilteredTransactions(mockTransactions);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedPayment !== 'All' || selectedQuickFilter;

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Search & Filter</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Smart Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            {aiProcessing && (
              <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 animate-pulse" />
            )}
            <Input
              placeholder="Try: 'Show coffee expenses this month' or search normally..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleNaturalLanguageSearch(searchQuery);
                }
              }}
              className="pl-10 pr-12"
            />
          </div>
          
          {/* AI Examples */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Try natural language:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {naturalLanguageExamples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleNaturalLanguageSearch(example)}
                  className="text-xs h-7"
                >
                  "{example}"
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Advanced Filters</CardTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Date Filters */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quick Filters</label>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={selectedQuickFilter === filter.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedQuickFilter(
                      selectedQuickFilter === filter.value ? '' : filter.value
                    )}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category and Payment Method */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Payment Method</label>
                <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">
            {filteredTransactions.length} Result{filteredTransactions.length !== 1 ? 's' : ''}
          </h3>
          {hasActiveFilters && (
            <Badge variant="secondary">Filtered</Badge>
          )}
          {aiProcessing && (
            <Badge variant="outline" className="text-blue-600">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Processing...
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        >
          {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
        </Button>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No transactions found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{transaction.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span>•</span>
                      <span>{transaction.payment}</span>
                      <span>•</span>
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">-${transaction.amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Total Summary */}
      {filteredTransactions.length > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Amount</span>
              <span className="text-lg font-semibold">
                -${filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}