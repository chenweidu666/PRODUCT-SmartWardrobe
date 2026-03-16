import React, { useState } from 'react';
import { ChevronLeft, Upload, Home, FolderOpen, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AddClothingProps {
  onNavigate?: (page: string) => void;
}

export function AddClothing({ onNavigate }: AddClothingProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* A区：顶部区 Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => onNavigate?.('wardrobe-manage')}
            className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors -ml-2 p-2"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm">返回</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">添加衣物</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* B区：内容区 Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 py-6">
          {/* B1 信息表单区 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 space-y-6">
              
              {/* B1.1 图片上传 */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-900">图片上传</Label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive 
                      ? 'border-teal-500 bg-teal-50' 
                      : uploadedImage 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                  
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded clothing" 
                        className="max-h-48 mx-auto rounded-lg object-contain"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg cursor-pointer hover:bg-slate-800 transition-colors text-sm"
                      >
                        更换图片
                      </label>
                    </div>
                  ) : (
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <Upload className="h-10 w-10 mx-auto mb-3 text-slate-400" />
                      <p className="text-sm text-slate-600 mb-1">点击或拖拽上传衣物图片</p>
                      <p className="text-xs text-slate-400">JPG / PNG，最大 5MB</p>
                    </label>
                  )}
                </div>
              </div>

              {/* 基本信息 */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">基本信息</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm">分类</Label>
                    <Select defaultValue="down-jacket">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">名称</Label>
                    <Input id="name" placeholder="速写羽绒服" defaultValue="速写羽绒服" className="h-11" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="color" className="text-sm">颜色</Label>
                      <Input id="color" placeholder="黑色" defaultValue="黑色" className="h-11" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size" className="text-sm">尺码</Label>
                      <Select defaultValue="xxl">
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
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-sm">品牌</Label>
                      <Input id="brand" placeholder="速写" defaultValue="速写" className="h-11" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="season" className="text-sm">季节</Label>
                      <Select defaultValue="winter">
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="material" className="text-sm">材质</Label>
                    <Input id="material" placeholder="棉混纺" defaultValue="棉混纺" className="h-11" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="shoulder" className="text-sm">肩宽</Label>
                      <Input id="shoulder" placeholder="46cm" defaultValue="46cm" className="h-11" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chest" className="text-sm">胸围</Label>
                      <Input id="chest" placeholder="108cm" defaultValue="108cm" className="h-11" />
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
                    <Input id="price" type="number" placeholder="1497" defaultValue="1497" className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm">日期</Label>
                    <Input id="date" type="date" className="h-11" />
                  </div>
                </div>
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm">备注</Label>
                <Textarea 
                  id="notes" 
                  placeholder="例：通勤外套，洗涤时注意水温" 
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* B2 确认按钮区 */}
          <div className="mt-6">
            <Button 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-base font-medium rounded-xl shadow-lg"
              onClick={() => onNavigate?.('wardrobe-manage')}
            >
              确认添加衣服
            </Button>
          </div>
        </div>
      </main>

      {/* C区：导航区 Bottom Navigation */}
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