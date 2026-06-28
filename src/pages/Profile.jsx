import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

// ─── Small reusable input ───────────────────────────────────────────────────
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
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-bright focus:border-secondary outline-none transition-all font-body-md text-body-md"
      />
    </div>
  </div>
);

// ─── Section card wrapper ───────────────────────────────────────────────────
const Card = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl border border-outline-variant shadow-[0px_2px_12px_rgba(15,23,42,0.05)] p-6 space-y-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="material-symbols-outlined text-secondary text-[22px]">{icon}</span>
      <h2 className="font-headline-md text-[17px] text-on-surface">{title}</h2>
    </div>
    {children}
  </div>
);

// ─── Status message ─────────────────────────────────────────────────────────
const Msg = ({ msg }) =>
  msg ? (
    <p className={`text-sm font-medium ${msg.ok ? "text-green-600" : "text-red-500"}`}>
      {msg.text}
    </p>
  ) : null;

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ full_name: "", email: "" });
  const [editOpen, setEditOpen] = useState(false);

  // Name change
  const [name, setName] = useState("");
  const [nameMsg, setNameMsg] = useState(null);
  const [nameLoading, setNameLoading] = useState(false);

  // Password change
  const [pwd, setPwd] = useState({ current: "", next: "" });
  const [pwdMsg, setPwdMsg] = useState(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Email change
  const [emailStep, setEmailStep] = useState(1); // 1 = input new email, 2 = enter OTP
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailMsg, setEmailMsg] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }
    // Fetch current user details
    apiFetch(`/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const u = d.user || d.data || d;
        if (u && (u.full_name || u.email)) {
          setUser(u);
          setName(u.full_name || "");
        }
      })
      .catch(() => {});
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  // ── Name update ─────────────────────────────────────────────────────────
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
    } finally {
      setNameLoading(false);
    }
  };

  // ── Password update ──────────────────────────────────────────────────────
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
    } finally {
      setPwdLoading(false);
    }
  };

  // ── Email — send OTP ─────────────────────────────────────────────────────
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
    } finally {
      setEmailLoading(false);
    }
  };

  // ── Email — verify OTP ───────────────────────────────────────────────────
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
      setEmailStep(1);
      setNewEmail(""); setOtp("");
    } catch (e) {
      setEmailMsg({ ok: false, text: e.message });
    } finally {
      setEmailLoading(false);
    }
  };

  const btnClass = (loading) =>
    `flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white font-label-sm text-label-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60 ${
      loading ? "opacity-70 cursor-not-allowed" : ""
    }`;

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-10">

      {/* ── Avatar + Info ── */}
      <div className="flex items-center gap-4 bg-white rounded-xl border border-outline-variant shadow-[0px_2px_12px_rgba(15,23,42,0.05)] p-6">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <span className="text-white text-2xl font-bold">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : "?"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-headline-md text-[18px] text-on-surface truncate">{user.full_name || "—"}</p>
          <p className="font-body-md text-body-md text-on-surface-variant truncate">{user.email || "—"}</p>
        </div>
      </div>

      {/* ── Edit Profile Button ── */}
      <button
        onClick={() => setEditOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl border border-outline-variant bg-white shadow-[0px_2px_12px_rgba(15,23,42,0.05)] font-label-sm text-label-sm font-bold text-on-surface active:scale-[0.99] transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[22px]">edit</span>
          Edit Profile
        </div>
        <span className="material-symbols-outlined text-outline-variant transition-transform duration-300" style={{ transform: editOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          expand_more
        </span>
      </button>

      {/* ── Edit Sections (collapsible) ── */}
      {editOpen && (
        <div className="space-y-5">

          {/* ── Change Name ── */}
          <Card title="Change Name" icon="badge">
            <Field
              label="Full Name"
              icon="person"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new name"
            />
            <Msg msg={nameMsg} />
            <button
              onClick={handleNameSave}
              disabled={nameLoading || !name.trim()}
              className={btnClass(nameLoading)}
              style={{ background: "#0058be" }}
            >
              {nameLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
              Save Name
            </button>
          </Card>

          {/* ── Change Password ── */}
          <Card title="Change Password" icon="lock">
            <Field
              label="Current Password"
              icon="lock"
              type="password"
              value={pwd.current}
              onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
              placeholder="Current password"
            />
            <Field
              label="New Password"
              icon="lock_reset"
              type="password"
              value={pwd.next}
              onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
              placeholder="New password"
            />
            <Msg msg={pwdMsg} />
            <button
              onClick={handlePwdSave}
              disabled={pwdLoading || !pwd.current || !pwd.next}
              className={btnClass(pwdLoading)}
              style={{ background: "#0058be" }}
            >
              {pwdLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
              Update Password
            </button>
          </Card>

          {/* ── Change Email ── */}
          <Card title="Change Email" icon="mail">
            {emailStep === 1 ? (
              <>
                <Field
                  label="New Email"
                  icon="mail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="newemail@example.com"
                />
                <Msg msg={emailMsg} />
                <button
                  onClick={handleEmailSendOtp}
                  disabled={emailLoading || !newEmail.trim()}
                  className={btnClass(emailLoading)}
                  style={{ background: "#0058be" }}
                >
                  {emailLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  OTP bheja gaya: <span className="text-on-surface font-semibold">{newEmail}</span>
                </p>
                <Field
                  label="Enter OTP"
                  icon="pin"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit OTP"
                />
                <Msg msg={emailMsg} />
                <div className="flex gap-3">
                  <button
                    onClick={handleEmailVerify}
                    disabled={emailLoading || otp.length < 6}
                    className={btnClass(emailLoading)}
                    style={{ background: "#0058be" }}
                  >
                    {emailLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                    Verify & Update
                  </button>
                  <button
                    onClick={() => { setEmailStep(1); setOtp(""); setEmailMsg(null); }}
                    className="px-4 py-2.5 rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container transition-all"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </Card>

        </div>
      )}

      {/* ── Logout ── */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-label-sm text-label-sm font-bold text-white active:scale-[0.98] transition-all"
        style={{ background: "#B3261E" }}
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        Logout
      </button>

    </div>
  );
}
