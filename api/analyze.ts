const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL
  || 'https://naynikasarkar.app.n8n.cloud/webhook/converseiq-analyze';

type RequestLike = {
  method?: string;
  body?: unknown;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
  json: (body: unknown) => void;
};

export const config = { maxDuration: 60 };

export default async function handler(request: RequestLike, response: ResponseLike) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ success: false, error: { message: 'Method not allowed.' } });
  }

  try {
    const upstream = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof request.body === 'string' ? request.body : JSON.stringify(request.body ?? {}),
    });
    const body = await upstream.text();
    response.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return response.status(upstream.status).send(body);
  } catch {
    return response.status(502).json({
      success: false,
      error: { message: 'The analysis workflow is temporarily unavailable. Please retry.' },
    });
  }
}
