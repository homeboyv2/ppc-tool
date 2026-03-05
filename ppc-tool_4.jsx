import { useState, useRef, useCallback } from "react";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const VM_LOGO = "data:image/png;base64,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";

const MODULES = [
  {
    id: "report", label: "Performance Report", icon: "01", tag: "ANALYSIS",
    desc: "Weekly & monthly campaign reports with narrative analysis and strategic recommendations.",
    prompt: (csv) => `You are an expert PPC analyst. Analyze this Google Ads / PPC campaign CSV data and produce a professional performance report.\n\nCSV Data:\n${csv}\n\nProduce a structured report with:\n1. EXECUTIVE SUMMARY (3-4 sentences, key wins and concerns)\n2. PERFORMANCE HIGHLIGHTS (top metrics, period changes with % differences)\n3. ANOMALIES & ALERTS (anything unusual — spikes, drops, budget pacing issues)\n4. CAMPAIGN BREAKDOWN (per campaign: spend, clicks, conversions, CPA, ROAS if available)\n5. STRATEGIC RECOMMENDATIONS (3-5 specific, actionable next steps with expected impact)\n\nBe specific with numbers from the data. Write in a confident, expert tone. Format with clear sections using markdown headers.`,
  },
  {
    id: "audit", label: "Campaign Audit", icon: "02", tag: "AUDIT",
    desc: "Full structural audit with health score, prioritized issues, and quick wins.",
    prompt: (csv) => `You are a senior PPC auditor. Perform a comprehensive audit of this campaign data.\n\nCSV Data:\n${csv}\n\nProduce a structured audit with:\n1. AUDIT SCORE (overall account health score out of 100 with brief justification)\n2. CRITICAL ISSUES (severity: HIGH) — problems costing money or limiting performance right now\n3. STRUCTURAL ISSUES (severity: MEDIUM) — setup problems that need fixing\n4. OPTIMIZATION OPPORTUNITIES (severity: LOW) — improvements for better performance\n5. QUICK WINS (top 3 things to fix this week for immediate impact)\n\nFor each issue: describe the problem, why it matters, and exactly how to fix it.`,
  },
  {
    id: "optimize", label: "Optimization Engine", icon: "03", tag: "OPTIMIZATION",
    desc: "Prioritized optimization plan with budget shifts, keyword actions, and 30-day roadmap.",
    prompt: (csv) => `You are a PPC optimization specialist. Analyze this campaign data and produce a prioritized optimization plan.\n\nCSV Data:\n${csv}\n\nProduce:\n1. PRIORITY MATRIX — rank all recommendations by: Impact (High/Med/Low) x Effort (High/Med/Low)\n2. BUDGET OPTIMIZATION — where to shift budget, what to pause, what to scale\n3. KEYWORD ACTIONS — specific keywords to pause, add as negatives, bid up/down with reasoning\n4. BID STRATEGY RECOMMENDATIONS — current vs recommended approach\n5. 30-DAY ACTION PLAN — week by week what to do\n\nBe hyper-specific. Reference actual campaign names, keywords, and numbers from the data.`,
  },
  {
    id: "competitor", label: "Competitor Analysis", icon: "04", tag: "INTELLIGENCE",
    desc: "Competitive landscape, impression share gaps, and counter-strategy recommendations.",
    prompt: (csv) => `You are a PPC competitive intelligence analyst. Analyze this auction insights or keyword data.\n\nCSV Data:\n${csv}\n\nProduce:\n1. COMPETITIVE LANDSCAPE — who are the main competitors, their estimated presence/aggression\n2. IMPRESSION SHARE GAPS — where you're losing and to whom\n3. POSITIONING OPPORTUNITIES — keywords/segments competitors are ignoring\n4. THREAT ASSESSMENT — competitors gaining ground, new entrants\n5. COUNTER-STRATEGY — specific tactics to outmaneuver top competitors`,
  },
];

