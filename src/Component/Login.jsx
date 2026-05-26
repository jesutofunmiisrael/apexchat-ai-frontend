import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./Login.css";

const LoginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

 const onSubmit = async (data) => {

  setLoading(true);

  try {

    const res = await fetch(
      "https://ai-business-chat-saas-backend.onrender.com/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      }
    );

    const result =
      await res.json();

    if (!res.ok) {
      throw new Error(
        result.message ||
        "Failed to log in"
      );
    }

    localStorage.setItem(
      "token",
      result.token
    );

    toast.success(
      "Welcome back! ✅"
    );

    navigate("/dashboard");

  } catch (error) {

    toast.error(
      error.message ||
      "Something went wrong"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="login">

      {/* ── Header ── */}
      <header className="login__header">
        <Link to="/" className="login__logo">
          <div className="login__logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="white" stroke="white" strokeWidth="0.5"
              />
            </svg>
          </div>
          <span className="login__logo-text">ApexChat AI</span>
        </Link>
        <p className="login__header-cta">
          No account?{" "}
          <Link to="/signup" className="login__header-link">Sign up free</Link>
        </p>
      </header>

      {/* ── Main split ── */}
      <main className="login__main">

        {/* LEFT — form */}
        <div className="login__left">
          <div className="login__form-wrap">

            <div className="login__form-head">
              <h1 className="login__title">Welcome back</h1>
              <p className="login__subtitle">Sign in to your account to continue.</p>
            </div>

            <form className="login__form" onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* Email */}
              <div className="login__field">
                <label className="login__label" htmlFor="email">Work email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane@company.com"
                  className={`login__input${errors.email ? " login__input--error" : ""}`}
                  {...register("email")}
                />
                {errors.email && <p className="login__error">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="login__field">
                <div className="login__label-row">
                  <label className="login__label" htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="login__forgot">Forgot password?</Link>
                </div>
                <div className="login__input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`login__input login__input--pw${errors.password ? " login__input--error" : ""}`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="login__pw-toggle"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="login__error">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button type="submit" className="login__submit" disabled={loading}>
                {loading ? (
                  <span className="login__spinner" />
                ) : (
                  <>
                    Sign in
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="login__divider"><span>Or continue with</span></div>

              {/* Social */}
              <div className="login__socials">
                <button type="button" className="login__social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="login__social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M11.4 24H0V12.6L11.4 24z" fill="#F25022"/>
                    <path d="M24 0H12.6v11.4L24 0z" fill="#7FBA00"/>
                    <path d="M0 12.6V24h11.4L0 12.6z" fill="#00A4EF"/>
                    <path d="M12.6 12.6V24H24L12.6 12.6z" fill="#FFB900"/>
                  </svg>
                  Microsoft
                </button>
              </div>

              <p className="login__signup-link">
                Don't have an account?{" "}
                <Link to="/signup" className="login__signup-anchor">Create one free</Link>
              </p>

            </form>
          </div>
        </div>

        {/* RIGHT — social proof */}
        <div className="login__right">
          <div className="login__right-inner">

            {/* Testimonial */}
            <div className="login__testimonial">
              <div className="login__stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <blockquote className="login__quote">
                "ApexChat AI completely transformed our support operations. We're now resolving 75% of inquiries automatically, and our human agents can focus on complex issues."
              </blockquote>
              <div className="login__author">
                <div className="login__avatar">SJ</div>
                <div className="login__author-info">
                  <span className="login__author-name">Sarah Jenkins</span>
                  <span className="login__author-role">VP of Customer Success, TechFlow</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="login__stats">
              <div className="login__stat">
                <span className="login__stat-num">2.4x</span>
                <span className="login__stat-label">Faster response time</span>
              </div>
              <div className="login__stat">
                <span className="login__stat-num">80%</span>
                <span className="login__stat-label">Resolution rate</span>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default Login;