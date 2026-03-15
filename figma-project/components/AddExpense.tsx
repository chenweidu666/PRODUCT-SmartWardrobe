import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Camera, Sparkles, DollarSign, ArrowLeft, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner@2.0.3';

const categories = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: 'bg-red-100 text-red-800' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: 'bg-blue-100 text-blue-800' },
  { id: 'bills', name: 'Bills & Utilities', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-purple-100 text-purple-800' },
  { id: 'health', name: 'Healthcare', icon: '🏥', color: 'bg-green-100 text-green-800' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'bg-pink-100 text-pink-800' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'other', name: 'Other', icon: '📝', color: 'bg-gray-100 text-gray-800' }
];

const paymentMethods = [
  { id: 'credit', name: 'Credit Card', icon: '💳' },
  { id: 'debit', name: 'Debit Card', icon: '💳' },
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'digital', name: 'Digital Wallet', icon: '📱' }
];

export function AddExpense() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    
    // Simulate AI auto-categorization
    if (value.toLowerCase().includes('coffee') || value.toLowerCase().includes('restaurant') || value.toLowerCase().includes('food')) {
      setAiSuggestion('food');
    } else if (value.toLowerCase().includes('uber') || value.toLowerCase().includes('gas') || value.toLowerCase().includes('transport')) {
      setAiSuggestion('transport');
    } else if (value.toLowerCase().includes('netflix') || value.toLowerCase().includes('subscription') || value.toLowerCase().includes('bill')) {
      setAiSuggestion('bills');
    } else {
      setAiSuggestion(null);
    }
  };

  const handleScanReceipt = () => {
    toast.success('Receipt scanned! Details filled automatically.');
    setAmount('23.45');
    setDescription('Target Store - Groceries');
    setSelectedCategory('food');
    setPaymentMethod('credit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !selectedCategory) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    toast.success('Expense added successfully!');
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setPaymentMethod('');
    setNotes('');
    setAiSuggestion(null);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Mobile Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-medium">Add Expense</h1>
      </div>

      {/* Enhanced Receipt Scanner */}
      <Card className="border-dashed border-2 border-primary/30 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Scan Receipt</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Use AI to automatically extract expense details
          </p>
          <Button 
            onClick={handleScanReceipt} 
            variant="outline" 
            className="w-full h-12 text-base active:scale-95 transition-all duration-200"
          >
            <Camera className="h-5 w-5 mr-2" />
            Scan Receipt
          </Button>
        </CardContent>
      </Card>

      {/* Mobile-Optimized Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input - Large and Prominent */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Label htmlFor="amount" className="text-lg mb-4 block">Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-12 text-3xl h-16 text-center font-semibold border-2 focus:border-primary"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Label htmlFor="description" className="text-lg mb-4 block">Description *</Label>
            <Input
              id="description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="h-12 text-base border-2 focus:border-primary"
              required
            />
            {aiSuggestion && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-800">AI Suggestion</span>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  This looks like a {categories.find(c => c.id === aiSuggestion)?.name} expense
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCategory(aiSuggestion)}
                  className="text-blue-700 border-blue-300 active:scale-95 transition-all duration-200"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Apply Suggestion
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Selection - Mobile Grid */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Label className="text-lg mb-4 block">Category *</Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 active:scale-95 ${
                    selectedCategory === category.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date and Payment Method - Mobile Stack */}
        <div className="space-y-4">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <Label className="text-lg mb-4 block">Date</Label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 justify-start text-left border-2 active:scale-95 transition-all duration-200"
                  >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    <span className="text-base">{format(date, 'MMMM dd, yyyy')}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate);
                        setIsDateOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6">
              <Label className="text-lg mb-4 block">Payment Method</Label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 active:scale-95 ${
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-medium text-sm">{method.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Label htmlFor="notes" className="text-lg mb-4 block">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="text-base border-2 focus:border-primary"
            />
          </CardContent>
        </Card>

        {/* Submit Button - Large and Prominent */}
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-medium rounded-xl shadow-lg active:scale-95 transition-all duration-200"
          >
            Add Expense
          </Button>
        </div>
      </form>
    </div>
  );
}