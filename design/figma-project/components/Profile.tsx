import React, { useState } from 'react';
import { Home, FolderOpen, User, LogIn, Camera, Settings, LogOut, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ProfileProps {
  onNavigate?: (page: string) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  // 未登录态
  if (!isLoggedIn && !showLoginForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">我的衣柜</h1>
          <p className="text-sm text-slate-600 mt-1">登录后管理您的个人信息</p>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          <div className="px-4 py-6">
            
            {/* Login Prompt Card */}
            <Card className="p-8 border-slate-200 text-center mb-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">欢迎使用智能衣橱</h2>
              <p className="text-sm text-slate-600 mb-6">
                登录后即可同步您的衣物数据，享受更多功能
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl"
                  onClick={() => setShowLoginForm(true)}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  登录 / 注册
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2"
                  onClick={() => onNavigate?.('home')}
                >
                  暂不登录，继续浏览
                </Button>
              </div>
            </Card>

            {/* Features Preview */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 px-1">登录后可使用</h3>
              
              <Card className="p-4 border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <ImageIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-1">个人图片管理</h4>
                    <p className="text-xs text-slate-600">上传和管理您的个人照片</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-1">数据同步</h4>
                    <p className="text-xs text-slate-600">跨设备同步您的衣橱数据</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-1">个性化推荐</h4>
                    <p className="text-xs text-slate-600">根据您的喜好智能推荐</p>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
          <div className="max-w-md mx-auto px-4 py-2">
            <div className="flex items-center justify-around">
              <button 
                onClick={() => onNavigate?.('home')}
                className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center"
              >
                <Home className="h-6 w-6" />
                <span className="text-[11px]">首页</span>
              </button>

              <button 
                onClick={() => onNavigate?.('wardrobe-manage')}
                className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center"
              >
                <FolderOpen className="h-6 w-6" />
                <span className="text-[11px]">衣服管理</span>
              </button>

              <button className="flex flex-col items-center gap-0.5 text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center">
                <User className="h-6 w-6" />
                <span className="text-[11px] font-semibold">我的衣柜</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  // 登录表单态
  if (showLoginForm && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">登录 / 注册</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          <div className="px-4 py-6">
            <Card className="p-6 border-slate-200">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">手机号</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="请输入手机号" 
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm">验证码</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="code" 
                      type="text" 
                      placeholder="请输入验证码" 
                      className="h-12 flex-1"
                    />
                    <Button variant="outline" className="h-12 px-4 shrink-0">
                      获取验证码
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl mt-6"
                  onClick={() => setIsLoggedIn(true)}
                >
                  登录
                </Button>

                <Button 
                  variant="ghost"
                  className="w-full h-12 rounded-xl"
                  onClick={() => setShowLoginForm(false)}
                >
                  返回
                </Button>

                <p className="text-xs text-slate-500 text-center pt-4">
                  登录即表示同意《用户协议》和《隐私政策》
                </p>
              </div>
            </Card>
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
          <div className="max-w-md mx-auto px-4 py-2">
            <div className="flex items-center justify-around">
              <button 
                onClick={() => onNavigate?.('home')}
                className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center"
              >
                <Home className="h-6 w-6" />
                <span className="text-[11px]">首页</span>
              </button>

              <button 
                onClick={() => onNavigate?.('wardrobe-manage')}
                className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center"
              >
                <FolderOpen className="h-6 w-6" />
                <span className="text-[11px]">衣服管理</span>
              </button>

              <button className="flex flex-col items-center gap-0.5 text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center">
                <User className="h-6 w-6" />
                <span className="text-[11px] font-semibold">我的衣柜</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  // 已登录态
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900">我的衣柜</h1>
        <p className="text-sm text-slate-600 mt-1">个人中心</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6 space-y-6">
          
          {/* Profile Card */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-slate-600" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900">用户12345</h2>
                <p className="text-sm text-slate-600 mt-1">138****8888</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-sm">昵称</Label>
                <Input 
                  id="nickname" 
                  defaultValue="用户12345" 
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">邮箱</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="请输入邮箱" 
                  className="h-11"
                />
              </div>

              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 rounded-xl mt-4">
                保存修改
              </Button>
            </div>
          </Card>

          {/* Image Management */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">个人图片管理</h3>
              <Button size="sm" variant="ghost" className="text-sm">
                <Camera className="h-4 w-4 mr-1" />
                上传
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i}
                  className="aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-slate-400 transition-colors cursor-pointer"
                >
                  <ImageIcon className="h-8 w-8 text-slate-400" />
                </div>
              ))}
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-4 border-slate-200">
            <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-slate-600" />
                <span className="text-slate-900">设置</span>
              </div>
              <span className="text-slate-400">›</span>
            </button>
          </Card>

          {/* Logout */}
          <Button 
            variant="outline"
            className="w-full h-12 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => {
              if (confirm('确定要退出登录吗？')) {
                setIsLoggedIn(false);
                setShowLoginForm(false);
              }
            }}
          >
            <LogOut className="h-5 w-5 mr-2" />
            退出登录
          </Button>

        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex items-center justify-around">
            <button 
              onClick={() => onNavigate?.('home')}
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center"
            >
              <Home className="h-6 w-6" />
              <span className="text-[11px]">首页</span>
            </button>

            <button 
              onClick={() => onNavigate?.('wardrobe-manage')}
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center"
            >
              <FolderOpen className="h-6 w-6" />
              <span className="text-[11px]">衣服管理</span>
            </button>

            <button className="flex flex-col items-center gap-0.5 text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center">
              <User className="h-6 w-6" />
              <span className="text-[11px] font-semibold">我的衣柜</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}