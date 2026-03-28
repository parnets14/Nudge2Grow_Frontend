import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdVisibility, MdSlideshow } from "react-icons/md";
import { api } from "../../api";

const TITLE_COLORS = [
  { label: "Green", value: "#45a578" },
  { label: "Orange", value: "#FF8C42" },
  { label: "Blue", value: "#2B7FD9" },
  { label: "Pink", value: "#FF69B4" },
];

const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#00aa59] transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState({
    title:       entry?.title       ?? "",
    titleColor:  entry?.titleColor  ?? "#45a578",
    description: entry?.description ?? "",
  });

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));
  const valid = form.title.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#00aa59] px-5 py-3 flex justify-between items-center">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Slide</> : <><MdAdd /> Add Slide</>}
          </h2>
          <button onClick={onClose}><MdClose className="text-white text-lg" /></button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Title *</label>
            <input className={inp} style={{ color: form.titleColor }} value={form.title} onChange={f("title")} placeholder="Enter slide title..." />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">Title Color</label>
            <div className="flex flex-wrap gap-2">
              {TITLE_COLORS.map(c => (
                <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, titleColor: c.value }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition ${form.titleColor === c.value ? "border-gray-800 scale-105" : "border-transparent"}`}
                  style={{ backgroundColor: c.value + "22", color: c.value }}>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.value }} />
                  {c.label}
                </button>
              ))}
              <input type="color" value={form.titleColor} onChange={f("titleColor")} className="w-8 h-8 rounded border cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
            <textarea rows={3} className={`${inp} resize-none`} value={form.description} onChange={f("description")} placeholder="Enter description..." />
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-5 py-2 rounded-lg text-white text-sm font-bold flex items-center gap-1.5 transition ${valid && !saving ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewModal = ({ slide, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><MdVisibility /> View Slide</h2>
        <button onClick={onClose}><MdClose className="text-white text-2xl" /></button>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-3xl font-extrabold mb-3" style={{ color: slide.titleColor }}>{slide.title}</p>
          {slide.description && <p className="text-base text-gray-600 leading-relaxed">{slide.description}</p>}
        </div>
      </div>
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
      </div>
    </div>
  </div>
);

const AdminIntroSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSlide, setEditSlide] = useState(null);
  const [viewSlide, setViewSlide] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.introSlides.getAll();
      setSlides(res.data || res || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editSlide) await api.introSlides.update(editSlide._id, form);
      else await api.introSlides.create(form);
      setModalOpen(false);
      setEditSlide(null);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try { await api.introSlides.remove(id); await load(); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <MdSlideshow className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Intro Slides</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage onboarding intro slides</p>
          </div>
        </div>
        <button onClick={() => { setEditSlide(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow transition">
          <MdAdd className="text-xl" /> Add Slide
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-6 py-4 text-left font-semibold w-16">No</th>
              <th className="px-6 py-4 text-left font-semibold">Title</th>
              <th className="px-6 py-4 text-left font-semibold">Description</th>
              <th className="px-6 py-4 text-center font-semibold w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-16 text-gray-400">Loading...</td></tr>
            ) : slides.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-16 text-gray-400">
                <MdSlideshow className="text-5xl text-gray-300 mx-auto mb-2" />
                No slides yet. Add your first one!
              </td></tr>
            ) : slides.map((s, i) => (
              <tr key={s._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-gray-500 font-medium">{i + 1}</td>
                <td className="px-6 py-4 font-bold" style={{ color: s.titleColor || "#00bf62" }}>{s.title}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{s.description || "—"}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => setViewSlide(s)} title="View"
                      className="text-[#00bf62] hover:text-[#00a055] transition">
                      <MdVisibility className="text-xl" />
                    </button>
                    <button onClick={() => { setEditSlide(s); setModalOpen(true); }} title="Edit"
                      className="text-amber-400 hover:text-amber-500 transition">
                      <MdEdit className="text-xl" />
                    </button>
                    <button onClick={() => handleDelete(s._id)} title="Delete"
                      className="text-red-500 hover:text-red-600 transition">
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <Modal entry={editSlide} onSave={handleSave} onClose={() => { setModalOpen(false); setEditSlide(null); }} saving={saving} />}
      {viewSlide && <ViewModal slide={viewSlide} onClose={() => setViewSlide(null)} />}
    </div>
  );
};

export default AdminIntroSlides;

