import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdPsychology, MdVisibility } from "react-icons/md";
import { api } from "../../api";

const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00bf62] transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { question: "", answer: "", hint: "", isActive: true });
  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const valid = form.question.trim() && form.answer.trim();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#00bf62] px-5 py-3 flex justify-between items-center">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MdPsychology /> {entry ? "Edit Riddle" : "Add Riddle"}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">
            <MdClose />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Question <span className="text-red-500">*</span></label>
            <textarea rows={3} className={`${inp} resize-none`} placeholder="Enter the riddle question..." value={form.question} onChange={f("question")} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Answer <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="Enter the answer..." value={form.answer} onChange={f("answer")} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Hint (optional)</label>
            <input className={inp} placeholder="Give a small hint..." value={form.hint} onChange={f("hint")} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-[#00bf62]" />
            <span className="text-xs font-semibold text-gray-700">Active (show in app)</span>
          </label>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-5 py-2 rounded-lg text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#00bf62] hover:bg-[#00a055]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add Riddle"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewModal = ({ item, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="bg-[#00bf62] px-5 py-3 flex justify-between items-center">
        <h2 className="text-base font-bold text-white flex items-center gap-2"><MdPsychology /> View Riddle</h2>
        <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"><MdClose /></button>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Question</p><p className="text-sm text-gray-800">{item.question}</p></div>
        <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Answer</p><p className="text-sm font-semibold text-[#00bf62]">{item.answer}</p></div>
        {item.hint && <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Hint</p><p className="text-sm text-gray-500 italic">{item.hint}</p></div>}
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t flex justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
      </div>
    </div>
  </div>
);

const AdminTodaysRiddle = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const res = await api.riddles.getAll(); setItems(res.data || res || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.riddles.update(editItem._id, form);
      else await api.riddles.create(form);
      setModalOpen(false); setEditItem(null); await load();
    } catch (e) { console.error(e); alert("Save failed."); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this riddle?")) return;
    try { await api.riddles.remove(id); await load(); } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <MdPsychology className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Today's Riddles</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage riddles shown on the home screen</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition">
          <MdAdd className="text-lg" /> Add Riddle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-5 py-3.5 text-left font-semibold w-10">No</th>
              <th className="px-5 py-3.5 text-left font-semibold">Question</th>
              <th className="px-5 py-3.5 text-left font-semibold">Answer</th>
              <th className="px-5 py-3.5 text-left font-semibold">Hint</th>
              <th className="px-5 py-3.5 text-left font-semibold w-24">Status</th>
              <th className="px-5 py-3.5 text-center font-semibold w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">
                <MdPsychology className="text-5xl text-gray-200 mx-auto mb-2" />
                No riddles yet. Add your first one!
              </td></tr>
            ) : items.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-5 py-3.5 text-gray-400 font-medium">{i + 1}</td>
                <td className="px-5 py-3.5 text-gray-800 max-w-xs"><p className="truncate font-medium">{item.question}</p></td>
                <td className="px-5 py-3.5 text-[#00bf62] font-semibold text-xs">{item.answer}</td>
                <td className="px-5 py-3.5 text-gray-400 text-xs italic">{item.hint || "—"}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={async () => {
                      try {
                        await api.riddles.update(item._id, { ...item, isActive: !item.isActive });
                        await load();
                      } catch (e) { console.error(e); }
                    }}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${item.isActive ? "bg-[#00bf62]/10 text-[#00bf62] hover:bg-red-100 hover:text-red-500" : "bg-gray-100 text-gray-400 hover:bg-[#00bf62]/10 hover:text-[#00bf62]"}`}
                    title={item.isActive ? "Click to deactivate" : "Click to activate"}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewItem(item)} className="text-[#00bf62] hover:text-[#00a055] transition"><MdVisibility className="text-xl" /></button>
                    <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-amber-400 hover:text-amber-500 transition"><MdEdit className="text-xl" /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-600 transition"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <Modal entry={editItem} onSave={handleSave} onClose={() => { setModalOpen(false); setEditItem(null); }} saving={saving} />}
      {viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)} />}
    </div>
  );
};

export default AdminTodaysRiddle;
