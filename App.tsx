
import React, { useState, useCallback } from 'react';
import { ViewState, AnalysisResult } from './types';
import { analyzeCalligraphy } from './services/geminiService';
import AnalysisReport from './components/AnalysisReport';
import StickerGenerator from './components/StickerGenerator';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [masterImg, setMasterImg] = useState<string | null>(null);
  const [userImg, setUserImg] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'master' | 'user') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'master') setMasterImg(base64);
        else setUserImg(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!masterImg || !userImg) return;
    setIsAnalyzing(true);
    setView('analyzing');
    try {
      const result = await analyzeCalligraphy(masterImg, userImg);
      setAnalysis(result);
      setView('result');
    } catch (error) {
      console.error("Analysis failed:", error);
      setView('upload');
      alert("分析失敗，請稍後再試。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderHome = () => (
    <div className="max-w-4xl mx-auto text-center space-y-12 py-20 px-4 animate-fade-in">
      <div className="space-y-4">
        <div className="inline-block bg-[#d32f2f] text-white px-3 py-1 text-xs rounded-full mb-4 animate-bounce">NEW: 數位鑑定報告 2.0</div>
        <h1 className="serif-title text-6xl md:text-8xl font-bold tracking-tighter text-[#1a1a1b]">
          墨韻<span className="text-[#d32f2f]">分析師</span>
        </h1>
        <p className="text-xl md:text-2xl text-stone-600 font-light tracking-[0.3em] uppercase">
          Ink Rhythm Analyst
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">🔎</div>
          <h3 className="font-bold">數位鑑定</h3>
          <p className="text-sm text-stone-500">專業歐體、顏體風格深度比對</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">📏</div>
          <h3 className="font-bold">量化指標</h3>
          <p className="text-sm text-stone-500">SSIM 與重心偏差之像素級數據</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">🎁</div>
          <h3 className="font-bold">文創導出</h3>
          <p className="text-sm text-stone-500">一鍵生成 LINE 貼圖與 Markdown 報告</p>
        </div>
      </div>

      <button
        onClick={() => setView('upload')}
        className="px-12 py-5 bg-[#d32f2f] text-white rounded-full text-xl font-bold shadow-2xl hover:bg-[#b71c1c] transition-all transform hover:scale-105 active:scale-95"
      >
        進入鑑定室
      </button>
    </div>
  );

  const renderUpload = () => (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      <h2 className="serif-title text-4xl font-bold text-center mb-12">上傳臨摹作品與對照字帖</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Master Upload */}
        <div className="space-y-4">
          <p className="font-bold text-[#d32f2f] flex items-center">
            <span className="bg-[#d32f2f] text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">1</span>
            名家原帖 (如：九成宮、蘭亭序)
          </p>
          <div className={`relative aspect-[3/4] rounded-3xl border-4 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-white ${masterImg ? 'border-green-500 shadow-lg' : 'border-stone-200 hover:border-stone-400'}`}>
            {masterImg ? (
              <img src={masterImg} alt="Master" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-8">
                <span className="text-6xl mb-4 block">📜</span>
                <p className="text-stone-400 font-medium">點擊上傳原帖照片</p>
                <p className="text-stone-300 text-xs mt-2">建議使用清晰掃描檔或格位照</p>
              </div>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => handleFileChange(e, 'master')} 
              accept="image/*"
            />
          </div>
        </div>

        {/* User Upload */}
        <div className="space-y-4">
          <p className="font-bold text-stone-800 flex items-center">
            <span className="bg-black text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">2</span>
            個人臨摹作品
          </p>
          <div className={`relative aspect-[3/4] rounded-3xl border-4 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-white ${userImg ? 'border-green-500 shadow-lg' : 'border-stone-200 hover:border-stone-400'}`}>
            {userImg ? (
              <img src={userImg} alt="User" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-8">
                <span className="text-6xl mb-4 block">🖌️</span>
                <p className="text-stone-400 font-medium">點擊上傳您的作品</p>
                <p className="text-stone-300 text-xs mt-2">請確保光線充足、背景乾淨</p>
              </div>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => handleFileChange(e, 'user')} 
              accept="image/*"
            />
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <button
          disabled={!masterImg || !userImg}
          onClick={startAnalysis}
          className={`px-16 py-5 rounded-full text-xl font-bold transition-all shadow-xl ${
            masterImg && userImg 
              ? 'bg-black text-white hover:bg-gray-800 transform hover:-translate-y-1' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-stone-200'
          }`}
        >
          {isAnalyzing ? '正在啟動數位鑑定核心...' : '啟動 AI 墨韻鑑定'}
        </button>
      </div>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col items-center justify-center text-center space-y-8 animate-pulse">
      <div className="relative">
        <div className="w-40 h-40 border-8 border-t-[#d32f2f] border-stone-100 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-5xl font-serif">墨</div>
      </div>
      <div className="space-y-3">
        <h2 className="serif-title text-3xl font-bold text-stone-800 tracking-widest">AI 專家鑑定中...</h2>
        <p className="text-stone-500 text-sm">
            正在計算 SSIM 指標、分析歐體/顏體法度、生成 Markdown 報告...
        </p>
      </div>
      <div className="flex gap-4">
        <span className="px-4 py-2 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-full uppercase tracking-widest">影像正交校正</span>
        <span className="px-4 py-2 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-full uppercase tracking-widest">筆勢壓力分析</span>
        <span className="px-4 py-2 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-full uppercase tracking-widest">鑑定報告生成</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#fdfcf0]/90 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="w-10 h-10 bg-[#d32f2f] rounded-xl flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform shadow-lg">墨</div>
          <div className="flex flex-col">
            <span className="serif-title text-xl font-bold tracking-tighter">墨韻分析師</span>
            <span className="text-[10px] text-stone-400 font-mono tracking-widest uppercase">Digital Calligraphy Appraisal</span>
          </div>
        </div>
        <nav className="hidden md:flex space-x-10 text-sm font-bold text-stone-600">
          <button className="hover:text-[#d32f2f] transition-colors border-b-2 border-transparent hover:border-[#d32f2f] pb-1" onClick={() => setView('home')}>首頁</button>
          <button className="hover:text-[#d32f2f] transition-colors border-b-2 border-transparent hover:border-[#d32f2f] pb-1" onClick={() => setView('upload')}>分析</button>
          <button className="hover:text-[#d32f2f] transition-colors border-b-2 border-transparent hover:border-[#d32f2f] pb-1">大師字帖</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        {view === 'home' && renderHome()}
        {view === 'upload' && renderUpload()}
        {view === 'analyzing' && renderAnalyzing()}
        {view === 'result' && analysis && masterImg && userImg && (
          <div className="max-w-4xl mx-auto py-12">
            <AnalysisReport 
              result={analysis} 
              masterImg={masterImg} 
              userImg={userImg} 
              onNext={() => setView('stickers')} 
            />
          </div>
        )}
        {view === 'stickers' && userImg && analysis && (
          <div className="max-w-6xl mx-auto py-12">
            <StickerGenerator userWork={userImg} result={analysis} />
          </div>
        )}
      </main>

      {/* Floating Action Button for Home (on mobile-ish) */}
      {view !== 'home' && (
          <button 
            onClick={() => setView('home')}
            className="fixed bottom-8 right-8 w-14 h-14 bg-white shadow-2xl rounded-full border border-stone-100 flex items-center justify-center hover:bg-stone-50 transition-all z-40 group"
          >
            <span className="group-hover:scale-110 transition-transform">🏠</span>
          </button>
      )}
    </div>
  );
};

export default App;
