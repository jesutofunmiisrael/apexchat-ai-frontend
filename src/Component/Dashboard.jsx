



import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Dashboard.css";


const statCards = [
  {
    id: 1,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    value: "1,248", label: "Conversations today", change: "+12%", positive: true,
  },
  {
    id: 2,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
    value: "78%", label: "AI Resolution Rate", change: "+5.4%", positive: true,
  },
  {
    id: 3,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    value: "1m 24s", label: "Avg Response Time", change: "-18%", positive: true,
  },
  {
    id: 4,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    value: "4.8/5", label: "Customer Satisfaction", change: "+0.2", positive: true,
  },
];

const chartDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const aiData    = [42, 28, 38, 52, 68, 82, 88];
const humanData = [22, 18, 28, 34, 38, 44, 42];

const conversations = [
  { id: 1, initials: "SJ", name: "Sarah Jenkins",  msg: "How do I upgrade my plan?",                          tag: "ai",    time: "2m ago"  },
  { id: 2, initials: "MC", name: "Michael Chen",   msg: "The API is returning a 500 error on the /users e...", tag: "human", time: "15m ago" },
  { id: 3, initials: "ED", name: "Emma Davis",     msg: "Thanks, that solved my issue!",                      tag: "ai",    time: "1h ago"  },
  { id: 4, initials: "JW", name: "James Wilson",   msg: "Can I add more seats to my current subscription...",  tag: "ai",    time: "2h ago"  },
  { id: 5, initials: "OT", name: "Olivia Taylor",  msg: "I need help setting up the Shopify integration.",    tag: "human", time: "3h ago"  },
];

const visitors = [
  { id: 1, flag: "US", name: "Anonymous",        page: "/pricing",   time: "2m"  },
  { id: 2, flag: "GB", name: "john@example.com", page: "/dashboard", time: "15m" },
  { id: 3, flag: "DE", name: "Anonymous",        page: "/docs/api",  time: "1m"  },
  { id: 4, flag: "CA", name: "sarah@tech.io",    page: "/",          time: "5m"  },
];

