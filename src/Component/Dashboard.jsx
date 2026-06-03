import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Dashboard.css";

const navItems = [
  {
    id: "dashboard", label: "Dashboard", path: "/dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    id: "conversations", label: "Conversations", path: "/conversations",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    id: "ai", label: "AI Assistant", path: "/dashboard/ai",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
  },
  {
    id: "widget", label: "Widget", path: "/dashboard/widget",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
  {
    id: "customers", label: "Customers", path: "/dashboard/customers",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    id: "analytics", label: "Analytics", path: "/dashboard/analytics",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    id: "settings", label: "Settings", path: "/under-construction",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  },
  {
    id: "billing", label: "Billing", path: "/under-construction",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
];

/* ── helpers ── */
const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/* ── Pure SVG area chart from real data ── */
const MiniChart = ({ days, aiCounts, humanCounts }) => {
  if (!days || days.length === 0) return null;
  const W = 660, H = 220, PAD = { t: 16, r: 16, b: 36, l: 36 };
  const cols  = days.length;
  const maxVal = Math.max(...aiCounts, ...humanCounts, 1);
  const x = (i) => PAD.l + (i / (cols - 1)) * (W - PAD.l - PAD.r);
  const y = (v) => PAD.t + (1 - v / maxVal) * (H - PAD.t - PAD.b);
  const pathD = (data) => data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const areaD = (data) => `${pathD(data)} L${x(cols-1)},${H-PAD.b} L${x(0)},${H-PAD.b} Z`;
  const gridVals = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), maxVal];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="db__chart-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b4ef5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#5b4ef5" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="humanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {gridVals.map((v) => (
        <g key={v}>
          <line x1={PAD.l} y1={y(v)} x2={W-PAD.r} y2={y(v)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3" />
          <text x={PAD.l-6} y={y(v)+4} textAnchor="end" fontSize="11" fill="#9ca3af">{v}</text>
        </g>
      ))}
      <path d={areaD(humanCounts)} fill="url(#humanGrad)" />
      <path d={areaD(aiCounts)}    fill="url(#aiGrad)" />
      <path d={pathD(humanCounts)} fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={pathD(aiCounts)}    fill="none" stroke="#5b4ef5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {days.map((d, i) => (
        <text key={d} x={x(i)} y={H-6} textAnchor="middle" fontSize="12" fill="#9ca3af">{d}</text>
      ))}
    </svg>
  );
};

