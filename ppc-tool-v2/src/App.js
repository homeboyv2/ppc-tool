import React, { useState, useRef, useCallback } from "react";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const VM_LOGO = "data:image/png;base64,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";

// ─── ANALYSIS MODULES ───────────────────────────────────────────────────────
const ANALYSIS_MODULES = [
  {
    id: "report", label: "Performance Report", icon: "01", tag: "ANALYSIS", group: "Core",
    desc: "Executive summary, KPI highlights, anomaly detection, and strategic recommendations from campaign data.",
    prompt: (csv) => `You are an expert PPC analyst. Analyze this Google Ads / PPC campaign CSV data and produce a professional performance report.\n\nCSV Data:\n${csv}\n\nProduce a structured report with:\n1. EXECUTIVE SUMMARY (3-4 sentences, key wins and concerns)\n2. PERFORMANCE HIGHLIGHTS (top metrics, period changes with % differences)\n3. ANOMALIES & ALERTS (anything unusual — spikes, drops, budget pacing issues)\n4. CAMPAIGN BREAKDOWN (per campaign: spend, clicks, conversions, CPA, ROAS if available)\n5. STRATEGIC RECOMMENDATIONS (3-5 specific, actionable next steps with expected impact)\n\nBe specific with numbers. Write in a confident, expert tone. Use markdown headers.`,
  },
  {
    id: "audit", label: "Campaign Audit", icon: "02", tag: "AUDIT", group: "Core",
    desc: "Full structural audit with health score out of 100, critical issues ranked by severity, and quick wins.",
    prompt: (csv) => `You are a senior PPC auditor. Perform a comprehensive audit of this campaign data.\n\nCSV Data:\n${csv}\n\nProduce:\n1. AUDIT SCORE (health score /100 with justification)\n2. CRITICAL ISSUES (HIGH severity) — problems costing money now\n3. STRUCTURAL ISSUES (MEDIUM severity) — setup problems to fix\n4. OPTIMIZATION OPPORTUNITIES (LOW severity) — improvements\n5. QUICK WINS — top 3 things to fix this week for immediate impact\n\nFor each issue: describe the problem, why it matters, how to fix it.`,
  },
  {
    id: "optimize", label: "Optimization Engine", icon: "03", tag: "OPTIMIZATION", group: "Core",
    desc: "Priority matrix, budget reallocation, keyword actions, bid strategy review, and a 30-day action plan.",
    prompt: (csv) => `You are a PPC optimization specialist. Analyze this campaign data and produce a prioritized optimization plan.\n\nCSV Data:\n${csv}\n\nProduce:\n1. PRIORITY MATRIX — rank recommendations by Impact x Effort\n2. BUDGET OPTIMIZATION — where to shift, pause, scale\n3. KEYWORD ACTIONS — specific keywords to pause, add as negatives, bid up/down\n4. BID STRATEGY RECOMMENDATIONS — current vs recommended\n5. 30-DAY ACTION PLAN — week by week\n\nBe hyper-specific. Reference actual campaign names, keywords, numbers.`,
  },
  {
    id: "competitor", label: "Competitor Analysis", icon: "04", tag: "INTELLIGENCE", group: "Core",
    desc: "Competitive landscape, impression share gaps, threat assessment, and counter-strategy from auction insights.",
    prompt: (csv) => `You are a PPC competitive intelligence analyst. Analyze this auction insights or keyword data.\n\nCSV Data:\n${csv}\n\nProduce:\n1. COMPETITIVE LANDSCAPE — main competitors, estimated aggression\n2. IMPRESSION SHARE GAPS — where you're losing and to whom\n3. POSITIONING OPPORTUNITIES — gaps competitors are ignoring\n4. THREAT ASSESSMENT — competitors gaining ground\n5. COUNTER-STRATEGY — specific tactics to outmaneuver top competitors`,
  },
  {
    id: "negatives", label: "Negative Keywords", icon: "05", tag: "KEYWORDS", group: "Keywords",
    desc: "Identify wasteful search terms, build a negative keyword list by match type, and protect budget from irrelevant traffic.",
    prompt: (csv) => `You are a PPC keyword specialist focused on negative keyword strategy. Analyze this search terms report.\n\nCSV Data:\n${csv}\n\nProduce:\n1. WASTE ANALYSIS — total spend on irrelevant/low-quality search terms, % of budget wasted\n2. NEGATIVE KEYWORD LIST — categorised by theme, with recommended match type (exact/phrase/broad) for each\n3. PRIORITY NEGATIVES — top 10 terms to add immediately based on spend waste\n4. NEGATIVE KEYWORD THEMES — recurring irrelevant themes to build broad exclusions around\n5. SAFEGUARDS — terms that look negative but should be kept (e.g. brand variants, high-intent modifiers)\n\nFormat the negative keyword list as a clean table: Term | Match Type | Reason | Estimated Spend Saved`,
  },
  {
    id: "location", label: "Location Analysis", icon: "06", tag: "GEO", group: "Audience",
    desc: "Geographic performance breakdown, top and bottom markets by ROAS/CPA, bid adjustment recommendations by region.",
    prompt: (csv) => `You are a PPC geo-targeting specialist. Analyze this location performance data.\n\nCSV Data:\n${csv}\n\nProduce:\n1. GEO PERFORMANCE OVERVIEW — total spend, revenue, ROAS, CPA by location (sorted by spend)\n2. TOP MARKETS — best performing locations with reasoning (ROAS, CVR, CPA)\n3. UNDERPERFORMING MARKETS — locations draining budget, with pause/reduce recommendations\n4. BID ADJUSTMENT RECOMMENDATIONS — specific +/- % adjustments by location tier\n5. EXPANSION OPPORTUNITIES — untapped or under-invested locations with strong signals\n6. STRATEGIC ACTIONS — whether to consolidate, expand, or restructure geo targeting\n\nBe specific with % changes and thresholds. Reference actual location names and numbers.`,
  },
  {
    id: "audience", label: "Audience Analysis", icon: "07", tag: "AUDIENCES", group: "Audience",
    desc: "Audience segment performance, bid modifier recommendations, and new audience strategy based on observed data.",
    prompt: (csv) => `You are a PPC audience strategist. Analyze this audience performance data.\n\nCSV Data:\n${csv}\n\nProduce:\n1. AUDIENCE SEGMENT PERFORMANCE — breakdown by audience with impressions, clicks, conversions, CPA, ROAS\n2. TOP PERFORMING AUDIENCES — what's working and why\n3. UNDERPERFORMING AUDIENCES — what to exclude or reduce bids on\n4. BID MODIFIER RECOMMENDATIONS — specific +/- % adjustments per audience\n5. AUDIENCE GAPS — segments likely to convert that are missing from targeting\n6. REMARKETING STRATEGY — layering recommendations for RLSA, customer match, similar audiences\n\nReference actual audience names and performance numbers throughout.`,
  },
  {
    id: "quality", label: "Quality Score Audit", icon: "08", tag: "QS", group: "Keywords",
    desc: "QS distribution analysis, click-weighted averages, root cause diagnosis, and ad relevance / landing page fixes.",
    prompt: (csv) => `You are a Google Ads Quality Score specialist. Analyze this keyword/QS data.\n\nCSV Data:\n${csv}\n\nProduce:\n1. QS DISTRIBUTION — breakdown of keywords by QS score (1-10), click-weighted average\n2. QS IMPACT ANALYSIS — estimated CPC premium or discount vs. benchmark\n3. ROOT CAUSE BREAKDOWN — split issues between: Expected CTR | Ad Relevance | Landing Page Experience\n4. PRIORITY FIX LIST — keywords with QS below 6 and high spend, ranked by improvement potential\n5. AD COPY RECOMMENDATIONS — specific changes to improve ad relevance for low-QS keywords\n6. LANDING PAGE ACTIONS — page-level fixes to improve Quality Score\n\nFormat the priority fix list as a table: Keyword | QS | Primary Issue | Recommended Action`,
  },
  {
    id: "pmax", label: "PMax Insights", icon: "09", tag: "PMAX", group: "Campaigns",
    desc: "Performance Max asset group analysis, channel breakdown where available, and optimisation levers.",
    prompt: (csv) => `You are a Performance Max specialist. Analyze this PMax campaign data.\n\nCSV Data:\n${csv}\n\nProduce:\n1. PMAX PERFORMANCE OVERVIEW — spend, conversions, ROAS, CPA at campaign level\n2. ASSET GROUP ANALYSIS — performance by asset group where data available\n3. CHANNEL MIX INSIGHTS — estimated spend/performance by channel (Search, Shopping, Display, YouTube) if visible\n4. ASSET QUALITY — identify weak assets (low performance scores) and what to replace\n5. AUDIENCE SIGNAL REVIEW — evaluate existing audience signals, recommend additions\n6. OPTIMISATION ACTIONS — specific levers to pull: asset additions, audience signals, budget, search themes\n7. BRAND VS NON-BRAND — analysis of brand keyword cannibalisation risk\n\nBe specific about what is and isn't visible in PMax data, and flag any blind spots.`,
  },
  {
    id: "budget", label: "Budget Pacing", icon: "10", tag: "BUDGET", group: "Campaigns",
    desc: "Month-to-date spend pacing, over/under-delivery detection, budget reallocation to maximise return.",
    prompt: (csv) => `You are a PPC budget management expert. Analyze this spend and pacing data.\n\nCSV Data:\n${csv}\n\nProduce:\n1. PACING OVERVIEW — actual vs expected spend MTD, over/under-pacing % per campaign\n2. BUDGET HEALTH — campaigns at risk of running out early vs campaigns under-spending\n3. LOST IMPRESSION SHARE (BUDGET) — campaigns limited by budget with estimated missed conversions\n4. REALLOCATION RECOMMENDATIONS — specific budget shifts between campaigns with expected impact\n5. DAILY BUDGET SUGGESTIONS — recommended daily budget for each campaign to hit monthly target\n6. END OF MONTH FORECAST — projected total spend and performance at current pacing\n\nFormat the reallocation table as: Campaign | Current Budget | Recommended Budget | Reason | Expected Impact`,
  },
];

