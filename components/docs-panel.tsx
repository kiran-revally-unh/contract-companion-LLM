"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock, Cpu, Code, Receipt, ShieldCheck, Rocket, ListChecks, Workflow, Zap, Gauge, FileText } from 'lucide-react';
import React from 'react';

export function DocsPanel() {
  const apiSnippet = `// app/api/contract/analyze/route.ts (simplified)
import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { ContractAnalysisSchema } from '@/lib/contract-analyzer/schemas';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const { contractText, modelId } = await request.json();
  const system = 'Structured extraction + explainability';
  const prompt = 'Analyze contract and return JSON matching schema';

  const result = await generateObject({
    model: openai(modelId),
    schema: ContractAnalysisSchema,
    system,
    prompt,
    temperature: 0.5,
  });

  return NextResponse.json({
    analysis: result.object,
    tokensUsed: {
      input: result.usage?.promptTokens || 0,
      output: result.usage?.completionTokens || 0,
    },
    modelUsed: modelId,
  });
}`;

  const schemaSnippet = `// lib/contract-analyzer/schemas.ts (excerpt)
import { z } from 'zod';

export const ClauseSchema = z.object({
  title: z.string(),
  risk_level: z.enum(['low','medium','high']),
  evidence_quotes: z.array(z.object({
    quote: z.string().min(15),
    location: z.string(),
  })).min(1),
  plain_english: z.string(),
  negotiation_language: z.string(),
});

export const ContractAnalysisSchema = z.object({
  overall_risk_score: z.number().min(0).max(100),
  clauses: z.array(ClauseSchema).min(1),
  missing_protections: z.array(z.string()).default([]),
});`;

  const promptSnippet = `// lib/ai/prompts.ts (excerpt)
export const productIntelligencePrompt = ` + "`" + `You are an AI-powered Contract Risk Analyzer.\n\nTransform unstructured contract text into structured, explainable insights.\n- Extract risky clauses\n- Provide verbatim evidence quotes and locations\n- Explain, suggest negotiation, and score risk\n` + "`" + `;
`;

  const flowSteps = [
    { icon: FileText, title: 'Input', desc: 'User pastes text or uploads PDF/DOCX.' },
    { icon: ShieldCheck, title: 'Guardrails', desc: 'Detect sensitive content & profanity before analysis.' },
    { icon: Code, title: 'Prompting', desc: 'Structured system + user prompts tailored to type/persona.' },
    { icon: Cpu, title: 'OpenAI Call', desc: 'Calls `generateObject()` with Zod schema for strict JSON.' },
    { icon: ListChecks, title: 'Validation & Retries', desc: 'Zod validation + bounded retries; rate-limit handling.' },
    { icon: Gauge, title: 'Metrics', desc: 'Tokens, latency, and estimated cost computed precisely.' },
    { icon: Workflow, title: 'Transformation', desc: 'JSON mapped to UI: flags, explanations, metrics, export.' },
    { icon: Rocket, title: 'Delivery', desc: 'Pipeline → results view; PDF export for sharing.' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-8 px-3 text-sm">Docs</Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>Docs / How This Works</SheetTitle>
          <SheetDescription>
            Guided walkthrough of Coco’s system design and LLM usage.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-6">
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Product</Badge>
              <span>Solves: rapid, explainable contract risk analysis</span>
            </div>
            <p className="text-sm text-gray-700">
              Paste or upload a contract, pick a type/persona, and get a structured risk report with evidence quotes, explanations, and negotiation suggestions. Tokens, latency, and cost are tracked.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">End-to-End Flow</h3>
            <div className="grid grid-cols-2 gap-3">
              {flowSteps.map((s, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 rounded-md border bg-white">
                  <s.icon className="size-4 text-gray-700 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{s.title}</div>
                    <div className="text-xs text-gray-600">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">API Call (OpenAI)</h3>
            <pre className="bg-gray-900 text-gray-100 text-xs rounded-md p-3 overflow-auto">
              <code>{apiSnippet}</code>
            </pre>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Schema Validation (Zod)</h3>
            <pre className="bg-gray-900 text-gray-100 text-xs rounded-md p-3 overflow-auto">
              <code>{schemaSnippet}</code>
            </pre>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Prompt Strategy</h3>
            <pre className="bg-gray-900 text-gray-100 text-xs rounded-md p-3 overflow-auto">
              <code>{promptSnippet}</code>
            </pre>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Metrics & Cost</h3>
            <p className="text-xs text-gray-700">
              We record precise input/output tokens (via provider usage or tokenizer fallback), latency, retries, and estimated cost per model. These are displayed in the pipeline UI.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">From JSON to UI</h3>
            <p className="text-xs text-gray-700">
              Validated JSON powers risk flags, explanations, clause tables, metrics, and the exportable report. Errors are surfaced with clear messages.
            </p>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
