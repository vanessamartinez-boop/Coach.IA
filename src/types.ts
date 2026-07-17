export interface Question {
  id: string;
  text: string;
  type: "technical" | "behavioral" | "curva";
  category: string;
  explanation: string;
}

export interface STARResponse {
  situation: string;
  task: string;
  action: string;
  result: string;
  fullOptimized: string;
  coachingTip: string;
}

export interface SimulationSession {
  id: string;
  role: string;
  description: string;
  questions: Question[];
  timestamp: string;
  userAnswers: Record<string, string>; // Maps question ID to user answer draft
  optimizedAnswers: Record<string, STARResponse>; // Maps question ID to optimized response
}
