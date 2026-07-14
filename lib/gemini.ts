import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface GeminiAnalysisResult {
  probabilityScore: number;  // 0–10
  aiLabel: string;           // e.g. "cyclone", "tsunami", "oil_spill", "marine_debris", "false_alarm"
  aiExplanation: string;     // 2-3 sentence reasoning
  keywords: string[];        // 5–10 keywords for social mining
  severity: "critical" | "high" | "medium" | "low";
  isOceanHazard: boolean;
}

export async function analyzeReport(
  description: string,
  hazardType: string,
  locationAddress: string,
  existingKeywords?: string[]
): Promise<GeminiAnalysisResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are VARUNA, an AI system for the Indian National Centre for Ocean Information Services (INCOIS). Analyze this citizen ocean hazard report and provide a structured assessment.

REPORT DETAILS:
- Hazard Type: ${hazardType}
- Location: ${locationAddress || "Unknown location, India"}
- Description: "${description}"
${existingKeywords ? `- Reporter Keywords: ${existingKeywords.join(", ")}` : ""}

TASK: Evaluate this oceanographic anomaly report and respond with ONLY a valid JSON object (no markdown, no explanation outside JSON):

{
  "probabilityScore": <number 0-10, where 10 = definitely real major hazard, 0 = clearly false/irrelevant>,
  "aiLabel": "<one of: cyclone, tsunami, storm_surge, coastal_flooding, oil_spill, marine_debris, rip_current, whale_stranding, algal_bloom, seismic_activity, high_waves, jellyfish_bloom, false_alarm, unknown>",
  "aiExplanation": "<2-3 sentences explaining your assessment, referencing specific details from the report>",
  "keywords": ["<5-10 specific keywords for social media mining, include location, hazard type, and specific observations>"],
  "severity": "<critical|high|medium|low>",
  "isOceanHazard": <true|false>
}

SCORING GUIDE:
- 9-10: Confirmed major hazard (tsunami, severe cyclone, large oil spill) with clear specific details
- 7-8: Likely real hazard with good detail (storm surge, coastal flooding, marine accident)
- 5-6: Possible hazard but vague or could be misidentified (unusual currents, moderate waves)
- 3-4: Unlikely to be a hazard but worth noting (minor discoloration, light debris)
- 0-2: False alarm or irrelevant report

Indian coastal context: Consider that India has both East (Bay of Bengal) and West (Arabian Sea) coasts. Cyclone season is June-November (Bay of Bengal) and May-June (Arabian Sea). Common hazards include cyclones, storm surges, coastal erosion, oil spills from shipping lanes, and marine animal strandings.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    
    const parsed = JSON.parse(jsonMatch[0]) as GeminiAnalysisResult;
    
    // Validate and clamp
    return {
      probabilityScore: Math.min(10, Math.max(0, Number(parsed.probabilityScore) || 0)),
      aiLabel: parsed.aiLabel || "unknown",
      aiExplanation: parsed.aiExplanation || "Analysis completed.",
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 10) : [],
      severity: parsed.severity || "low",
      isOceanHazard: Boolean(parsed.isOceanHazard),
    };
  } catch (error) {
    console.error("Gemini analysis error:", error);
    // Fallback: basic keyword-based scoring
    return fallbackAnalysis(description, hazardType);
  }
}

function fallbackAnalysis(description: string, hazardType: string): GeminiAnalysisResult {
  const highRiskKeywords = ["tsunami", "cyclone", "flood", "surge", "oil spill", "drowning", "emergency", "stranded"];
  const desc = description.toLowerCase();
  const matchCount = highRiskKeywords.filter(k => desc.includes(k)).length;
  const score = Math.min(10, matchCount * 2.5 + 2);
  
  return {
    probabilityScore: score,
    aiLabel: hazardType || "unknown",
    aiExplanation: "Automated analysis based on keyword matching. Manual review recommended.",
    keywords: [hazardType, ...description.split(" ").slice(0, 5)],
    severity: score >= 7 ? "high" : score >= 4 ? "medium" : "low",
    isOceanHazard: true,
  };
}

export function computeTrustScore(probabilityScore: number, socialPostCount: number): number {
  // Base: 60% weight on AI probability, 40% on social corroboration
  const socialBoost = Math.min(10, socialPostCount / 5); // every 5 posts = 1 point, max 10
  const trust = (probabilityScore * 0.6) + (socialBoost * 0.4);
  return Math.round(Math.min(10, Math.max(0, trust)) * 10) / 10;
}

export function getTrustLabel(trustScore: number): { label: string; color: string; action: string } {
  if (trustScore >= 8) {
    return { label: "HIGH CONFIDENCE", color: "red", action: "Auto-alert dispatched to responders" };
  } else if (trustScore >= 5) {
    return { label: "MEDIUM CONFIDENCE", color: "orange", action: "Queued for human review" };
  } else {
    return { label: "LOW CONFIDENCE", color: "yellow", action: "Saved for pattern analysis" };
  }
}
