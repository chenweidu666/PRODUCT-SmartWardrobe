import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { 
  User, 
  Download, 
  Cloud, 
  Settings, 
  Palette, 
  Bell, 
  Shield, 
  CreditCard,
  Tags,
  Plus,
  Edit3,
  Trash2,
  FileText,
  Database,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const customCategories = [
  { id: 1, name: 'Coffee & Drinks', icon: '☕', color: '#FF6B6B', transactions: 15 },
  { id: 2, name: 'Gym & Fitness', icon: '💪', color: '#4ECDC4', transactions: 8 },
  { id: 3, name: 'Pet Expenses', icon: '🐕', color: '#45B7D1', transactions: 12 },
  { id: 4, name: 'Books & Learning', icon: '📚', color: '#96CEB4', transactions: 5 }
];

export function SettingsProfile() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState('4000');
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@example.com');

  const handleExportCSV = () => {
    toast.success('Expense data exported to CSV successfully!');
  };

  const handleExportPDF = () => {
    toast.success('Monthly report exported to PDF successfully!');
  };

  const handleBackupData = () => {
    toast.success('Data backed up to Google Drive successfully!');
  };

  const handleSyncData = () => {
    toast.success('Data synced with cloud storage!');
  };

  const handleDeleteCategory = (categoryId: number) => {
    toast.success('Category deleted successfully!');
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl">Settings</h1>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="budget">Monthly Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleExportCSV} className="h-16 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Export CSV</span>
            </Button>
            <Button variant="outline" onClick={handleExportPDF} className="h-16 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Export PDF</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Export your expense data for backup or analysis in other tools.
          </p>
        </CardContent>
      </Card>

      {/* Cloud Sync */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Sync & Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Google Drive Backup</p>
                <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleBackupData}>
              <Cloud className="h-4 w-4 mr-2" />
              Backup Now
            </Button>
            <Button variant="outline" onClick={handleSyncData}>
              <Database className="h-4 w-4 mr-2" />
              Sync Data
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Your data is automatically backed up to Google Drive and synced across devices.
          </p>
        </CardContent>
      </Card>

      {/* Category Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Custom Categories
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {customCategories.map((category) => (
            <div key={category.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: category.color }}
              >
                <span className="text-lg">{category.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-muted-foreground">
                  {category.transactions} transactions
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                {darkMode ? <Moon className="h-5 w-5 text-purple-600" /> : <Sun className="h-5 w-5 text-purple-600" />}
              </div>
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Switch to dark theme</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified about expenses</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Budget Alerts</p>
                <p className="text-sm text-muted-foreground">Alert when overspending</p>
              </div>
            </div>
            <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Payment Methods
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <User className="h-4 w-4 mr-2" />
            Privacy Settings
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">ExpenseTracker v2.1.0</p>
          <div className="flex justify-center gap-4 text-sm">
            <Button variant="ghost" size="sm">Terms of Service</Button>
            <Button variant="ghost" size="sm">Privacy Policy</Button>
            <Button variant="ghost" size="sm">Help Center</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}