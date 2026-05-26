import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./SignupWorkspace.css";

/* ── Validation ── */
const WorkspaceSchema = yup.object({
  companyName:    yup.string().required("Company name is required").min(2, "At least 2 characters"),
  companyWebsite: yup.string().required("Company website is required").url("Enter a valid URL (e.g. https://acme.com)"),
  companySize:    yup.string().required("Please select a company size"),
  industry:       yup.string().required("Please select an industry"),
});

const SIZES      = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
const INDUSTRIES = ["SaaS", "E-commerce", "Fintech", "Healthcare", "Other"];

/* ── Custom select ── */
const CustomSelect = ({ value, onChange, options, placeholder, icon, error }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <div className={`ws-select${open ? " ws-select--open" : ""}${error ? " ws-select--error" : ""}`}>
      <button type="button" className="ws-select__trigger" onClick={() => setOpen((o) => !o)}>
        <span className="ws-select__icon">{icon}</span>
        <span className={`ws-select__value${!value ? " ws-select__value--placeholder" : ""}`}>
          {value || placeholder}
        </span>
        <span className="ws-select__arrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <ul className="ws-select__dropdown">
          {options.map((opt) => (
            <li
              key={opt}
              className={`ws-select__option${value === opt ? " ws-select__option--active" : ""}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ── Component ── */
const SignupWorkspace = () => {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(WorkspaceSchema),
    defaultValues: {
      companyName:    "",
      companyWebsite: "",
      companySize:    "",
      industry:       "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://ai-business-chat-saas-backend.onrender.com/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName:    data.companyName,
          companyWebsite: data.companyWebsite,
          companySize:    data.companySize,
          industry:       data.industry,
        }),
      });

      const result = await response.json();

if (!response.ok) {
  throw new Error(
    result.message ||
    "Failed to save workspace"
  );
}

toast.success(
  "Workspace created! ✅"
);

navigate("/signup/ai");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ws">
      {/* ── Header ── */}
      <header className="ws__header">
        <Link to="/" className="ws__logo">
          <div className="ws__logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="white" stroke="white" strokeWidth="0.5"
              />
            </svg>
          </div>
          <span className="ws__logo-text">ApexChat AI</span>
        </Link>

        {/* Step progress */}
        <div className="ws__steps">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`ws__step${s < 2 ? " ws__step--done" : s === 2 ? " ws__step--active" : ""}`}>
                {s < 2 ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : s}
              </div>
              {s < 3 && <div className={`ws__step-line${s < 2 ? " ws__step-line--done" : ""}`} />}
            </React.Fragment>
          ))}
          <span className="ws__step-label">Step 2 of 3</span>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="ws__main">

        {/* LEFT — form */}
        <div className="ws__left">
          <div className="ws__form-wrap">
            <div className="ws__form-head">
              <h1 className="ws__title">Tell us about your company</h1>
              <p className="ws__subtitle">This helps us tailor your AI assistant's initial knowledge.</p>
            </div>

            <form className="ws__form" onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* Company name */}
              <div className="ws__field">
                <label className="ws__label" htmlFor="companyName">Company name</label>
                <div className="ws__input-wrap">
                  <span className="ws__input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </span>
                  <input
                    id="companyName"
                    type="text"
                    placeholder="Acme Corp"
                    className={`ws__input ws__input--icon${errors.companyName ? " ws__input--error" : ""}`}
                    {...register("companyName")}
                  />
                </div>
                {errors.companyName && <p className="ws__error">{errors.companyName.message}</p>}
              </div>

              {/* Company website */}
              <div className="ws__field">
                <label className="ws__label" htmlFor="companyWebsite">Company website</label>
                <div className="ws__input-wrap">
                  <span className="ws__input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </span>
                  <input
                    id="companyWebsite"
                    type="url"
                    placeholder="https://acme.com"
                    className={`ws__input ws__input--icon${errors.companyWebsite ? " ws__input--error" : ""}`}
                    {...register("companyWebsite")}
                  />
                </div>
                {errors.companyWebsite && <p className="ws__error">{errors.companyWebsite.message}</p>}
              </div>

              {/* Company size + Industry — 2 col */}
              <div className="ws__row">
                <div className="ws__field">
                  <label className="ws__label">Company size</label>
                  <Controller
                    name="companySize"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={SIZES}
                        placeholder="1-10"
                        error={!!errors.companySize}
                        icon={
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        }
                      />
                    )}
                  />
                  {errors.companySize && <p className="ws__error">{errors.companySize.message}</p>}
                </div>

                <div className="ws__field">
                  <label className="ws__label">Industry</label>
                  <Controller
                    name="industry"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={INDUSTRIES}
                        placeholder="SaaS"
                        error={!!errors.industry}
                        icon={
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M8 21h8M12 17v4" />
                          </svg>
                        }
                      />
                    )}
                  />
                  {errors.industry && <p className="ws__error">{errors.industry.message}</p>}
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="ws__submit" disabled={loading}>
                {loading ? (
                  <span className="ws__spinner" />
                ) : (
                  <>
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT — social proof (same as signup) */}
        <div className="ws__right">
          <div className="ws__right-inner">
            <div className="ws__testimonial">
              <div className="ws__stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <blockquote className="ws__quote">
                "ApexChat AI completely transformed our support operations. We're now resolving 75% of inquiries automatically, and our human agents can focus on complex issues."
              </blockquote>
              <div className="ws__author">
                <div className="ws__avatar">SJ</div>
                <div className="ws__author-info">
                  <span className="ws__author-name">Sarah Jenkins</span>
                  <span className="ws__author-role">VP of Customer Success, TechFlow</span>
                </div>
              </div>
            </div>

            <div className="ws__stats">
              <div className="ws__stat">
                <span className="ws__stat-num">2.4x</span>
                <span className="ws__stat-label">Faster response time</span>
              </div>
              <div className="ws__stat">
                <span className="ws__stat-num">80%</span>
                <span className="ws__stat-label">Resolution rate</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default SignupWorkspace;