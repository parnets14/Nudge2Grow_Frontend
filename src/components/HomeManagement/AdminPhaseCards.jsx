import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdLayers, MdVisibility } from "react-icons/md";
import { api } from "../../api";

const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00bf62] transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { title: "", description: "", image: "", isActive: true });
  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));
  const valid = form.title.trim() !== "";

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const canvas = document.createElement("canvas");
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 600;
      let { width, height } = img;
      if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      setForm(p => ({ ...p, image: canvas.toDataURL("image/jpeg", 0.75) }));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#00bf62] px-5 py-3 flex justify-between items-center">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MdLayers /> {entry ? "Edit Card" : "Add Phase Card"}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"><MdClose /></button>
        </div>
        <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* Image upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Image</label>
            <label className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`w-full h-32 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition ${form.image ? "border-[#00bf62]" : "border-gray-200 group-hover:border-[#00bf62]"}`}>
                {form.image
                  ? <img src={form.image} className="w-full h-full object-cover" alt="preview" />
                  : <span className="text-xs text-gray-400 group-hover:text-[#00bf62] transition">Click to upload image</span>}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            {form.image && (
              <button type="button" onClick={() => setForm(p => ({ ...p, image: "" }))}
                className="mt-1 text-xs text-red-400 hover:text-red-600 font-semibold">Remove</button>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Thinks like a philosopher" value={form.title} onChange={f("title")} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
            <textarea rows={2} className={`${inp} resize-none`} placeholder="e.g. You help them learn when you... ask questions." value={form.description} onChange={f("description")} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-[#00bf62]" />
            <span className="text-xs font-semibold text-gray-700">Active (show in app)</span>
          </label>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-5 py-2 rounded-lg text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#00bf62] hover:bg-[#00a055]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add Card"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPhaseCards = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const res = await api.phaseCards.getAll(); setItems(res.data || res || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.phaseCards.update(editItem._id, form);
      else await api.phaseCards.create(form);
      setModalOpen(false); setEditItem(null); await load();
    } catch (e) { console.error(e); alert("Save failed."); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this card?")) return;
    try { await api.phaseCards.remove(id); await load(); } catch (e) { console.error(e); }
  };

  const toggleActive = async (item) => {
    try { await api.phaseCards.update(item._id, { ...item, isActive: !item.isActive }); await load(); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <MdLayers className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">For This Phase</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage phase cards shown on the home screen</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition">
          <MdAdd className="text-lg" /> Add Card
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-5 py-3.5 text-left font-semibold w-10">No</th>
              <th className="px-5 py-3.5 text-left font-semibold w-20">Image</th>
              <th className="px-5 py-3.5 text-left font-semibold">Title</th>
              <th className="px-5 py-3.5 text-left font-semibold">Description</th>
              <th className="px-5 py-3.5 text-left font-semibold w-24">Status</th>
              <th className="px-5 py-3.5 text-center font-semibold w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">
                <MdLayers className="text-5xl text-gray-200 mx-auto mb-2" />
                No cards yet. Add your first one!
              </td></tr>
            ) : items.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-5 py-3.5 text-gray-400 font-medium">{i + 1}</td>
                <td className="px-5 py-3.5">
                  {item.image
                    ? <img src={item.image} className="w-12 h-10 rounded-lg object-cover border border-gray-200" alt={item.title} />
                    : <div className="w-12 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><MdLayers className="text-gray-300 text-xl" /></div>}
                </td>
                <td className="px-5 py-3.5 font-semibold text-gray-800 max-w-xs"><p className="truncate">{item.title}</p></td>
                <td className="px-5 py-3.5 text-gray-500 text-xs max-w-xs"><p className="truncate">{item.description || "—"}</p></td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleActive(item)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${item.isActive ? "bg-[#00bf62]/10 text-[#00bf62] hover:bg-red-100 hover:text-red-500" : "bg-gray-100 text-gray-400 hover:bg-[#00bf62]/10 hover:text-[#00bf62]"}`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-center gap-2">
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
    </div>
  );
};

export default AdminPhaseCards;
