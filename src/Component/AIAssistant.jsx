import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./AIAssistant.css";

const BASE_URL = "https://ai-business-chat-saas-backend.onrender.com";

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

const TABS = ["Overview", "Knowledge Base", "Prompts", "Behavior", "Test AI"];

const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const AIAssistant = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [workspace,    setWorkspace   ] = useState(null);
  const [loading,      setLoading     ] = useState(true);
  const [activeTab,    setActiveTab   ] = useState("Knowledge Base");
  const [sidebarOpen,  setSidebarOpen ] = useState(false);
  const [retraining,   setRetraining  ] = useState(false);
  const [editingInstr, setEditingInstr] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [savingInstr,  setSavingInstr ] = useState(false);

  /* Test AI tab */
  const [testMsg,      setTestMsg     ] = useState("");
  const [testConvoId,  setTestConvoId ] = useState(null);
  const [testMessages, setTestMessages] = useState([]);
  const [testLoading,  setTestLoading ] = useState(false);

  const activeId = "ai";

  /* ── Fetch workspace ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetch_ = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/api/workspaces/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setWorkspace(data);
        setInstructions(data.aiInstructions || generateDefaultInstructions(data));
      } catch (err) {
        toast.error(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  const generateDefaultInstructions = (ws) => {
    const company = ws?.companyName || "our company";
    const industry = ws?.industry || "business";
    const tone = ws?.tone || "Professional";
    const helpTopics = ws?.helpTopics || "customer inquiries";
    const bizDesc = ws?.businessDescription || `You are an AI assistant for ${company}.`;

    return `You are an AI assistant for ${company}, a ${industry} company.
${bizDesc}

Your primary goal is to resolve customer inquiries quickly and accurately.

Tone Guidelines:
- Be ${tone.toLowerCase()} but approachable.
- Keep responses concise and easy to read.
- Use bullet points for steps or lists.

What you help with:
${helpTopics}

Escalation Rules:
- If you don't know the answer, DO NOT guess. Escalate to a human agent.
- If the user asks for a refund or has a billing issue, escalate immediately.`;
  };

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  /* ── Retrain AI ── */
  const handleRetrain = async () => {
    setRetraining(true);
    const token = localStorage.getItem("token");
    try {
      const res  = await fetch(`${BASE_URL}/api/workspaces/ai`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessDescription: workspace?.businessDescription,
          helpTopics:          workspace?.helpTopics,
          tone:                workspace?.tone,
          aiInstructions:      instructions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("AI retrained successfully! ✅");
    } catch (err) {
      toast.error(err.message || "Failed to retrain");
    } finally {
      setRetraining(false);
    }
  };

  /* ── Save instructions ── */
  const handleSaveInstructions = async () => {
    setSavingInstr(true);
    const token = localStorage.getItem("token");
    try {
      const res  = await fetch(`${BASE_URL}/api/workspaces/ai`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aiInstructions: instructions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setWorkspace(prev => ({ ...prev, aiInstructions: instructions }));
      setEditingInstr(false);
      toast.success("Instructions saved! ✅");
    } catch (err) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSavingInstr(false);
    }
  };

  /* ── Test AI ── */
  const handleTestSend = async () => {
    if (!testMsg.trim()) return;
    setTestLoading(true);
    const token = localStorage.getItem("token");
    const userMsg = testMsg;
    setTestMessages(prev => [...prev, { sender: "customer", text: userMsg }]);
    setTestMsg("");
    try {
      const res  = await fetch(`${BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMsg, conversationId: testConvoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTestConvoId(data.conversationId);
      setTestMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
    } catch (err) {
      toast.error(err.message || "Failed to get AI response");
      setTestMessages(prev => [...prev, { sender: "ai", text: "Sorry, I couldn't process that. Please try again." }]);
    } finally {
      setTestLoading(false);
    }
  };

  /* ── Knowledge sources derived from workspace ── */
  const knowledgeSources = [
    {
      id: "website",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b4ef5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
      iconBg: "#ede9ff",
      title: "Company Website",
      sub: workspace?.companyWebsite || "Not set",
      status: workspace?.companyWebsite ? "synced" : "not-set",
      meta: workspace?.companyWebsite ? "Auto-crawled on setup" : "Add your website in settings",
    },
    {
      id: "business",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
      ),
      iconBg: "#f3e8ff",
      title: "Business Description",
      sub: workspace?.businessDescription
        ? workspace.businessDescription.slice(0, 60) + (workspace.businessDescription.length > 60 ? "..." : "")
        : "Not set",
      status: workspace?.businessDescription ? "synced" : "not-set",
      meta: workspace?.industry ? `Industry: ${workspace.industry}` : "Add description in setup",
    },
    {
      id: "tone",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      ),
      iconBg: "#fff7ed",
      title: "Tone & Behavior",
      sub: workspace?.tone ? `${workspace.tone} tone` : "Not configured",
      status: workspace?.tone ? "synced" : "not-set",
      meta: workspace?.helpTopics
        ? workspace.helpTopics.slice(0, 50) + "..."
        : "Configure in setup",
    },
  ];

  if (loading) {
    return (
      <div className="ai__loading">
        <div className="ai__spinner" />
        <p>Loading AI Assistant...</p>
      </div>
    );
  }

  const ownerName      = workspace?.owner?.name || "User";
  const ownerInitials  = getInitials(ownerName);
  const companyInitial = (workspace?.companyName || "A")[0].toUpperCase();
  const companyName    = workspace?.companyName || "My Company";

  return (
    <div className="ai">

      {/* ══ SIDEBAR ══ */}
      <aside className={`ai__sidebar${sidebarOpen ? " ai__sidebar--open" : ""}`}>
        <div className="ai__workspace">
          <div className="ai__workspace-icon">{companyInitial}</div>
          <div className="ai__workspace-info">
            <span className="ai__workspace-name">{companyName}</span>
            <span className="ai__workspace-plan">Growth Plan</span>
          </div>
          <button className="ai__workspace-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <nav className="ai__nav">
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`ai__nav-item${activeId === item.id ? " ai__nav-item--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="ai__nav-icon">{item.icon}</span>
              <span className="ai__nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="ai__user">
          <div className="ai__user-avatar">{ownerInitials}</div>
          <div className="ai__user-info">
            <span className="ai__user-name">{ownerName}</span>
            <span className="ai__user-email">{workspace?.owner?.email || ""}</span>
          </div>
          <button className="ai__logout-btn" onClick={handleLogout} title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="ai__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ══ BODY ══ */}
      <div className="ai__body">

        {/* TOPBAR */}
        <header className="ai__topbar">
          <button className="ai__hamburger" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="ai__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search conversations, customers, or settings..." className="ai__search-input" readOnly />
            <div className="ai__search-kbd"><span>⌘</span><span>K</span></div>
          </div>
          <div className="ai__topbar-right">
            <div className="ai__trial">
              Trial: <strong>12 days left</strong>
              <Link to="/under-construction" className="ai__upgrade">Upgrade</Link>
            </div>
            <button className="ai__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="ai__icon-dot"/>
            </button>
            <button className="ai__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="ai__main">

          {/* ── Hero card ── */}
          <div className="ai__hero">
            <div className="ai__hero-left">
              <div className="ai__hero-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <span className="ai__hero-dot"/>
              </div>
              <div>
                <h1 className="ai__hero-name">{companyName} AI</h1>
                <p className="ai__hero-status">
                  <span className="ai__hero-status-dot"/>
                  Online and handling conversations
                </p>
              </div>
            </div>
            <div className="ai__hero-right">
              <span className="ai__hero-trained">
                Last trained: {workspace?.updatedAt
                  ? new Date(workspace.updatedAt).toLocaleDateString("en", { month: "short", day: "numeric" }) + ", " + new Date(workspace.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "Not yet trained"}
              </span>
              <button className="ai__retrain-btn" onClick={handleRetrain} disabled={retraining}>
                {retraining ? (
                  <><span className="ai__btn-spinner"/> Retraining...</>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                    Retrain AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="ai__tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`ai__tab${activeTab === tab ? " ai__tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ══ TAB CONTENT ══ */}

          {/* ── OVERVIEW ── */}
          {activeTab === "Overview" && (
            <div className="ai__section">
              <div className="ai__overview-grid">
                <div className="ai__overview-card">
                  <div className="ai__overview-icon ai__overview-icon--purple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div>
                    <p className="ai__overview-label">Company</p>
                    <p className="ai__overview-value">{companyName}</p>
                  </div>
                </div>
                <div className="ai__overview-card">
                  <div className="ai__overview-icon ai__overview-icon--blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 0 20A10 10 0 0 1 12 2z"/></svg>
                  </div>
                  <div>
                    <p className="ai__overview-label">Industry</p>
                    <p className="ai__overview-value">{workspace?.industry || "Not set"}</p>
                  </div>
                </div>
                <div className="ai__overview-card">
                  <div className="ai__overview-icon ai__overview-icon--green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                  </div>
                  <div>
                    <p className="ai__overview-label">AI Tone</p>
                    <p className="ai__overview-value">{workspace?.tone || "Professional"}</p>
                  </div>
                </div>
                <div className="ai__overview-card">
                  <div className="ai__overview-icon ai__overview-icon--orange">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <div>
                    <p className="ai__overview-label">Company Size</p>
                    <p className="ai__overview-value">{workspace?.companySize || "Not set"}</p>
                  </div>
                </div>
              </div>

              {workspace?.businessDescription && (
                <div className="ai__desc-card">
                  <h3 className="ai__desc-title">Business Description</h3>
                  <p className="ai__desc-text">{workspace.businessDescription}</p>
                </div>
              )}

              {workspace?.helpTopics && (
                <div className="ai__desc-card">
                  <h3 className="ai__desc-title">What the AI helps with</h3>
                  <p className="ai__desc-text">{workspace.helpTopics}</p>
                </div>
              )}
            </div>
          )}

          {/* ── KNOWLEDGE BASE ── */}
          {activeTab === "Knowledge Base" && (
            <div className="ai__section">
              <div className="ai__section-head">
                <div>
                  <h2 className="ai__section-title">Knowledge Sources</h2>
                  <p className="ai__section-sub">Data sources your AI uses to answer questions.</p>
                </div>
                <button className="ai__add-source-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Source
                </button>
              </div>

              <div className="ai__sources-grid">
                {knowledgeSources.map(src => (
                  <div key={src.id} className="ai__source-card">
                    <div className="ai__source-top">
                      <div className="ai__source-icon" style={{ background: src.iconBg }}>
                        {src.icon}
                      </div>
                      <span className={`ai__source-status ai__source-status--${src.status}`}>
                        {src.status === "synced" ? "Synced" : "Not set"}
                      </span>
                    </div>
                    <h3 className="ai__source-title">{src.title}</h3>
                    <p className="ai__source-sub">{src.sub}</p>
                    <p className="ai__source-meta">{src.meta}</p>
                  </div>
                ))}
              </div>

              {/* Base Instructions */}
              <div className="ai__instr-card">
                <div className="ai__instr-head">
                  <div className="ai__instr-head-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
                      <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
                      <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
                      <line x1="17" y1="16" x2="23" y2="16"/>
                    </svg>
                    <h3 className="ai__instr-title">Base Instructions</h3>
                  </div>
                  <button
                    className="ai__instr-edit-btn"
                    onClick={() => setEditingInstr(!editingInstr)}
                  >
                    {editingInstr ? "Cancel" : "Edit"}
                  </button>
                </div>

                {editingInstr ? (
                  <div className="ai__instr-edit">
                    <textarea
                      className="ai__instr-textarea"
                      value={instructions}
                      onChange={e => setInstructions(e.target.value)}
                      rows={14}
                    />
                    <button
                      className="ai__instr-save-btn"
                      onClick={handleSaveInstructions}
                      disabled={savingInstr}
                    >
                      {savingInstr ? <><span className="ai__btn-spinner"/> Saving...</> : "Save Instructions"}
                    </button>
                  </div>
                ) : (
                  <div className="ai__instr-view">
                    <pre className="ai__instr-pre">{instructions}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PROMPTS ── */}
          {activeTab === "Prompts" && (
            <div className="ai__section">
              <div className="ai__section-head">
                <div>
                  <h2 className="ai__section-title">AI Prompts</h2>
                  <p className="ai__section-sub">Configure what your AI says in specific situations.</p>
                </div>
              </div>
              <div className="ai__prompts-list">
                {[
                  { label: "Greeting Message", value: workspace?.welcomeMsg || `Hi there! 👋 Welcome to ${companyName}. How can I help you today?`, key: "welcomeMsg" },
                  { label: "Fallback Message", value: `I'm not sure about that. Let me connect you with a human agent who can help.`, key: "fallbackMsg" },
                  { label: "Handoff Message", value: `I'm transferring you to one of our team members. They'll be with you shortly.`, key: "handoffMsg" },
                ].map(p => (
                  <div key={p.key} className="ai__prompt-card">
                    <div className="ai__prompt-label">{p.label}</div>
                    <div className="ai__prompt-value">{p.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BEHAVIOR ── */}
          {activeTab === "Behavior" && (
            <div className="ai__section">
              <div className="ai__section-head">
                <div>
                  <h2 className="ai__section-title">AI Behavior</h2>
                  <p className="ai__section-sub">Control how your AI handles conversations.</p>
                </div>
              </div>
              <div className="ai__behavior-list">
                {[
                  { label: "Auto-reply to new messages", desc: "AI responds immediately when a customer sends a message", active: true },
                  { label: "Escalate to human on confusion", desc: "Hand off to agent if AI can't confidently answer", active: true },
                  { label: "Collect customer name", desc: "Ask for the customer's name at the start of a conversation", active: false },
                  { label: "Send conversation summary", desc: "Email a summary after each closed conversation", active: false },
                ].map((b, i) => (
                  <div key={i} className="ai__behavior-card">
                    <div className="ai__behavior-info">
                      <p className="ai__behavior-label">{b.label}</p>
                      <p className="ai__behavior-desc">{b.desc}</p>
                    </div>
                    <div className={`ai__toggle${b.active ? " ai__toggle--on" : ""}`}>
                      <div className="ai__toggle-thumb" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TEST AI ── */}
          {activeTab === "Test AI" && (
            <div className="ai__section">
              <div className="ai__section-head">
                <div>
                  <h2 className="ai__section-title">Test Your AI</h2>
                  <p className="ai__section-sub">Send a message and see how your AI responds in real time.</p>
                </div>
                {testMessages.length > 0 && (
                  <button
                    className="ai__clear-btn"
                    onClick={() => { setTestMessages([]); setTestConvoId(null); }}
                  >
                    Clear chat
                  </button>
                )}
              </div>

              <div className="ai__test-wrap">
                <div className="ai__test-messages">
                  {testMessages.length === 0 ? (
                    <div className="ai__test-empty">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                      <p>Type a message below to test your AI assistant</p>
                    </div>
                  ) : (
                    testMessages.map((msg, i) => (
                      <div key={i} className={`ai__test-msg ai__test-msg--${msg.sender}`}>
                        {msg.sender === "ai" && (
                          <div className="ai__test-avatar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                            </svg>
                          </div>
                        )}
                        <div className="ai__test-bubble">
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {testLoading && (
                    <div className="ai__test-msg ai__test-msg--ai">
                      <div className="ai__test-avatar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                      </div>
                      <div className="ai__test-bubble ai__test-bubble--typing">
                        <span/><span/><span/>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ai__test-input-wrap">
                  <input
                    type="text"
                    className="ai__test-input"
                    placeholder="Type a test message..."
                    value={testMsg}
                    onChange={e => setTestMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleTestSend()}
                    disabled={testLoading}
                  />
                  <button
                    className="ai__test-send"
                    onClick={handleTestSend}
                    disabled={testLoading || !testMsg.trim()}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AIAssistant;