const navItems = [
  {
    id: "dashboard", label: "Dashboard", path: "/dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    id: "conversations", label: "Conversations", path: "/under-construction", badge: 12,
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
    id: "customers", label: "Customers",  path: "/under-construction",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    id: "analytics", label: "Analytics", path: "/under-construction",
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

/* ── Pure SVG area chart ── */
const MiniChart = () => {
  const W = 660, H = 220, PAD = { t: 16, r: 16, b: 36, l: 36 };
  const cols = chartDays.length;
  const maxVal = 100;
  const x = (i) => PAD.l + (i / (cols - 1)) * (W - PAD.l - PAD.r);
  const y = (v) => PAD.t + (1 - v / maxVal) * (H - PAD.t - PAD.b);
  const pathD = (data) => data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const areaD = (data) => `${pathD(data)} L${x(cols-1)},${H-PAD.b} L${x(0)},${H-PAD.b} Z`;

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
      {[0,25,50,75,100].map((v) => (
        <g key={v}>
          <line x1={PAD.l} y1={y(v)} x2={W-PAD.r} y2={y(v)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3" />
          <text x={PAD.l-6} y={y(v)+4} textAnchor="end" fontSize="11" fill="#9ca3af">{v}</text>
        </g>
      ))}
      <path d={areaD(humanData)} fill="url(#humanGrad)" />
      <path d={areaD(aiData)}    fill="url(#aiGrad)" />
      <path d={pathD(humanData)} fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={pathD(aiData)}    fill="none" stroke="#5b4ef5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {chartDays.map((d, i) => (
        <text key={d} x={x(i)} y={H-6} textAnchor="middle" fontSize="12" fill="#9ca3af">{d}</text>
      ))}
    </svg>
  );
};

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
const Dashboard = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [workspace,   setWorkspace  ] = useState(null);
  const [loading,     setLoading    ] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chartRange,  setChartRange ] = useState("Last 7 days");

  const activeId = navItems.find(n => location.pathname === n.path)?.id || "dashboard";
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* Fetch workspace */
  useEffect(() => {
    const fetchWorkspace = async () => {
      const token = localStorage.getItem("token");
      try {
        const res  = await fetch("https://ai-business-chat-saas-backend.onrender.com/api/workspaces/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setWorkspace(data);
      } catch (err) {
        toast.error(err.message || "Failed to load workspace");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspace();
  }, []);

  /* Copy widget code */
  const widgetCode = `<script\n  src="https://ai-business-chat-saas-backend.onrender.com/widget.js"\n  data-token="${workspace?.widgetToken}">\n</script>`;

  const copyWidget = () => {
    navigator.clipboard.writeText(widgetCode);
    toast.success("Widget code copied! ✅");
  };

  /* Loading state */
  if (loading) {
    return (
      <div className="db__loading">
        <div className="db__loading-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  /* Owner initials for avatar */
  const ownerName    = workspace?.owner?.name || "User";
  const ownerInitials = ownerName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  const companyInitial = (workspace?.companyName || "A")[0].toUpperCase();

  return (
    <div className="db">

      {/* ══ SIDEBAR ══ */}
      <aside className={`db__sidebar${sidebarOpen ? " db__sidebar--open" : ""}`}>

        {/* Workspace */}
        <div className="db__workspace">
          <div className="db__workspace-icon">{companyInitial}</div>
          <div className="db__workspace-info">
            <span className="db__workspace-name">{workspace?.companyName || "My Company"}</span>
            <span className="db__workspace-plan">Growth Plan</span>
          </div>
          <button className="db__workspace-chevron" aria-label="Switch workspace">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="db__nav">
          {navItems.map((item) => (
            <Link
              key={item.id}
             to={
  ["analytics", "billing", "customers", "settings",  "ai", "conversations", ]
    .includes(item.id)
      ? "/under-construction"
      : item.path
}
              className={`db__nav-item${activeId === item.id ? " db__nav-item--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="db__nav-icon">{item.icon}</span>
              <span className="db__nav-label">{item.label}</span>
              {item.badge && <span className="db__nav-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="db__user">
          <div className="db__user-avatar">{ownerInitials}</div>
          <div className="db__user-info">
            <span className="db__user-name">{ownerName}</span>
            <span className="db__user-email">{workspace?.owner?.email || ""}</span>
          </div>
          <Link to="/dashboard/settings" className="db__user-settings" aria-label="Settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </Link>



          <button
  className="db__logout"
  onClick={() => {

    localStorage.removeItem(
      "token"
    );

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");

  }}
>
  Logout
</button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="db__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ══ BODY ══ */}
      <div className="db__body">

        {/* ── TOPBAR ── */}
        <header className="db__topbar">
          <button className="db__hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
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
              <Link to="/dashboard/billing" className="db__upgrade">Upgrade</Link>
            </div>
            <button className="db__icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="db__icon-dot" />
            </button>
            <button className="db__icon-btn" aria-label="Help">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
          </div>
        </header>

        {/* ── CONTENT + RIGHT PANEL ── */}
        <div className="db__content-wrap">

  
          <main className="db__main">

        
            <div className="db__greeting">
              <h1 className="db__greeting-title">{greeting}, {ownerName.split(" ")[0]} 👋</h1>
              <p className="db__greeting-sub">Here's what's happening in your support today.</p>
            </div>

            {/* Stat cards */}
            <div className="db__stats">
              {statCards.map((s) => (
                <div key={s.id} className="db__stat-card">
                  <div className="db__stat-top">
                    <div className="db__stat-icon">{s.icon}</div>
                    <span className={`db__stat-change${s.positive ? " db__stat-change--up" : " db__stat-change--down"}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                        <polyline points="17 6 23 6 23 12"/>
                      </svg>
                      {s.change}
                    </span>
                  </div>
                  <div className="db__stat-value">{s.value}</div>
                  <div className="db__stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="db__chart-card">
              <div className="db__chart-head">
                <h2 className="db__chart-title">AI vs Human Resolutions</h2>
                <select className="db__chart-range" value={chartRange} onChange={e => setChartRange(e.target.value)}>
                  {["Last 7 days","Last 30 days","Last 90 days"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="db__chart-legend">
                <span className="db__legend-item"><span className="db__legend-dot db__legend-dot--ai" />AI Handled</span>
                <span className="db__legend-item"><span className="db__legend-dot db__legend-dot--human" />Human</span>
              </div>
              <div className="db__chart-wrap"><MiniChart /></div>
            </div>

            {/* Recent Conversations */}
            <div className="db__convos-card">
              <div className="db__convos-head">
                <h2 className="db__convos-title">Recent Conversations</h2>
                <Link to="/dashboard/conversations" className="db__view-all">View all</Link>
              </div>
              <div className="db__convos-list">
                {conversations.map((c) => (
                  <div key={c.id} className="db__convo">
                    <div className="db__convo-avatar">{c.initials}</div>
                    <div className="db__convo-body">
                      <span className="db__convo-name">{c.name}</span>
                      <span className="db__convo-msg">{c.msg}</span>
                    </div>
                    <div className="db__convo-meta">
                      <span className={`db__convo-tag db__convo-tag--${c.tag}`}>
                        {c.tag === "ai"
                          ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> AI Handled</>
                          : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Human</>
                        }
                      </span>
                      <span className="db__convo-time">{c.time}</span>
                    </div>
                  </div>
                ))}
              </div>
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
                  <span className="db__ai-dot" />
                </div>
                <div className="db__ai-info">
                  <span className="db__ai-name">ApexChat AI</span>
                  <span className="db__ai-status">Online &amp; Active</span>
                </div>
              </div>
              <p className="db__ai-trained">Last trained: Today at 9:41 AM from 24 sources.</p>
              <Link to="/dashboard/ai" className="db__ai-manage">Manage AI Assistant</Link>
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
{`<script
  src="https://ai-business-chat-saas-backend.onrender.com/widget.js"
  data-token="${workspace?.widgetToken}">
</script>`}
</div>
              <button className="db__widget-copy" onClick={copyWidget}>Copy widget code</button>
              <Link to="/widget" className="db__widget-customize">Customize widget →</Link>
            </div>

            {/* Active visitors */}
            <div className="db__panel-card">
              <div className="db__visitors-head">
                <span className="db__visitors-dot" />
                <h3 className="db__panel-title">Active Visitors (24)</h3>
              </div>
              <div className="db__visitors-list">
                {visitors.map((v) => (
                  <div key={v.id} className="db__visitor">
                    <span className="db__visitor-flag">{v.flag}</span>
                    <div className="db__visitor-info">
                      <span className="db__visitor-name">{v.name}</span>
                      <span className="db__visitor-page">{v.page}</span>
                    </div>
                    <span className="db__visitor-time">{v.time}</span>
                  </div>
                ))}
              </div>
              <div className="db__visitors-actions">
                <button className="db__visitors-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Invite Team
                </button>
                <button className="db__visitors-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Settings
                </button>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;