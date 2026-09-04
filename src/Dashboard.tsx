import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, CheckCircle2, HeartHandshake,
  Lightbulb, RotateCcw, Sparkles, Target, TrendingUp,
} from 'lucide-react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AnalysisResponse, Sentiment } from './types';

const sentimentColors: Record<Sentiment, string> = { positive: '#2aa99b', neutral: '#e6ad3a', negative: '#df655d' };
const sentimentClasses: Record<Sentiment, string> = {
  positive: 'bg-[#e5f7f3] text-[#14776e] border-[#c0ebe4]',
  neutral: 'bg-[#fff6df] text-[#92670d] border-[#f6dfaa]',
  negative: 'bg-[#fff0ee] text-[#b84b45] border-[#f2cfcb]',
};

const titleCase = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const percent = (value: number) => `${Math.round(value * 100)}%`;

function SentimentBadge({ value }: { value: Sentiment }) {
  return <Badge variant="outline" className={`rounded-full px-2.5 py-1 font-semibold ${sentimentClasses[value]}`}>{titleCase(value)}</Badge>;
}

function MetricCard({ label, value, note, tone, icon: Icon }: { label: string; value: string; note: string; tone: 'teal' | 'red' | 'amber' | 'blue'; icon: typeof Activity }) {
  const tones = {
    teal: 'bg-[#e8f7f4] text-[#188b7f]', red: 'bg-[#fff0ee] text-[#c1534e]',
    amber: 'bg-[#fff5dd] text-[#a8720b]', blue: 'bg-[#eaf2f6] text-[#416f85]',
  };
  return <article className="rounded-2xl border border-[#dce6e9] bg-white p-5 shadow-[0_4px_18px_rgba(20,55,66,.04)]">
    <div className="flex items-start justify-between"><p className="text-sm font-medium text-[#667b83]">{label}</p><span className={`grid size-9 place-items-center rounded-xl ${tones[tone]}`}><Icon size={18}/></span></div>
    <p className="mt-4 text-2xl font-semibold tracking-[-.035em] text-[#173641]">{value}</p>
    <p className="mt-1 text-sm text-[#788b91]">{note}</p>
  </article>;
}

function SectionHeading({ eyebrow, title, detail }: { eyebrow: string; title: string; detail?: string }) {
  return <div><p className="text-xs font-bold uppercase tracking-[.13em] text-[#29988b]">{eyebrow}</p><div className="mt-1 flex flex-wrap items-end justify-between gap-2"><h2 className="text-xl font-semibold tracking-[-.025em] text-[#173641]">{title}</h2>{detail && <p className="text-sm text-[#71848a]">{detail}</p>}</div></div>;
}

function InsightTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-lg border border-[#d9e5e8] bg-white px-3 py-2 text-sm shadow-lg"><span className="font-medium text-[#294750]">{titleCase(label || '')}</span><span className="ml-3 font-semibold text-[#0b5964]">{payload[0].value}%</span></div>;
}

function SentimentPanel({ analysis }: { analysis: AnalysisResponse['data'] }) {
  const breakdown = Object.entries(analysis.overall_sentiment.breakdown).map(([name, value]) => ({ name, value, fill: sentimentColors[name as Sentiment] }));
  return <article className="rounded-2xl border border-[#dce6e9] bg-white p-5 sm:p-6">
    <SectionHeading eyebrow="Conversation tone" title="Sentiment breakdown" detail="All substantive sentences" />
    <div className="mt-5 grid items-center gap-5 sm:grid-cols-[190px_1fr]">
      <div className="relative h-[190px]">
        <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={62} outerRadius={82} paddingAngle={4} strokeWidth={0}/></PieChart></ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="text-2xl font-semibold text-[#193843]">{percent(analysis.overall_sentiment.confidence)}</p><p className="text-xs text-[#75898f]">confidence</p></div></div>
      </div>
      <div className="space-y-4">{breakdown.map((item) => <div key={item.name}><div className="mb-1.5 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-medium text-[#37545d]"><i className="size-2.5 rounded-full" style={{background: sentimentColors[item.name as Sentiment]}} />{titleCase(item.name)}</span><strong>{item.value}%</strong></div><div className="h-2 overflow-hidden rounded-full bg-[#eef3f4]"><div className="h-full rounded-full" style={{width: `${item.value}%`, background: sentimentColors[item.name as Sentiment]}} /></div></div>)}</div>
    </div>
  </article>;
}

