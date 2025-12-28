
export interface AppraisalMetadata {
  workName: string;
  style: string;
  date: string;
  appraisalId: string;
}

export interface AnalysisResult {
  metadata: AppraisalMetadata;
  scores: {
    structure: number;
    stroke: number;
    gravity: number;
    whiteSpace: number;
    appearance: number;
    spirit: number;
    ssim: number; 
    pixelOverlap: number;
    gravityOffset: number; 
  };
  feedback: {
    structureDiff: string;
    strokeAdvice: string;
    specificStrokes: string;
    inkDistribution: string;
    conclusion: string;
    nextSteps: string;
    visualMarkers: {
      greenAreas: string;
      redAreas: string;
    };
  };
  markdownReport: string;
  cvAdvice: {
    steps: string[];
    codeSnippet: string;
  };
}

export interface StickerTemplate {
  id: string;
  name: string;
  theme: string;
  visualStyle: string;
  illustration: string;
}

export type ViewState = 'home' | 'upload' | 'analyzing' | 'result' | 'stickers';
