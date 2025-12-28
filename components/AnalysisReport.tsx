
import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../types';

interface AnalysisReportProps {
  result: AnalysisResult;
  masterImg: string;
  userImg: string;
  onNext: () => void;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, masterImg, userImg, onNext }) => {
  const [copied, setCopied] = useState(false);

  const chartData = [
    { subject: '結構(結體)', A: result.scores.structure, fullMark: 100 },
    { subject: '法度(擬合)', A: result.scores.stroke, fullMark: 100 },
    { subject: '重心(穩健)', A: result.scores.gravity, fullMark: 100 },
    { subject: '氣韻(神采)', A: result.scores.spirit, fullMark: 100 },
    { subject: '力度(勁道)', A: result.scores.appearance, fullMark: 100 },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #appraisal-document, #appraisal-document * { visibility: visible; }
          #appraisal-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            box-shadow: none;
            border: none;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Official Appraisal Document Section */}
      <div id="appraisal-document" className="bg-white p-6 md:p-10 shadow-2xl border-t-8 border-[#d32f2f] relative overflow-hidden ink-texture rounded-b-xl border border-stone-200">
        {/* Decorative Seal Background */}
        <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none select-none">
           <div className="text-[180px] font-bold text-[#d32f2f] rotate-12">歐體鑑定</div>
        </div>

        <div className="text-center mb-6">
          <div className="inline-block bg-[#d32f2f] text-white px-4 py-0.5 text-[10px] font-bold tracking-widest mb-3 rounded">數位書法鑑定中心 · 歐體專項</div>
          <h1 className="serif-title text-3xl md:text-4xl font-bold tracking-[0.4em] text-stone-800 mb-2 uppercase">歐體《九成宮》數位鑑定報告</h1>
          <div className="flex flex-wrap justify-center items-center mt-4 gap-4 md:gap-8 text-xs font-medium text-stone-500 border-y border-stone-100 py-2">
            <span>鑑定編號：{result.metadata.appraisalId}</span>
            <span>鑑定日期：{result.metadata.date}</span>
            <span>標的：{result.metadata.workName}</span>
          </div>
        </div>

        {/* Visual Comparison Section at the top */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <p className="text-center text-[10px] font-bold text-[#d32f2f] uppercase tracking-widest">名家原帖</p>
            <div className="aspect-[4/3] bg-stone-50 rounded-lg border border-stone-200 overflow-hidden flex items-center justify-center">
              <img src={masterImg} alt="Master Copy" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-center text-[10px] font-bold text-stone-800 uppercase tracking-widest">臨摹作品</p>
            <div className="aspect-[4/3] bg-stone-50 rounded-lg border border-stone-200 overflow-hidden flex items-center justify-center">
              <img src={userImg} alt="User Work" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
        </div>

        {/* Top Scores Bar */}
        <div className="bg-stone-50 rounded-xl p-4 mb-8 grid grid-cols-3 gap-4 border border-stone-100">
           <div className="text-center border-r border-stone-200">
             <p className="text-[9px] text-stone-400 uppercase tracking-tighter mb-1">綜合評分 (Overall)</p>
             <p className="text-3xl font-bold text-[#d32f2f]">🟢 {Math.round(result.scores.ssim)}</p>
           </div>
           <div className="text-center border-r border-stone-200">
             <p className="text-[9px] text-stone-400 uppercase tracking-tighter mb-1">像素重疊率</p>
             <p className="text-3xl font-bold text-stone-800">{Math.round(result.scores.pixelOverlap)}%</p>
           </div>
           <div className="text-center">
             <p className="text-[9px] text-stone-400 uppercase tracking-tighter mb-1">重心偏差</p>
             <p className="text-3xl font-bold text-stone-700">{result.scores.gravityOffset}<span className="text-xs font-normal ml-0.5 text-stone-400">px</span></p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Visualization & Feedback */}
          <div className="space-y-6">
            <h2 className="serif-title text-lg font-bold border-l-4 border-[#d32f2f] pl-3 text-stone-800">【 視覺化特徵分析 】</h2>
            
            <div className="space-y-4">
              <div className="bg-green-50/60 p-4 rounded-lg border border-green-100 shadow-sm">
                <h3 className="font-bold text-green-800 text-xs mb-1 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> 🟢 綠色區域 (法度精準)
                </h3>
                <p className="text-[11px] leading-relaxed text-green-700">{result.feedback.visualMarkers.greenAreas}</p>
              </div>
              
              <div className="bg-red-50/60 p-4 rounded-lg border border-red-100 shadow-sm">
                <h3 className="font-bold text-red-800 text-xs mb-1 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> 🔴 紅色區域 (偏差修正)
                </h3>
                <p className="text-[11px] leading-relaxed text-red-700">{result.feedback.visualMarkers.redAreas}</p>
              </div>

              <div className="bg-[#fffefe] border border-stone-100 p-5 rounded-xl shadow-sm italic text-stone-600 text-[11px] leading-loose">
                 <h4 className="font-bold text-stone-800 mb-1 not-italic text-xs">鑑定評語：</h4>
                 "{result.feedback.specificStrokes}"
              </div>
            </div>
          </div>

          {/* Right: Radar Chart & Metrics */}
          <div className="space-y-6">
            <h2 className="serif-title text-lg font-bold border-l-4 border-stone-800 pl-3 text-stone-800">【 鑑定雷達分析圖 】</h2>
            <div className="h-[200px] bg-white rounded-xl border border-stone-50">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid stroke="#f3f4f6" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="歐體法度"
                    dataKey="A"
                    stroke="#d32f2f"
                    fill="#d32f2f"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
               <h3 className="text-xs font-bold text-stone-800 mb-2">三、 進階練習建議</h3>
               <p className="text-[10px] text-stone-500 leading-relaxed">{result.feedback.nextSteps}</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-end">
           <div className="space-y-1">
             <p className="text-[9px] text-stone-400 font-mono">APPRAISAL VERIFIED BY AI INK ALGORITHM</p>
             <div className="serif-title text-xl font-bold italic text-stone-800">墨韻鑑定小組 · 歐體專科</div>
           </div>
           <div className="w-16 h-16 border-2 border-[#d32f2f]/40 rounded-full flex items-center justify-center text-[#d32f2f] font-bold text-[9px] transform -rotate-12 select-none border-double">
              <div className="text-center leading-tight">鑑定<br/>合格</div>
           </div>
        </div>
      </div>

      {/* Action Buttons (Hidden in Print) */}
      <div className="flex flex-col md:flex-row gap-4 no-print">
        <button 
          onClick={handleExportPDF}
          className="flex-1 bg-stone-900 text-white py-4 rounded-xl text-md font-bold hover:bg-black transition-all flex items-center justify-center shadow-lg"
        >
            <span className="mr-2">📁 匯出 PDF 鑑定書</span>
        </button>
        <button 
          onClick={copyToClipboard}
          className="flex-1 bg-white border-2 border-stone-200 text-stone-600 py-4 rounded-xl text-md font-bold hover:bg-stone-50 transition-all flex items-center justify-center shadow-sm"
        >
            <span className="mr-2">{copied ? '✅ 已複製' : '📋 複製 Markdown'}</span>
        </button>
        <button
          onClick={onNext}
          className="flex-[1.5] bg-[#d32f2f] hover:bg-[#b71c1c] text-white py-4 rounded-xl text-md font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
        >
          文創貼圖製作 →
        </button>
      </div>
    </div>
  );
};

export default AnalysisReport;
