import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import posthog from "posthog-js";

const status = import.meta.env.VITE_APP_STATUS;

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    posthog.capture("registration_page_viewed", {
      app_status: status,
    });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    posthog.capture("registration_attempted", {
      has_at_symbol: email.includes("@"),
      password_length: password.length,
    });

    if (!email.includes("@") || password.length < 8) {
      setMessage("Registration failed");
      posthog.capture("registration_failed", {
        reason: !email.includes("@") ? "invalid_email" : "password_too_short",
      });
      return;
    }

    posthog.capture("user_registered", {
      app_status: status,
      email_domain: email.split("@")[1] ?? "unknown",
    });
    setMessage("Registration successful");
  };

  return (
    <main className="app-shell">
      <section className="panel" style={{ maxWidth: 560, width: "100%", margin: "0 auto" }}>
        <p className="panel-label">Registration flow</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)", marginBottom: 12 }}>
          Test a success and failure funnel.
        </h1>
        <p className="hero-copy" style={{ marginBottom: 28 }}>
          This form sends page view, attempt, failure, and success events so we can validate
          a slightly more realistic user journey in PostHog.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              data-testid="email-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@example.com"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              data-testid="password-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
            />
          </label>

          <div className="button-row" style={{ marginTop: 20 }}>
            <button data-testid="submit-button" type="submit">
              Sign up
            </button>
            <Link className="secondary-link" to="/">
              Back to playground
            </Link>
          </div>
        </form>

        {message ? (
          <p
            data-testid="registration-message"
            style={{
              marginTop: 20,
              padding: "14px 16px",
              borderRadius: 18,
              background: "rgba(245, 240, 230, 0.75)",
            }}
          >
            {message}
          </p>
        ) : null}

        <p style={{ marginTop: 18, color: "#58627a" }}>App mode: {status}</p>
      </section>
    </main>
  );
}
