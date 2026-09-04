import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, AudioLines, FileText, LogOut, Sparkles, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeTranscript, validateTranscript } from './analysisApi';
import { Dashboard } from './Dashboard';
import { demoResponse } from './demoData';
import type { AnalysisResponse } from './types';

type Status = 'idle' | 'loading' | 'error' | 'success';

function BrandMark() {
  return <div className="grid size-9 place-items-center rounded-xl bg-[#25a99b] text-white"><AudioLines size={20}/></div>;
}

function useTranscriptTool(runAnalysis: (fileName: string, transcript: string) => Promise<AnalysisResponse>, showSample: () => void) {
  useEffect(() => {
    const modelContext = (document as unknown as { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(modelContext.registerTool({
      name: 'analyze_support_transcript',
      title: 'Analyze support transcript',
      description: 'Analyze one customer-support transcript and show the resulting ConverseIQ dashboard.',
      inputSchema: { type:'object', properties:{ file_name:{type:'string'}, transcript:{type:'string'} }, required:['file_name','transcript'], additionalProperties:false },
      annotations: { readOnlyHint:false, untrustedContentHint:true },
      execute: async (input: unknown) => {
        const value = input as { file_name?: unknown; transcript?: unknown };
        if (typeof value.file_name !== 'string' || typeof value.transcript !== 'string') throw new Error('file_name and transcript are required strings.');
        const result = await runAnalysis(value.file_name, value.transcript);
        return { request_id:result.request_id, overall_sentiment:result.data.overall_sentiment.label, resolution_status:result.data.kpis.resolution_status.status };
      },
    }, { signal:lifecycle.signal })).catch(() => undefined);
    void Promise.resolve(modelContext.registerTool({
      name: 'preview_sample_analysis',
      title: 'Preview sample analysis',
      description: 'Open the built-in sample call analysis and update the visible ConverseIQ dashboard.',
      inputSchema: { type:'object', properties:{}, required:[], additionalProperties:false },
      annotations: { readOnlyHint:false, untrustedContentHint:false },
      execute: async () => {
        showSample();
        return { status:'displayed', file_name:demoResponse.meta.file_name, overall_sentiment:demoResponse.data.overall_sentiment.label };
      },
    }, { signal:lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [runAnalysis, showSample]);
}

function LoadingState() {
  return <div className="grid min-h-[58vh] place-items-center"><div className="w-full max-w-md rounded-2xl border border-[#dbe7e9] bg-white p-8 text-center shadow-[0_12px_40px_rgba(24,60,70,.08)]"><div className="relative mx-auto size-16"><span className="absolute inset-0 animate-ping rounded-full bg-[#7fd5ca]/25"/><span className="relative grid size-16 place-items-center rounded-full bg-[#e4f6f2] text-[#238f83]"><Sparkles className="animate-pulse" size={26}/></span></div><h2 className="mt-6 text-xl font-semibold tracking-[-.025em] text-[#1a3b46]">Reading the conversation</h2><p className="mt-2 text-sm leading-6 text-[#71848a]">Finding customer signals, business impact and the moments that shaped the call.</p><div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#edf3f3]"><div className="h-full w-1/2 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-[#2aa99b]"/></div></div></div>;
}

function UploadPanel({ onAnalyze, onSample }: { onAnalyze: (fileName:string, transcript:string) => Promise<void>; onSample: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const choose = async (selected?: File) => {
    if (!selected) return;
    try { const text = await selected.text(); validateTranscript(selected.name, text); setFile(selected); setMessage(''); }
    catch (error) { setFile(null); setMessage(error instanceof Error ? error.message : 'Could not read this file.'); }
  };
  const submit = async () => { if (!file) return; await onAnalyze(file.name, await file.text()); };
  return <div className="mx-auto grid min-h-[calc(100vh-150px)] max-w-6xl items-center gap-10 py-10 lg:grid-cols-[.82fr_1.18fr]">
    <div><span className="inline-flex items-center gap-2 rounded-full bg-[#e4f5f2] px-3 py-1.5 text-sm font-semibold text-[#1d8178]"><Sparkles size={15}/>AI conversation intelligence</span><h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-.05em] text-[#143743] sm:text-5xl">Find the signal inside every support call.</h1><p className="mt-5 max-w-xl text-base leading-7 text-[#647a82]">Upload a transcript to understand customer sentiment, escalation risk, business impact and whether the experience recovered.</p><div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">{[['Sentence-level','Sentiment + emotion'],['Evidence-backed','Moments + reasoning'],['Business-ready','Six call KPIs']].map(([title,detail]) => <div key={title} className="border-l-2 border-[#6fcbbf] pl-3"><p className="text-sm font-semibold text-[#294b55]">{title}</p><p className="mt-0.5 text-xs text-[#788b91]">{detail}</p></div>)}</div></div>
    <div className="rounded-3xl border border-[#d6e3e5] bg-white p-5 shadow-[0_20px_55px_rgba(27,67,77,.09)] sm:p-7"><div className="flex items-center justify-between"><div><p className="font-semibold text-[#254650]">New analysis</p><p className="mt-1 text-sm text-[#76898f]">Plain text · up to 15,000 characters</p></div><span className="grid size-10 place-items-center rounded-xl bg-[#edf6f5] text-[#2b8b83]"><FileText size={19}/></span></div><button type="button" aria-label="Choose or drop a plain-text transcript" onClick={() => inputRef.current?.click()} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{e.preventDefault(); void choose(e.dataTransfer.files[0]);}} className="mt-5 grid min-h-56 w-full place-items-center rounded-2xl border border-dashed border-[#a9c5c7] bg-[#f7faf9] p-6 text-center transition hover:border-[#58aaa3] hover:bg-[#f0f8f6]"><span><span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-[#2a958b] shadow-sm"><UploadCloud size={24}/></span><span className="mt-4 block font-semibold text-[#294b55]">Drop a transcript here</span><span className="mt-1 block text-sm text-[#76898f]">or click to browse your files</span></span></button><input ref={inputRef} aria-label="Choose a plain-text transcript" className="sr-only" type="file" accept=".txt,text/plain" onChange={(e)=>void choose(e.target.files?.[0])}/>{file && <div className="mt-4 flex items-center justify-between rounded-xl border border-[#d8e7e6] bg-[#f1f8f7] p-3"><div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-[#2b8d84]"><FileText size={17}/></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#31535c]">{file.name}</p><p className="text-xs text-[#7a8d92]">{Math.ceil(file.size/1024)} KB · ready to analyze</p></div></div><button aria-label="Remove file" onClick={()=>setFile(null)} className="rounded-lg p-2 text-[#71858b] hover:bg-white"><X size={17}/></button></div>}{message && <div className="mt-4 flex gap-2 rounded-xl bg-[#fff1ef] p-3 text-sm text-[#a84e49]"><AlertCircle className="mt-0.5 shrink-0" size={17}/><span>{message}</span></div>}<Button disabled={!file} onClick={()=>void submit()} className="mt-5 h-12 w-full rounded-xl bg-[#0d5967] text-base hover:bg-[#084653]">Analyze conversation <Sparkles className="ml-1"/></Button><button onClick={onSample} className="mt-4 w-full text-center text-sm font-semibold text-[#43827f] hover:text-[#205d5d]">Preview with a sample call</button></div>
  </div>;
}

export function Workspace({ onLogout }: { onLogout: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState('');
  const runAnalysis = useCallback(async (fileName: string, transcript: string) => {
    setStatus('loading'); setError('');
    try { const response = await analyzeTranscript(fileName, transcript); setResult(response); setStatus('success'); return response; }
    catch (cause) { const message = cause instanceof Error ? cause.message : 'Analysis failed. Please retry.'; setError(message); setStatus('error'); throw cause; }
  }, []);
  const showSample = useCallback(() => { setResult({...demoResponse, meta:{...demoResponse.meta, analyzed_at:new Date().toISOString()}}); setStatus('success'); setError(''); }, []);
  useTranscriptTool(runAnalysis, showSample);
  const reset = () => { setResult(null); setStatus('idle'); setError(''); };
  return <div className="min-h-screen bg-[#f2f6f8]">
    <header className="sticky top-0 z-20 border-b border-[#dbe5e8] bg-white/95 backdrop-blur"><div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8"><div className="flex items-center gap-3"><BrandMark/><div><p className="font-semibold tracking-[-.025em] text-[#173944]">ConverseIQ</p><p className="text-[11px] font-medium uppercase tracking-[.1em] text-[#7d9096]">Conversation intelligence</p></div></div><div className="flex items-center gap-3"><span className="hidden rounded-full bg-[#e9f6f3] px-3 py-1.5 text-xs font-semibold text-[#237d75] sm:inline-flex">Demo workspace</span><button onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#587179] hover:bg-[#eff4f5]"><LogOut size={16}/>Sign out</button></div></div></header>
    <main className="mx-auto max-w-[1440px] px-5 sm:px-8">{status === 'loading' && <LoadingState/>}{status === 'idle' && <UploadPanel onAnalyze={async (name,text)=>{try{await runAnalysis(name,text);}catch{}}} onSample={showSample}/>} {status === 'error' && <div className="grid min-h-[70vh] place-items-center"><div className="max-w-md rounded-2xl border border-[#edd8d4] bg-white p-7 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-[#fff0ee] text-[#c3544e]"><AlertCircle size={22}/></span><h2 className="mt-4 text-xl font-semibold text-[#273f47]">We couldn’t complete the analysis</h2><p className="mt-2 text-sm leading-6 text-[#6c8087]">{error}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Button variant="outline" onClick={reset} className="h-10">Choose another file</Button><Button onClick={showSample} className="h-10 bg-[#0d5967] hover:bg-[#084653]">View sample analysis</Button></div></div></div>}{status === 'success' && result && <div className="pt-7"><Dashboard result={result} onNewAnalysis={reset}/></div>}</main>
  </div>;
}
