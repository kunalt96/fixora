import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, signup, getToken, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (isSignup && !name) {
      setError("Name is required for signup.");
      return;
    }

    setSubmitting(true);

    try {
      if (isSignup) {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }

      // After successful auth, send token to backend to verify session
      const token = await getToken();
      if (token) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Backend rejected the token — sign out from Supabase to stay in sync
          await logout();
          setError("Backend verification failed. Please try again.");
          return;
        }

        const userData = await res.json();
        console.log("Authenticated user from backend:", userData);
      }

      navigate("/");
    } catch (err) {
      // If anything fails after Supabase succeeded, sign out to stay in sync
      await logout();
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d121a] text-white flex flex-col items-center relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(74,222,128,0.1),transparent_50%)]"></div>

      {/* Navbar */}
      <nav className="relative z-10 w-full flex justify-between items-center px-6 md:px-12 py-6 md:py-8 max-w-[1200px]">
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold text-white flex items-center gap-2">
            <span className="text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">✔</span>
            Fixora
          </span>
        </div>
      </nav>

      {/* Login Card */}
      <section className="relative z-10 flex flex-col items-center text-center mt-12 md:mt-20 px-6 w-full">
        <h1 className="text-4xl md:text-[48px] font-bold leading-tight mb-3 tracking-tight">
          {isSignup ? "Create an account" : "Welcome back"}
        </h1>
        <p className="text-lg md:text-[20px] text-gray-300 mb-10 leading-relaxed max-w-[500px]">
          {isSignup
            ? "Sign up to start tracking errors with AI."
            : "Sign in to access your Fixora dashboard."}
        </p>

        <div className="bg-[#0d121a]/80 backdrop-blur-md border border-gray-700 rounded-2xl md:rounded-[2rem] p-6 md:p-10 max-w-[420px] w-full shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <form className="text-left flex flex-col gap-5" onSubmit={handleSubmit}>
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition"
                  placeholder="Kunal Tiwari"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition"
                placeholder="••••••••"
              />
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded bg-gray-900 border-gray-700 text-[#4ade80] focus:ring-[#4ade80] focus:ring-offset-gray-900"
                  />
                  <span className="text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-[#4ade80] hover:text-white transition">
                  Forgot password?
                </a>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full text-center bg-gradient-to-b from-[#69f0ae] to-[#34d399] hover:brightness-110 transition duration-300 text-gray-900 px-8 py-3.5 rounded-[12px] font-bold shadow-[0_0_20px_rgba(52,211,153,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Please wait..."
                : isSignup
                ? "Create Account"
                : "Sign In"}
            </button>

            <p className="text-center text-sm text-gray-400 mt-2">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                }}
                className="text-white hover:text-[#4ade80] transition font-medium"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto pb-10 text-[13px] text-gray-400/80 text-center w-full">
        🚀 Fixora is currently in development. Launching publicly soon!
      </footer>
    </div>
  );
}
