import type { AnalysisResponse } from './types';

export const SAMPLE_TRANSCRIPT = `Agent: Good morning, Tata Tele Business Services support. This is Priya. How can I help you today?
Customer: Our primary internet line has been dropping since yesterday and our billing team cannot access the ERP. This is the third call I have made.
Agent: I am sorry you have had to contact us again, especially while your team is blocked. I will own this case and check the circuit now.
Customer: We are losing invoice processing time every hour. I need this escalated, not another ticket number.
Agent: I understand the impact. I can see intermittent packet loss on the circuit, and I am escalating it to our network operations team as a priority incident.
Customer: How long will this take? We have a client billing deadline this afternoon.
Agent: The team has accepted the incident. The immediate workaround is to fail over to your backup link; I will stay with you while we switch it.
Customer: The ERP is loading now on the backup. It is slower, but at least the team can work.
Agent: Good. Your primary circuit still needs repair, so this remains open. I will call you by 2 PM with the network team's update.
Customer: That is better. Please make sure I do not have to explain everything again when you call.
Agent: Absolutely. I have documented the impact and the steps we took today. I will be your point of contact.
Customer: Thank you. I will wait for your update.`;

export const demoResponse: AnalysisResponse = {
  success: true,
  request_id: 'demo-ciq-1042',
  meta: { file_name: 'enterprise-network-call.txt', model: 'openai/gpt-oss-20b', analyzed_at: '2026-09-04T05:20:00.000Z', transcript_characters: SAMPLE_TRANSCRIPT.length },
  data: {
    overview: {
      conversation_summary: 'A repeat caller reports an unstable primary internet circuit blocking ERP access. The agent acknowledges the operational impact, owns the case, escalates it, and restores limited service through a backup link while the primary repair remains open.',
      customer_intent: 'Restore reliable connectivity and secure accountable escalation',
      primary_issue: 'Intermittent primary internet circuit disrupting ERP access',
      call_outcome: 'Temporary service restored through backup link; primary repair remains open with a 2 PM callback promised.',
    },
    overall_sentiment: { label: 'negative', confidence: 0.87, breakdown: { positive: 18, neutral: 27, negative: 55 } },
    sentences: [
      { id: 1, speaker: 'customer', sentence: 'Our primary internet line has been dropping since yesterday and our billing team cannot access the ERP.', sentiment: 'negative', emotion: 'frustration', confidence: 0.96, reasoning: 'Service failure is directly blocking essential work.' },
      { id: 2, speaker: 'customer', sentence: 'This is the third call I have made.', sentiment: 'negative', emotion: 'anger', confidence: 0.97, reasoning: 'Repeated contact signals unresolved frustration.' },
      { id: 3, speaker: 'agent', sentence: 'I will own this case and check the circuit now.', sentiment: 'positive', emotion: 'neutral', confidence: 0.91, reasoning: 'Agent takes clear ownership.' },
      { id: 4, speaker: 'customer', sentence: 'We are losing invoice processing time every hour.', sentiment: 'negative', emotion: 'anxiety', confidence: 0.94, reasoning: 'Customer identifies ongoing operational loss.' },
      { id: 5, speaker: 'agent', sentence: 'I am escalating it to our network operations team as a priority incident.', sentiment: 'positive', emotion: 'neutral', confidence: 0.93, reasoning: 'Concrete escalation addresses the request.' },
      { id: 6, speaker: 'customer', sentence: 'The ERP is loading now on the backup.', sentiment: 'positive', emotion: 'relief', confidence: 0.96, reasoning: 'The workaround restores access.' },
      { id: 7, speaker: 'agent', sentence: 'I will call you by 2 PM with the network team\'s update.', sentiment: 'positive', emotion: 'neutral', confidence: 0.9, reasoning: 'Agent provides a specific commitment.' },
      { id: 8, speaker: 'customer', sentence: 'Thank you. I will wait for your update.', sentiment: 'positive', emotion: 'gratitude', confidence: 0.92, reasoning: 'Customer closes with appreciation and acceptance.' },
    ],
    kpis: {
      customer_satisfaction: { score: 68, level: 'medium', confidence: 0.84, reasoning: 'The workaround and ownership improve the experience, but the main fault remains unresolved.', evidence: ['The ERP is loading now on the backup.', 'That is better.'] },
      escalation_risk: { score: 76, level: 'high', confidence: 0.92, reasoning: 'Repeated contact and business disruption create a strong escalation signal.', evidence: ['This is the third call I have made.', 'I need this escalated.'] },
      resolution_status: { status: 'partially_resolved', confidence: 0.96, reasoning: 'Backup connectivity restores work, while the primary circuit still requires repair.', evidence: ['The ERP is loading now on the backup.', 'Your primary circuit still needs repair.'] },
      agent_empathy: { score: 88, level: 'high', confidence: 0.91, reasoning: 'The agent acknowledges impact, apologizes, takes ownership, and provides a specific follow-up.', evidence: ['I am sorry you have had to contact us again.', 'I will be your point of contact.'] },
      business_impact: { level: 'high', categories: ['operations', 'revenue', 'sla'], confidence: 0.9, reasoning: 'ERP access and invoice processing are impaired ahead of a client deadline.', evidence: ['We are losing invoice processing time every hour.', 'We have a client billing deadline this afternoon.'] },
      repeat_contact: { score: 61, risk: 'medium', confidence: 0.86, reasoning: 'A committed callback reduces risk, but the unresolved primary repair may require further contact.', evidence: ['This remains open.', 'I will call you by 2 PM.'] },
    },
    moments: [
      { id: 1, type: 'escalation', speaker: 'customer', evidence: 'This is the third call I have made.', why_it_matters: 'Shows prior attempts failed and raises urgency.', sentiment: 'negative', confidence: 0.97 },
      { id: 2, type: 'business_impact', speaker: 'customer', evidence: 'We are losing invoice processing time every hour.', why_it_matters: 'Connects the outage to a measurable operating consequence.', sentiment: 'negative', confidence: 0.95 },
      { id: 3, type: 'empathy', speaker: 'agent', evidence: 'I will own this case and check the circuit now.', why_it_matters: 'Clear ownership begins rebuilding trust.', sentiment: 'positive', confidence: 0.92 },
      { id: 4, type: 'resolution', speaker: 'customer', evidence: 'The ERP is loading now on the backup.', why_it_matters: 'Confirms that the workaround restored essential access.', sentiment: 'positive', confidence: 0.97 },
    ],
    sentiment_recovery: {
      opening: { label: 'negative', score: -72, evidence: ['This is the third call I have made.'] },
      closing: { label: 'positive', score: 31, evidence: ['Thank you. I will wait for your update.'] },
      delta: 103,
      trend: 'improved',
      explanation: 'The experience recovered after the agent acknowledged the repeat contact, restored limited service, and committed to personal follow-up.',
    },
    emotion_distribution: { anger: 12, frustration: 24, disappointment: 8, anxiety: 15, neutral: 10, satisfaction: 11, relief: 14, gratitude: 6 },
  },
};
