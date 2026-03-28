import { useState, useEffect } from "react";
import { MdSave, MdAccessTime, MdEmail, MdPhone, MdInfo } from "react-icons/md";
import { api } from "../../api";

const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00bf62] transition";

const AdminSupportInfo = () => {
  const [form, setForm] = useState({ supportHours: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.supportInfo.get()
      .then(data => setForm({ supportHours: data.supportHours || "", email: data.email || "", phone: data.phone || "" }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.supportInfo.update(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <MdInfo className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Support Info</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage support hours, email and phone shown in Help & Support</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow transition text-white ${saving ? "bg-gray-300 cursor-not-allowed" : "bg-[#00bf62] hover:bg-[#00a055]"}`}>
          <MdSave /> {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5 max-w-2xl">
        {/* Support Hours */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <MdAccessTime className="text-[#00bf62]" /> Support Hours
          </label>
          <textarea
            rows={3}
            className={`${inp} resize-none`}
            placeholder="e.g. Monday - Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 4:00 PM"
            value={form.supportHours}
            onChange={e => setForm(p => ({ ...p, supportHours: e.target.value }))}
          />
          <p className="text-[10px] text-gray-400 mt-1">Use new lines to separate multiple time slots</p>
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <MdEmail className="text-[#00bf62]" /> Support Email
          </label>
          <input
            className={inp}
            type="email"
            placeholder="e.g. support@nudge2grow.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <MdPhone className="text-[#00bf62]" /> Support Phone
          </label>
          <input
            className={inp}
            placeholder="e.g. +91 1800-123-4567 (Toll Free)"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          />
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Preview in App</p>
          <div className="space-y-3">
            {form.supportHours && (
              <div className="flex items-start gap-3">
                <MdAccessTime className="text-[#00bf62] text-xl shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-700">Support Hours</p>
                  {form.supportHours.split('\n').map((line, i) => (
                    <p key={i} className="text-xs text-gray-500">{line}</p>
                  ))}
                </div>
              </div>
            )}
            {form.email && (
              <div className="flex items-center gap-3">
                <MdEmail className="text-[#00bf62] text-xl shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-700">Email</p>
                  <p className="text-xs text-gray-500">{form.email}</p>
                </div>
              </div>
            )}
            {form.phone && (
              <div className="flex items-center gap-3">
                <MdPhone className="text-[#00bf62] text-xl shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-700">Phone</p>
                  <p className="text-xs text-gray-500">{form.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportInfo;
