import React, { useState } from 'react';
import { ChevronLeft, Plus, SlidersHorizontal, Home, FolderOpen, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface WardrobeManageProps {
  onNavigate?: (page: string, itemId?: number) => void;
}

export function WardrobeManage({ onNavigate }: WardrobeManageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'jacket', name: '外套' },
    { id: 'top', name: '上衣' },
    { id: 'pants', name: '裤子' },
    { id: 'dress', name: '裙装' },
    { id: 'accessories', name: '配饰' },
  ];

  const items = [
    { id: 1, name: '速写羽绒服', category: 'jacket', color: '黑色', size: 'XXL', image: '🧥' },
    { id: 2, name: '优衣库毛衣', category: 'top', color: '灰色', size: 'L', image: '👔' },
    { id: 3, name: 'Nike运动裤', category: 'pants', color: '蓝色', size: 'M', image: '👖' },
    { id: 4, name: 'Zara夹克', category: 'jacket', color: '棕色', size: 'L', image: '🧥' },
    { id: 5, name: 'H&M连衣裙', category: 'dress', color: '红色', size: 'S', image: '👗' },
    { id: 6, name: 'Adidas运动衫', category: 'top', color: '白色', size: 'M', image: '👕' },
    { id: 7, name: 'Levi\'s牛仔裤', category: 'pants', color: '深蓝', size: 'L', image: '👖' },
    { id: 8, name: '羊绒围巾', category: 'accessories', color: '米色', size: 'F', image: '🧣' },
    { id: 9, name: 'Columbia冲锋衣', category: 'jacket', color: '军绿', size: 'L', image: '🧥' },
    { id: 10, name: '条纹衬衫', category: 'top', color: '蓝白', size: 'M', image: '👔' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => onNavigate?.('home')}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors -ml-2 p-2"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">返回</span>
            </button>
            <h1 className="text-xl font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">衣服管理</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
              <Button 
                size="icon"
                className="h-9 w-9 bg-slate-900 hover:bg-slate-800"
                onClick={() => onNavigate?.('wardrobe-add')}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Category Filter - Horizontal Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Grid */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <Card 
                key={item.id}
                className="overflow-hidden border-slate-200 hover:shadow-lg transition-all cursor-pointer active:scale-95"
                onClick={() => onNavigate?.('wardrobe-detail', item.id)}
              >
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-6xl">
                  {item.image}
                </div>
                <div className="p-3 space-y-1 bg-white">
                  <h3 className="font-medium text-slate-900 text-sm line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {item.color} · {item.size}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-slate-600 mb-4">暂无衣物</p>
              <Button 
                onClick={() => onNavigate?.('wardrobe-add')}
                className="bg-slate-900 hover:bg-slate-800"
              >
                添加第一件衣物
              </Button>
            </div>
          )}
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

            <button className="flex flex-col items-center gap-0.5 text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center">
              <FolderOpen className="h-6 w-6" />
              <span className="text-[11px] font-semibold">衣服管理</span>
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