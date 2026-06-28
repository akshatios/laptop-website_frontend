import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import apiFetch from "../utils/apiFetch";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/";

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch(`/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail?.message || "Google login failed");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google login failed"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiFetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: formData.identifier, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (data.user?.role === 'superadmin') {
        localStorage.setItem('admin_token', data.token);
        window.location.href = '/admin';
        return;
      }
      if (formData.remember) localStorage.setItem("token", data.token);
      else sessionStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("authChange"));
      navigate(redirectTo === "/" || !redirectTo ? "/" : `/${redirectTo}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center px-[16px] md:px-[40px] py-[32px] relative overflow-hidden min-h-screen"
      style={{ background: "radial-gradient(circle at top left, #f7f9fb 0%, #eceef0 100%)" }}>

      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "#d8e2ff" }} />
        <div className="absolute bottom-1/4 -right-48 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "#dae2fd", filter: "blur(100px)" }} />
        <div className="absolute top-1/2 left-1/4 w-1 h-64"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(0,88,190,0.2), transparent)" }} />
      </div>

      {/* Login Container */}
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-xl overflow-hidden relative z-10"
        style={{ background: "#ffffff" }}>

        {/* Branding Side (Desktop Only) */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative"
          style={{ background: "#131b2e", color: "#ffffff" }}>
          <div className="z-10">
            <h1 className="text-[32px] leading-[40px] font-bold tracking-tighter text-white">TECHNOVA</h1>
            <p className="mt-4 text-[18px] leading-[28px] max-w-xs" style={{ color: "#7c839b" }}>
              Elevate your performance with next-generation engineering.
            </p>
          </div>
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz9rQ1XjYOKAezqp6Sl5yHv2UJSKL2U2Vmc31GqTECI90xKf2fvVoRzN42tsg5c3cfgNeCsA_f8WDO4vysI5v46Ea-WpyC7X2Y4rQycy2EmpD9YpYxKMpYVvkzDfkkP3Uj45FqRQz-TweKK8gelzvzGMkwYAUPEcZGmzSfpohflcH325FBYZHujYpc2Kqusir58pqtyMmq0hZlQdoSU4tiSCCw0KYmAAqFSDYuu1BN-74KF4EKsA81JR9BX8ya1HqE45qpeZoC0w"
              alt="Technova workstation"
            />
          </div>
          <div className="z-10 flex items-center gap-4" style={{ color: "#7c839b" }}>
            <span className="material-symbols-outlined" style={{ color: "#d8e2ff" }}>verified</span>
            <span className="text-[14px] leading-[20px] font-medium">Secured by Technova Quantum Guard</span>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex flex-col justify-center p-8 md:p-16 bg-white">
          <div className="mb-[16px]">
            <div className="lg:hidden mb-8">
              <h1 className="text-[28px] leading-[36px] font-bold tracking-tighter" style={{ color: "#000000" }}>
                TECHNOVA
              </h1>
            </div>
            <h2 className="text-[24px] leading-[32px] font-semibold mb-2" style={{ color: "#191c1e" }}>
              Welcome Back
            </h2>
            <p className="text-[16px] leading-[24px]" style={{ color: "#45464d" }}>
              Access your premium tech ecosystem.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {/* Identifier */}
            <div className="space-y-2">
              <label className="block text-[14px] leading-[20px] font-medium" style={{ color: "#45464d" }}
                htmlFor="identifier">
                Email or Mobile Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined transition-colors"
                    style={{ color: "#76777d" }}>person</span>
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="Enter your registered ID"
                  value={formData.identifier}
                  onChange={(e) => setFormData((p) => ({ ...p, identifier: e.target.value }))}
                  className="block w-full pl-11 pr-4 py-3 border rounded-lg text-[16px] leading-[24px] outline-none transition-all"
                  style={{ background: "#f2f4f6", borderColor: "#c6c6cd" }}
                  onFocus={e => e.target.style.borderColor = "#0058be"}
                  onBlur={e => e.target.style.borderColor = "#c6c6cd"}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[14px] leading-[20px] font-medium" style={{ color: "#45464d" }}
                  htmlFor="password">
                  Password
                </label>
                <a className="text-[14px] leading-[20px] font-medium hover:underline" style={{ color: "#0058be" }}
                  href="#">
                  Forgot Password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined transition-colors"
                    style={{ color: "#76777d" }}>lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  className="block w-full pl-11 pr-12 py-3 border rounded-lg text-[16px] leading-[24px] outline-none transition-all"
                  style={{ background: "#f2f4f6", borderColor: "#c6c6cd" }}
                  onFocus={e => e.target.style.borderColor = "#0058be"}
                  onBlur={e => e.target.style.borderColor = "#c6c6cd"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                  style={{ color: "#76777d" }}>
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input id="remember" type="checkbox"
                checked={formData.remember}
                onChange={(e) => setFormData((p) => ({ ...p, remember: e.target.checked }))}
                className="w-4 h-4 rounded border"
                style={{ accentColor: "#0058be", borderColor: "#c6c6cd" }} />
              <label htmlFor="remember" className="ml-2 text-[14px] leading-[20px] font-medium"
                style={{ color: "#45464d" }}>
                Keep me logged in on this device
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white text-[14px] leading-[20px] font-bold rounded-lg shadow-sm uppercase tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-70"
              style={{ background: "#0058be" }}
              onMouseEnter={e => !loading && (e.target.style.background = "#004395")}
              onMouseLeave={e => (e.target.style.background = "#0058be")}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: "#c6c6cd" }} />
            <span className="text-[13px] font-medium" style={{ color: "#76777d" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "#c6c6cd" }} />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 border rounded-lg font-bold text-[14px] leading-[20px] transition-all active:scale-[0.98]"
            style={{ borderColor: "#c6c6cd", color: "#191c1e", background: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f2f4f6"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.6 26.9 36 24 36c-5.2 0-9.7-2.9-11.3-7.1l-6.6 4.8C9.6 39.5 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.2 5.2C41 35.2 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <div className="mt-[16px] border-t pt-[8px] text-center" style={{ borderColor: "#c6c6cd" }}>
            <p className="text-[16px] leading-[24px] mb-4" style={{ color: "#45464d" }}>
              Don't have an account?
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center w-full py-3 px-6 border font-bold text-[14px] leading-[20px] rounded-lg uppercase tracking-wider transition-colors"
              style={{ borderColor: "#000000", color: "#000000" }}
              onMouseEnter={e => e.currentTarget.style.background = "#eceef0"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              Sign up for TECHNOVA
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
