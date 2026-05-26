import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import "./Widget.css";

/* ── Nav items (reused from Dashboard) ── */
const navItems = [
    {
        id: "dashboard", label: "Dashboard", path: "/dashboard",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
    },
    {
        id: "conversations", label: "Conversations", path: "/dashboard/conversations", badge: 12,
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    },
    {
        id: "ai", label: "AI Assistant", path: "/dashboard/ai",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>,
    },
    {
        id: "widget", label: "Widget", path: "/dashboard/widget",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    },
    {
        id: "customers", label: "Customers", path: "/dashboard/customers",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
    {
        id: "analytics", label: "Analytics", path: "/dashboard/analytics",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
    },
    {
        id: "settings", label: "Settings", path: "/dashboard/settings",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    },
    {
        id: "billing", label: "Billing", path: "/dashboard/billing",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
    },
];

const PRESET_COLORS = ["#5b4ef5", "#0f0e17", "#0ea5e9", "#16a34a", "#d97706", "#e11d48"];

const Widget = () => {
    const location = useLocation();
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    /* Widget settings state */
    const [primaryColor, setPrimaryColor] = useState("#5b4ef5");
    const [customColor, setCustomColor] = useState("#5b4ef5");
    const [welcomeMessage, setWelcomeMessage] = useState("Hi there! 👋 How can we help you today?");
    const [position, setPosition] = useState("bottom-right");

    const activeId = navItems.find(n => location.pathname === n.path)?.id || "widget";

    /* Fetch workspace */
    useEffect(() => {
        const fetchWorkspace = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("https://ai-business-chat-saas-backend.onrender.com/api/workspaces/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setWorkspace(data);
                /* Pre-fill saved settings if they exist */
                if (data.widgetColor) setPrimaryColor(data.widgetColor);
                if (data.welcomeMsg) setWelcomeMessage(data.welcomeMsg);
                if (data.widgetPosition) setPosition(data.widgetPosition);
            } catch (err) {
                toast.error(err.message || "Failed to load workspace");
            } finally {
                setLoading(false);
            }
        };
        fetchWorkspace();
    }, []);


    const widgetCode =
        `<script
  src="https://ai-business-chat-saas-backend.onrender.com/widget.js"
  data-token="${workspace?.widgetToken}">
</script>`;
    const copyCode = () => {
        navigator.clipboard.writeText(widgetCode);
        setCopied(true);
        toast.success("Widget code copied! ✅");
        setTimeout(() => setCopied(false), 2000);
    };

    /* Save settings */
    const saveSettings = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("https://ai-business-chat-saas-backend.onrender.com/api/workspaces/widget", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    widgetColor: primaryColor,
                    welcomeMsg: welcomeMessage,
                    widgetPosition: position,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success("Widget settings saved! ✅");
        } catch (err) {
            toast.error(err.message || "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    /* Loading */
    if (loading) {
        return (
            <div className="wg__loading">
                <div className="wg__loading-spinner" />
                <p>Loading widget settings...</p>
            </div>
        );
    }

    const ownerName = workspace?.owner?.name || "User";
    const ownerInitials = ownerName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const companyInitial = (workspace?.companyName || "A")[0].toUpperCase();

    return (
        <div className="wg">

            {/* ══ SIDEBAR ══ */}
            <aside className={`wg__sidebar${sidebarOpen ? " wg__sidebar--open" : ""}`}>
                <div className="wg__workspace">
                    <div className="wg__workspace-icon">{companyInitial}</div>
                    <div className="wg__workspace-info">
                        <span className="wg__workspace-name">{workspace?.companyName || "My Company"}</span>
                        <span className="wg__workspace-plan">Growth Plan</span>
                    </div>
                    <button className="wg__workspace-chevron">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </div>

                <nav className="wg__nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`wg__nav-item${activeId === item.id ? " wg__nav-item--active" : ""}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="wg__nav-icon">{item.icon}</span>
                            <span className="wg__nav-label">{item.label}</span>
                            {item.badge && <span className="wg__nav-badge">{item.badge}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="wg__user">
                    <div className="wg__user-avatar">{ownerInitials}</div>
                    <div className="wg__user-info">
                        <span className="wg__user-name">{ownerName}</span>
                        <span className="wg__user-email">{workspace?.owner?.email || ""}</span>
                    </div>
                    <Link to="/dashboard/settings" className="wg__user-settings">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    </Link>
                </div>
            </aside>

            {sidebarOpen && <div className="wg__overlay" onClick={() => setSidebarOpen(false)} />}

            {/* ══ BODY ══ */}
            <div className="wg__body">

                {/* TOPBAR */}
                <header className="wg__topbar">
                    <button className="wg__hamburger" onClick={() => setSidebarOpen(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <div className="wg__search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" placeholder="Search conversations, customers, or settings..." className="wg__search-input" readOnly />
                        <div className="wg__search-kbd"><span>⌘</span><span>K</span></div>
                    </div>

                    <div className="wg__topbar-right">
                        <div className="wg__trial">
                            Trial: <strong>12 days left</strong>
                            <Link to="/dashboard/billing" className="wg__upgrade">Upgrade</Link>
                        </div>
                        <button className="wg__icon-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <span className="wg__icon-dot" />
                        </button>
                        <button className="wg__icon-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="wg__content-wrap">

                    {/* LEFT — settings panels */}
                    <main className="wg__main">
                        <div className="wg__page-head">
                            <h1 className="wg__page-title">Widget Settings</h1>
                            <p className="wg__page-sub">Customize how the chat widget appears on your website.</p>
                        </div>

                        {/* ── Installation ── */}
                        <div className="wg__card">
                            <div className="wg__card-head">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                                </svg>
                                <h2 className="wg__card-title">Installation</h2>
                            </div>
                            <p className="wg__card-desc">
                                Copy and paste this code
                                into your website before
                                the closing body tag.
                            </p>
                            <div className="wg__code-block">
                                <pre className="wg__code">{widgetCode}</pre>
                                <button className="wg__code-copy" onClick={copyCode} title="Copy code">
                                    {copied ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ── Appearance ── */}
                        <div className="wg__card">
                            <div className="wg__card-head">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="10" r="3" />
                                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                                </svg>
                                <h2 className="wg__card-title">Appearance</h2>
                            </div>

                            {/* Primary color */}
                            <div className="wg__field">
                                <label className="wg__label">Primary Color</label>
                                <div className="wg__colors">
                                    {PRESET_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            className={`wg__color-swatch${primaryColor === c ? " wg__color-swatch--active" : ""}`}
                                            style={{ background: c }}
                                            onClick={() => setPrimaryColor(c)}
                                            title={c}
                                        />
                                    ))}
                                    <div className="wg__color-divider" />
                                    <label className="wg__color-custom" title="Custom color">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                        <input
                                            type="color"
                                            value={customColor}
                                            className="wg__color-input"
                                            onChange={(e) => {
                                                setCustomColor(e.target.value);
                                                setPrimaryColor(e.target.value);
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Welcome message */}
                            <div className="wg__field">
                                <label className="wg__label">Welcome Message</label>
                                <textarea
                                    className="wg__textarea"
                                    rows={3}
                                    value={welcomeMessage}
                                    onChange={(e) => setWelcomeMessage(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* ── Position ── */}
                        <div className="wg__card">
                            <div className="wg__card-head">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                </svg>
                                <h2 className="wg__card-title">Position</h2>
                            </div>
                            <div className="wg__positions">
                                {[
                                    { id: "bottom-right", label: "Bottom Right", dotClass: "wg__pos-dot--right" },
                                    { id: "bottom-left", label: "Bottom Left", dotClass: "wg__pos-dot--left" },
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        className={`wg__pos-card${position === p.id ? " wg__pos-card--active" : ""}`}
                                        onClick={() => setPosition(p.id)}
                                    >
                                        <div className="wg__pos-preview">
                                            <div className={`wg__pos-dot ${p.dotClass}`}
                                                style={{ background: position === p.id ? primaryColor : "#d1d5db" }}
                                            />
                                        </div>
                                        <span className="wg__pos-label">{p.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>



                    </main>


                    <aside className="wg__preview">
                        <div className="wg__preview-label">Live Preview</div>
                        <div className="wg__preview-browser">
                            <div className="wg__preview-bar">
                                <span /><span /><span />
                            </div>
                            <div className="wg__preview-screen">
                                {/* Chat bubble */}
                                <div
                                    className={`wg__preview-bubble wg__preview-bubble--${position === "bottom-right" ? "right" : "left"}`}
                                    style={{ background: primaryColor }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>


                                <div className={`wg__preview-window wg__preview-window--${position === "bottom-right" ? "right" : "left"}`}>
                                    <div className="wg__preview-window-head" style={{ background: primaryColor }}>
                                        <div className="wg__preview-avatar">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="wg__preview-bot-name">AI Assistant</div>
                                            <div className="wg__preview-status">
                                                <span className="wg__preview-status-dot" /> Online
                                            </div>
                                        </div>
                                        <button className="wg__preview-minimize">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                <polyline points="8 3 12 7 16 3" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="wg__preview-messages">
                                        <div className="wg__preview-msg">
                                            {welcomeMessage || "Hi there! 👋 How can we help you today?"}
                                        </div>
                                    </div>
                                    <div className="wg__preview-input">
                                        <span>Send a message...</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
};

export default Widget;