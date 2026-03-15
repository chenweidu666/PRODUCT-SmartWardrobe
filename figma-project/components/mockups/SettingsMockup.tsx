import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Home, Plus, BarChart3, Search, Settings, 
  User, Download, Cloud, Bell, Moon, Shield, 
  CreditCard, Tags, Edit3, Trash2, FileText, Database 
} from 'lucide-react';

export function SettingsMockup() {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        </div>

        {/* Profile Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Profile</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-semibold">
                SA
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-lg border text-gray-900">
                      Sarah Anderson
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Monthly Budget</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-lg border text-gray-900">
                      $3,500
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Download className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Export Data</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 border border-gray-200 rounded-xl text-center">
                <FileText className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">Export CSV</span>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl text-center">
                <FileText className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">Export PDF</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-3">
              Export your expense data for backup or analysis in other tools.
            </p>
          </CardContent>
        </Card>

        {/* Cloud Sync */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Sync & Backup</h3>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Google Drive Backup</p>
                  <p className="text-sm text-gray-500">Last backup: 2 hours ago</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-700">
                Backup Now
              </div>
              <div className="p-3 border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-700">
                Sync Data
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Categories */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Custom Categories</h3>
              </div>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { icon: '☕', name: 'Coffee & Drinks', color: 'bg-orange-500', transactions: 15 },
                { icon: '💪', name: 'Gym & Fitness', color: 'bg-green-500', transactions: 8 },
                { icon: '🐕', name: 'Pet Expenses', color: 'bg-blue-500', transactions: 12 }
              ].map((category, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${category.color}`}>
                    <span>{category.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.transactions} transactions</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Edit3 className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Preferences</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: Moon, title: 'Dark Mode', description: 'Switch to dark theme', enabled: false },
                { icon: Bell, title: 'Push Notifications', description: 'Get notified about expenses', enabled: true },
                { icon: Shield, title: 'Budget Alerts', description: 'Alert when overspending', enabled: true }
              ].map((pref, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <pref.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{pref.title}</p>
                      <p className="text-sm text-gray-500">{pref.description}</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative ${
                    pref.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      pref.enabled ? 'left-6' : 'left-0.5'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Options */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Security & Privacy</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { icon: CreditCard, title: 'Manage Payment Methods' },
                { icon: Shield, title: 'Change Password' },
                { icon: User, title: 'Privacy Settings' }
              ].map((option, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                  <option.icon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{option.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">ExpenseTracker v2.1.0</p>
            <div className="flex justify-center gap-4 text-sm">
              <button className="text-gray-600">Terms</button>
              <button className="text-gray-600">Privacy</button>
              <button className="text-gray-600">Help</button>
            </div>
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
          { icon: Search, label: 'Search' },
          { icon: Settings, label: 'Settings', active: true }
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