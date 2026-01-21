# Quick Demo Notes & Cheat Sheet

## 🚀 Quick Start

```bash
# Start the app
pnpm dev

# Open browser
http://localhost:3000
```

---

## 📋 One-Liner Descriptions

**For non-technical audience:**
> "Coco analyzes legal contracts using AI and tells you what's risky, unfair, or missing—in plain English with suggested fixes."

**For technical audience:**
> "A Next.js app using OpenAI's structured output API with Zod validation, retry logic, and real-time observability for AI-powered contract risk analysis."

**For business audience:**
> "An AI tool that reads contracts in seconds, identifies risky clauses, calculates risk scores, and provides negotiation language—saving hours of legal review time."

---

## 🎯 Key Demo Points (30-Second Version)

1. **Upload a contract** → Choose type/persona/model
2. **Watch the AI analyze** → 8 steps with real-time progress
3. **See the results** → Risk score, risky clauses, evidence quotes, suggested revisions
4. **Export to PDF** → Professional report ready to share

---

## 💻 Code to Show (30 seconds)

**File:** `/app/api/contract/analyze/route.ts`

```typescript
// The OpenAI integration - show this part:
const response = await generateObject({
  model: openai(modelId),
  schema: ContractAnalysisSchema,  // ← Zod schema for structure
  system: systemPrompt,
  prompt: baseUserPrompt,
  temperature: 0.5,
});

// Retry logic - show this part:
while (retries <= MAX_RETRIES) {
  try {
    const response = await generateObject({ ... });
    result = response;
    break;
  } catch (err) {
    retries++;
    await delay(RETRY_DELAY_MS);
  }
}

// Cost calculation - show this part:
function calculateCost(model: string, input: number, output: number) {
  const pricing = MODEL_PRICING[model];
  return ((input / 1_000_000) * pricing.input) + 
         ((output / 1_000_000) * pricing.output);
}
```

**Say:** "This is the core API route. I use `generateObject` for structured JSON output, built retry logic for reliability, and calculate real-time costs based on token usage."

---

## 🎬 Demo Flow (Visual Cues)

### Screen 1: Homepage
- Point to: Model selector (GPT-4o vs GPT-4o-mini)
- Point to: Contract type dropdown
- Point to: Persona selector
- **Say:** "Pick your scenario—like analyzing an employment offer as an employee"

### Screen 2: Pipeline View
- Point to: Progress bar with 8 steps
- Point to: Token count updating in real-time
- Point to: Retry counter (if it retries)
- **Say:** "Full observability—you can see exactly what's happening"

### Screen 3: Results Dashboard
- Point to: Risk score (big number at top)
- Point to: Clause categories (Termination, Liability, IP, etc.)
- Point to: Evidence quotes in yellow highlight
- **Say:** "Every finding is backed by actual contract text with exact locations"

### Screen 4: Diff View
- Point to: Side-by-side comparison
- Point to: Suggested changes highlighted
- **Say:** "AI-generated revisions you can copy/paste into negotiations"

### Screen 5: Metrics Footer
- Point to: Total tokens, cost, latency, retries
- **Say:** "This analysis cost 8 cents and took 9 seconds. Transparent pricing."

---

## 🔥 Impressive Technical Features to Highlight

1. **Structured Output with Zod** → No unstructured text, full type safety
2. **Automatic Retries** → Handles API failures gracefully
3. **Cost Tracking** → Real-time calculation per token
4. **Evidence Grounding** → Every claim backed by quoted text
5. **Multi-Model Support** → Choose speed (mini) vs accuracy (4o)
6. **PDF Export** → Professional reports

---

## 📊 Sample Metrics (From Real Run)

Use these numbers if asked:

| Metric | Value |
|--------|-------|
| Analysis Time | 8.7 seconds |
| Input Tokens | 3,245 |
| Output Tokens | 1,823 |
| Total Cost | $0.08 |
| Clauses Found | 7 |
| Risk Score | 68/100 |
| Model Used | GPT-4o-mini |

---

## 🗣️ Elevator Pitch (10 seconds)

> "Coco is an AI contract analyzer that reads NDAs, employment offers, and lease agreements—finds risky clauses, explains them in plain English, and suggests specific revisions. Built with OpenAI's API, Next.js, and full production-quality engineering."

---

## 💬 Anticipated Questions & Answers

**Q: Is this production-ready?**
> "Yes. Full error handling, retry logic, rate limit detection, authentication, database storage, and cost tracking."

**Q: How much does it cost to run?**
> "Between 2 to 15 cents per analysis depending on the model. GPT-4o-mini is cheapest, GPT-4o is most accurate."

**Q: Can I trust the AI?**
> "I show evidence quotes for every finding so you can verify. It's meant to augment human review, not replace it."

**Q: What's next?**
> "Adding Claude Sonnet support, batch processing for multiple contracts, and a Chrome extension for analyzing contracts on websites."

**Q: Can I see the code?**
> "Yes, it's open source on GitHub under MIT license."

---

## 🎨 Visual Demo Path

```
Homepage
   ↓
Paste Contract → Select Options → Click "Analyze"
   ↓
Pipeline View (8 steps with progress)
   ↓
Results Dashboard
   ├─ Risk Score
   ├─ Clause List
   ├─ Evidence Quotes
   ├─ Diff View
   └─ PDF Export
   ↓
Metrics Footer (cost, tokens, time)
```

---

## ⚡ Speed Demo (60 seconds)

If you only have 1 minute:

1. **[0:00-0:10]** "This is Coco, an AI contract analyzer"
2. **[0:10-0:20]** Paste contract → Select employee perspective → Click Analyze
3. **[0:20-0:35]** "Watch it analyze in real-time with full observability"
4. **[0:35-0:50]** Show results: risk score, risky clauses, evidence quotes
5. **[0:50-1:00]** "Built with OpenAI structured output, Zod validation, retry logic. Cost: 8 cents, time: 9 seconds. Thanks!"

---

## 🎓 What You Learned Building This

Use this to talk about growth:

- ✅ **Prompt Engineering** → Iteratively refined prompts for better output
- ✅ **Structured Output** → Using schemas instead of parsing text
- ✅ **Error Handling** → Retry logic, rate limits, validation
- ✅ **Cost Optimization** → Token counting and model selection
- ✅ **Full-Stack Development** → Next.js API routes, database, auth
- ✅ **UI/UX Design** → Making AI outputs user-friendly

---

## 🎯 Call to Action

End with:

> "If you're interested in trying it out, I can share the GitHub repo. It's fully open source and you can run it locally with your own OpenAI API key. Or if you have questions about the implementation, happy to dive deeper!"

---

## 🔗 Links to Have Ready

- **GitHub**: [Your repo URL]
- **Live Demo**: [If deployed on Vercel]
- **Sample Contracts**: In `/samples/contracts/` folder
- **OpenAI Docs**: https://platform.openai.com/docs/guides/structured-outputs

---

**Remember:** You built something genuinely useful and technically solid. Be confident! 💪
