import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
dotenv.config({ path: path.join(process.cwd(), ".env.local"), override: true });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const PLACEHOLDER_KEYS = new Set(["", "MY_GEMINI_API_KEY", "your_api_key_here"]);

app.use(express.json());

const api_key =
  process.env.GEMINI_API_KEY?.trim() ||
  process.env.GOOGLE_API_KEY?.trim() ||
  "";

let ai: GoogleGenAI | null = null;

if (api_key && !PLACEHOLDER_KEYS.has(api_key)) {
  try {
    ai = new GoogleGenAI({ apiKey: api_key });
    console.log(
      `DecisionTwin Backend: Gemini API live (${GEMINI_MODEL}).`
    );
  } catch (error) {
    console.error("DecisionTwin Backend: Error initializing Gemini.", error);
  }
} else {
  console.log(
    "DecisionTwin Backend: Set GEMINI_API_KEY in .env.local for live Gemini chat."
  );
}

const GOVERNANCE_SYSTEM_INSTRUCTION = `You are the Gemini Governance Assistant for DECISIONTWIN, an enterprise AI governance and risk-simulation platform.
The user is a chief risk officer, compliance auditor, or regulator reviewing AI fairness, bias trajectories, and policy risk.
Answer with executive clarity. Use markdown headings, bullet points, and tables when helpful.
Ground responses in realistic governance frameworks (RBI Digital Lending, EU AI Act, NITI Aayog Responsible AI). Be numbers-oriented and actionable.`;

type ChatTurn = { sender: "user" | "gemini"; text: string };

async function generateGeminiText(
  contents: string | Array<{ role: string; parts: Array<{ text: string }> }>,
  options?: { systemInstruction?: string; temperature?: number }
): Promise<string> {
  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction:
        options?.systemInstruction ?? GOVERNANCE_SYSTEM_INSTRUCTION,
      temperature: options?.temperature ?? 0.7,
    },
  });

  return response.text?.trim() || "No response received from Gemini.";
}

function buildChatContents(
  previousMessages: ChatTurn[],
  message: string
): Array<{ role: string; parts: Array<{ text: string }> }> {
  const history = previousMessages
    .filter((m) => m.text.trim())
    .slice(-10)
    .map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

  return [...history, { role: "user", parts: [{ text: message }] }];
}

app.get("/api/gemini-status", (_req: Request, res: Response) => {
  res.json({ live: Boolean(ai), model: GEMINI_MODEL });
});

// REST API Endpoints

/**
 * 1. AI Copilot Chat Endpoint
 */
