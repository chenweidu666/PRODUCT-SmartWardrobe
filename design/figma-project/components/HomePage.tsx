import React from 'react';
import { Home, FolderOpen, User, Cloud, Sparkles, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900">智能衣橱</h1>
        <p className="text-sm text-slate-600 mt-1">让穿搭更简单，让生活更优雅</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6 space-y-4">
          
          {/* 天气模块 - 占位 */}
          <Card className="p-6 border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  <h2 className="font-semibold text-slate-900">今日天气</h2>
                </div>
                <p className="text-sm text-slate-600">根据天气智能推荐穿搭</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">22°</div>
                <div className="text-xs text-slate-600 mt-1">多云</div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-blue-100">
              <div className="text-sm text-slate-600">💡 建议：适合穿薄外套</div>
            </div>
          </Card>

          {/* 推荐模块 - 占位 */}
          <Card className="p-6 border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="font-semibold text-slate-900">AI 穿搭推荐</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              基于您的衣柜和今日场景，为您推荐最佳搭配
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-square bg-white rounded-lg flex items-center justify-center text-4xl shadow-sm">
                👔
              </div>
              <div className="aspect-square bg-white rounded-lg flex items-center justify-center text-4xl shadow-sm">
                👖
              </div>
              <div className="aspect-square bg-white rounded-lg flex items-center justify-center text-4xl shadow-sm">
                👞
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              查看完整搭配
            </button>
          </Card>

          {/* 统计模块 - 占位 */}
          <Card className="p-6 border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h2 className="font-semibold text-slate-900">我的衣橱数据</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">127</div>
                <div className="text-xs text-slate-600 mt-1">总件数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-xs text-slate-600 mt-1">本月新增</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-xs text-slate-600 mt-1">本周穿戴</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">最常穿</span>
                <span className="font-medium text-slate-900">黑色羽绒服</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-600">利用率</span>
                <span className="font-medium text-green-600">78%</span>
              </div>
            </div>
          </Card>

          {/* 快捷入口 */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onNavigate?.('wardrobe-manage')}
              className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all text-center"
            >
              <div className="text-3xl mb-2">📦</div>
              <div className="text-sm font-medium text-slate-900">浏览衣柜</div>
            </button>
            <button
              onClick={() => onNavigate?.('wardrobe-manage')}
              className="p-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-center shadow-md"
            >
              <div className="text-3xl mb-2">➕</div>
              <div className="text-sm font-medium">添加衣物</div>
            </button>
          </div>

        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-0.5 text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center">
              <Home className="h-6 w-6" />
              <span className="text-[11px] font-semibold">首页</span>
            </button>

            <button 
              onClick={() => onNavigate?.('wardrobe-manage')}
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center"
            >
              <FolderOpen className="h-6 w-6" />
              <span className="text-[11px]">衣服管理</span>
            </button>

            <button 
              onClick={() => onNavigate?.('profile')}
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center"
            >
              <User className="h-6 w-6" />
              <span className="text-[11px]">我的衣柜</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}