/* ══════════════════════════════════════
   DASHBOARD COMPONENT
══════════════════════════════════════ */
const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [workspace,     setWorkspace    ] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading,       setLoading      ] = useState(true);
  const [sidebarOpen,   setSidebarOpen  ] = useState(false);
  const [chartRange,    setChartRange   ] = useState("Last 7 days");

  const activeId = navItems.find(n => location.pathname === n.path)?.id || "dashboard";
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* ── Fetch all data ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAll = async () => {
      try {
        const [wsRes, convRes] = await Promise.all([
          fetch("https://ai-business-chat-saas-backend.onrender.com/api/workspaces/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://ai-business-chat-saas-backend.onrender.com/api/ai/conversations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const wsData   = await wsRes.json();
        const convData = await convRes.json();
        if (!wsRes.ok)   throw new Error(wsData.message);
        if (!convRes.ok) throw new Error(convData.message);
        setWorkspace(wsData);
        setConversations(Array.isArray(convData) ? convData : []);
      } catch (err) {
        toast.error(err.message || "Failed to load dashboard");
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

  /* ── Copy widget ── */
  const widgetCode = `<script\n  src="https://ai-business-chat-saas-backend.onrender.com/widget.js"\n  data-token="${workspace?.widgetToken}">\n</script>`;
  const copyWidget = () => {
    navigator.clipboard.writeText(widgetCode);
    toast.success("Widget code copied! ✅");
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="db__loading">
        <div className="db__loading-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  /* ── Derived real stats from conversations ── */
  const totalConvos     = conversations.length;
  const aiHandled       = conversations.filter(c => c.messages?.some(m => m.sender === "ai")).length;
  const humanHandled    = conversations.filter(c => c.messages?.some(m => m.sender === "agent")).length;
  const aiResolutionRate = totalConvos > 0 ? Math.round((aiHandled / totalConvos) * 100) : 0;

  /* avg messages per conversation as proxy for response activity */
  const totalMessages   = conversations.reduce((sum, c) => sum + (c.messages?.length || 0), 0);
  const avgMessages     = totalConvos > 0 ? (totalMessages / totalConvos).toFixed(1) : 0;

  /* open vs closed */
  const openConvos   = conversations.filter(c => c.status === "open").length;
  const closedConvos = conversations.filter(c => c.status === "closed").length;

  /* stat cards — all real */
  const statCards = [
    {
      id: 1,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      value: totalConvos.toLocaleString(),
      label: "Total Conversations",
      sub: `${openConvos} open · ${closedConvos} closed`,
      color: "purple",
    },
    {
      id: 2,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
      value: `${aiResolutionRate}%`,
      label: "AI Resolution Rate",
      sub: `${aiHandled} AI · ${humanHandled} human`,
      color: "blue",
    },
    {
      id: 3,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="12" y2="14" />
        </svg>
      ),
      value: totalMessages.toLocaleString(),
      label: "Total Messages",
      sub: `Avg ${avgMessages} per conversation`,
      color: "green",
    },
    {
      id: 4,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      value: openConvos.toLocaleString(),
      label: "Open Conversations",
      sub: openConvos === 0 ? "All caught up! 🎉" : "Need attention",
      color: openConvos > 0 ? "orange" : "green",
    },
  ];

  /* ── Build chart data from real conversations (last 7 days) ── */
  const buildChartData = () => {
    const days = [];
    const aiCounts    = [];
    const humanCounts = [];
    const daysBack = chartRange === "Last 7 days" ? 7 : chartRange === "Last 30 days" ? 30 : 90;
    for (let i = daysBack - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = daysBack <= 7
        ? d.toLocaleDateString("en", { weekday: "short" })
        : d.toLocaleDateString("en", { month: "short", day: "numeric" });
      const dayStr = d.toDateString();
      const dayConvos = conversations.filter(c => new Date(c.createdAt).toDateString() === dayStr);
      days.push(label);
      aiCounts.push(dayConvos.filter(c => c.messages?.some(m => m.sender === "ai")).length);
      humanCounts.push(dayConvos.filter(c => c.messages?.some(m => m.sender === "agent")).length);
    }
    return { days, aiCounts, humanCounts };
  };
  const { days, aiCounts, humanCounts } = buildChartData();

  /* ── recent 5 conversations ── */
  const recentConvos = [...conversations]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  const ownerName      = workspace?.owner?.name || "User";
  const ownerInitials  = getInitials(ownerName);
  const companyInitial = (workspace?.companyName || "A")[0].toUpperCase();

  return (
    <div className="db">

      {/* ══ SIDEBAR ══ */}
      <aside className={`db__sidebar${sidebarOpen ? " db__sidebar--open" : ""}`}>
        <div className="db__workspace">
          <div className="db__workspace-icon">{companyInitial}</div>
          <div className="db__workspace-info">
            <span className="db__workspace-name">{workspace?.companyName || "My Company"}</span>
            <span className="db__workspace-plan">Growth Plan</span>
          </div>
          <button className="db__workspace-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <nav className="db__nav">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`db__nav-item${activeId === item.id ? " db__nav-item--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="db__nav-icon">{item.icon}</span>
              <span className="db__nav-label">{item.label}</span>
              {item.id === "conversations" && totalConvos > 0 && (
                <span className="db__nav-badge">{totalConvos}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="db__user">
          <div className="db__user-avatar">{ownerInitials}</div>
          <div className="db__user-info">
            <span className="db__user-name">{ownerName}</span>
            <span className="db__user-email">{workspace?.owner?.email || ""}</span>
          </div>
          <button className="db__logout-btn" onClick={handleLogout} title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="db__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ══ BODY ══ */}
      <div className="db__body">

        {/* TOPBAR */}
        <header className="db__topbar">
          <button className="db__hamburger" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="db__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search conversations, customers, or settings..." className="db__search-input" readOnly />
            <div className="db__search-kbd"><span>⌘</span><span>K</span></div>
          </div>
          <div className="db__topbar-right">
            <div className="db__trial">
              Trial: <strong>12 days left</strong>
              <Link to="/under-construction" className="db__upgrade">Upgrade</Link>
            </div>
            <button className="db__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="db__icon-dot"/>
            </button>
            <button className="db__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="db__content-wrap">
          <main className="db__main">

            {/* Greeting */}
            <div className="db__greeting">
              <h1 className="db__greeting-title">{greeting}, {ownerName.split(" ")[0]} 👋</h1>
              <p className="db__greeting-sub">Here's what's happening in your support today.</p>
            </div>

            {/* ── Stat cards — ALL REAL ── */}
            <div className="db__stats">
              {statCards.map((s) => (
                <div key={s.id} className={`db__stat-card db__stat-card--${s.color}`}>
                  <div className="db__stat-top">
                    <div className="db__stat-icon">{s.icon}</div>
                  </div>
                  <div className="db__stat-value">{s.value}</div>
                  <div className="db__stat-label">{s.label}</div>
                  <div className="db__stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* ── Chart — real data ── */}
            <div className="db__chart-card">
              <div className="db__chart-head">
                <h2 className="db__chart-title">AI vs Human Resolutions</h2>
                <select className="db__chart-range" value={chartRange} onChange={e => setChartRange(e.target.value)}>
                  {["Last 7 days","Last 30 days","Last 90 days"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="db__chart-legend">
                <span className="db__legend-item"><span className="db__legend-dot db__legend-dot--ai"/>AI Handled</span>
                <span className="db__legend-item"><span className="db__legend-dot db__legend-dot--human"/>Human</span>
              </div>
              {totalConvos === 0 ? (
                <div className="db__chart-empty">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  <p>No data yet — conversations will appear here once customers start chatting</p>
                </div>
              ) : (
                <div className="db__chart-wrap">
                  <MiniChart days={days} aiCounts={aiCounts} humanCounts={humanCounts} />
                </div>
              )}
            </div>

            {/* ── Recent Conversations — real ── */}
            <div className="db__convos-card">
              <div className="db__convos-head">
                <h2 className="db__convos-title">Recent Conversations</h2>
                <Link to="/conversations" className="db__view-all">View all</Link>
              </div>

              {recentConvos.length === 0 ? (
                <div className="db__convos-empty">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p>No conversations yet. Install your widget to start receiving messages.</p>
                  <Link to="/dashboard/widget" className="db__convos-empty-link">Install widget →</Link>
                </div>
              ) : (
                <div className="db__convos-list">
                  {recentConvos.map((c) => {
                    const lastMsg = c.messages?.[c.messages.length - 1];
                    const isAI    = lastMsg?.sender === "ai";
                    return (
                      <Link key={c._id} to="/conversations" className="db__convo">
                        <div className="db__convo-avatar">{getInitials(c.customerName)}</div>
                        <div className="db__convo-body">
                          <span className="db__convo-name">{c.customerName || "Unknown visitor"}</span>
                          <span className="db__convo-msg">{lastMsg?.text || "No messages yet"}</span>
                        </div>
                        <div className="db__convo-meta">
                          <span className={`db__convo-tag db__convo-tag--${isAI ? "ai" : "human"}`}>
                            {isAI ? (
                              <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> AI Handled</>
                            ) : (
                              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Human</>
                            )}
                          </span>
                          <span className="db__convo-time">{formatTime(c.updatedAt || c.createdAt)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

          </main>

          {/* RIGHT PANEL */}
          <aside className="db__right">

            {/* AI status */}
            <div className="db__panel-card">
              <div className="db__ai-header">
                <div className="db__ai-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  <span className="db__ai-dot"/>
                </div>
                <div className="db__ai-info">
                  <span className="db__ai-name">AI Assistant</span>
                  <span className="db__ai-status">Online &amp; Active</span>
                </div>
              </div>
              <p className="db__ai-trained">
                Trained on your workspace data. Handling customer queries automatically.
              </p>
              <Link to="/under-construction" className="db__ai-manage">Manage AI Assistant</Link>
            </div>

            {/* Widget install */}
            <div className="db__panel-card">
              <div className="db__widget-head">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
                <h3 className="db__panel-title">Widget Installation</h3>
              </div>
              <div className="db__widget-status">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Installed successfully
              </div>
              <div className="db__widget-code">
                {`<script src="https://cdn.yourapp...`}
              </div>
              <button className="db__widget-copy" onClick={copyWidget}>Copy widget code</button>
              <Link to="/dashboard/widget" className="db__widget-customize">Customize widget →</Link>
            </div>

            {/* Quick stats summary */}
            <div className="db__panel-card">
              <div className="db__visitors-head">
                <span className="db__visitors-dot"/>
                <h3 className="db__panel-title">Your Stats</h3>
              </div>
              <div className="db__quick-stats">
                <div className="db__quick-stat">
                  <span className="db__quick-stat-num">{totalConvos}</span>
                  <span className="db__quick-stat-label">Total Conversations</span>
                </div>
                <div className="db__quick-stat">
                  <span className="db__quick-stat-num">{aiResolutionRate}%</span>
                  <span className="db__quick-stat-label">AI Resolution Rate</span>
                </div>
                <div className="db__quick-stat">
                  <span className="db__quick-stat-num">{totalMessages}</span>
                  <span className="db__quick-stat-label">Total Messages</span>
                </div>
                <div className="db__quick-stat">
                  <span className="db__quick-stat-num">{openConvos}</span>
                  <span className="db__quick-stat-label">Open Now</span>
                </div>
              </div>
              <div className="db__visitors-actions">
                <Link to="/conversations" className="db__visitors-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  View Chats
                </Link>
                <Link to="/dashboard/widget" className="db__visitors-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                  Widget
                </Link>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;