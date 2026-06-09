import { useState } from "react";

const inputClass =
  "w-full bg-surface border border-border-bright text-text font-mono text-base sm:text-sm px-4 py-3.5 outline-none transition-colors focus:border-accent placeholder:text-muted";

export default function AdminLogin({ onLogin, signingIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-border bg-surface p-6 sm:p-8">
        <div className="font-sans font-extrabold text-[11px] tracking-[0.2em] uppercase text-accent mb-2">
          Ottermap Admin
        </div>
        <h1 className="font-sans font-extrabold text-2xl text-text mb-6">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-[11px] tracking-[0.15em] uppercase text-muted mb-2">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={inputClass}
              placeholder="admin@ottermap.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-[11px] tracking-[0.15em] uppercase text-muted mb-2">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <button
            type="submit"
            disabled={signingIn}
            className="w-full bg-accent text-black font-sans font-bold text-xs tracking-[0.15em] uppercase py-3.5 disabled:opacity-40"
          >
            {signingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
