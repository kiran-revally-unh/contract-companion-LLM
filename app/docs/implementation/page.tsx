import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, Code, ShieldCheck, Gauge, FileText, Upload, Layers, Network, ClipboardList, CheckCircle, Database } from 'lucide-react';

export default function ImplementationDocsPage() {
  const apiSnippet = `// app/api/contract/analyze/route.ts (core)\nimport { NextResponse } from 'next/server';\nimport { openai } from '@ai-sdk/openai';\nimport { generateObject } from 'ai';\nimport { ContractAnalysisSchema } from '@/lib/contract-analyzer/schemas';\nexport const runtime = 'nodejs';\n\nexport async function POST(request: Request) {\n  const json = await request.json();\n  const { contractText, contractType, jurisdiction, persona, modelId } = json;\n\n  const system = 'Structured extraction + explainability';\n  const prompt = /* user prompt assembled from inputs */ '';\n\n  const result = await generateObject({\n    model: openai(modelId),\n    schema: ContractAnalysisSchema,\n    system,\n    prompt,\n    temperature: 0.5,\n  });\n\n  // Usage + tokenizer fallback for exact tokens\n  let tokensUsed = {\n    input: result.usage?.promptTokens || 0,\n    output: result.usage?.completionTokens || 0,\n    total: result.usage?.totalTokens || 0,\n  };\n  if (tokensUsed.total === 0) {\n    const tk = await import('@dqbd/tiktoken');\n    const enc = tk.get_encoding('o200k_base');\n    const inputTokens = enc.encode(contractText).length;\n    const outputTokens = enc.encode(JSON.stringify(result.object)).length;\n    enc.free();\n    tokensUsed = { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens };\n  }\n\n  return NextResponse.json({\n    analysis: result.object,\n    tokensUsed,\n    modelUsed: modelId,\n  });\n}`;

  const promptSnippet = `// lib/ai/prompts.ts (excerpt)\nexport const productIntelligencePrompt = ` + "`" + `You are an AI-powered Contract Risk Analyzer.\\n\\nTransform unstructured contract text into structured, explainable insights.\\n- Extract risky clauses\\n- Provide verbatim evidence quotes and locations\\n- Explain, suggest negotiation, and score risk\\n` + "`" + `;\n`;

  const schemaSnippet = `// lib/contract-analyzer/schemas.ts (excerpt)\nimport { z } from 'zod';\n\nexport const ClauseSchema = z.object({\n  title: z.string(),\n  risk_level: z.enum(['low','medium','high']),\n  evidence_quotes: z.array(z.object({ quote: z.string().min(15), location: z.string() })).min(1),\n  plain_english: z.string(),\n  negotiation_language: z.string(),\n});\n\nexport const ContractAnalysisSchema = z.object({\n  overall_risk_score: z.number().min(0).max(100),\n  clauses: z.array(ClauseSchema).min(1),\n  missing_protections: z.array(z.string()).default([]),\n});`;

  const clientSnippet = `// app/(chat)/contract-analyzer/page.tsx (flow excerpt)\nasync function analyzeContract() {\n  const response = await fetch('/api/contract/analyze', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ contractText, contractType, jurisdiction, persona, modelId }),\n  });\n  const json = await response.json();\n  setModelMetrics({ tokensUsed: json.tokensUsed, processingTime: json.processingTime, cost: json.estimatedCost });\n  setAnalysis(json.analysis);\n}\n`;

  return (
    <div className="min-h-svh w-full bg-gray-50">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">End-to-End Implementation</h1>
          <p className="mt-3 text-gray-600">How Coco is built and runs: architecture, flow, APIs, prompts, validation, metrics, and delivery.</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">Architecture</Badge>
            <Badge className="bg-blue-100 text-blue-800" variant="secondary">LLM Integration</Badge>
            <Badge className="bg-green-100 text-green-800" variant="secondary">Metrics</Badge>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-white">
            <Layers className="size-5 text-gray-700 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Frontend</div>
              <div className="text-sm text-gray-700">Next.js App Router, React 19 RC, Tailwind + shadcn UI. Pages: Home, Pipeline, Results, Docs.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-white">
            <Network className="size-5 text-gray-700 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-900">API Layer</div>
              <div className="text-sm text-gray-700">Node runtime routes; OpenAI via AI SDK; robust error handling and retries.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-white">
            <ClipboardList className="size-5 text-gray-700 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Validation</div>
              <div className="text-sm text-gray-700">Zod schemas enforce strict structure; bounded retries on validation failure.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-white">
            <Gauge className="size-5 text-gray-700 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Metrics</div>
              <div className="text-sm text-gray-700">Precise tokens (usage or tokenizer), latency, retries, and per-model cost.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-white">
            <Code className="size-5 text-gray-700 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Prompting</div>
              <div className="text-sm text-gray-700">Structured system + user prompts; persona/type/jurisdiction-aware.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-white">
            <CheckCircle className="size-5 text-gray-700 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Delivery</div>
              <div className="text-sm text-gray-700">Pipeline to results; exportable PDF; simple sharing; discoverable Docs.</div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Frontend Flow</h2>
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            <li>Home: select type/persona/model, paste/upload contract. Click Analyze to start pipeline.</li>
            <li>Pipeline: shows steps, Model Run details, and a &quot;View results&quot; button.</li>
            <li>Results: split view with flags, explanations, clause tables, and Export Report.</li>
            <li>Docs: product-focused walkthrough and implementation details.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">API Layer</h2>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-md p-4 overflow-auto"><code>{apiSnippet}</code></pre>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Prompt Strategy</h2>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-md p-4 overflow-auto"><code>{promptSnippet}</code></pre>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Schema & Validation</h2>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-md p-4 overflow-auto"><code>{schemaSnippet}</code></pre>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Client Flow</h2>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-md p-4 overflow-auto"><code>{clientSnippet}</code></pre>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Deployment & Runtime</h2>
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            <li>Next.js 15 App Router with Node runtime for API routes.</li>
            <li>Build avoids automatic DB migrations; run migrations via script when needed.</li>
            <li>Environment: `POSTGRES_URL` for database (optional for demos).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Security & Privacy</h2>
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            <li>Guardrails detect sensitive content and profanity pre-analysis.</li>
            <li>UI clearly labels privacy status; no data is shared without explicit user action.</li>
          </ul>
        </section>

        <section className="mt-10 flex items-center gap-3 justify-center">
          <Link href="/docs"><Button variant="outline">Back to Docs</Button></Link>
          <Link href="/"><Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">Back to App</Button></Link>
        </section>
      </main>
    </div>
  );
}
