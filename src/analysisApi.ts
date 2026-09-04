import type { AnalysisResponse } from './types';

const MIN_CHARACTERS = 50;
const MAX_CHARACTERS = 15000;

export function validateTranscript(fileName: string, transcript: string) {
  if (!fileName.toLowerCase().endsWith('.txt')) throw new Error('Choose a plain-text (.txt) transcript.');
  const normalized = transcript.replace(/\r\n/g, '\n').trim();
  if (normalized.length < MIN_CHARACTERS) throw new Error('The transcript is too short to analyze. Add at least 50 characters.');
  if (normalized.length > MAX_CHARACTERS) throw new Error('This transcript exceeds the 15,000-character demo limit.');
  return normalized;
}

export async function analyzeTranscript(fileName: string, transcript: string): Promise<AnalysisResponse> {
  const normalized = validateTranscript(fileName, transcript);
  const endpoint = '/api/analyze';

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_name: fileName, transcript: normalized }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null) as {
      success?: boolean;
      error?: { message?: string };
      data?: { overall_sentiment?: unknown; sentences?: unknown };
    } | null;
    if (!response.ok || !payload?.success) throw new Error(payload?.error?.message || 'The analysis service could not complete this request.');
    if (!payload.data?.overall_sentiment || !Array.isArray(payload.data?.sentences)) throw new Error('The analysis service returned an incomplete result.');
    return payload as AnalysisResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new Error('Analysis took longer than 60 seconds. Please retry.');
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
