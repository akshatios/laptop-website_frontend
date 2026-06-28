import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

const InputField = ({ label, icon, type, placeholder, value, onChange }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1">
      <label className="font-label-sm text-label-sm text-on-surface-variant block ml-1">
        {label}
      </label>
      <div className="relative">
        <span
          className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            focused ? "text-secondary" : "text-outline-variant"
          }`}
        >
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-bright focus:border-secondary focus:ring-0 transition-all outline-none font-body-md text-body-md"
          style={{ boxShadow: focused ? "0 0 0 4px rgba(59,130,246,0.1)" : "" }}
        />
      </div>
    </div>
  );
};

export default function Register() {
  const [verifyVia, setVerifyVia] = useState("email");
  const [btnState, setBtnState] = useState("idle"); // idle | loading | success
  const [newsletter, setNewsletter] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setBtnState("loading");
    try {
      const res = await apiFetch(`/api/auth/register/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          via: verifyVia,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.detail || JSON.stringify(data) || "Failed to send OTP");
      setBtnState("success");
      setTimeout(() => navigate("/verify-otp", { state: { email: formData.email, mobile: formData.mobile, verify_via: verifyVia } }), 1000);
    } catch (err) {
      setError(err.message);
      setBtnState("idle");
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto bg-surface shadow-sm">
        <span className="font-headline-lg text-headline-lg tracking-tighter text-on-surface">
          TECHNOVA
        </span>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm text-label-sm">Support</a>
          <a href="#" className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm text-label-sm">Privacy</a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow pt-24 pb-stack-lg flex items-center justify-center px-margin-mobile">
        <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant/30">

          {/* Left Panel */}
          <div className="hidden lg:flex flex-col justify-between p-margin-desktop relative overflow-hidden bg-primary-container text-white">
            <div className="z-10">
              <h1 className="font-headline-xl text-headline-xl mb-stack-md leading-tight">
                Elevate Your Tech Ecosystem.
              </h1>
              <p className="font-body-lg text-body-lg text-on-primary-container max-w-xs opacity-90">
                Join the elite community of tech enthusiasts and get exclusive access to next-gen hardware and software solutions.
              </p>
            </div>
            <div className="mt-auto z-10 flex gap-4 items-center">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-surface-container-highest" />
                <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-surface-container-high" />
                <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-surface-container" />
              </div>
              <span className="font-label-sm text-label-sm text-on-primary-container">
                Joined by 50k+ professionals
              </span>
            </div>
            {/* Decorative blobs */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary rounded-full blur-[100px]" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-container rounded-full blur-[100px]" />
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="p-8 md:p-margin-desktop flex flex-col justify-center">
            <div className="mb-stack-lg">
              <h2 className="font-headline-md text-headline-md mb-2">Create Account</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Secure your future-ready profile today.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <InputField label="Full Name" icon="person" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange("name")} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Email" icon="mail" type="email" placeholder="name@company.com" value={formData.email} onChange={handleChange("email")} />
                <InputField label="Mobile Number" icon="smartphone" type="tel" placeholder="+1 (555) 000-0000" value={formData.mobile} onChange={handleChange("mobile")} />
              </div>

              {/* Verify via toggle */}
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant block ml-1">
                  Verify via
                </label>
                <div className="flex gap-2 p-1 bg-surface-container rounded-xl">
                  {["email", "mobile"].map((option) => (
                    <label key={option} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="verify_via"
                        value={option}
                        checked={verifyVia === option}
                        onChange={() => setVerifyVia(option)}
                        className="sr-only"
                      />
                      <div className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all font-label-sm text-label-sm ${
                        verifyVia === option
                          ? "bg-white shadow-sm text-secondary"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {option === "email" ? "email" : "sms"}
                        </span>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Password" icon="lock" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange("password")} />
                <InputField label="Confirm Password" icon="shield" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange("confirmPassword")} />
              </div>

              <button
                type="submit"
                disabled={btnState !== "idle"}
                className={`w-full font-headline-md text-[18px] py-4 rounded-lg shadow-lg active:scale-[0.98] transition-all duration-200 mt-stack-md flex items-center justify-center gap-3 group text-on-secondary ${
                  btnState === "success"
                    ? "bg-green-600 opacity-80 cursor-not-allowed"
                    : btnState === "loading"
                    ? "bg-secondary opacity-80 cursor-not-allowed"
                    : "bg-secondary hover:bg-[#004BB1]"
                }`}
              >
                {btnState === "loading" && (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Sending...
                  </>
                )}
                {btnState === "success" && (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    OTP Sent!
                  </>
                )}
                {btnState === "idle" && (
                  <>
                    Send OTP
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>

              <p className="text-center font-label-sm text-label-sm text-on-surface-variant pt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-secondary font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-stack-lg px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter bg-primary-container text-on-primary-container mt-auto">
        <div className="flex flex-col gap-4">
          <span className="font-headline-md text-headline-md text-white">TECHNOVA</span>
          <p className="font-body-md text-body-md opacity-80">
            Precision engineered commerce for the digital age. Trusted by thousands of creators and engineers globally.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-label-sm text-label-sm font-bold text-white mb-2">Legal</h4>
          <a href="#" className="font-body-md text-body-md opacity-80 hover:text-secondary-fixed transition-opacity">Privacy Policy</a>
          <a href="#" className="font-body-md text-body-md opacity-80 hover:text-secondary-fixed transition-opacity">Terms of Service</a>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-label-sm text-label-sm font-bold text-white mb-2">Support</h4>
          <a href="#" className="font-body-md text-body-md opacity-80 hover:text-secondary-fixed transition-opacity">Customer Service</a>
          <a href="#" className="font-body-md text-body-md opacity-80 hover:text-secondary-fixed transition-opacity">Warranty</a>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-label-sm text-label-sm font-bold text-white mb-2">Newsletter</h4>
          <p className="font-body-md text-body-md opacity-80 mb-2">Stay updated with latest releases.</p>
          <div className="flex h-10">
            <input
              type="email"
              placeholder="Email"
              value={newsletter}
              onChange={(e) => setNewsletter(e.target.value)}
              className="bg-surface-container-low/10 border border-outline-variant/30 px-3 rounded-l-lg text-white w-full focus:outline-none"
            />
            <button className="bg-secondary px-4 rounded-r-lg text-white">
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
        <div className="col-span-1 md:col-span-4 border-t border-outline-variant/20 pt-8 mt-4 text-center">
          <p className="font-body-md text-body-md opacity-60">© 2024 TECHNOVA Electronics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
