import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(59);
  const [btnState, setBtnState] = useState("idle"); // idle | loading | success
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, mobile, verify_via } = location.state || {};

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    if (val && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.join("").length < 6) return;
    setError("");
    setBtnState("loading");
    try {
      const res = await apiFetch(`/api/auth/register/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile, otp: otp.join(""), verify_via }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail?.message || data.message || "OTP verification failed");
      setBtnState("success");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
      setBtnState("idle");
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    try {
      await apiFetch(`/api/auth/register/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile, verify_via }),
      });
    } catch (_) {}
    setTimeLeft(59);
    setOtp(Array(6).fill(""));
    inputsRef.current[0].focus();
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield_lock
          </span>
          <span className="font-headline-md text-headline-md tracking-tighter text-on-surface">TECHNOVA</span>
        </div>
        <Link
          to="/register"
          className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors font-label-sm text-label-sm"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="hidden md:inline">Back to Sign Up</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-24">
        <div className="w-full max-w-md">
          {/* Icon + Title */}
          <div className="mb-stack-lg text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-fixed mb-stack-md">
              <span
                className="material-symbols-outlined text-secondary text-4xl"
                style={{ fontVariationSettings: "'wght' 300" }}
              >
                mark_email_read
              </span>
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              Verify your account
            </h1>
            <p className="text-on-surface-variant font-body-md text-body-md px-4">
              We've sent a 6-digit security code to{" "}
              <span className="text-on-surface font-semibold">{verify_via === "email" ? email : mobile}</span>. Please enter it below to
              confirm your registration.
            </p>
          </div>

          {/* OTP Card */}
          <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
            <form className="space-y-stack-lg" onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {/* OTP Inputs */}
              <div className="flex justify-between gap-2 md:gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onWheel={(e) => e.preventDefault()}
                    className="w-full aspect-square text-center text-headline-md font-headline-md bg-surface-bright border border-outline-variant rounded-lg focus:border-secondary focus:ring-0 transition-all outline-none focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="flex flex-col items-center gap-stack-sm">
                <p className="text-on-surface-variant font-label-sm text-label-sm">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timeLeft > 0}
                  className="text-secondary font-label-sm text-label-sm font-bold hover:underline disabled:text-outline-variant disabled:no-underline transition-all"
                >
                  Resend OTP {timeLeft > 0 && <span>({timeLeft}s)</span>}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={btnState !== "idle"}
                className={`w-full py-4 rounded-lg font-label-sm text-label-sm font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-on-secondary ${
                  btnState === "success"
                    ? "bg-green-600 opacity-80 pointer-events-none"
                    : btnState === "loading"
                    ? "bg-secondary opacity-80 pointer-events-none"
                    : "bg-secondary hover:opacity-90"
                }`}
              >
                {btnState === "loading" && (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Verifying...
                  </>
                )}
                {btnState === "success" && (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    Success
                  </>
                )}
                {btnState === "idle" && (
                  <>
                    Verify Account
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Decorative bar */}
          <div className="mt-stack-lg grid grid-cols-2 gap-gutter opacity-40">
            <div className="h-1 bg-outline-variant rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-2/3" />
            </div>
            <div className="h-1 bg-outline-variant rounded-full" />
          </div>
          <p className="text-center mt-stack-md text-on-surface-variant font-label-sm text-label-sm opacity-60">
            Encrypted with AES-256 Security Standards
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-stack-md px-margin-desktop border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant">
        <p className="font-label-sm text-label-sm">© 2024 TECHNOVA Electronics. All rights reserved.</p>
        <div className="flex gap-stack-lg">
          <a href="#" className="font-label-sm text-label-sm hover:text-secondary transition-colors">Privacy Policy</a>
          <a href="#" className="font-label-sm text-label-sm hover:text-secondary transition-colors">Terms of Service</a>
          <a href="#" className="font-label-sm text-label-sm hover:text-secondary transition-colors">Help Center</a>
        </div>
      </footer>
    </div>
  );
}
