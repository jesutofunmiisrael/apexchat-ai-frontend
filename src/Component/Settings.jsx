import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Settings.css";

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

const SETTING_TABS = [
  { id: "workspace",    label: "Workspace",    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
  { id: "team",         label: "Team Members", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: "ai",           label: "AI Prompt",    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> },
  { id: "notifications",label: "Notifications",icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { id: "apikeys",      label: "API Keys",     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg> },
  { id: "integrations", label: "Integrations", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> },
];

const TONES = ["Professional", "Friendly", "Playful", "Concise", "Empathetic"];

const getInitials = (n = "") => n.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "?";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [workspace,    setWorkspace   ] = useState(null);
  const [settings,     setSettings    ] = useState(null);
  const [loading,      setLoading     ] = useState(true);
  const [saving,       setSaving      ] = useState(false);
  const [activeTab,    setActiveTab   ] = useState("workspace");
  const [sidebarOpen,  setSidebarOpen ] = useState(false);

  /* Form state */
  const [businessName,    setBusinessName   ] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [supportEmail,    setSupportEmail   ] = useState("");
  const [aiName,          setAiName         ] = useState("");
  const [welcomeMessage,  setWelcomeMessage ] = useState("");
  const [aiTone,          setAiTone         ] = useState("Professional");
  const [autoHandoff,     setAutoHandoff    ] = useState(true);

  const activeNavId = "settings";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAll = async () => {
      try {
        const wsRes = await fetch(`${BASE_URL}/api/workspaces/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wsData = await wsRes.json();
        if (!wsRes.ok) throw new Error(wsData.message);
        setWorkspace(wsData);

        /* Fetch settings using workspaceId */
        const settingsRes = await fetch(`${BASE_URL}/api/settings/${wsData._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
       const settingsData = await settingsRes.json();

const s =
  settingsRes.ok && settingsData
    ? settingsData
    : {};

setSettings(s);

setBusinessName(
  s.businessName ||
  wsData.companyName ||
  ""
);

setBusinessWebsite(
  s.businessWebsite ||
  wsData.companyWebsite ||
  ""
);

setSupportEmail(
  s.supportEmail ||
  wsData.owner?.email ||
  ""
);

setAiName(
  s.aiName ||
  `${wsData.companyName} AI` ||
  "AI Assistant"
);
        setWelcomeMessage(s.welcomeMessage|| wsData.welcomeMsg         || "Hi there! 👋 How can we help you today?");
        setAiTone(s.aiTone               || wsData.tone                || "Professional");
        setAutoHandoff(s.autoHandoff !== undefined ? s.autoHandoff : true);
      } catch (err) {
        toast.error(err.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);


  const handleSave = async () => {
    if (!workspace) return;
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/api/settings/${workspace._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessName,
          businessWebsite,
          supportEmail,
          aiName,
          welcomeMessage,
          aiTone,
          autoHandoff,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");
      toast.success("Settings saved! ✅");
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="st__loading">
        <div className="st__spinner"/>
        <p>Loading settings...</p>
      </div>
    );
  }

  const ownerName      = workspace?.owner?.name || "User";
  const ownerInitials  = getInitials(ownerName);
  const companyInitial = (workspace?.companyName || "A")[0].toUpperCase();

  return (
    <div className="st">

      {/* ══ SIDEBAR ══ */}
      <aside className={`st__sidebar${sidebarOpen ? " st__sidebar--open" : ""}`}>
        <div className="st__workspace">
          <div className="st__workspace-icon">{companyInitial}</div>
          <div className="st__workspace-info">
            <span className="st__workspace-name">{workspace?.companyName || "My Company"}</span>
            <span className="st__workspace-plan">Growth Plan</span>
          </div>
          <button className="st__workspace-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        <nav className="st__nav">
          {navItems.map(item => (
            <Link key={item.id} to={item.path}
              className={`st__nav-item${activeNavId === item.id ? " st__nav-item--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="st__nav-icon">{item.icon}</span>
              <span className="st__nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="st__user">
          <div className="st__user-avatar">{ownerInitials}</div>
          <div className="st__user-info">
            <span className="st__user-name">{ownerName}</span>
            <span className="st__user-email">{workspace?.owner?.email || ""}</span>
          </div>
          <button className="st__logout-btn" onClick={handleLogout} title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="st__overlay" onClick={() => setSidebarOpen(false)}/>}

      {/* ══ BODY ══ */}
      <div className="st__body">

        {/* TOPBAR */}
        <header className="st__topbar">
          <button className="st__hamburger" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="st__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search conversations, customers, or settings..." className="st__search-input" readOnly/>
            <div className="st__search-kbd"><span>⌘</span><span>K</span></div>
          </div>
          <div className="st__topbar-right">
            <div className="st__trial">Trial: <strong>12 days left</strong>
              <Link to="/under-construction" className="st__upgrade">Upgrade</Link>
            </div>
            <button className="st__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="st__icon-dot"/>
            </button>
            <button className="st__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
          </div>
        </header>

        {/* ══ SETTINGS LAYOUT ══ */}
        <div className="st__layout">

          {/* Settings left nav */}
          <div className="st__settings-nav">
            <h1 className="st__page-title">Settings</h1>
            <nav className="st__settings-tabs">
              {SETTING_TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`st__settings-tab${activeTab === tab.id ? " st__settings-tab--active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="st__tab-icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings content */}
          <div className="st__content">

            {/* ── WORKSPACE ── */}
            {activeTab === "workspace" && (
              <div className="st__panel">
                <div className="st__panel-head">
                  <h2 className="st__panel-title">Workspace Settings</h2>
                  <p className="st__panel-sub">Manage your company details and preferences.</p>
                </div>

                {/* Logo */}
                <div className="st__card">
                  <div className="st__logo-row">
                    <div className="st__logo-preview">
                      <span>{companyInitial}</span>
                    </div>
                    <div>
                      <button className="st__upload-btn">Upload Logo</button>
                      <p className="st__upload-hint">Recommended size: 256×256px</p>
                    </div>
                  </div>

                  <div className="st__form-grid">
                    <div className="st__field">
                      <label className="st__label">Workspace Name</label>
                      <input
                        type="text"
                        className="st__input"
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div className="st__field">
                      <label className="st__label">Website URL</label>
                      <input
                        type="url"
                        className="st__input"
                        value={businessWebsite}
                        onChange={e => setBusinessWebsite(e.target.value)}
                        placeholder="https://acme.com"
                      />
                    </div>
                    <div className="st__field">
                      <label className="st__label">Support Email</label>
                      <input
                        type="email"
                        className="st__input"
                        value={supportEmail}
                        onChange={e => setSupportEmail(e.target.value)}
                        placeholder="support@acme.com"
                      />
                    </div>
                    <div className="st__field">
                      <label className="st__label">Industry</label>
                      <input
                        type="text"
                        className="st__input"
                        value={workspace?.industry || ""}
                        readOnly
                        placeholder="e.g. SaaS"
                      />
                    </div>
                  </div>

                  <div className="st__save-row">
                    <button className="st__save-btn" onClick={handleSave} disabled={saving}>
                      {saving ? <><span className="st__btn-spinner"/> Saving...</> : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TEAM MEMBERS ── */}
            {activeTab === "team" && (
              <div className="st__panel">
                <div className="st__panel-head">
                  <h2 className="st__panel-title">Team Members</h2>
                  <p className="st__panel-sub">Manage who has access to your workspace.</p>
                </div>
                <div className="st__card">
                  <div className="st__team-member">
                    <div className="st__member-avatar">{ownerInitials}</div>
                    <div className="st__member-info">
                      <span className="st__member-name">{ownerName}</span>
                      <span className="st__member-email">{workspace?.owner?.email || ""}</span>
                    </div>
                    <span className="st__member-badge">Owner</span>
                  </div>
                  <div className="st__team-empty">
                    <button className="st__invite-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Invite Team Member
                    </button>
                    <p className="st__team-hint">Team member invites coming soon.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── AI PROMPT ── */}
            {activeTab === "ai" && (
              <div className="st__panel">
                <div className="st__panel-head">
                  <h2 className="st__panel-title">AI Prompt Settings</h2>
                  <p className="st__panel-sub">Configure how your AI assistant behaves.</p>
                </div>
                <div className="st__card">
                  <div className="st__form-grid">
                    <div className="st__field st__field--full">
                      <label className="st__label">AI Assistant Name</label>
                      <input
                        type="text"
                        className="st__input"
                        value={aiName}
                        onChange={e => setAiName(e.target.value)}
                        placeholder="e.g. Aria, Max, Support Bot"
                      />
                    </div>
                    <div className="st__field st__field--full">
                      <label className="st__label">Welcome Message</label>
                      <textarea
                        className="st__textarea"
                        rows={3}
                        value={welcomeMessage}
                        onChange={e => setWelcomeMessage(e.target.value)}
                        placeholder="Hi there! 👋 How can we help you today?"
                      />
                    </div>
                    <div className="st__field st__field--full">
                      <label className="st__label">AI Tone</label>
                      <div className="st__tones">
                        {TONES.map(tone => (
                          <button
                            key={tone}
                            type="button"
                            className={`st__tone-btn${aiTone === tone ? " st__tone-btn--active" : ""}`}
                            onClick={() => setAiTone(tone)}
                          >
                            {tone}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="st__field st__field--full">
                      <div className="st__toggle-row">
                        <div>
                          <p className="st__toggle-label">Auto Handoff to Human Agent</p>
                          <p className="st__toggle-desc">Automatically transfer to a human when AI can't resolve the issue</p>
                        </div>
                        <button
                          type="button"
                          className={`st__toggle${autoHandoff ? " st__toggle--on" : ""}`}
                          onClick={() => setAutoHandoff(p => !p)}
                        >
                          <div className="st__toggle-thumb"/>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="st__save-row">
                    <button className="st__save-btn" onClick={handleSave} disabled={saving}>
                      {saving ? <><span className="st__btn-spinner"/> Saving...</> : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <div className="st__panel">
                <div className="st__panel-head">
                  <h2 className="st__panel-title">Notifications</h2>
                  <p className="st__panel-sub">Control when and how you get notified.</p>
                </div>
                <div className="st__card">
                  {[
                    { label: "New conversation started",      desc: "Get notified when a customer starts a new chat" },
                    { label: "Handoff to human requested",    desc: "Alert when AI transfers to a human agent" },
                    { label: "Conversation closed",           desc: "Notify when a conversation is resolved" },
                    { label: "Weekly analytics report",       desc: "Receive a weekly summary of your support metrics" },
                  ].map((n, i) => (
                    <div key={i} className="st__notif-row">
                      <div>
                        <p className="st__toggle-label">{n.label}</p>
                        <p className="st__toggle-desc">{n.desc}</p>
                      </div>
                      <div className="st__toggle st__toggle--on">
                        <div className="st__toggle-thumb"/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── API KEYS ── */}
            {activeTab === "apikeys" && (
              <div className="st__panel">
                <div className="st__panel-head">
                  <h2 className="st__panel-title">API Keys</h2>
                  <p className="st__panel-sub">Use these keys to integrate with your systems.</p>
                </div>
                <div className="st__card">
                  <div className="st__field">
                    <label className="st__label">Widget Token</label>
                    <div className="st__api-row">
                      <input
                        type="text"
                        className="st__input st__input--mono"
                        value={workspace?.widgetToken || "—"}
                        readOnly
                      />
                      <button className="st__copy-btn" onClick={() => {
                        navigator.clipboard.writeText(workspace?.widgetToken || "");
                        toast.success("Copied!");
                      }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="st__field">
                    <label className="st__label">Workspace ID</label>
                    <div className="st__api-row">
                      <input
                        type="text"
                        className="st__input st__input--mono"
                        value={workspace?._id || "—"}
                        readOnly
                      />
                      <button className="st__copy-btn" onClick={() => {
                        navigator.clipboard.writeText(workspace?._id || "");
                        toast.success("Copied!");
                      }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── INTEGRATIONS ── */}
            {activeTab === "integrations" && (
              <div className="st__panel">
                <div className="st__panel-head">
                  <h2 className="st__panel-title">Integrations</h2>
                  <p className="st__panel-sub">Connect your favorite tools.</p>
                </div>
                <div className="st__card">
                  {[
                    { name: "Shopify",  desc: "Sync orders and customer data",    connected: false },
                    { name: "Slack",    desc: "Get notifications in Slack",        connected: false },
                    { name: "Zendesk",  desc: "Sync tickets and knowledge base",   connected: false },
                    { name: "HubSpot",  desc: "Sync contacts and conversations",   connected: false },
                  ].map((intg, i) => (
                    <div key={i} className="st__intg-row">
                      <div className="st__intg-icon">
                        {intg.name[0]}
                      </div>
                      <div className="st__intg-info">
                        <p className="st__intg-name">{intg.name}</p>
                        <p className="st__intg-desc">{intg.desc}</p>
                      </div>
                      <button className={`st__intg-btn${intg.connected ? " st__intg-btn--connected" : ""}`}>
                        {intg.connected ? "Connected" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;