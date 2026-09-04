export type Sentiment = 'positive' | 'neutral' | 'negative';
export type Level = 'low' | 'medium' | 'high';

export interface AnalysisData {
  overview: {
    conversation_summary: string;
    customer_intent: string;
    primary_issue: string;
    call_outcome: string;
  };
  overall_sentiment: {
    label: Sentiment;
    confidence: number;
    breakdown: Record<Sentiment, number>;
  };
  sentences: Array<{
    id: number;
    speaker: 'customer' | 'agent' | 'other';
    sentence: string;
    sentiment: Sentiment;
    emotion: 'anger' | 'frustration' | 'disappointment' | 'anxiety' | 'neutral' | 'satisfaction' | 'relief' | 'gratitude';
    confidence: number;
    reasoning: string;
  }>;
  kpis: {
    customer_satisfaction: ScoreKpi;
    escalation_risk: ScoreKpi;
    resolution_status: {
      status: 'resolved' | 'partially_resolved' | 'unresolved' | 'follow_up_required' | 'unknown';
      confidence: number;
      reasoning: string;
      evidence: string[];
    };
    agent_empathy: ScoreKpi;
    business_impact: {
      level: 'none' | 'low' | 'medium' | 'high' | 'critical';
      categories: Array<'revenue' | 'operations' | 'sla' | 'churn' | 'reputation' | 'compliance' | 'none'>;
      confidence: number;
      reasoning: string;
      evidence: string[];
    };
    repeat_contact: {
      score: number;
      risk: Level;
      confidence: number;
      reasoning: string;
      evidence: string[];
    };
  };
  moments: Array<{
    id: number;
    type: 'escalation' | 'frustration' | 'empathy' | 'business_impact' | 'resolution';
    speaker: 'customer' | 'agent' | 'other';
    evidence: string;
    why_it_matters: string;
    sentiment: Sentiment;
    confidence: number;
  }>;
  sentiment_recovery: {
    opening: RecoveryPoint;
    closing: RecoveryPoint;
    delta: number;
    trend: 'improved' | 'stable' | 'deteriorated';
    explanation: string;
  };
  emotion_distribution: Record<'anger' | 'frustration' | 'disappointment' | 'anxiety' | 'neutral' | 'satisfaction' | 'relief' | 'gratitude', number>;
}

export interface ScoreKpi {
  score: number;
  level: Level;
  confidence: number;
  reasoning: string;
  evidence: string[];
}

interface RecoveryPoint {
  label: Sentiment;
  score: number;
  evidence: string[];
}

export interface AnalysisResponse {
  success: true;
  request_id: string;
  meta: {
    file_name: string;
    model: string;
    analyzed_at: string;
    transcript_characters: number;
  };
  data: AnalysisData;
}
