import React, { useState, useEffect, useRef } from "react";
import "./Home.css";


const brands = ["Linear", "Notion", "Vercel", "Stripe", "Loom", "Shopify"];

const features = [
  {
    id: 1,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
    title: "AI Resolution",
    desc: "Instantly resolve common questions with an AI trained on your docs.",
  },
  {
    id: 2,
    featured: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Unified Inbox",
    desc: "Manage chats, emails, and social messages in one blazing-fast inbox.",
  },
  {
    id: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Smart Routing",
    desc: "Automatically route complex issues to the right human agent.",
  },
  {
    id: 4,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Knowledge AI",
    desc: "Connect your website, Zendesk, or Notion to train your AI in seconds.",
  },
  {
    id: 5,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6"  y1="20" x2="6"  y2="14" />
      </svg>
    ),
    title: "Deep Analytics",
    desc: "Measure CSAT, resolution times, and AI deflection rates.",
  },
  {
    id: 6,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Customer Profiles",
    desc: "See full context, past orders, and behavior before you reply.",
  },
];

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$39",
    period: "/mo",
    desc: "Perfect for small teams getting started with AI support.",
    cta: "Start free trial",
    ctaStyle: "outline",
    perks: [
      "Up to 1,000 conversations/mo",
      "Basic AI Assistant",
      "2 team seats",
      "Standard widget",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$99",
    period: "/mo",
    desc: "For growing businesses that need advanced AI capabilities.",
    cta: "Start free trial",
    ctaStyle: "primary",
    popular: true,
    perks: [
      "Up to 5,000 conversations/mo",
      "Advanced AI with custom data",
      "5 team seats",
      "Remove branding",
      "Priority support",
      "Analytics dashboard",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large organizations with complex support needs.",
    cta: "Contact sales",
    ctaStyle: "outline",
    perks: [
      "Unlimited conversations",
      "Custom AI models",
      "Unlimited seats",
      "SSO & Advanced Security",
      "Dedicated success manager",
      "Custom integrations",
    ],
  },
];


function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}