// ─── REPORT FILE TYPES ───────────────────────────────────────────────────────
const REPORT_FILES = [
  { id: "campaigns",  label: "Campaign Data",   icon: "📊", required: true,  desc: "Campaign-level spend, impressions, clicks, conversions, revenue" },
  { id: "adgroups",   label: "Ad Group Data",   icon: "📁", required: false, desc: "Ad group breakdown with performance metrics" },
  { id: "ads",        label: "Ads / Creative",  icon: "📝", required: false, desc: "Individual ad performance including headlines & descriptions" },
  { id: "keywords",   label: "Keywords",        icon: "🔑", required: false, desc: "Keyword-level performance, match types, QS" },
  { id: "searches",   label: "Search Terms",    icon: "🔍", required: false, desc: "Search query report for intent and negative keyword analysis" },
  { id: "geo",        label: "Geo / Location",  icon: "🌍", required: false, desc: "Geographic performance breakdown" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const formatMd = (text) => text
  .replace(/^### (.+)$/gm, '<h3 style="font-size:11px;font-weight:700;color:#0a3d0a;margin:14px 0 5px;text-transform:uppercase;letter-spacing:0.08em">$1</h3>')
  .replace(/^## (.+)$/gm, '<h2 style="font-size:16px;font-weight:700;color:#111;margin:20px 0 7px;border-bottom:2px solid #0a3d0a;padding-bottom:6px">$1</h2>')
  .replace(/^# (.+)$/gm, '<h1 style="font-size:21px;font-weight:800;color:#111;margin:22px 0 9px">$1</h1>')
  .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#111;font-weight:700">$1</strong>')
  .replace(/^- (.+)$/gm, '<div style="padding:4px 0 4px 14px;border-left:2px solid #d4e8d4;margin:3px 0;color:#444;font-size:13.5px">$1</div>')
  .replace(/\n\n/g, '<div style="height:9px"></div>');

const readFile = (file) => new Promise((resolve) => {
  const r = new FileReader();
  r.onload = (e) => resolve(e.target.result.trim().slice(0, 6000));
  r.readAsText(file);
});

// ─── STYLES ──────────────────────────────────────────────────────────────────
const G = "#0a3d0a";
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #fff; }
  .tab-btn { transition: all 0.18s; }
  .tab-btn:hover { color: #0a3d0a !important; }
  .tab-btn.active { color: #0a3d0a !important; border-bottom-color: #0a3d0a !important; }
  .mod-card { transition: all 0.16s; cursor: pointer; }
  .mod-card:hover { border-color: #0a3d0a !important; background: #f6fbf6 !important; }
  .mod-card.selected { border-color: #0a3d0a !important; background: #f0f7f0 !important; box-shadow: 0 3px 16px rgba(10,61,10,0.1); }
  .run-btn:hover:not(:disabled) { background: #0c4a0c !important; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(10,61,10,0.25) !important; }
  .file-slot { transition: all 0.16s; cursor: pointer; }
  .file-slot:hover { border-color: #0a3d0a !important; background: #f6fbf6 !important; }
  .file-slot.loaded { border-color: #0a3d0a !important; background: #f0f7f0 !important; border-style: solid !important; }
  .spin { display:inline-block;width:14px;height:14px;border:2px solid #ccc;border-top-color:#0a3d0a;border-radius:50%;animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .fade-in { animation: fadeUp 0.3s ease forwards; }
  @keyframes fadeUp { from { opacity:0;transform:translateY(8px); } to { opacity:1;transform:translateY(0); } }
  .group-label { font-size:10px;font-weight:700;letter-spacing:0.12em;color:#ccc;text-transform:uppercase;margin:18px 0 8px;padding-left:2px; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #f8f8f8; } ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
`;

// ─── RESULT PANEL ─────────────────────────────────────────────────────────────
function ResultPanel({ result, label, onCopy, copied }) {
  return (
    <div className="fade-in" style={{ background: "#fff", border: "1.5px solid #ebebeb", borderRadius: 14, overflow: "hidden", boxShadow: "0 6px 32px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 22px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: G, display: "inline-block" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{label} — Complete</span>
        </div>
        <button onClick={onCopy} style={{ background: "#fff", border: "1px solid #e4e4e4", borderRadius: 6, padding: "5px 14px", fontSize: 12, color: "#666", cursor: "pointer", fontWeight: 500 }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div style={{ padding: "26px 22px", fontSize: 13.5, lineHeight: 1.85, color: "#444", maxHeight: 560, overflowY: "auto", fontWeight: 300 }}
        dangerouslySetInnerHTML={{ __html: formatMd(result) }} />
    </div>
  );
}

// ─── TAB: ANALYSIS ────────────────────────────────────────────────────────────
function AnalysisTab({ apiKey }) {
  const [mod, setMod] = useState(null);
  const [csv, setCsv] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  const loadFile = useCallback((file) => {
    if (!file) return;
    setFileName(file.name);
    readFile(file).then(setCsv);
  }, []);

  const run = async () => {
    if (!apiKey) { setError("Enter your Anthropic API key in the header."); return; }
    if (!csv) { setError("Upload a CSV file first."); return; }
    if (!mod) { setError("Select an analysis module."); return; }
    setError(""); setResult(""); setLoading(true);
    try {
      const m = ANALYSIS_MODULES.find(m => m.id === mod);
      const res = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1800, messages: [{ role: "user", content: m.prompt(csv) }] }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || "API error"); }
      const data = await res.json();
      setResult(data.content[0].text);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const activeMod = ANALYSIS_MODULES.find(m => m.id === mod);
  const groups = [...new Set(ANALYSIS_MODULES.map(m => m.group))];

  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: G, textTransform: "uppercase", background: "#f0f7f0", border: "1px solid #c3dfc3", borderRadius: 20, padding: "3px 12px", marginBottom: 18 }}>
          10 Analysis Modules
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#111", lineHeight: 1.12, marginBottom: 12, letterSpacing: "-0.02em" }}>
          PPC Intelligence.<br />Built for Growth.
        </h1>
        <p style={{ fontSize: 15, color: "#888", fontWeight: 300, maxWidth: 480, lineHeight: 1.7 }}>
          Upload any PPC export and get expert-level analysis, audits, and actionable recommendations.
        </p>
      </div>

      {/* Module grid grouped */}
      {groups.map(group => (
        <div key={group}>
          <div className="group-label">{group}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10, marginBottom: 6 }}>
            {ANALYSIS_MODULES.filter(m => m.group === group).map(m => (
              <button key={m.id} className={`mod-card ${mod === m.id ? "selected" : ""}`}
                onClick={() => { setMod(m.id); setResult(""); setError(""); }}
                style={{ background: "#fafafa", border: "1.5px solid #eaeaea", borderRadius: 12, padding: "18px 16px", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: mod === m.id ? G : "#ccc", textTransform: "uppercase" }}>{m.tag}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, color: mod === m.id ? G : "#e0e0e0" }}>{m.icon}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 5, color: "#111" }}>{m.label}</div>
                <div style={{ fontSize: 11.5, color: "#aaa", lineHeight: 1.55, fontWeight: 400 }}>{m.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Upload + Run */}
      <div style={{ marginTop: 28, marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "stretch", flexWrap: "wrap" }}>
          <div
            onDrop={e => { e.preventDefault(); loadFile(e.dataTransfer.files[0]); }}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current.click()}
            style={{ flex: 1, minWidth: 240, background: csv ? "#f5fbf5" : "#fafafa", border: `1.5px dashed ${csv ? G : "#ddd"}`, borderRadius: 12, padding: "22px 18px", cursor: "pointer", minHeight: 86, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" style={{ display: "none" }} onChange={e => loadFile(e.target.files[0])} />
            {csv ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, background: G, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15 }}>✓</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 2 }}>{fileName}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>{csv.length.toLocaleString()} chars loaded</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, color: "#ddd", marginBottom: 7 }}>↑</div>
                <div style={{ fontSize: 13, color: "#aaa", fontWeight: 500 }}>Drop CSV or click to upload</div>
                <div style={{ fontSize: 11, color: "#ccc", marginTop: 3 }}>Any PPC export — Google Ads, Microsoft, etc.</div>
              </div>
            )}
          </div>
          <button className="run-btn" onClick={run} disabled={loading}
            style={{ background: activeMod ? G : "#f0f0f0", color: activeMod ? "#fff" : "#ccc", border: "none", borderRadius: 12, padding: "0 32px", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", minWidth: 180, minHeight: 86, opacity: loading ? 0.75 : 1, transition: "all 0.2s", boxShadow: activeMod ? "0 4px 14px rgba(10,61,10,0.18)" : "none" }}>
            {loading
              ? <span style={{ display: "flex", alignItems: "center", gap: 9, justifyContent: "center" }}><span className="spin" /> Analysing...</span>
              : <span>Run {activeMod?.label || "Analysis"} →</span>}
          </button>
        </div>
        {error && <div style={{ marginTop: 10, background: "#fff5f5", border: "1px solid #fcc", borderRadius: 7, padding: "9px 14px", fontSize: 12.5, color: "#c00" }}>{error}</div>}
      </div>

      {/* Result */}
      {result && <ResultPanel result={result} label={activeMod?.label} onCopy={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} copied={copied} />}
    </div>
  );
}

// ─── TAB: MONTHLY REPORT ─────────────────────────────────────────────────────
function ReportTab({ apiKey }) {
  const [files, setFiles] = useState({});        // { fileId: { name, content } }
  const [reportType, setReportType] = useState("monthly");
  const [clientName, setClientName] = useState("");
  const [period, setPeriod] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRefs = useRef({});

  const loadFileForSlot = useCallback(async (file, slotId) => {
    if (!file) return;
    const content = await readFile(file);
    setFiles(prev => ({ ...prev, [slotId]: { name: file.name, content } }));
  }, []);

  const removeFile = (slotId) => {
    setFiles(prev => { const n = { ...prev }; delete n[slotId]; return n; });
  };

  const run = async () => {
    if (!apiKey) { setError("Enter your Anthropic API key in the header."); return; }
    const loadedFiles = Object.entries(files);
    if (loadedFiles.length === 0) { setError("Upload at least the campaign data CSV."); return; }
    if (!files.campaigns) { setError("Campaign data is required — please upload it."); return; }

    setError(""); setResult(""); setLoading(true);
    try {
      // Build combined data payload
      const sections = loadedFiles.map(([id, f]) => {
        const slot = REPORT_FILES.find(s => s.id === id);
        return `--- ${slot?.label?.toUpperCase() || id.toUpperCase()} (${f.name}) ---\n${f.content}`;
      }).join("\n\n");

      const prompt = `You are an expert PPC analyst and report writer for VM Consultancy. Produce a professional ${reportType} paid search performance report for ${clientName || "the client"} covering ${period || "the reporting period"}.

You have been provided with the following data:
${sections}

Produce a comprehensive report in this EXACT structure:

# ${clientName || "Client"} | Paid Search ${reportType === "monthly" ? "Monthly" : "Weekly"} Report | ${period || "[Period]"}

## Executive Summary
Write 3-5 sentences covering: overall performance vs prior period, key wins, key concerns, and the #1 recommended action.

## Key Metrics
Present the top-level KPIs in a clear format:
- Revenue / Total Conversions
- Ad Spend (MoM or WoW change)
- ROAS
- Clicks & Impressions
- CPC, CTR, Conv. Rate
- Quality Score (if available)
- Impression Share (if available)

## ${reportType === "monthly" ? "3-Month" : "4-Week"} Trend
Show the most important metrics across the last ${reportType === "monthly" ? "3 months" : "4 weeks"} in a markdown table. If you only have one period of data, note that and present what's available.

## Campaign Performance Breakdown
For each campaign: Spend | Clicks | Conversions | Revenue | ROAS | CPA | Key Observation

${files.adgroups ? "## Ad Group Analysis\nTop and bottom performing ad groups with actionable insight.\n" : ""}
${files.keywords ? "## Keyword Performance\nTop performing keywords, low QS keywords to address, and keyword-level recommendations.\n" : ""}
${files.searches ? "## Search Term Insights\nTop intent themes from search queries, recommended new negatives, potential new keyword opportunities.\n" : ""}
${files.geo ? "## Geographic Performance\nTop and bottom markets, bid adjustment recommendations.\n" : ""}
${files.ads ? "## Ad Creative Performance\nTop and bottom performing ads/headlines, creative recommendations.\n" : ""}

## Quality Score Summary
If QS data is available, show distribution and click-weighted average. Flag any keywords below QS 6.

## Next Steps
List 5-7 specific, prioritised actions for the next ${reportType === "monthly" ? "month" : "week"} in this format:
**Priority [1-7]: [Action Title]**
[One sentence describing exactly what to do and expected impact]

Use markdown formatting throughout. Be specific with numbers from the data. Write in a confident, professional tone consistent with a senior PPC consultant.`;

      const res = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2500, messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || "API error"); }
      const data = await res.json();
      setResult(data.content[0].text);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const uploadedCount = Object.keys(files).length;

  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: G, textTransform: "uppercase", background: "#f0f7f0", border: "1px solid #c3dfc3", borderRadius: 20, padding: "3px 12px", marginBottom: 18 }}>
          Multi-Source Report Builder
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#111", lineHeight: 1.12, marginBottom: 12, letterSpacing: "-0.02em" }}>
          Monthly & Weekly<br />Performance Reports.
        </h1>
        <p style={{ fontSize: 15, color: "#888", fontWeight: 300, maxWidth: 520, lineHeight: 1.7 }}>
          Upload your campaign exports across multiple dimensions. The more data you provide, the richer the report.
        </p>
      </div>

      {/* Report config */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
        <div style={{ flex: "0 0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#bbb", textTransform: "uppercase", marginBottom: 7 }}>Report Type</div>
          <div style={{ display: "flex", gap: 0, border: "1px solid #e4e4e4", borderRadius: 8, overflow: "hidden" }}>
            {["monthly", "weekly"].map(t => (
              <button key={t} onClick={() => setReportType(t)}
                style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, background: reportType === t ? G : "#fff", color: reportType === t ? "#fff" : "#888", border: "none", cursor: "pointer", textTransform: "capitalize" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#bbb", textTransform: "uppercase", marginBottom: 7 }}>Client Name</div>
          <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Namecheap"
            style={{ width: "100%", background: "#fafafa", border: "1px solid #e4e4e4", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#111", outline: "none" }} />
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#bbb", textTransform: "uppercase", marginBottom: 7 }}>Period</div>
          <input value={period} onChange={e => setPeriod(e.target.value)} placeholder="e.g. January 2026"
            style={{ width: "100%", background: "#fafafa", border: "1px solid #e4e4e4", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#111", outline: "none" }} />
        </div>
      </div>

      {/* File upload slots */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#bbb", textTransform: "uppercase", marginBottom: 12 }}>
          Data Sources — {uploadedCount}/{REPORT_FILES.length} uploaded {uploadedCount > 0 && `· Campaign data ${files.campaigns ? "✓" : "missing"}`}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
          {REPORT_FILES.map(slot => {
            const loaded = files[slot.id];
            return (
              <div key={slot.id} className={`file-slot ${loaded ? "loaded" : ""}`}
                style={{ border: `1.5px dashed ${loaded ? G : "#ddd"}`, borderRadius: 11, padding: "14px 16px", position: "relative" }}
                onClick={() => !loaded && fileRefs.current[slot.id]?.click()}>
                <input ref={el => fileRefs.current[slot.id] = el} type="file" accept=".csv,.tsv,.txt" style={{ display: "none" }}
                  onChange={e => loadFileForSlot(e.target.files[0], slot.id)} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 18, lineHeight: 1.1, marginTop: 1 }}>{slot.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{slot.label}</span>
                      {slot.required && <span style={{ fontSize: 9, fontWeight: 700, color: G, background: "#f0f7f0", border: "1px solid #c3dfc3", borderRadius: 10, padding: "1px 6px", letterSpacing: "0.06em" }}>REQUIRED</span>}
                    </div>
                    {loaded ? (
                      <div style={{ fontSize: 11.5, color: G, fontWeight: 500 }}>
                        ✓ {loaded.name}
                        <button onClick={e => { e.stopPropagation(); removeFile(slot.id); }}
                          style={{ marginLeft: 8, background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 13, lineHeight: 1 }}>×</button>
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: "#bbb" }}>{slot.desc}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Run button */}
      <div style={{ marginTop: 24, marginBottom: 32 }}>
        <button className="run-btn" onClick={run} disabled={loading}
          style={{ background: uploadedCount > 0 ? G : "#f0f0f0", color: uploadedCount > 0 ? "#fff" : "#ccc", border: "none", borderRadius: 12, padding: "14px 40px", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, transition: "all 0.2s", boxShadow: uploadedCount > 0 ? "0 4px 14px rgba(10,61,10,0.18)" : "none" }}>
          {loading
            ? <span style={{ display: "flex", alignItems: "center", gap: 9 }}><span className="spin" /> Generating report...</span>
            : `Generate ${reportType === "monthly" ? "Monthly" : "Weekly"} Report →`}
        </button>
        {error && <div style={{ marginTop: 10, background: "#fff5f5", border: "1px solid #fcc", borderRadius: 7, padding: "9px 14px", fontSize: 12.5, color: "#c00", display: "inline-block", marginLeft: 12 }}>{error}</div>}
      </div>

      {/* Result */}
      {result && <ResultPanel result={result} label={`${clientName || "Client"} ${reportType === "monthly" ? "Monthly" : "Weekly"} Report`} onCopy={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} copied={copied} />}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("analysis");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [keyError, setKeyError] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#111", fontFamily: "'DM Sans', Helvetica, Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Header ── */}
      <header style={{ borderBottom: "1px solid #ebebeb", background: "#fff", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "13px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={VM_LOGO} alt="VM" style={{ width: 36, height: 36, borderRadius: 7, objectFit: "cover", background: G }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: "-0.01em" }}>VM Consultancy</div>
              <div style={{ fontSize: 9.5, color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase" }}>PPC Intelligence</div>
            </div>
          </div>
          {/* API Key */}
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            {!saved ? (
              <>
                <input type="password" placeholder="sk-ant-... API Key" value={apiKey}
                  onChange={e => { setApiKey(e.target.value); setKeyError(""); }}
                  onKeyDown={e => e.key === "Enter" && apiKey.startsWith("sk-") && setSaved(true)}
                  style={{ background: "#f8f8f8", border: `1px solid ${keyError ? "#fcc" : "#e4e4e4"}`, borderRadius: 8, padding: "7px 12px", color: "#111", fontSize: 12.5, width: 210, outline: "none" }} />
                <button onClick={() => apiKey.startsWith("sk-") ? setSaved(true) : setKeyError("Invalid key")}
                  style={{ background: G, color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
                  Connect
                </button>
                {keyError && <span style={{ fontSize: 11.5, color: "#c00" }}>{keyError}</span>}
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#f0f7f0", border: "1px solid #c3dfc3", borderRadius: 8, padding: "7px 14px", fontSize: 12.5, color: G, fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: G, display: "inline-block" }} />
                API Connected
                <button onClick={() => { setSaved(false); setApiKey(""); }} style={{ background: "none", border: "none", color: "#bbb", cursor: "pointer", fontSize: 15, paddingLeft: 7, lineHeight: 1 }}>×</button>
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px", display: "flex", gap: 0, borderTop: "1px solid #f0f0f0" }}>
          {[
            { id: "analysis", label: "Analysis" },
            { id: "reports",  label: "Reports" },
          ].map(t => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
              style={{ padding: "11px 22px", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? G : "#999", background: "none", border: "none", borderBottom: `2px solid ${tab === t.id ? G : "transparent"}`, cursor: "pointer", letterSpacing: "0.01em" }}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 28px 80px", width: "100%", flex: 1 }}>
        {tab === "analysis" && <AnalysisTab apiKey={apiKey} />}
        {tab === "reports"  && <ReportTab apiKey={apiKey} />}
      </main>

      <footer style={{ borderTop: "1px solid #f0f0f0", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 11.5, color: "#ccc" }}>© VM Consultancy 2025 · PPC Intelligence</div>
        <div style={{ fontSize: 11.5, color: "#ccc" }}>Powered by Claude AI</div>
      </footer>
    </div>
  );
}
