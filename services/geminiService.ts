
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCalligraphy = async (
  masterImage: string,
  userWorkImage: string
): Promise<AnalysisResult> => {
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    你是一位精通「中國書法史」且專精「歐陽詢 - 九成宮醴泉銘」的數位書法鑑定師。你具備辨識歐體「方勁、中宮緊結、左收右放、結體險勁」特徵的能力。
    
    分析要求：
    1. **歐體鑑定**：特別關注「險勁」之神韻、橫畫之斜度（左低右高）與點畫精確度。
    2. **量化指標 (請務必回傳 0-100 的整數百分比)**：
       - SSIM (結構相似度)
       - 像素重疊率 (Pixel Overlap)
       - 重心偏差值 (單位 px)
    3. **視覺標註**：
       - 🟢 **綠色標註**：高度吻合原帖法度的區域。
       - 🔴 **紅色標註**：重心偏差、筆劃長度或粗細不符的區域。
    4. **Markdown 報告**：生成一份結構嚴謹、標題排版美觀的《書法數位鑑定報告書》文本，包含 Unicode 符號繪製的 5x5 矩陣雷達圖。

    請以 JSON 格式回傳結果。
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: masterImage.split(',')[1] } },
          { inlineData: { mimeType: 'image/jpeg', data: userWorkImage.split(',')[1] } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metadata: {
            type: Type.OBJECT,
            properties: {
              workName: { type: Type.STRING },
              style: { type: Type.STRING },
              date: { type: Type.STRING },
              appraisalId: { type: Type.STRING }
            },
            required: ["workName", "style", "date", "appraisalId"]
          },
          scores: {
            type: Type.OBJECT,
            properties: {
              structure: { type: Type.NUMBER },
              stroke: { type: Type.NUMBER },
              gravity: { type: Type.NUMBER },
              whiteSpace: { type: Type.NUMBER },
              appearance: { type: Type.NUMBER },
              spirit: { type: Type.NUMBER },
              ssim: { type: Type.NUMBER },
              pixelOverlap: { type: Type.NUMBER },
              gravityOffset: { type: Type.NUMBER }
            },
            required: ["structure", "stroke", "gravity", "whiteSpace", "appearance", "spirit", "ssim", "pixelOverlap", "gravityOffset"]
          },
          feedback: {
            type: Type.OBJECT,
            properties: {
              structureDiff: { type: Type.STRING },
              strokeAdvice: { type: Type.STRING },
              specificStrokes: { type: Type.STRING },
              inkDistribution: { type: Type.STRING },
              conclusion: { type: Type.STRING },
              nextSteps: { type: Type.STRING },
              visualMarkers: {
                type: Type.OBJECT,
                properties: {
                  greenAreas: { type: Type.STRING },
                  redAreas: { type: Type.STRING }
                },
                required: ["greenAreas", "redAreas"]
              }
            },
            required: ["structureDiff", "strokeAdvice", "specificStrokes", "inkDistribution", "conclusion", "nextSteps", "visualMarkers"]
          },
          markdownReport: { type: Type.STRING },
          cvAdvice: {
            type: Type.OBJECT,
            properties: {
              steps: { type: Type.ARRAY, items: { type: Type.STRING } },
              codeSnippet: { type: Type.STRING }
            },
            required: ["steps", "codeSnippet"]
          }
        },
        required: ["metadata", "scores", "feedback", "markdownReport", "cvAdvice"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as AnalysisResult;
};

export const generateStickerSuggestions = async (result: AnalysisResult): Promise<any> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `基於以下書法鑑定結果：
  作品：${result.metadata.workName}
  風格：歐體 (歐陽詢)
  結論：${result.feedback.conclusion}
  
  請：
  1. 推薦 3 個符合歐體「險勁、莊重」性格的 LINE 貼圖文字。
  2. 設計 5 個 LINE 貼圖模板。
  3. 針對歐體特徵（方折、中宮緊結），給予插圖建議。`;
  
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });
  
  return response.text;
};
