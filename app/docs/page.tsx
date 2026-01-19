import Link from 'next/link';
import Image from 'next/image';
import { AppHeader } from '@/components/app-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ShieldCheck, Code, Cpu, ListChecks, Gauge, Workflow, Rocket } from 'lucide-react';
import showcase1 from './showcase1.png';
import showcase2 from './showcase2.png';
import showcase3 from './showcase3.png';
import showcase4 from './showcase4.png';
import showcase5 from './showcase5.png';

export default function DocsPage() {
  const apiSnippet = `// app/api/contract/analyze/route.ts (simplified)\nimport { NextResponse } from 'next/server';\nimport { openai } from '@ai-sdk/openai';\nimport { generateObject } from 'ai';\nimport { ContractAnalysisSchema } from '@/lib/contract-analyzer/schemas';\n\nexport const runtime = 'nodejs';\n\nexport async function POST(request: Request) {\n  const { contractText, modelId } = await request.json();\n  const system = 'Structured extraction + explainability';\n  const prompt = 'Analyze contract and return JSON matching schema';\n\n  const result = await generateObject({\n    model: openai(modelId),\n    schema: ContractAnalysisSchema,\n    system,\n    prompt,\n    temperature: 0.5,\n  });\n\n  return NextResponse.json({\n    analysis: result.object,\n    tokensUsed: {\n      input: result.usage?.promptTokens || 0,\n      output: result.usage?.completionTokens || 0,\n    },\n    modelUsed: modelId,\n  });\n}`;

  const schemaSnippet = `// lib/contract-analyzer/schemas.ts (excerpt)\nimport { z } from 'zod';\n\nexport const ClauseSchema = z.object({\n  title: z.string(),\n  risk_level: z.enum(['low','medium','high']),\n  evidence_quotes: z.array(z.object({\n    quote: z.string().min(15),\n    location: z.string(),\n  })).min(1),\n  plain_english: z.string(),\n  negotiation_language: z.string(),\n});\n\nexport const ContractAnalysisSchema = z.object({\n  overall_risk_score: z.number().min(0).max(100),\n  clauses: z.array(ClauseSchema).min(1),\n  missing_protections: z.array(z.string()).default([]),\n});`;

  const promptSnippet = `// lib/ai/prompts.ts (excerpt)\nexport const productIntelligencePrompt = ` + "`" + `You are an AI-powered Contract Risk Analyzer.\\n\\nTransform unstructured contract text into structured, explainable insights.\\n- Extract risky clauses\\n- Provide verbatim evidence quotes and locations\\n- Explain, suggest negotiation, and score risk\\n` + "`" + `;\n`;

  const steps = [
    { icon: FileText, title: '1. Input', desc: 'User pastes text or uploads PDF/DOCX.' },
    { icon: ShieldCheck, title: '2. Guardrails', desc: 'Detect sensitive content & profanity before analysis.' },
    { icon: Code, title: '3. Prompting', desc: 'Structured system + user prompts tailored to type/persona.' },
    { icon: Cpu, title: '4. OpenAI Call', desc: 'Calls `generateObject()` with Zod schema for strict JSON.' },
    { icon: ListChecks, title: '5. Validation & Retries', desc: 'Zod validation + bounded retries; rate-limit handling.' },
    { icon: Gauge, title: '6. Metrics', desc: 'Tokens, latency, and estimated cost computed precisely.' },
    { icon: Workflow, title: '7. Transformation', desc: 'JSON mapped to UI: flags, explanations, metrics, export.' },
    { icon: Rocket, title: '8. Delivery', desc: 'Pipeline → results view; PDF export for sharing.' },
  ];

  return (
    <div className="min-h-svh w-full bg-gray-50">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Showcase: same five images as README for parity */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center">Product Showcase</h1>
          <p className="mt-3 text-gray-600 text-center">A quick visual tour of the core experience.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border bg-white p-3">
              <Image src={showcase1} alt="Home - Analyze Contract" className="w-full h-auto rounded-md" placeholder="blur" />
              <div className="mt-2 text-sm text-gray-700">Home: choose type/persona/model and analyze.</div>
            </div>
            <div className="rounded-lg border bg-white p-3">
              <Image src={showcase2} alt="Pipeline - Model Run & Steps" className="w-full h-auto rounded-md" placeholder="blur" />
              <div className="mt-2 text-sm text-gray-700">Pipeline with tokens, latency, cost, retries.</div>
            </div>
            <div className="rounded-lg border bg-white p-3">
              <Image src={showcase3} alt="Analysis Results - Dashboard" className="w-full h-auto rounded-md" placeholder="blur" />
              <div className="mt-2 text-sm text-gray-700">Results dashboard with evidence and clause table.</div>
            </div>
            <div className="rounded-lg border bg-white p-3">
              <Image src={showcase4} alt="Diff View - Suggested Redlines" className="w-full h-auto rounded-md" placeholder="blur" />
              <div className="mt-2 text-sm text-gray-700">Diff view with suggested redlines.</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="rounded-lg border bg-white p-3">
              <Image src={showcase5} alt="Metrics & Export" className="w-full h-auto rounded-md" placeholder="blur" />
              <div className="mt-2 text-sm text-gray-700 text-center">Metrics & Export: model, tokens, latency, retries, PDF.</div>
            </div>
          </div>
        </section>
        <section className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Docs / How This Works</h1>
          <p className="mt-3 text-gray-600">A concise, product-oriented walkthrough of Coco’s system design and LLM usage.</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">Production-minded</Badge>
            <Badge className="bg-blue-100 text-blue-800" variant="secondary">Explainable</Badge>
            <Badge className="bg-green-100 text-green-800" variant="secondary">Measured</Badge>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg border bg-white">
              <s.icon className="size-5 text-gray-700 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                <div className="text-sm text-gray-700">{s.desc}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">What problem this solves</h2>
          <p className="text-sm text-gray-700">
            Rapid, explainable contract risk analysis: paste a contract and get a structured report with evidence quotes, plain-English explanations, and negotiation suggestions. The app tracks tokens, latency, and cost.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">API Call (OpenAI)</h2>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-md p-4 overflow-auto"><code>{apiSnippet}</code></pre>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Schema Validation (Zod)</h2>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-md p-4 overflow-auto"><code>{schemaSnippet}</code></pre>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Prompt Strategy</h2>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-md p-4 overflow-auto"><code>{promptSnippet}</code></pre>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Validation, Retries, and Metrics</h2>
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            <li>Zod validates structured output; failures are retried with bounded backoff.</li>
            <li>Rate limits are detected and surfaced cleanly.</li>
            <li>Tokens are counted from provider usage or tokenizer fallback; cost is estimated per model.</li>
            <li>Latency and retry count are tracked and shown in the pipeline UI.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">From JSON to UI</h2>
          <p className="text-sm text-gray-700">Validated JSON powers risk flags, explanations, clause tables, metrics, and the exportable report. Errors are displayed with actionable messages.</p>
        </section>

        <section className="mt-10 text-center">
          <div className="flex items-center justify-center gap-3">
            <Link href="/docs/implementation">
              <Button variant="outline">End-to-End Implementation</Button>
            </Link>
            <Link href="/">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">Back to App</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
