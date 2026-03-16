import React, { useState } from 'react';
import { ChevronLeft, Edit2, Trash2, Home, FolderOpen, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface WardrobeDetailProps {
  onNavigate?: (page: string) => void;
  itemId?: number;
}

export function WardrobeDetail({ onNavigate, itemId }: WardrobeDetailProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in real app, this would be fetched based on itemId
  const item = {
    id: itemId || 1,
    name: '速写羽绒服',
    category: 'down-jacket',
    color: '黑色',
    size: 'XXL',
    brand: '速写',
    season: 'winter',
    material: '棉混纺',
    shoulder: '46cm',
    chest: '108cm',
    price: 1497,
    date: '2024-11-20',
    notes: '通勤外套，洗涤时注意水温',
    image: '🧥'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate?.('wardrobe-manage')}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors -ml-2 p-2"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">返回</span>
            </button>
            <h1 className="text-xl font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">
              {isEditing ? '编辑衣物' : '衣物详情'}
            </h1>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 py-6">
          
          {/* Image Display */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <div className="text-9xl">{item.image}</div>
            </div>
          </div>

          {/* Information Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 space-y-6">
              
              {/* 基本信息 */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">基本信息</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm">分类</Label>
                    {isEditing ? (
                      <Select defaultValue={item.category}>
                        <SelectTrigger id="category" className="h-11">
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="down-jacket">羽绒服</SelectItem>
                          <SelectItem value="jacket">夹克</SelectItem>
                          <SelectItem value="coat">大衣</SelectItem>
                          <SelectItem value="sweater">毛衣</SelectItem>
                          <SelectItem value="shirt">衬衫</SelectItem>
                          <SelectItem value="t-shirt">T恤</SelectItem>
                          <SelectItem value="pants">裤子</SelectItem>
                          <SelectItem value="dress">连衣裙</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                        羽绒服
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">名称</Label>
                    {isEditing ? (
                      <Input id="name" defaultValue={item.name} className="h-11" />
                    ) : (
                      <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                        {item.name}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="color" className="text-sm">颜色</Label>
                      {isEditing ? (
                        <Input id="color" defaultValue={item.color} className="h-11" />
                      ) : (
                        <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                          {item.color}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size" className="text-sm">尺码</Label>
                      {isEditing ? (
                        <Select defaultValue={item.size.toLowerCase()}>
                          <SelectTrigger id="size" className="h-11">
                            <SelectValue placeholder="选择尺码" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="xs">XS</SelectItem>
                            <SelectItem value="s">S</SelectItem>
                            <SelectItem value="m">M</SelectItem>
                            <SelectItem value="l">L</SelectItem>
                            <SelectItem value="xl">XL</SelectItem>
                            <SelectItem value="xxl">XXL</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                          {item.size}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-sm">品牌</Label>
                      {isEditing ? (
                        <Input id="brand" defaultValue={item.brand} className="h-11" />
                      ) : (
                        <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                          {item.brand}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="season" className="text-sm">季节</Label>
                      {isEditing ? (
                        <Select defaultValue={item.season}>
                          <SelectTrigger id="season" className="h-11">
                            <SelectValue placeholder="选择季节" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spring">春季</SelectItem>
                            <SelectItem value="summer">夏季</SelectItem>
                            <SelectItem value="autumn">秋季</SelectItem>
                            <SelectItem value="winter">冬季</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                          冬季
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="material" className="text-sm">材质</Label>
                    {isEditing ? (
                      <Input id="material" defaultValue={item.material} className="h-11" />
                    ) : (
                      <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                        {item.material}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="shoulder" className="text-sm">肩宽</Label>
                      {isEditing ? (
                        <Input id="shoulder" defaultValue={item.shoulder} className="h-11" />
                      ) : (
                        <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                          {item.shoulder}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chest" className="text-sm">胸围</Label>
                      {isEditing ? (
                        <Input id="chest" defaultValue={item.chest} className="h-11" />
                      ) : (
                        <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                          {item.chest}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 购买信息 */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">购买信息</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm">价格</Label>
                    {isEditing ? (
                      <Input id="price" type="number" defaultValue={item.price} className="h-11" />
                    ) : (
                      <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                        ¥{item.price}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm">日期</Label>
                    {isEditing ? (
                      <Input id="date" type="date" defaultValue={item.date} className="h-11" />
                    ) : (
                      <div className="h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-900">
                        {item.date}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm">备注</Label>
                {isEditing ? (
                  <Textarea 
                    id="notes" 
                    defaultValue={item.notes}
                    className="min-h-[80px] resize-none"
                  />
                ) : (
                  <div className="min-h-[80px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                    {item.notes}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {isEditing ? (
              <>
                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-base font-medium rounded-xl shadow-lg"
                  onClick={() => {
                    setIsEditing(false);
                    // Save logic here
                  }}
                >
                  保存修改
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-12 text-base font-medium rounded-xl border-2"
                  onClick={() => setIsEditing(false)}
                >
                  取消
                </Button>
              </>
            ) : (
              <Button 
                variant="destructive"
                className="w-full h-12 text-base font-medium rounded-xl"
                onClick={() => {
                  if (confirm('确定要删除这件衣物吗？')) {
                    onNavigate?.('wardrobe-manage');
                  }
                }}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                删除衣物
              </Button>
            )}
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
              className="flex flex-col items-center gap-0.5 text-slate-900 transition-colors group min-h-[44px] min-w-[44px] justify-center"
            >
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