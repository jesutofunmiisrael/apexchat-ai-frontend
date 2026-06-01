import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Customers.css";

const BASE_URL = "https://ai-business-chat-saas-backend.onrender.com";
const PER_PAGE = 10;

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
  { id: "analytics",     label: "Analytics",     path: "/under-construction",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { id: "settings",      label: "Settings",      path: "/under-construction",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  { id: "billing",       label: "Billing",       path: "/under-construction",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
];

/* ── helpers ── */
const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const formatTime = (dateStr) => {
  if (!dateStr) return "—";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
  if (diff < 172800) return "Yesterday";
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return new Date(dateStr).toLocaleDateString("en", { month: "short", day: "numeric" });
};

/* Build unique customer list from conversations */
const buildCustomers = (conversations) => {
  const map = new Map();
  conversations.forEach(conv => {
    const key = conv.customerEmail || conv.customerName || conv._id;
    if (!map.has(key)) {
      map.set(key, {
        id:            conv._id,
        name:          conv.customerName || "Guest",
        email:         conv.customerEmail || "—",
        conversations: 0,
        lastSeen:      conv.updatedAt || conv.createdAt,
        status:        conv.status,
      });
    }
    const c = map.get(key);
    c.conversations += 1;
    const d = new Date(conv.updatedAt || conv.createdAt);
    if (d > new Date(c.lastSeen)) c.lastSeen = conv.updatedAt || conv.createdAt;
  });
  return Array.from(map.values()).sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));
};

const Customers = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [workspace,   setWorkspace  ] = useState(null);
  const [customers,   setCustomers  ] = useState([]);
  const [loading,     setLoading    ] = useState(true);
  const [search,      setSearch     ] = useState("");
  const [page,        setPage       ] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeId = "customers";

  /* ── Fetch ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAll = async () => {
      try {
        const [wsRes, convRes] = await Promise.all([
          fetch(`${BASE_URL}/api/workspaces/me`,       { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE_URL}/api/ai/conversations`,    { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const wsData   = await wsRes.json();
        const convData = await convRes.json();
        if (!wsRes.ok)   throw new Error(wsData.message);
        if (!convRes.ok) throw new Error(convData.message);
        setWorkspace(wsData);
        setCustomers(buildCustomers(Array.isArray(convData) ? convData : []));
      } catch (err) {
        toast.error(err.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };


  const exportCSV = () => {
    if (customers.length === 0) return toast.error("No customers to export");
    const rows = [
      ["Name", "Email", "Last Seen", "Conversations", "Status"],
      ...customers.map(c => [c.name, c.email, formatTime(c.lastSeen), c.conversations, c.status]),
    ];
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "customers.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported! ✅");
  };

  /* ── Filter + paginate ── */
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="cust__loading">
        <div className="cust__spinner" />
        <p>Loading customers...</p>
      </div>
    );
  }

  const ownerName      = workspace?.owner?.name || "User";
  const ownerInitials  = getInitials(ownerName);
  const companyInitial = (workspace?.companyName || "A")[0].toUpperCase();

  return (
    <div className="cust">

      {/* ══ SIDEBAR ══ */}
      <aside className={`cust__sidebar${sidebarOpen ? " cust__sidebar--open" : ""}`}>
        <div className="cust__workspace">
          <div className="cust__workspace-icon">{companyInitial}</div>
          <div className="cust__workspace-info">
            <span className="cust__workspace-name">{workspace?.companyName || "My Company"}</span>
            <span className="cust__workspace-plan">Growth Plan</span>
          </div>
          <button className="cust__workspace-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <nav className="cust__nav">
          {navItems.map(item => (
            <Link key={item.id} to={item.path}
              className={`cust__nav-item${activeId === item.id ? " cust__nav-item--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="cust__nav-icon">{item.icon}</span>
              <span className="cust__nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="cust__user">
          <div className="cust__user-avatar">{ownerInitials}</div>
          <div className="cust__user-info">
            <span className="cust__user-name">{ownerName}</span>
            <span className="cust__user-email">{workspace?.owner?.email || ""}</span>
          </div>
          <button className="cust__logout-btn" onClick={handleLogout} title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="cust__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ══ BODY ══ */}
      <div className="cust__body">

        {/* TOPBAR */}
        <header className="cust__topbar">
          <button className="cust__hamburger" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="cust__search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search conversations, customers, or settings..." className="cust__search-input" readOnly />
            <div className="cust__search-kbd"><span>⌘</span><span>K</span></div>
          </div>
          <div className="cust__topbar-right">
            <div className="cust__trial">
              Trial: <strong>12 days left</strong>
              <Link to="/under-construction" className="cust__upgrade">Upgrade</Link>
            </div>
            <button className="cust__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="cust__icon-dot"/>
            </button>
            <button className="cust__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="cust__main">

          {/* Page header */}
          <div className="cust__page-head">
            <div>
              <h1 className="cust__page-title">Customers</h1>
              <p className="cust__page-sub">Manage and view your customer base.</p>
            </div>
            <button className="cust__export-btn" onClick={exportCSV}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </button>
          </div>

          {/* Table card */}
          <div className="cust__card">

            {/* Search + filter */}
            <div className="cust__card-head">
              <div className="cust__filter-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search customers by name, email, or company..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="cust__filter-input"
                />
              </div>
              <button className="cust__filter-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filters
              </button>
            </div>

            {/* Empty state */}
            {customers.length === 0 ? (
              <div className="cust__empty">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <h3>No customers yet</h3>
                <p>Customers will appear here once they start chatting through your widget.</p>
                <Link to="/dashboard/widget" className="cust__empty-link">Install widget →</Link>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="cust__table-wrap">
                  <table className="cust__table">
                    <thead>
                      <tr>
                        <th>CUSTOMER</th>
                        <th>LAST SEEN</th>
                        <th>CONVERSATIONS</th>
                        <th>STATUS</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((c) => (
                        <tr key={c.id} className="cust__row">
                          <td>
                            <div className="cust__customer-cell">
                              <div className="cust__avatar">{getInitials(c.name)}</div>
                              <div className="cust__customer-info">
                                <span className="cust__customer-name">{c.name}</span>
                                <span className="cust__customer-email">{c.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="cust__last-seen">{formatTime(c.lastSeen)}</td>
                          <td className="cust__convos">{c.conversations}</td>
                          <td>
                            <span className={`cust__status-badge cust__status-badge--${c.status === "open" || c.status === "ai" ? "active" : "closed"}`}>
                              {c.status === "open" || c.status === "ai" ? "Active" : "Closed"}
                            </span>
                          </td>
                          <td>
                            <Link to="/conversations" className="cust__view-btn" title="View conversations">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="cust__pagination">
                  <span className="cust__pagination-info">
                    Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
                  </span>
                  <div className="cust__pagination-btns">
                    <button
                      className="cust__page-btn"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="cust__page-btn"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Customers;