function EmotionPanel({ analysis }: { analysis: AnalysisResponse['data'] }) {
  const data = Object.entries(analysis.emotion_distribution).filter(([, value]) => value > 0).sort((a,b) => b[1]-a[1]).map(([emotion, value]) => ({ emotion: titleCase(emotion), value }));
  return <article className="rounded-2xl border border-[#dce6e9] bg-white p-5 sm:p-6">
    <SectionHeading eyebrow="Customer signals" title="Emotion distribution" detail="Customer-weighted" />
    <div className="mt-5 h-[210px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{left: 2, right: 16}}><XAxis type="number" hide domain={[0, 'dataMax']} /><YAxis type="category" dataKey="emotion" width={88} tick={{fill:'#647980',fontSize:12}} axisLine={false} tickLine={false}/><Tooltip content={<InsightTooltip/>} cursor={{fill:'#f4f8f8'}}/><Bar dataKey="value" fill="#3d8e91" radius={[0,6,6,0]} barSize={12}/></BarChart></ResponsiveContainer></div>
  </article>;
}

function RecoveryPanel({ analysis }: { analysis: AnalysisResponse['data'] }) {
  const recovery = analysis.sentiment_recovery;
  const position = (score: number) => `${Math.max(2, Math.min(98, (score + 100) / 2))}%`;
  const improved = recovery.delta > 0;
  return <article className="rounded-2xl border border-[#cfe5e1] bg-gradient-to-br from-[#ecf9f6] to-white p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><SectionHeading eyebrow="Experience trajectory" title="Customer sentiment recovery"/><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold ${improved ? 'bg-[#d8f3ed] text-[#16796f]' : 'bg-[#fff0ee] text-[#b84b45]'}`}><TrendingUp size={15}/>{recovery.delta > 0 ? '+' : ''}{recovery.delta} pts</span></div>
    <div className="mt-8 px-2"><div className="relative h-2 rounded-full bg-gradient-to-r from-[#df655d] via-[#e9c35f] to-[#2aa99b]"><span className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#df655d] shadow" style={{left:position(recovery.opening.score)}}/><span className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#2aa99b] shadow" style={{left:position(recovery.closing.score)}}/></div><div className="mt-4 flex justify-between text-sm"><div><p className="text-[#74878d]">Opening</p><p className="font-semibold text-[#b84b45]">{titleCase(recovery.opening.label)} · {recovery.opening.score}</p></div><ArrowRight className="mt-2 text-[#83a29f]"/><div className="text-right"><p className="text-[#74878d]">Closing</p><p className="font-semibold text-[#14776e]">{titleCase(recovery.closing.label)} · {recovery.closing.score}</p></div></div></div>
    <p className="mt-6 border-t border-[#d4e8e4] pt-4 text-sm leading-6 text-[#526b72]">{recovery.explanation}</p>
  </article>;
}

