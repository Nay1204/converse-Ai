# ConverseIQ

ConverseIQ is a React + Vite conversation-intelligence dashboard for customer-support call transcripts. It sends plain-text transcripts to an n8n webhook, which calls Groq with a strict JSON Schema and returns an explainable analysis.

## Included

- Demo login (`demo@converseiq.ai` / `demo123`)
- `.txt` upload with type and length validation
- Overall and sentence-level sentiment
- Customer satisfaction, escalation risk, resolution, empathy, business impact and repeat-contact KPIs
- Moments that mattered and sentiment recovery
- Recharts visualizations, responsive layout and loading/error states
- Importable n8n workflow specification and Groq prompt/schema
- Built-in sample analysis for UI review before the live workflow is connected

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_N8N_WEBHOOK_URL` to the production n8n webhook.
4. Start with `pnpm dev`.

The app accepts transcripts from 50 to 15,000 characters. It never places the Groq key in the browser.

## n8n setup

See `n8n/setup.md`. The browser sends:

```json
{
  "file_name": "support-call.txt",
  "transcript": "Agent: ...\nCustomer: ..."
}
```

The workflow returns `{ success, request_id, meta, data }`. The Groq key remains in an n8n Header Auth credential.

## Vercel

Import the repository into Vercel, keep the detected Vite build settings, and add `VITE_N8N_WEBHOOK_URL`. The included `vercel.json` provides the SPA fallback.

## Security note

The login is intentionally a client-side demo gate for the coding assignment, not production authentication. Configure n8n to avoid retaining successful transcript payloads if execution-history retention is not needed.
