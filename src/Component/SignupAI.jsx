import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./SignupAI.css";

/* ── Validation ── */
const AISchema = yup.object({
  businessDescription: yup
    .string()
    .required("Please describe your business")
    .min(20, "At least 20 characters"),
  helpTopics: yup
    .string()
    .required("Please describe what the AI should help with")
    .min(10, "At least 10 characters"),
  tone: yup.string().required("Please select a tone"),
});

const TONES = ["Friendly", "Professional", "Playful", "Concise", "Empathetic"];

/* ── Component ── */
const SignupAI = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState("Professional");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AISchema),
    defaultValues: {
      businessDescription: "",
      helpTopics: "",
      tone: "Professional",
    },
  });

  const handleTone = (tone) => {
    setSelectedTone(tone);
    setValue("tone", tone, { shouldValidate: true });
  };

 const onSubmit = async (data) => {
  setLoading(true);

  const token = localStorage.getItem("token");

  try {

    const response = await fetch(
      "https://ai-business-chat-saas-backend.onrender.com/api/workspaces/ai",
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          businessDescription:
            data.businessDescription,

          aiHelp:
            data.helpTopics,

          tone:
            data.tone,
        }),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
        "Failed to set up AI assistant"
      );
    }

    toast.success(
      "AI Assistant generated! 🚀"
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
    <div className="sai">
      {/* ── Header ── */}
      <header className="sai__header">
        <Link to="/" className="sai__logo">
          <div className="sai__logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="white" stroke="white" strokeWidth="0.5"
              />
            </svg>
          </div>
          <span className="sai__logo-text">ApexChat AI</span>
        </Link>

        {/* Step progress */}
        <div className="sai__steps">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`sai__step${s < 3 ? " sai__step--done" : " sai__step--active"}`}>
                {s < 3 ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : s}
              </div>
              {s < 3 && <div className="sai__step-line sai__step-line--done" />}
            </React.Fragment>
          ))}
          <span className="sai__step-label">Step 3 of 3</span>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="sai__main">

        {/* LEFT — form */}
        <div className="sai__left">
          <div className="sai__form-wrap">

            <div className="sai__form-head">
              <h1 className="sai__title">Set up your AI assistant</h1>
              <p className="sai__subtitle">
                Give your AI some initial instructions on how to handle customers.
              </p>
            </div>

            <form className="sai__form" onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* Describe your business */}
              <div className="sai__field">
                <label className="sai__label" htmlFor="businessDescription">
                  Describe your business
                </label>
                <textarea
                  id="businessDescription"
                  rows={4}
                  placeholder="e.g. We are a B2B SaaS company that provides project management software for remote teams..."
                  className={`sai__textarea${errors.businessDescription ? " sai__textarea--error" : ""}`}
                  {...register("businessDescription")}
                />
                {errors.businessDescription && (
                  <p className="sai__error">{errors.businessDescription.message}</p>
                )}
              </div>

              {/* What should AI help with */}
              <div className="sai__field">
                <label className="sai__label" htmlFor="helpTopics">
                  What should the AI help customers with?
                </label>
                <textarea
                  id="helpTopics"
                  rows={4}
                  placeholder="e.g. Answer pricing questions, help with password resets, explain core features..."
                  className={`sai__textarea${errors.helpTopics ? " sai__textarea--error" : ""}`}
                  {...register("helpTopics")}
                />
                {errors.helpTopics && (
                  <p className="sai__error">{errors.helpTopics.message}</p>
                )}
              </div>

              {/* Tone picker */}
              <div className="sai__field">
                <label className="sai__label">What tone should your AI use?</label>
                <div className="sai__tones">
                  {TONES.map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      className={`sai__tone-btn${selectedTone === tone ? " sai__tone-btn--active" : ""}`}
                      onClick={() => handleTone(tone)}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
                {errors.tone && <p className="sai__error">{errors.tone.message}</p>}
              </div>

              {/* Submit */}
              <button type="submit" className="sai__submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="sai__spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate AI Assistant
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT — social proof */}
        <div className="sai__right">
          <div className="sai__right-inner">

            <div className="sai__testimonial">
              <div className="sai__stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <blockquote className="sai__quote">
                "ApexChat AI completely transformed our support operations. We're now resolving 75% of inquiries automatically, and our human agents can focus on complex issues."
              </blockquote>
              <div className="sai__author">
                <div className="sai__avatar">SJ</div>
                <div className="sai__author-info">
                  <span className="sai__author-name">Sarah Jenkins</span>
                  <span className="sai__author-role">VP of Customer Success, TechFlow</span>
                </div>
              </div>
            </div>

            <div className="sai__stats">
              <div className="sai__stat">
                <span className="sai__stat-num">2.4x</span>
                <span className="sai__stat-label">Faster response time</span>
              </div>
              <div className="sai__stat">
                <span className="sai__stat-num">80%</span>
                <span className="sai__stat-label">Resolution rate</span>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default SignupAI;