const Home = () => {
  const [visibleMessages, setVisibleMessages] = useState(0);

  const [brandsRef,   brandsInView  ] = useInView(0.15);
  const [featHeadRef, featHeadInView] = useInView(0.15);
  const [featGridRef, featGridInView] = useInView(0.08);
  const [pricingRef,  pricingInView ] = useInView(0.08);
  const [ctaRef,      ctaInView     ] = useInView(0.2);

  useEffect(() => {
    const delays = [800, 1600, 2600, 3400];
    const timers = delays.map((delay, i) =>
      setTimeout(() => setVisibleMessages(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
    
      <section className="home" id="home">
        <div className="home__bg-blob home__bg-blob--1" aria-hidden="true" />
        <div className="home__bg-blob home__bg-blob--2" aria-hidden="true" />
        <div className="home__bg-grid"                  aria-hidden="true" />

        <div className="home__container">
          {/* Left */}
          <div className="home__content">
            <div className="home__badge">
              <span className="home__badge-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#5b4ef5" stroke="#5b4ef5" strokeWidth="1"
                  />
                </svg>
              </span>
              ApexChat AI 2.0 is here
            </div>

            <h1 className="home__headline">
              Customer<br />
              support,<br />
              <span className="home__headline-accent">reimagined</span><br />
              with AI.
            </h1>

            <p className="home__subheadline">
              Resolve 80% of customer inquiries instantly with an AI assistant
              that learns your business, speaks your brand's tone, and seamlessly
              hands off to human agents.
            </p>

            <div className="home__ctas">
              <a href="/signup" className="home__cta-primary">
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#demo" className="home__cta-secondary">
                <span className="home__play-icon">
                  <svg width="12" height="13" viewBox="0 0 12 14" fill="currentColor">
                    <path d="M1 1l10 6-10 6V1z" />
                  </svg>
                </span>
                Watch demo
              </a>
            </div>

            <p className="home__trust">Free 14-day trial. No credit card required.</p>
          </div>

          {/* Right — chat widget */}
          <div className="home__widget-wrap">
            <div className="home__widget">
              <div className="home__widget-header">
                <div className="home__widget-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5"
                    />
                  </svg>
                </div>
                <div className="home__widget-info">
                  <span className="home__widget-name">ApexChat AI</span>
                  <span className="home__widget-status">
                    <span className="home__status-dot" />
                    Online and ready to help
                  </span>
                </div>
              </div>

              <div className="home__widget-messages">
                {visibleMessages >= 1 && (
                  <div className="home__msg home__msg--user home__msg--enter">
                    How do I integrate with Shopify?
                  </div>
                )}
                {visibleMessages >= 2 && (
                  <div className="home__msg home__msg--bot home__msg--enter">
                    <p className="home__bot-text">
                      I can help with that! Integrating with Shopify takes just a few clicks.
                    </p>
                    <div className="home__msg-options">
                      <button className="home__option-btn">
                        View integration guide
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                      <button className="home__option-btn">
                        Talk to a human
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                {visibleMessages >= 3 && (
                  <div className="home__msg home__msg--user home__msg--enter">
                    The guide is perfect, thanks!
                  </div>
                )}
                {visibleMessages >= 4 && (
                  <div className="home__msg home__msg--bot home__msg--enter home__msg--typing">
                    <span className="home__typing-dot" />
                    <span className="home__typing-dot" />
                    <span className="home__typing-dot" />
                  </div>
                )}
              </div>

              <div className="home__widget-input">
                <input type="text" placeholder="Type your message..." className="home__input" readOnly />
                <button className="home__input-btn" aria-label="Send">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </button>
              </div>
            </div>

            <button className="home__chat-bubble" aria-label="Open chat">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. BRANDS STRIP
      ══════════════════════════════════════ */}
      <section className="brands" ref={brandsRef}>
        <div className="brands__container">
          <p className={`brands__label${brandsInView ? " brands__label--visible" : ""}`}>
            TRUSTED BY INNOVATIVE TEAMS WORLDWIDE
          </p>
          <div className={`brands__list${brandsInView ? " brands__list--visible" : ""}`}>
            {brands.map((b, i) => (
              <span key={b} className="brands__name" style={{ animationDelay: `${0.08 * i}s` }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. FEATURES
      ══════════════════════════════════════ */}
      <section className="features" id="product">
        <div className="features__container">
          <div
            className={`features__head${featHeadInView ? " features__head--visible" : ""}`}
            ref={featHeadRef}
          >
            <h2 className="features__title">Everything you need to scale support</h2>
            <p className="features__subtitle">
              A complete platform that combines the power of AI with the empathy of human agents.
            </p>
          </div>

          <div
            className={`features__grid${featGridInView ? " features__grid--visible" : ""}`}
            ref={featGridRef}
          >
            {features.map((f, i) => (
              <div
                key={f.id}
                className={`features__card${f.featured ? " features__card--featured" : ""}`}
                style={{ animationDelay: `${0.09 * i}s` }}
              >
                <div className="features__card-icon">{f.icon}</div>
                <h3 className="features__card-title">{f.title}</h3>
                <p className="features__card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. PRICING
      ══════════════════════════════════════ */}
      <section className="pricing" id="pricing" ref={pricingRef}>
        <div className="pricing__container">
          <div className={`pricing__head${pricingInView ? " pricing__head--visible" : ""}`}>
            <h2 className="pricing__title">Simple, transparent pricing</h2>
            <p className="pricing__subtitle">Start for free, upgrade when you need more power.</p>
          </div>

          <div className={`pricing__grid${pricingInView ? " pricing__grid--visible" : ""}`}>
            {plans.map((plan, i) => (
              <div
                key={plan.id}
                className={`pricing__card${plan.popular ? " pricing__card--popular" : ""}`}
                style={{ animationDelay: `${0.12 * i}s` }}
              >
                {plan.popular && (
                  <div className="pricing__badge">MOST POPULAR</div>
                )}
                <div className="pricing__card-head">
                  <h3 className="pricing__plan-name">{plan.name}</h3>
                  <div className="pricing__price-row">
                    <span className="pricing__price">{plan.price}</span>
                    {plan.period && <span className="pricing__period">{plan.period}</span>}
                  </div>
                  <p className="pricing__plan-desc">{plan.desc}</p>
                </div>

                <a
                  href="#get-started"
                  className={`pricing__cta pricing__cta--${plan.ctaStyle}`}
                >
                  {plan.cta}
                </a>

                <ul className="pricing__perks">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="pricing__perk">
                      <span className="pricing__check" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. BOTTOM CTA BANNER
      ══════════════════════════════════════ */}
      <section className="cta-banner" ref={ctaRef}>
        <div className={`cta-banner__card${ctaInView ? " cta-banner__card--visible" : ""}`}>
          <div className="cta-banner__glow cta-banner__glow--left"  aria-hidden="true" />
          <div className="cta-banner__glow cta-banner__glow--right" aria-hidden="true" />
          <h2 className="cta-banner__title">Ready to transform your support?</h2>
          <p className="cta-banner__subtitle">
            Join thousands of companies using ApexChat AI to deliver faster, smarter customer service.
          </p>
          <a href="/signup" className="cta-banner__btn">
            Get Started for Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. FOOTER
      ══════════════════════════════════════ */}
      <footer className="footer">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white" stroke="white" strokeWidth="0.5"
                  />
                </svg>
              </div>
              <span className="footer__logo-text">ApexChat AI</span>
            </div>
            <p className="footer__tagline">
              The modern AI customer support platform for forward-thinking teams.
            </p>
          </div>

          {/* Link columns */}
          <nav className="footer__nav">
            {[
              { heading: "Product",   links: ["Features", "Integrations", "Pricing", "Changelog"] },
              { heading: "Resources", links: ["Documentation", "Blog", "Help Center", "Community"] },
              { heading: "Company",   links: ["About", "Careers", "Legal", "Contact"] },
            ].map((col) => (
              <div key={col.heading} className="footer__col">
                <h4 className="footer__col-heading">{col.heading}</h4>
                <ul className="footer__col-list">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="footer__link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="footer__copy">© 2026 ApexChat AI Inc. All rights reserved.</p>
          <div className="footer__socials">
            <a href="https://x.com/Jesutofunm50939" className="footer__social-link">Twitter</a>
            <a href="#" className="footer__social-link">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;