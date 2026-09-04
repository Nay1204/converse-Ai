# ConverseIQ n8n setup

1. In n8n Cloud, create a **Header Auth** credential named `Groq API Key`.
   - Name: `Authorization`
   - Value: `Bearer YOUR_GROQ_API_KEY`
2. Import `converseiq-workflow.json`.
3. Open the **Groq — Strict Analysis** node and select the credential created above.
4. In the Webhook node, replace `*` under Allowed Origins with:
   - `http://localhost:5173` while developing
   - your final Vercel origin for submission
5. Save and activate the workflow.
6. Copy its **Production URL** into `VITE_N8N_WEBHOOK_URL` locally and in Vercel.
7. Test with `public/sample-transcript.txt`.

The workflow validates `.txt` filenames and transcript length, calls `openai/gpt-oss-20b` with strict structured output, normalizes the API result, and returns a sanitized error envelope for upstream failures.

For transcript privacy, set the workflow to save failed executions only, or disable successful execution data retention if your n8n plan exposes that setting.

If an n8n version flags the imported placeholder credential ID, simply reselect `Groq API Key` from the credential dropdown; no API key belongs in the workflow JSON.