app.post("/api/chat", async (req: Request, res: Response) => {
  const { message, previousMessages } = req.body as {
    message?: string;
    previousMessages?: ChatTurn[];
  };

  if (!message?.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (ai) {
    try {
      const reply = await generateGeminiText(
        buildChatContents(previousMessages ?? [], message),
        { temperature: 0.7 }
      );
      return res.json({ reply, live: true });
    } catch (error: unknown) {
      const detail =
        error instanceof Error ? error.message : "Gemini request failed";
      console.error("Gemini Copilot Error:", error);
      return res.status(502).json({ error: detail, live: false });
    }
  }

  // Offline fallback when no API key
  let answer = "";
  const lower = message.toLowerCase();
  if (lower.includes("rural") || lower.includes("disparity")) {
    answer = `### 🌾 Rural Disparity Deep-Dive (Predictive Impact 2026-2035)

Based on current simulated telemetry from **Tier-3 socio-economic pincodes**, rural disparity is growing by **14% year-over-year** due to the following structural variables:

1. **Proxy Attribute Association**: Credit history duration acts as a proxy for physical bank branch proximity.
2. **Alternative Data Bias**: Micro-transaction frequencies penalize cash-dominant rural merchants.
3. **Connectivity Penalties**: Latency in mobile network checkouts predicted as irregular behavioral risk by neural networks.

#### Strategic Recommendations:
* Run the **Policy Lab Simulator** with **Protected Attributes Filter** toggled to **ON**.
* Lower the **Credit Threshold** to **₹45,000 / month** to stabilize approval curves.`;
  } else if (lower.includes("policy") || lower.includes("bias")) {
    answer = `### ⚖️ Multi-Agent Policy Optimization Guide

To optimize systemic bias from **91% down to a nominal <2%** without degrading net interest margin (NIM):

1. **Toggle Protected Attributes**: Activating demographic shadow filters redirects XGBoost weights away from zip-code and parental financial indices.
2. **Adjust Scholarship / Cutoffs**: In education-related loan schemes, lower the strict digital criteria by **8%** while incorporating manual rural outreach exceptions. This mitigates the "First-Generation Graduate" trap observed in current dummy profiles.
3. **Execute Stochastic Matching**: Clone your outlier applicants in the **Doppelganger Test Lab** to prove gender parity to RBI inspectors in real-time.`;
  } else if (lower.includes("rbi") || lower.includes("compliance") || lower.includes("gap")) {
    answer = `### 🏦 RBI Digital Lending Compliance Gap Analysis

Our governance engine identifies **2 key deviations** under current automated models:

| Compliance Node | Metric | Current Status | Remediation Action |
| :--- | :---: | :---: | :--- |
| **Sec 4.2: Algorithmic Ledger** | Audit Log Capture | ⚠️ Gap Found | Trigger automated report logs in the **Audit Generator** module. |
| **Sec 9.1: Bias Protection** | Demographic Parity | ⚠️ 12% Disparity | Standardize Logistic Regression or DecisionTwin Guardrailed Model in style labs. |

*Compliance Readiness Status*: **98% Projected** upon deploying policy stabilizers.`;
  } else {
    answer = `### 🛡️ DecisionTwin Enterprise Advisory Service

Intellectual audit findings processed dynamically for query: *"${message}"*

* **Observation**: Current models exhibit high precision but penalize single-parent and rural demographics over 10-year timelines.
* **Risk Forecast**: Potential Class Action or regulatory investigation from local authorities if fallback weights remain unadjusted.
* **Prescriptive Command**: 
  - Access **Doppelganger Test Lab** to evaluate systemic bias instantly.
  - Review **Multi Model Comparison** tab to replace unexplainable DNN nodes with our *DecisionTwin Guardrailed Model*.`;
  }
  return res.json({ reply: answer, live: false });
});

/**
 * 2. Doppelganger Lab Explanation Generator
 */
app.post("/api/doppelganger-explain", async (req: Request, res: Response) => {
  const { original, cloned, biasScore } = req.body;

  const prompt = `You are an AI Bias Auditor on the DECISIONTWIN platform.
The user has executed a Doppelganger Split-Screen test.
Original Applicant:
- Name: ${original.name}
- Gender: ${original.gender}
- Monthly Income: ${original.income}
- Credit Score: ${original.creditScore}
- AI Decision Result: ${original.decision}

Cloned Applicant (Identical metrics except protected attributes changed):
- Name: Cloned Twin (Alternate)
- Gender: ${cloned.gender}
- Monthly Income: ${cloned.income}
- Credit Score: ${cloned.creditScore}
- AI Decision Result: ${cloned.decision}

The AI model achieved a Bias Confidence Score of ${biasScore}%.
Explain why this behavior represents systemic demographic bias. Point out proxy variables (like pincode, dependency ratios, or community classifications) and explain why the neural network processed these identical financial metrics differently based on gender. Ensure the tone is highly professional and executive, suited for a Chief Compliance Officer. Keep response to 2 key paragraphs.`;

  if (ai) {
    try {
      const explanation = await generateGeminiText(prompt, {
        systemInstruction:
          "You are an AI Bias Auditor on the DECISIONTWIN platform. Write professional executive summaries for compliance officers.",
        temperature: 0.6,
      });
      return res.json({ explanation, live: true });
    } catch (error) {
      console.error("Gemini Doppelganger Explanation Error:", error);
    }
  }

  // Fallback high-fidelity explanation
  const fallbackExpl = `An automated audits audit reveals deep systemic bias (Confidence Score: ${biasScore}%). Because the original applicant (${original.name}, ${original.gender}) and the clone (${cloned.gender}) share identical monthly incomes and credit profiles, the divergence in AI outcome (${original.decision} vs. ${cloned.decision}) is driven by latent demographic correlations. 

The algorithmic model penalizes background metadata (such as dependent counts, localized carrier indices, or non-traditional micro-repayments) which serve as legal proxies for gender and socio-economic markers. By filtering these variables in real-time, the *DecisionTwin Guardrailed Model* recovers demographic parity while safeguarding enterprise risk compliance.`;

  return res.json({ explanation: fallbackExpl });
});

/**
 * 3. Audit Report Generator
 */
app.post("/api/generate-audit", async (req: Request, res: Response) => {
  const { framework, scores } = req.body;

  const prompt = `You are a Lead AI Ethics and Compliance Auditor. 
Generate a beautifully structured Google Docs-style regulatory audit report for our model's adherence to the "${framework}" framework.
Use the current scores: 
- Governance Score: ${scores.gov}/100
- Compliance Readiness: ${scores.comp}%
- Fairness Score: ${scores.fair}%
- Citizens Impacted: ${scores.impacted}

Provide the following sections strictly in beautiful Markdown formatting:
1. Executive Summary
2. Framework-Specific Findings (adhering specifically to ${framework})
3. Policy & Bias Risk Forecast (what happens over a 10-year horizon)
4. Key Recommendations and Remediation Pathway

The text should be authoritative, highly technical, and completely realistic, without placeholder indicators or brackets.`;

  if (ai) {
    try {
      const report = await generateGeminiText(prompt, {
        systemInstruction:
          "You are a Lead AI Ethics and Compliance Auditor producing regulatory audit reports in markdown.",
        temperature: 0.5,
      });
      return res.json({ report, live: true });
    } catch (e) {
      console.error("Gemini Audit Generator Error:", e);
    }
  }

  // Fallback high-fidelity Markdown audit report
  const fallbackReport = `# 🛡️ DECISIONTWIN REGULATORY ETHICS AUDIT
**Framework Focus:** ${framework}  
**Date of Audit:** June 13, 2026  
**Auditor Signature:** decisiontwin-engine-v3.5  

---

### 1. Executive Summary
Upon reviewing transactional logs representing **${scores.impacted} impacted citizens**, the platform has tracked a comprehensive **Governance Score of ${scores.gov}/100** and a **Fairness Index of ${scores.fair}%**. While general accuracy metrics correspond with standard market indices, latent demographic disparity exists within micro-borrower segments and regional communities.

### 2. Framework-Specific Compliance Findings (${framework})
* **Data Parity (Sec 3.1)**: Algorithmic checks verify that the standard credit decision nodes rely on proxy parameters (including geographic billing zip-codes) which map directly to historic low-income categories. 
* **Algorithmic Transparency (Sec 7.4)**: The neural network models under evaluation suffer from severe explainability deficits, dropping to a rating of **18% explainability**.
* **Risk Mitigation Coverage**: Safeguarding indices indicate that the *DecisionTwin Guardrailed Model* boosts regional compliance from **71% up to ${scores.comp}%** when enabled.

### 3. Policy & Bias Risk Forecast (10-Year Horizon: 2026 - 2036)
- **Stagnation Trap**: Without demographic equalization, approval rates in marginalized geographic clusters will deteriorate by **an additional 18%** as feedback loops consolidate.
- **Regulatory Penalties**: Current trends project a class action risk penalty of approximately **₹5.2 Crores** if the baseline credit threshold remains unchanged.

### 4. Key Recommendations and Remediation Pathway
1. **Model Substitution**: Transition mission-critical workflows from deep neural networks to *DecisionTwin Guardrailed Models* immediately.
2. **Apply Policy Stabilizers**: Lower the automated credit score threshold to 650 with demographic-relative equal opportunity rules to auto-correct gender disparities.
3. **Continuous Doppelganger Testing**: Mandate bi-weekly split-tests in the Sandbox to maintain real-time fairness indices above 92%.`;

  return res.json({ report: fallbackReport });
});


// Express server hosting static web pages & Vite integration
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DecisionTwin is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