const formatMd = (text) => text
  .replace(/^### (.+)$/gm, '<h3 style="font-size:12px;font-weight:700;color:#0a3d0a;margin:16px 0 6px;text-transform:uppercase;letter-spacing:0.06em">$1</h3>')
  .replace(/^## (.+)$/gm, '<h2 style="font-size:17px;font-weight:700;color:#111;margin:22px 0 8px;border-bottom:2px solid #0a3d0a;padding-bottom:7px">$1</h2>')
  .replace(/^# (.+)$/gm, '<h1 style="font-size:22px;font-weight:800;color:#111;margin:24px 0 10px">$1</h1>')
  .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#111;font-weight:700">$1</strong>')
  .replace(/^- (.+)$/gm, '<div style="padding:5px 0 5px 14px;border-left:2px solid #d4e8d4;margin:4px 0;color:#444;font-size:14px">$1</div>')
  .replace(/\n\n/g, '<div style="height:10px"></div>');

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
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
    const r = new FileReader();
    r.onload = (e) => setCsv(e.target.result.trim().slice(0, 8000));
    r.readAsText(file);
  }, []);

  const run = async () => {
    if (!apiKey) { setError("Please enter your Anthropic API key."); return; }
    if (!csv) { setError("Please upload a CSV file."); return; }
    if (!mod) { setError("Please select an analysis module."); return; }
    setError(""); setResult(""); setLoading(true);
    try {
      const m = MODULES.find(m => m.id === mod);
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

  const activeMod = MODULES.find(m => m.id === mod);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#111", fontFamily: "'DM Sans', Helvetica, Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .mod-card:hover { background: #f4f9f4 !important; border-color: #0a3d0a !important; }
        .run-btn:hover:not(:disabled) { background: #0c4a0c !important; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(10,61,10,0.25) !important; }
        .spin { display:inline-block;width:15px;height:15px;border:2px solid #ccc;border-top-color:#0a3d0a;border-radius:50%;animation:spin .7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .fade-in { animation: fadeUp 0.35s ease forwards; }
        @keyframes fadeUp { from { opacity:0;transform:translateY(10px); } to { opacity:1;transform:translateY(0); } }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #ebebeb", background: "#fff", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={VM_LOGO} alt="VM" style={{ width: 38, height: 38, borderRadius: 7, objectFit: "cover", background: "#0a3d0a" }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: "-0.01em" }}>VM Consultancy</div>
              <div style={{ fontSize: 10, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase" }}>PPC Intelligence</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!saved ? (
              <>
                <input type="password" placeholder="sk-ant-... API Key" value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && apiKey.startsWith("sk-") && setSaved(true)}
                  style={{ background: "#f8f8f8", border: "1px solid #e4e4e4", borderRadius: 8, padding: "8px 14px", color: "#111", fontSize: 13, width: 230, outline: "none" }} />
                <button onClick={() => apiKey.startsWith("sk-") ? setSaved(true) : setError("Invalid API key format")}
                  style={{ background: "#0a3d0a", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
                  Connect
                </button>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0f7f0", border: "1px solid #c3dfc3", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#0a3d0a", fontWeight: 600 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#0a3d0a", display: "inline-block" }} />
                API Connected
                <button onClick={() => { setSaved(false); setApiKey(""); }} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16, paddingLeft: 8, lineHeight: 1 }}>×</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 32px 80px", width: "100%", flex: 1 }}>

        {/* Hero */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#0a3d0a", textTransform: "uppercase", background: "#f0f7f0", border: "1px solid #c3dfc3", borderRadius: 20, padding: "4px 14px", marginBottom: 22 }}>
            AI-Powered Analysis
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 800, color: "#111", lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.02em" }}>
            PPC Intelligence.<br />Built for Growth.
          </h1>
          <p style={{ fontSize: 17, color: "#777", fontWeight: 300, maxWidth: 500, lineHeight: 1.7 }}>
            Upload any PPC export and get expert-level analysis, audits, and actionable recommendations — powered by Claude AI.
          </p>
        </div>

        {/* Modules */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#bbb", textTransform: "uppercase", marginBottom: 18 }}>Select Analysis Type</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {MODULES.map(m => (
              <button key={m.id} className="mod-card"
                onClick={() => { setMod(m.id); setResult(""); setError(""); }}
                style={{
                  background: mod === m.id ? "#f0f7f0" : "#fafafa",
                  border: `1.5px solid ${mod === m.id ? "#0a3d0a" : "#eaeaea"}`,
                  borderRadius: 14, padding: "22px 20px", cursor: "pointer", textAlign: "left",
                  transition: "all 0.18s", boxShadow: mod === m.id ? "0 4px 20px rgba(10,61,10,0.1)" : "none",
                }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: mod === m.id ? "#0a3d0a" : "#ccc", textTransform: "uppercase" }}>{m.tag}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: mod === m.id ? "#0a3d0a" : "#ddd" }}>{m.icon}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 7, color: "#111" }}>{m.label}</div>
                <div style={{ fontSize: 12, color: "#999", lineHeight: 1.6, fontWeight: 400 }}>{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload + Run */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "stretch", flexWrap: "wrap" }}>
            <div
              onDrop={e => { e.preventDefault(); loadFile(e.dataTransfer.files[0]); }}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current.click()}
              style={{
                flex: 1, minWidth: 260,
                background: csv ? "#f5fbf5" : "#fafafa",
                border: `1.5px dashed ${csv ? "#0a3d0a" : "#ddd"}`,
                borderRadius: 14, padding: "26px 22px", cursor: "pointer",
                minHeight: 96, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
              <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" style={{ display: "none" }} onChange={e => loadFile(e.target.files[0])} />
              {csv ? (
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 38, height: 38, background: "#0a3d0a", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 17, flexShrink: 0 }}>✓</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, color: "#111" }}>{fileName}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>{csv.length.toLocaleString()} characters loaded</div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26, marginBottom: 8, color: "#ccc" }}>↑</div>
                  <div style={{ fontSize: 14, color: "#999", marginBottom: 4, fontWeight: 500 }}>Drop your CSV here or click to upload</div>
                  <div style={{ fontSize: 12, color: "#ccc" }}>Google Ads, Microsoft Ads, any PPC export</div>
                </div>
              )}
            </div>

            <button className="run-btn" onClick={run} disabled={loading}
              style={{
                background: activeMod ? "#0a3d0a" : "#f0f0f0",
                color: activeMod ? "#fff" : "#ccc",
                border: "none", borderRadius: 14,
                padding: "0 36px", fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                minWidth: 200, minHeight: 96,
                opacity: loading ? 0.75 : 1,
                transition: "all 0.2s",
                boxShadow: activeMod ? "0 4px 16px rgba(10,61,10,0.2)" : "none",
              }}>
              {loading
                ? <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}><span className="spin" /> Analysing...</span>
                : <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>Run {activeMod?.label || "Analysis"} →</span>}
            </button>
          </div>

          {error && <div style={{ marginTop: 12, background: "#fff5f5", border: "1px solid #fcc", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#c00" }}>{error}</div>}
        </div>

        {/* Result */}
        {result && (
          <div className="fade-in" style={{ background: "#fff", border: "1.5px solid #ebebeb", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 26px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0a3d0a" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{activeMod?.label} — Complete</span>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ background: "#fff", border: "1px solid #e4e4e4", borderRadius: 7, padding: "6px 16px", fontSize: 12, color: "#666", cursor: "pointer", fontWeight: 500, transition: "all 0.15s" }}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <div style={{ padding: "30px 26px", fontSize: 14, lineHeight: 1.9, color: "#444", maxHeight: 600, overflowY: "auto", fontWeight: 300 }}
              dangerouslySetInnerHTML={{ __html: formatMd(result) }} />
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div style={{ borderTop: "1px solid #f4f4f4", paddingTop: 52, display: "flex", gap: 36, flexWrap: "wrap" }}>
            {["Upload a CSV from Google Ads, Microsoft Ads, or any PPC platform", "Select the type of analysis you need", "Get expert-level insights and recommendations in seconds"].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: "1 1 200px" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#f5fbf5", border: "1.5px solid #c3dfc3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#0a3d0a", flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                <div style={{ fontSize: 14, color: "#999", lineHeight: 1.7, fontWeight: 300, paddingTop: 5 }}>{s}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #f0f0f0", padding: "22px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 12, color: "#ccc" }}>© VM Consultancy 2025 · PPC Intelligence</div>
        <div style={{ fontSize: 12, color: "#ccc" }}>Powered by Claude AI</div>
      </footer>
    </div>
  );
}
