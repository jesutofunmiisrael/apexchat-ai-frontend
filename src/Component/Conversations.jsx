import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner";
import "./Conversations.css";

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
    id: "settings", label: "Settings", path: "/dashboard/settings",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  },
  {
    id: "billing", label: "Billing", path: "/under-construction",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
];

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}s`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const Conversations = () => {
  const location       = useLocation();
  const navigate       = useNavigate();
  const messagesEndRef = useRef(null);
  const socketRef      = useRef(null);

  const [workspace,     setWorkspace    ] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selected,      setSelected     ] = useState(null);
  const [loading,       setLoading      ] = useState(true);
  const [search,        setSearch       ] = useState("");
  const [reply,         setReply        ] = useState("");
  const [sending,       setSending      ] = useState(false);
  const [sidebarOpen,   setSidebarOpen  ] = useState(false);

  const activeId = "conversations";

  /* ── 1. Fetch workspace + conversations ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const init = async () => {
      try {
        const [wsRes, convRes] = await Promise.all([
          fetch(`${BASE_URL}/api/workspaces/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/api/ai/conversations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const wsData   = await wsRes.json();
        const convData = await convRes.json();
        if (!wsRes.ok)   throw new Error(wsData.message);
        if (!convRes.ok) throw new Error(convData.message);
        setWorkspace(wsData);
        setConversations(convData);
        if (convData.length > 0) setSelected(convData[0]);
      } catch (err) {
        toast.error(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /* ── 2. Socket.io — connect once, join room on selected change ── */
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Connect socket once
    socketRef.current = io(BASE_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.log("Socket error:", err.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  /* ── 3. Join conversation room when selected changes ── */
  useEffect(() => {
    if (!selected?._id || !socketRef.current) return;

    // Join the selected conversation room
    socketRef.current.emit("joinConversation", selected._id);

    // Listen for new messages in this conversation
    const handleNewMessage = ({ conversationId, messages }) => {
      if (conversationId === selected._id) {
        // Replace messages from socket (prevents duplicates)
        setSelected(prev => ({
          ...prev,
          messages,
        }));
        setConversations(prev =>
          prev.map(c =>
            c._id === conversationId
              ? { ...c, messages }
              : c
          )
        );
      }
    };

    socketRef.current.on("newMessage", handleNewMessage);

    return () => {
      socketRef.current?.off("newMessage", handleNewMessage);
    };
  }, [selected?._id]);

  /* ── 4. Auto-scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  /* ── 5. Logout ── */
  const handleLogout = () => {
    socketRef.current?.disconnect();
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  /* ── 6. Send reply — correct endpoint ── */
  const handleSend = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${BASE_URL}/api/ai/conversations/${selected._id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: reply }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send");

      setSelected(
  data.conversation
);

setConversations(prev =>
  prev.map(c =>
    c._id ===
    selected._id

      ? data.conversation

      : c
  )
);
    
      setReply("");
      toast.success("Reply sent!");
    } catch (err) {
      toast.error(err.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const filteredConvos = conversations.filter(c =>
    c.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="conv__loading-screen">
        <div className="conv__spinner" />
        <p>Loading conversations...</p>
      </div>
    );
  }

  const ownerName      = workspace?.owner?.name || "User";
  const ownerInitials  = getInitials(ownerName);
  const companyInitial = (workspace?.companyName || "A")[0].toUpperCase();

  return (
    <div className="conv">

      {/* ══ SIDEBAR NAV ══ */}
      <aside className={`conv__sidenav${sidebarOpen ? " conv__sidenav--open" : ""}`}>
        <div className="conv__workspace">
          <div className="conv__workspace-icon">{companyInitial}</div>
          <div className="conv__workspace-info">
            <span className="conv__workspace-name">{workspace?.companyName || "My Company"}</span>
            <span className="conv__workspace-plan">Growth Plan</span>
          </div>
          <button className="conv__workspace-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <nav className="conv__nav">
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`conv__nav-item${activeId === item.id ? " conv__nav-item--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="conv__nav-icon">{item.icon}</span>
              <span className="conv__nav-label">{item.label}</span>
              {item.id === "conversations" && conversations.length > 0 && (
                <span className="conv__nav-badge">{conversations.length}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="conv__user">
          <div className="conv__user-avatar">{ownerInitials}</div>
          <div className="conv__user-info">
            <span className="conv__user-name">{ownerName}</span>
            <span className="conv__user-email">{workspace?.owner?.email || ""}</span>
          </div>
          <button className="conv__logout-btn" onClick={handleLogout} title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="conv__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ══ BODY ══ */}
      <div className="conv__body">

        {/* TOPBAR */}
        <header className="conv__topbar">
          <button className="conv__hamburger" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="conv__topbar-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search conversations, customers, or settings..." readOnly className="conv__topbar-input" />
            <div className="conv__topbar-kbd"><span>⌘</span><span>K</span></div>
          </div>
          <div className="conv__topbar-right">
            <div className="conv__trial">
              Trial: <strong>12 days left</strong>
              <Link to="/under-construction" className="conv__upgrade">Upgrade</Link>
            </div>
            <button className="conv__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="conv__icon-dot"/>
            </button>
            <button className="conv__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
          </div>
        </header>

        {/* ══ LAYOUT ══ */}
        <div className="conv__layout">

          {/* LIST PANEL */}
          <div className="conv__list-panel">
            <div className="conv__list-head">
              <div className="conv__list-title-row">
                <h2 className="conv__list-title">Conversations</h2>
                <span className="conv__list-count">{conversations.length}</span>
              </div>
              <div className="conv__list-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="conv__list-search-input"
                />
                <button className="conv__filter-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="conv__list">
              {filteredConvos.length === 0 ? (
                <div className="conv__list-empty">No conversations found</div>
              ) : (
                filteredConvos.map(c => (
                  <div
                    key={c._id}
                    className={`conv__item${selected?._id === c._id ? " conv__item--active" : ""}`}
                    onClick={() => setSelected(c)}
                  >
                    <div className="conv__item-avatar">
                      {getInitials(c.customerName)}
                      <span className={`conv__item-dot conv__item-dot--${
                        c.status === "open" || c.status === "ai" ? "green" : "gray"
                      }`} />
                    </div>
                    <div className="conv__item-body">
                      <div className="conv__item-row">
                        <span className="conv__item-name">{c.customerName || "Guest"}</span>
                        <span className="conv__item-time">{formatTime(c.updatedAt || c.createdAt)}</span>
                      </div>
                      <div className="conv__item-row">
                        <span className="conv__item-preview">
                          {c.messages?.[c.messages.length - 1]?.text || "No messages yet"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="conv__chat">
            {selected ? (
              <>
                {/* Chat header */}
                <div className="conv__chat-head">
                  <div className="conv__chat-head-left">
                    <div className="conv__chat-avatar">{getInitials(selected.customerName)}</div>
                    <div>
                      <h3 className="conv__chat-name">{selected.customerName || "Guest"}</h3>
                      <span className={`conv__chat-status conv__chat-status--${selected.status}`}>
                        {selected.status}
                      </span>
                    </div>
                  </div>
                  <div className="conv__chat-head-right">
                    <span className={`conv__chat-tag conv__chat-tag--${selected.status === "human" ? "human" : "ai"}`}>
                      {selected.status === "human" ? (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Human</>
                      ) : (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> AI Handled</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="conv__messages">
                  {selected.messages?.length === 0 ? (
                    <div className="conv__messages-empty">No messages yet</div>
                  ) : (
                    <>
                      <div className="conv__date-divider">
                        <span>Today, {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      {selected.messages.map((msg, i) => (
                        <div
                          key={`${msg._id || i}-${msg.sender}`}
                          className={`conv__msg conv__msg--${
                            msg.sender === "customer" ? "customer" : "agent"
                          }`}
                        >
                          {msg.sender === "customer" && (
                            <div className="conv__msg-avatar">{getInitials(selected.customerName)}</div>
                          )}
                          <div className="conv__msg-bubble">
                            {msg.sender !== "customer" && (
                              <span className="conv__msg-sender">
                                {msg.sender === "ai" ? "AI" : "You"}
                              </span>
                            )}
                            <p className="conv__msg-text">{msg.text}</p>
                            <span className="conv__msg-time">
                              {msg.createdAt ? formatTime(msg.createdAt) : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Reply */}
                <div className="conv__reply">
                  <div className="conv__reply-actions">
                    <button className="conv__reply-suggest">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                      Suggest reply
                    </button>
                    <button className="conv__reply-article">Insert help article</button>
                  </div>
                  <div className="conv__reply-box">
                    <textarea
                      className="conv__reply-input"
                      placeholder={`Reply to ${selected.customerName?.split(" ")[0] || "customer"}...`}
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      rows={3}
                    />
                    <div className="conv__reply-footer">
                      <div className="conv__reply-tools">
                        <button className="conv__tool-btn" title="Attach file">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                          </svg>
                        </button>
                        <button className="conv__tool-btn" title="Image">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </button>
                        <button className="conv__tool-btn" title="Emoji">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
                            <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                          </svg>
                        </button>
                        <button className="conv__tool-btn" title="More">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                          </svg>
                        </button>
                      </div>
                      <button
                        className="conv__send-btn"
                        onClick={handleSend}
                        disabled={sending || !reply.trim()}
                      >
                        {sending ? (
                          <span className="conv__send-spinner" />
                        ) : (
                          <>
                            Send
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="22" y1="2" x2="11" y2="13"/>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="conv__empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversations;