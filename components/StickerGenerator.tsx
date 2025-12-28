
import React, { useState, useEffect } from 'react';
import { generateStickerSuggestions } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface StickerGeneratorProps {
  userWork: string;
  result: AnalysisResult;
}

const StickerGenerator: React.FC<StickerGeneratorProps> = ({ userWork, result }) => {
  const [suggestions, setSuggestions] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const text = await generateStickerSuggestions(result);
        setSuggestions(text);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [result]);

  const templates = [
    { theme: '長輩祝禱', icon: '🙏', text: '「墨寶傳情」', bg: 'bg-amber-50' },
    { theme: '專業商務', icon: '🖋️', text: '「筆力扛鼎」', bg: 'bg-slate-50' },
    { theme: '新年賀詞', icon: '🧧', text: '「墨舞新春」', bg: 'bg-red-50' },
    { theme: '極簡文青', icon: '🍵', text: '「靜觀其墨」', bg: 'bg-stone-50' },
    { theme: 'Q版趣味', icon: '🎨', text: '「墨氣十足」', bg: 'bg-yellow-50' }
  ];

  return (
    <div className="space-y-8 p-4 md:p-0 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 ink-texture">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h2 className="serif-title text-3xl font-bold text-[#d32f2f] mb-1">墨韻文創工坊</h2>
                <p className="text-stone-500 text-sm italic">根據鑑定結論「{result.feedback.conclusion}」定制設計</p>
            </div>
            <div className="bg-stone-100 px-3 py-1 rounded-full text-[10px] font-bold text-stone-500">
                PRO VERSION
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Preview Area */}
          <div className="space-y-6">
            <h3 className="font-bold text-gray-800 flex items-center">
                <span className="w-1.5 h-6 bg-[#d32f2f] mr-3 rounded-full"></span>
                作品合成預覽 (320x320)
            </h3>
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-stone-200 bg-[#fdfcf0] flex items-center justify-center group shadow-inner">
              <img 
                src={userWork} 
                alt="User Work" 
                className="max-h-[75%] opacity-90 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                 <div className="mt-48 bg-white/95 px-6 py-2 rounded-full shadow-xl border border-red-50 text-[#d32f2f] font-bold serif-title text-xl tracking-widest backdrop-blur-sm">
                    入 木 三 分
                 </div>
              </div>
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">歐體法度</div>
            </div>
          </div>

          {/* Configuration Area */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">選擇建議模板</h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((t, idx) => (
                  <button 
                    key={idx}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:border-[#d32f2f] hover:shadow-md group ${t.bg} border-transparent`}
                  >
                    <span className="text-2xl mb-2 block">{t.icon}</span>
                    <p className="font-bold text-xs text-gray-800">{t.theme}</p>
                    <p className="text-[10px] text-gray-500">{t.text}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1b] p-6 rounded-2xl text-stone-300 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl">🖌️</div>
                <h4 className="text-yellow-500 font-bold mb-4 flex items-center text-sm">
                    <span className="mr-2">📝</span> AI 貼圖設計建議 (針對{result.metadata.style})
                </h4>
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-3 bg-stone-700 rounded w-3/4"></div>
                        <div className="h-3 bg-stone-700 rounded w-full"></div>
                        <div className="h-3 bg-stone-700 rounded w-1/2"></div>
                    </div>
                ) : (
                    <div className="text-xs leading-relaxed overflow-y-auto max-h-[220px] scrollbar-hide space-y-3 pr-2">
                        {suggestions.split('\n').filter(l => l.trim()).map((line, i) => (
                            <p key={i} className="border-l border-stone-700 pl-3">{line}</p>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row gap-4">
            <button className="flex-1 bg-stone-900 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-black transition-all shadow-lg">
                <span className="mr-2">📥</span> 下載透明 PNG
            </button>
            <button className="flex-1 bg-[#d32f2f] text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-[#b71c1c] transition-all shadow-xl">
                <span className="mr-2">💬</span> 分享至 LINE
            </button>
        </div>
      </div>
    </div>
  );
};

export default StickerGenerator;
