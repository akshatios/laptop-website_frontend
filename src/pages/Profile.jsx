import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const Field = ({ label, icon, type = "text", value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="font-label-sm text-label-sm text-on-surface-variant block">{label}</label>
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-outline-variant bg-surface-container-low focus:border-primary outline-none transition-all font-body-md text-body-md text-on-surface placeholder:text-outline"
      />
    </div>
  </div>
);

const Msg = ({ msg }) =>
  msg ? (
    <p className={`text-sm font-medium ${msg.ok ? "text-green-600" : "text-error"}`}>{msg.text}</p>
  ) : null;

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ full_name: "", email: "" });
  const [editOpen, setEditOpen] = useState(false);

  const [name, setName] = useState("");
  const [nameMsg, setNameMsg] = useState(null);
  const [nameLoading, setNameLoading] = useState(false);

  const [pwd, setPwd] = useState({ current: "", next: "" });
  const [pwdMsg, setPwdMsg] = useState(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  const [emailStep, setEmailStep] = useState(1);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailMsg, setEmailMsg] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }
    apiFetch(`/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const u = d.user || d.data || d;
        if (u && (u.full_name || u.email)) { setUser(u); setName(u.full_name || ""); }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const handleNameSave = async () => {
    if (!name.trim()) return;
    setNameLoading(true); setNameMsg(null);
    try {
      const res = await apiFetch(`/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ full_name: name.trim() }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Failed");
      setUser((u) => ({ ...u, full_name: d.user?.full_name || name }));
      setNameMsg({ ok: true, text: "Name updated successfully" });
    } catch (e) {
      setNameMsg({ ok: false, text: e.message });
    } finally { setNameLoading(false); }
  };

  const handlePwdSave = async () => {
    if (!pwd.current || !pwd.next) return;
    setPwdLoading(true); setPwdMsg(null);
    try {
      const res = await apiFetch(`/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ current_password: pwd.current, new_password: pwd.next }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Failed");
      setPwdMsg({ ok: true, text: "Password changed successfully" });
      setPwd({ current: "", next: "" });
    } catch (e) {
      setPwdMsg({ ok: false, text: e.message });
    } finally { setPwdLoading(false); }
  };

  const handleEmailSendOtp = async () => {
    if (!newEmail.trim()) return;
    setEmailLoading(true); setEmailMsg(null);
    try {
      const res = await apiFetch(`/api/auth/profile/change-email/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ new_email: newEmail.trim() }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Failed");
      setEmailStep(2);
      setEmailMsg({ ok: true, text: "OTP sent to new email" });
    } catch (e) {
      setEmailMsg({ ok: false, text: e.message });
    } finally { setEmailLoading(false); }
  };

  const handleEmailVerify = async () => {
    if (!otp.trim()) return;
    setEmailLoading(true); setEmailMsg(null);
    try {
      const res = await apiFetch(`/api/auth/profile/change-email/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ new_email: newEmail.trim(), otp: otp.trim() }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Failed");
      setUser((u) => ({ ...u, email: newEmail }));
      setEmailMsg({ ok: true, text: "Email updated successfully" });
      setEmailStep(1); setNewEmail(""); setOtp("");
    } catch (e) {
      setEmailMsg({ ok: false, text: e.message });
    } finally { setEmailLoading(false); }
  };

  const initials = user.full_name ? user.full_name.charAt(0).toUpperCase() : "?";

  return (
    <div className="max-w-lg mx-auto pb-10">

      {/* ── Profile Header ── */}
      <section className="flex flex-col items-center mb-lg">
        {/* Avatar */}
        <div className="relative group cursor-pointer mb-md">
          <div className="w-32 h-32 rounded-full absolute -inset-0.5 opacity-20 blur animate-pulse"
            style={{ background: "linear-gradient(135deg, #4648d4 0%, #39b8fd 100%)" }} />
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-surface-container-highest flex items-center justify-center">
            <span className="font-headline-xl text-headline-xl text-primary">{initials}</span>
          </div>
          <button
            onClick={() => setEditOpen((v) => !v)}
            className="absolute bottom-1 right-1 bg-primary text-on-primary p-2 rounded-full shadow-lg active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>

        {/* Name & Email */}
        <div className="text-center space-y-1">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            {user.full_name || "—"}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{user.email || "—"}</p>
        </div>

        {/* Edit Profile button */}
        <button
          onClick={() => setEditOpen((v) => !v)}
          className="mt-md flex items-center justify-center gap-2 px-8 py-3 bg-white border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 text-on-surface font-label-md text-label-md"
        >
          <span className="material-symbols-outlined text-[20px]">person_edit</span>
          Edit Profile
        </button>
      </section>

      {/* ── Menu List ── */}
      <section className="space-y-3">

        {/* Glass menu card */}
        <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}>

          {/* My Orders */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group active:bg-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-primary" style={{ background: "rgba(70,72,212,0.1)" }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface">My Orders</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
          </button>

          <div className="h-px bg-outline-variant/20 mx-4" />

          {/* Saved Items */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group active:bg-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-tertiary" style={{ background: "rgba(161,46,112,0.1)" }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface">Saved Items</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-tertiary transition-colors">chevron_right</span>
          </button>

          <div className="h-px bg-outline-variant/20 mx-4" />

          {/* Settings */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group active:bg-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-secondary" style={{ background: "rgba(0,101,145,0.1)" }}>
                <span className="material-symbols-outlined">settings</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface">Settings</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary transition-colors">chevron_right</span>
          </button>

          <div className="h-px bg-outline-variant/20 mx-4" />

          {/* Help & Support */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group active:bg-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant" style={{ background: "rgba(70,69,84,0.1)" }}>
                <span className="material-symbols-outlined">help</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface">Help & Support</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-on-surface transition-colors">chevron_right</span>
          </button>
        </div>

        {/* ── Technova Pro Banner ── */}
        <div
          className="mt-8 p-6 rounded-2xl text-on-primary shadow-lg relative overflow-hidden group cursor-pointer"
          style={{ background: "linear-gradient(135deg, #4648d4 0%, #39b8fd 100%)", boxShadow: "0 8px 32px rgba(70,72,212,0.2)" }}
        >
          <div className="relative z-10">
            <h3 className="font-headline-md text-headline-md mb-1">Technova Pro</h3>
            <p className="font-label-sm text-label-sm" style={{ color: "rgba(255,255,255,0.8)" }}>Get exclusive early access to new releases.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px]">rocket_launch</span>
          </div>
        </div>

        {/* ── Edit Profile Sections (collapsible) ── */}
        {editOpen && (
          <div className="space-y-3 pt-1">

            {/* Change Name */}
            <div className="rounded-xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">badge</span>
                <h2 className="font-headline-md text-[17px] text-on-surface">Change Name</h2>
              </div>
              <Field label="Full Name" icon="person" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter new name" />
              <Msg msg={nameMsg} />
              <button
                onClick={handleNameSave}
                disabled={nameLoading || !name.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-on-primary font-label-md text-label-md transition-all active:scale-[0.98] disabled:opacity-60 hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #4648d4 0%, #39b8fd 100%)" }}
              >
                {nameLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                Save Name
              </button>
            </div>

            {/* Change Password */}
            <div className="rounded-xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">lock</span>
                <h2 className="font-headline-md text-[17px] text-on-surface">Change Password</h2>
              </div>
              <Field label="Current Password" icon="lock" type="password" value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} placeholder="Current password" />
              <Field label="New Password" icon="lock_reset" type="password" value={pwd.next} onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))} placeholder="New password" />
              <Msg msg={pwdMsg} />
              <button
                onClick={handlePwdSave}
                disabled={pwdLoading || !pwd.current || !pwd.next}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-on-primary font-label-md text-label-md transition-all active:scale-[0.98] disabled:opacity-60 hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #4648d4 0%, #39b8fd 100%)" }}
              >
                {pwdLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                Update Password
              </button>
            </div>

            {/* Change Email */}
            <div className="rounded-xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">mail</span>
                <h2 className="font-headline-md text-[17px] text-on-surface">Change Email</h2>
              </div>
              {emailStep === 1 ? (
                <>
                  <Field label="New Email" icon="mail" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="newemail@example.com" />
                  <Msg msg={emailMsg} />
                  <button
                    onClick={handleEmailSendOtp}
                    disabled={emailLoading || !newEmail.trim()}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-on-primary font-label-md text-label-md transition-all active:scale-[0.98] disabled:opacity-60 hover:brightness-110"
                    style={{ background: "linear-gradient(135deg, #4648d4 0%, #39b8fd 100%)" }}
                  >
                    {emailLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    OTP sent to: <span className="text-on-surface font-semibold">{newEmail}</span>
                  </p>
                  <Field label="Enter OTP" icon="pin" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit OTP" />
                  <Msg msg={emailMsg} />
                  <div className="flex gap-3">
                    <button
                      onClick={handleEmailVerify}
                      disabled={emailLoading || otp.length < 6}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-on-primary font-label-md text-label-md transition-all active:scale-[0.98] disabled:opacity-60 hover:brightness-110"
                      style={{ background: "linear-gradient(135deg, #4648d4 0%, #39b8fd 100%)" }}
                    >
                      {emailLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                      Verify & Update
                    </button>
                    <button
                      onClick={() => { setEmailStep(1); setOtp(""); setEmailMsg(null); }}
                      className="px-4 py-3 rounded-xl border border-outline-variant font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-all"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Logout ── */}
        <button
          onClick={handleLogout}
          className="w-full mt-lg flex items-center justify-center gap-3 p-4 bg-error text-on-error rounded-xl font-label-md text-label-md shadow-lg active:scale-[0.98] transition-all hover:brightness-110"
          style={{ boxShadow: "0 4px 16px rgba(186,26,26,0.15)" }}
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>

      </section>
    </div>
  );
}
