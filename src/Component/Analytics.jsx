import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Analytics.css";

const BASE_URL = "https://ai-business-chat-saas-backend.onrender.com";

const navItems = [
  { id: "dashboard",     label: "Dashboard",     path: "/dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { id: "conversations", label: "Conversations", path: "/conversations",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { id: "ai",            label: "AI Assistant",  path: "/dashboard/ai",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> },
  { id: "widget",        label: "Widget",        path: "/dashboard/widget",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { id: "customers",     label: "Customers",     path: "/dashboard/customers",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: "analytics",     label: "Analytics",     path: "/dashboard/analytics",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { id: "settings",      label: "Settings",      path: "/dashboard/settings",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  { id: "billing",       label: "Billing",       path: "/under-construction",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
];

const RANGES = ["Last 7 days", "Last 30 days", "Last 90 days"];

const getInitials = (n = "") => n.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "?";

/* ── detect topic keywords in message text ── */
const detectTopic = (text = "") => {
  const t = text.toLowerCase();
  if (t.match(/price|pricing|cost|plan|upgrade|subscription|fee|pay/))   return "Pricing";
  if (t.match(/integrat|connect|shopify|zapier|api|webhook|install/))     return "Integration";
  if (t.match(/bill|invoice|charge|refund|payment|credit/))               return "Billing";
  if (t.match(/bug|error|broken|crash|issue|problem|fail|500|not work/))  return "Bug Report";
  if (t.match(/feature|request|suggest|idea|would like|can you add/))     return "Feature Request";
  if (t.match(/password|login|account|sign|access|permission/))           return "Account";
  if (t.match(/how|help|guide|tutorial|doc|setup|start/))                 return "How-To";
  return "General";
};

const Analytics = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [workspace,   setWorkspace  ] = useState(null);
  const [convos,      setConvos     ] = useState([]);
  const [loading,     setLoading    ] = useState(true);
  const [range,       setRange      ] = useState("Last 7 days");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeId = "analytics";

  /* ── Fetch ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAll = async () => {
      try {
        const [wsRes, convRes] = await Promise.all([
          fetch(`${BASE_URL}/api/workspaces/me`,    { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/api/ai/conversations`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const wsData   = await wsRes.json();
        const convData = await convRes.json();
        if (!wsRes.ok)   throw new Error(wsData.message);
        if (!convRes.ok) throw new Error(convData.message);
        setWorkspace(wsData);
        setConvos(Array.isArray(convData) ? convData : []);
      } catch (err) {
        toast.error(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  /* ── Filter by range ── */
  const daysBack = range === "Last 7 days" ? 7 : range === "Last 30 days" ? 30 : 90;
  const cutoff   = new Date(Date.now() - daysBack * 86400000);
  const filtered = convos.filter(c => new Date(c.createdAt) >= cutoff);

  /* ── Derived stats ── */
  const total      = filtered.length;
  const aiHandled  = filtered.filter(c => c.messages?.some(m => m.sender === "ai")).length;
  const humanHandled = filtered.filter(c => c.messages?.some(m => m.sender === "agent")).length;
  const aiRate     = total > 0 ? ((aiHandled / total) * 100).toFixed(1) : "0.0";
  const totalMsgs  = filtered.reduce((s, c) => s + (c.messages?.length || 0), 0);
  const openCount  = filtered.filter(c => c.status === "open" || c.status === "ai").length;
  const closedCount= filtered.filter(c => c.status === "closed").length;

  /* ── Build daily volume chart data ── */
  const buildDailyData = () => {
    const days = []; const counts = []; const aiCounts = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const label = daysBack <= 7
        ? d.toLocaleDateString("en", { month: "short", day: "numeric" })
        : daysBack <= 30
          ? d.toLocaleDateString("en", { month: "short", day: "numeric" })
          : d.toLocaleDateString("en", { month: "short", day: "numeric" });
      const ds = d.toDateString();
      const dayConvos = filtered.filter(c => new Date(c.createdAt).toDateString() === ds);
      days.push(label);
      counts.push(dayConvos.length);
      aiCounts.push(dayConvos.filter(c => c.messages?.some(m => m.sender === "ai")).length);
    }
    return { days, counts, aiCounts };
  };
  const { days, counts, aiCounts } = buildDailyData();

  /* ── Topic detection from all messages ── */
  const topicMap = {};
  filtered.forEach(c => {
    c.messages?.forEach(m => {
      if (m.sender === "customer") {
        const topic = detectTopic(m.text);
        topicMap[topic] = (topicMap[topic] || 0) + 1;
      }
    });
  });
  const topics = Object.entries(topicMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxTopic = topics[0]?.[1] || 1;

  /* ── SVG area chart ── */
  const VolumeChart = () => {
    if (days.length === 0) return null;
    const W = 640, H = 200, PAD = { t: 16, r: 16, b: 36, l: 40 };
    const maxVal = Math.max(...counts, 1);
    const x = (i) => PAD.l + (i / (days.length - 1)) * (W - PAD.l - PAD.r);
    const y = (v) => PAD.t + (1 - v / maxVal) * (H - PAD.t - PAD.b);
    const pathD = (data) => data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
    const areaD = (data) => `${pathD(data)} L${x(days.length-1)},${H-PAD.b} L${x(0)},${H-PAD.b} Z`;
    const gridVals = [0, Math.round(maxVal*0.25), Math.round(maxVal*0.5), Math.round(maxVal*0.75), maxVal];
    /* show fewer x-axis labels if many days */
    const showLabel = (i) => {
      if (days.length <= 7)  return true;
      if (days.length <= 30) return i % 5 === 0 || i === days.length - 1;
      return i % 15 === 0 || i === days.length - 1;
    };
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="an__chart-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.02"/>
          </linearGradient>
          <linearGradient id="aiGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b4ef5" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#5b4ef5" stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {gridVals.map(v => (
          <g key={v}>
            <line x1={PAD.l} y1={y(v)} x2={W-PAD.r} y2={y(v)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3"/>
            <text x={PAD.l-6} y={y(v)+4} textAnchor="end" fontSize="10" fill="#9ca3af">{v}</text>
          </g>
        ))}
        <path d={areaD(counts)}   fill="url(#totalGrad)"/>
        <path d={areaD(aiCounts)} fill="url(#aiGrad2)"/>
        <path d={pathD(counts)}   fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        <path d={pathD(aiCounts)} fill="none" stroke="#5b4ef5" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        {days.map((d, i) => showLabel(i) && (
          <text key={d} x={x(i)} y={H-6} textAnchor="middle" fontSize="10" fill="#9ca3af">{d}</text>
        ))}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="an__loading">
        <div className="an__spinner"/>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const ownerName      = workspace?.owner?.name || "User";
  const ownerInitials  = getInitials(ownerName);
  const companyInitial = (workspace?.companyName || "A")[0].toUpperCase();

  return (
    <div className="an">

      {/* ══ SIDEBAR ══ */}
      <aside className={`an__sidebar${sidebarOpen ? " an__sidebar--open" : ""}`}>
        <div className="an__workspace">
          <div className="an__workspace-icon">{companyInitial}</div>
          <div className="an__workspace-info">
            <span className="an__workspace-name">{workspace?.companyName || "My Company"}</span>
            <span className="an__workspace-plan">Growth Plan</span>
          </div>
          <button className="an__workspace-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        <nav className="an__nav">
          {navItems.map(item => (
            <Link key={item.id} to={item.path}
              className={`an__nav-item${activeId === item.id ? " an__nav-item--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="an__nav-icon">{item.icon}</span>
              <span className="an__nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="an__user">
          <div className="an__user-avatar">{ownerInitials}</div>
          <div className="an__user-info">
            <span className="an__user-name">{ownerName}</span>
            <span className="an__user-email">{workspace?.owner?.email || ""}</span>
          </div>
          <button className="an__logout-btn" onClick={handleLogout} title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="an__overlay" onClick={() => setSidebarOpen(false)}/>}

      {/* ══ BODY ══ */}
      <div className="an__body">

        {/* TOPBAR */}
        <header className="an__topbar">
          <button className="an__hamburger" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="an__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search conversations, customers, or settings..." className="an__search-input" readOnly/>
            <div className="an__search-kbd"><span>⌘</span><span>K</span></div>
          </div>
          <div className="an__topbar-right">
            <div className="an__trial">Trial: <strong>12 days left</strong>
              <Link to="/under-construction" className="an__upgrade">Upgrade</Link>
            </div>
            <button className="an__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="an__icon-dot"/>
            </button>
            <button className="an__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="an__main">

          {/* Page head */}
          <div className="an__page-head">
            <div>
              <h1 className="an__page-title">Analytics</h1>
              <p className="an__page-sub">Measure your team and AI performance.</p>
            </div>
            <div className="an__range-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <select className="an__range-select" value={range} onChange={e => setRange(e.target.value)}>
                {RANGES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* ── Stat cards — all real ── */}
          <div className="an__stats">
            <div className="an__stat-card">
              <p className="an__stat-label">Total Conversations</p>
              <p className="an__stat-value">{total.toLocaleString()}</p>
              <p className="an__stat-sub">{openCount} open · {closedCount} closed</p>
            </div>
            <div className="an__stat-card">
              <p className="an__stat-label">AI Resolution Rate</p>
              <p className="an__stat-value">{aiRate}%</p>
              <p className="an__stat-sub">{aiHandled} AI · {humanHandled} human</p>
            </div>
            <div className="an__stat-card">
              <p className="an__stat-label">Total Messages</p>
              <p className="an__stat-value">{totalMsgs.toLocaleString()}</p>
              <p className="an__stat-sub">
                Avg {total > 0 ? (totalMsgs / total).toFixed(1) : 0} per conversation
              </p>
            </div>
          </div>

          {/* ── Charts row ── */}
          <div className="an__charts-row">

            {/* Conversation Volume */}
            <div className="an__chart-card an__chart-card--wide">
              <div className="an__chart-head">
                <h2 className="an__chart-title">Conversation Volume</h2>
                <div className="an__chart-legend">
                  <span className="an__legend-item"><span className="an__legend-dot an__legend-dot--gray"/>Total</span>
                  <span className="an__legend-item"><span className="an__legend-dot an__legend-dot--purple"/>AI Handled</span>
                </div>
              </div>
              {total === 0 ? (
                <div className="an__chart-empty">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  <p>No data yet for this period</p>
                </div>
              ) : (
                <div className="an__chart-wrap"><VolumeChart/></div>
              )}
            </div>

            {/* Top Topics */}
            <div className="an__chart-card an__chart-card--narrow">
              <div className="an__chart-head">
                <h2 className="an__chart-title">Top Topics (AI Detected)</h2>
              </div>
              {topics.length === 0 ? (
                <div className="an__chart-empty">
                  <p>No messages to analyze yet</p>
                </div>
              ) : (
                <div className="an__topics">
                  {topics.map(([topic, count]) => (
                    <div key={topic} className="an__topic-row">
                      <span className="an__topic-label">{topic}</span>
                      <div className="an__topic-bar-wrap">
                        <div
                          className="an__topic-bar"
                          style={{ width: `${(count / maxTopic) * 100}%` }}
                        />
                      </div>
                      <span className="an__topic-count">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

      
          <div className="an__breakdown-card">
            <h2 className="an__chart-title" style={{ marginBottom: 20 }}>AI vs Human Breakdown</h2>
            {total === 0 ? (
              <div className="an__chart-empty"><p>No conversations in this period</p></div>
            ) : (
              <div className="an__breakdown">
                <div className="an__breakdown-bar-wrap">
                  <div className="an__breakdown-bar">
                    <div
                      className="an__breakdown-segment an__breakdown-segment--ai"
                      style={{ width: `${(aiHandled / total) * 100}%` }}
                      title={`AI: ${aiHandled}`}
                    />
                    <div
                      className="an__breakdown-segment an__breakdown-segment--human"
                      style={{ width: `${(humanHandled / total) * 100}%` }}
                      title={`Human: ${humanHandled}`}
                    />
                  </div>
                </div>
                <div className="an__breakdown-legend">
                  <div className="an__breakdown-item">
                    <span className="an__breakdown-dot an__breakdown-dot--ai"/>
                    <span className="an__breakdown-text">AI Handled</span>
                    <strong>{aiHandled}</strong>
                    <span className="an__breakdown-pct">({aiRate}%)</span>
                  </div>
                  <div className="an__breakdown-item">
                    <span className="an__breakdown-dot an__breakdown-dot--human"/>
                    <span className="an__breakdown-text">Human Handled</span>
                    <strong>{humanHandled}</strong>
                    <span className="an__breakdown-pct">({total > 0 ? ((humanHandled/total)*100).toFixed(1) : 0}%)</span>
                  </div>
                  <div className="an__breakdown-item">
                    <span className="an__breakdown-dot an__breakdown-dot--open"/>
                    <span className="an__breakdown-text">Still Open</span>
                    <strong>{openCount}</strong>
                    <span className="an__breakdown-pct">({total > 0 ? ((openCount/total)*100).toFixed(1) : 0}%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Analytics;