function KpiPanel({ analysis }: { analysis: AnalysisResponse['data'] }) {
  const rows = [
    { label:'Customer satisfaction', value:analysis.kpis.customer_satisfaction.score, state:titleCase(analysis.kpis.customer_satisfaction.level), text:analysis.kpis.customer_satisfaction.reasoning, icon:HeartHandshake },
    { label:'Agent empathy', value:analysis.kpis.agent_empathy.score, state:titleCase(analysis.kpis.agent_empathy.level), text:analysis.kpis.agent_empathy.reasoning, icon:Sparkles },
    { label:'Repeat contact risk', value:analysis.kpis.repeat_contact.score, state:titleCase(analysis.kpis.repeat_contact.risk), text:analysis.kpis.repeat_contact.reasoning, icon:RotateCcw },
  ];
  return <section><SectionHeading eyebrow="Operational scorecard" title="Phone call KPIs" detail="AI-inferred from transcript evidence"/><div className="mt-4 grid gap-4 lg:grid-cols-3">{rows.map(({label,value,state,text,icon:Icon}) => <article key={label} className="rounded-2xl border border-[#dce6e9] bg-white p-5"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl bg-[#edf5f5] text-[#327e82]"><Icon size={18}/></span><span className="text-xs font-semibold uppercase tracking-[.08em] text-[#71858b]">{state}</span></div><div className="mt-5 flex items-end gap-2"><strong className="text-3xl tracking-[-.04em] text-[#173641]">{value}</strong><span className="mb-1 text-sm text-[#819198]">/100</span></div><Progress value={value} className="mt-3 h-2 bg-[#edf2f3] [&_[data-slot=progress-indicator]]:bg-[#2b9690]"/><h3 className="mt-4 font-semibold text-[#294750]">{label}</h3><p className="mt-1 text-sm leading-6 text-[#6b7f86]">{text}</p></article>)}</div></section>;
}

function MomentsPanel({ analysis }: { analysis: AnalysisResponse['data'] }) {
  const icons = { escalation:AlertTriangle, frustration:Activity, empathy:HeartHandshake, business_impact:Target, resolution:CheckCircle2 };
  return <section><SectionHeading eyebrow="Evidence trail" title="Moments that mattered" detail={`${analysis.moments.length} pivotal moments`}/><div className="mt-5 grid gap-4 lg:grid-cols-2">{analysis.moments.map((moment) => { const Icon=icons[moment.type]; return <article key={moment.id} className="group rounded-2xl border border-[#dce6e9] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(20,55,66,.08)]"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-semibold text-[#36565f]"><span className="grid size-8 place-items-center rounded-lg bg-[#edf6f5] text-[#288f86]"><Icon size={16}/></span>{titleCase(moment.type)}</span><span className="text-xs text-[#84959a]">{percent(moment.confidence)} confidence</span></div><blockquote className="mt-4 border-l-2 border-[#3eb1a5] pl-4 text-[15px] font-medium leading-6 text-[#27464f]">“{moment.evidence}”</blockquote><p className="mt-3 text-sm leading-6 text-[#6c7f85]">{moment.why_it_matters}</p><div className="mt-4 flex items-center gap-2 text-xs text-[#7b8d92]"><span className="font-semibold uppercase tracking-[.08em]">{moment.speaker}</span><span>·</span><SentimentBadge value={moment.sentiment}/></div></article>; })}</div></section>;
}

function SentencePanel({ analysis }: { analysis: AnalysisResponse['data'] }) {
  const [filter, setFilter] = useState<'all' | Sentiment>('all');
  const sentences = useMemo(() => filter === 'all' ? analysis.sentences : analysis.sentences.filter((item) => item.sentiment === filter), [analysis.sentences, filter]);
  return <section><div className="flex flex-wrap items-end justify-between gap-4"><SectionHeading eyebrow="Detailed review" title="Sentence-level analysis" detail={`${sentences.length} sentences`}/><label className="flex items-center gap-2 text-sm text-[#687e85]">Filter<select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="h-9 rounded-lg border border-[#ccdadd] bg-white px-3 font-medium text-[#294750] outline-none focus:ring-2 focus:ring-[#47afa4]/30"><option value="all">All sentiment</option><option value="positive">Positive</option><option value="neutral">Neutral</option><option value="negative">Negative</option></select></label></div><div className="mt-4 overflow-hidden rounded-2xl border border-[#dce6e9] bg-white"><Table><TableHeader><TableRow className="bg-[#f6f9f9] hover:bg-[#f6f9f9]"><TableHead className="pl-5">Speaker</TableHead><TableHead>Sentence & reasoning</TableHead><TableHead>Emotion</TableHead><TableHead>Sentiment</TableHead><TableHead className="pr-5 text-right">Confidence</TableHead></TableRow></TableHeader><TableBody>{sentences.map((item) => <TableRow key={item.id} className="align-top"><TableCell className="pl-5 align-top"><span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold uppercase tracking-[.06em] ${item.speaker === 'customer' ? 'bg-[#e8f0f4] text-[#426f83]' : 'bg-[#edf7f5] text-[#278479]'}`}>{item.speaker}</span></TableCell><TableCell className="min-w-[340px] whitespace-normal align-top"><p className="font-medium leading-6 text-[#294750]">{item.sentence}</p><p className="mt-1 text-xs leading-5 text-[#819096]">{item.reasoning}</p></TableCell><TableCell className="align-top text-sm text-[#526b73]">{titleCase(item.emotion)}</TableCell><TableCell className="align-top"><SentimentBadge value={item.sentiment}/></TableCell><TableCell className="pr-5 text-right align-top font-semibold text-[#4d666e]">{percent(item.confidence)}</TableCell></TableRow>)}</TableBody></Table></div></section>;
}

export function Dashboard({ result, onNewAnalysis }: { result: AnalysisResponse; onNewAnalysis: () => void }) {
  const analysis = result.data;
  const resolutionLabel = titleCase(analysis.kpis.resolution_status.status);
  return <div className="space-y-8 pb-14">
    <section className="rounded-2xl border border-[#dce6e9] bg-white p-5 shadow-[0_4px_20px_rgba(20,55,66,.04)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><SentimentBadge value={analysis.overall_sentiment.label}/><span className="text-xs text-[#7a8c92]">Analyzed with {result.meta.model}</span></div><h1 className="mt-4 max-w-3xl text-2xl font-semibold tracking-[-.035em] text-[#153743] sm:text-[2rem]">{analysis.overview.primary_issue}</h1><p className="mt-3 max-w-4xl text-[15px] leading-7 text-[#5d737b]">{analysis.overview.conversation_summary}</p></div><button onClick={onNewAnalysis} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#cddbdd] bg-white px-4 text-sm font-semibold text-[#365761] transition hover:bg-[#f3f7f7]"><RotateCcw size={15}/>New analysis</button></div>
      <div className="mt-6 grid gap-3 border-t border-[#e4ecee] pt-5 md:grid-cols-3"><div><p className="text-xs font-bold uppercase tracking-[.09em] text-[#829298]">Customer intent</p><p className="mt-1 text-sm font-medium text-[#36535c]">{analysis.overview.customer_intent}</p></div><div><p className="text-xs font-bold uppercase tracking-[.09em] text-[#829298]">Outcome</p><p className="mt-1 text-sm font-medium text-[#36535c]">{analysis.overview.call_outcome}</p></div><div><p className="text-xs font-bold uppercase tracking-[.09em] text-[#829298]">Source</p><p className="mt-1 text-sm font-medium text-[#36535c]">{result.meta.file_name}</p></div></div>
    </section>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Overall sentiment" value={titleCase(analysis.overall_sentiment.label)} note={`${percent(analysis.overall_sentiment.confidence)} confidence`} tone="red" icon={Activity}/><MetricCard label="Customer satisfaction" value={`${analysis.kpis.customer_satisfaction.score}/100`} note="AI-inferred CSAT proxy" tone="teal" icon={HeartHandshake}/><MetricCard label="Escalation risk" value={titleCase(analysis.kpis.escalation_risk.level)} note={`${analysis.kpis.escalation_risk.score}/100 risk score`} tone="amber" icon={AlertTriangle}/><MetricCard label="Resolution status" value={resolutionLabel} note={analysis.kpis.resolution_status.reasoning} tone="blue" icon={CheckCircle2}/></div>
    <div className="grid gap-5 xl:grid-cols-2"><SentimentPanel analysis={analysis}/><EmotionPanel analysis={analysis}/></div>
    <RecoveryPanel analysis={analysis}/>
    <KpiPanel analysis={analysis}/>
    <section className="grid gap-4 md:grid-cols-2"><article className="rounded-2xl border border-[#dce6e9] bg-white p-5"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl bg-[#fff2e9] text-[#bd682f]"><Target size={18}/></span><Badge variant="outline" className="rounded-full capitalize">{analysis.kpis.business_impact.level} impact</Badge></div><h3 className="mt-4 font-semibold text-[#294750]">Business impact</h3><p className="mt-2 text-sm leading-6 text-[#6b7f86]">{analysis.kpis.business_impact.reasoning}</p><div className="mt-4 flex flex-wrap gap-2">{analysis.kpis.business_impact.categories.map((category) => <span key={category} className="rounded-full bg-[#f2f6f7] px-2.5 py-1 text-xs font-semibold text-[#557078]">{titleCase(category)}</span>)}</div></article><article className="rounded-2xl border border-[#dce6e9] bg-white p-5"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl bg-[#edf6f5] text-[#278b82]"><Lightbulb size={18}/></span><span className="text-sm font-semibold text-[#557078]">{percent(analysis.kpis.resolution_status.confidence)} confidence</span></div><h3 className="mt-4 font-semibold text-[#294750]">Resolution evidence</h3><p className="mt-2 text-sm leading-6 text-[#6b7f86]">{analysis.kpis.resolution_status.reasoning}</p><div className="mt-4 space-y-2">{analysis.kpis.resolution_status.evidence.map((quote) => <p key={quote} className="rounded-lg bg-[#f5f8f8] px-3 py-2 text-xs italic text-[#587078]">“{quote}”</p>)}</div></article></section>
    <MomentsPanel analysis={analysis}/>
    <SentencePanel analysis={analysis}/>
  </div>;
}
