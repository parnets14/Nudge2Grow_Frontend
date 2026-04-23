import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdSearch, MdArrowBack, MdArrowForward } from "react-icons/md";
import { api } from "../../../api";
import { MDI_ICONS } from "../../../data/mdiIconNames";

const RN_ICONS = [
  { name: "brain",                  label: "Brain (AI)" },
  { name: "wallet",                 label: "Wallet (Finance)" },
  { name: "palette",                label: "Palette (Arts)" },
  { name: "shield-check",           label: "Shield (Safety)" },
  { name: "calculator",             label: "Calculator (Math)" },
  { name: "flask",                  label: "Flask (Science)" },
  { name: "book-open-page-variant", label: "Book (English)" },
  { name: "earth",                  label: "Earth (Social)" },
  { name: "robot",                  label: "Robot" },
  { name: "lightbulb-on",           label: "Lightbulb" },
  { name: "star",                   label: "Star" },
  { name: "heart",                  label: "Heart" },
  { name: "music",                  label: "Music" },
  { name: "run",                    label: "Sports" },
  { name: "leaf",                   label: "Nature" },
  { name: "code-tags",              label: "Code" },
  { name: "chart-bar",              label: "Chart" },
  { name: "camera",                 label: "Camera" },
  { name: "microphone",             label: "Microphone" },
  { name: "chess-knight",           label: "Chess" },
];

const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00bf62] transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry
    ? { ...entry }
    : { name: "", type: "life_skill" }
  );

  const valid = form.name.trim() !== "";
  const searchResults = form._iconSearch
    ? MDI_ICONS.filter(n => n.includes(form._iconSearch.toLowerCase())).slice(0, 60)
    : RN_ICONS.map(ic => ic.name);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#00bf62] px-5 py-3 flex justify-between items-center">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Subject</> : <><MdAdd /> Add Subject</>}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Subject Name <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Financial Literacy" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>

          {/* React Native Icon Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              React Native Icon <span className="text-gray-400 font-normal">(MaterialCommunityIcons — {MDI_ICONS.length.toLocaleString()} icons)</span>
            </label>
            <div className="relative mb-2">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#00bf62] transition"
                placeholder="Search icons... e.g. tennis, fire, soccer, account"
                value={form._iconSearch || ""}
                onChange={e => setForm(p => ({ ...p, _iconSearch: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-5 gap-1.5 max-h-52 overflow-y-auto pr-1">
              {searchResults.map(name => (
                <button key={name} type="button"
                  onClick={() => setForm(p => ({ ...p, rnIcon: name }))}
                  title={name}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border-2 transition ${form.rnIcon === name ? "border-[#00bf62] bg-green-50 text-[#00bf62]" : "border-gray-100 bg-gray-50 text-gray-400 hover:border-[#00bf62]"}`}>
                  <i className={`mdi mdi-${name} text-xl`} />
                  <span className="text-[8px] font-medium text-center leading-tight truncate w-full">{name}</span>
                </button>
              ))}
              {form._iconSearch && searchResults.length === 0 && (
                <div className="col-span-5 text-center py-4 text-xs text-gray-400">No icons found.</div>
              )}
            </div>

            {/* Manual input fallback */}
            <div className="mt-2 flex items-center gap-2">
              <input
                className="flex-1 border border-dashed border-gray-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#00bf62] transition text-gray-600"
                placeholder="Or type icon name directly: e.g. tennis, soccer-field..."
                value={form.rnIcon || ""}
                onChange={e => setForm(p => ({ ...p, rnIcon: e.target.value }))}
              />
              {form.rnIcon && <i className={`mdi mdi-${form.rnIcon} text-xl text-[#00bf62] shrink-0`} />}
            </div>

            {form.rnIcon && (
              <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <i className={`mdi mdi-${form.rnIcon} text-xl text-[#00bf62]`} />
                <code className="text-xs font-mono text-[#00a055] bg-green-100 px-2 py-0.5 rounded">{form.rnIcon}</code>
                <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noreferrer"
                  className="ml-auto text-[10px] text-[#00bf62] underline">Browse all</a>
                <button type="button" onClick={() => setForm(p => ({ ...p, rnIcon: "" }))}
                  className="text-gray-400 hover:text-red-400 transition">
                  <MdClose className="text-sm" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-5 py-2 rounded-lg text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#00bf62] hover:bg-[#00a055]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving…" : entry ? "Update" : "Add Subject"}
          </button>
        </div>
      </div>
    </div>
  );
};

const BeyondSchool = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.customizeLearning.getAll();
      setItems((res.data || res || []).filter(i => i.type === "life_skill"));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      // Strip UI-only fields before sending to backend
      const { _iconSearch, ...rest } = form;
      const payload = { ...rest, type: "life_skill" };
      if (editItem) await api.customizeLearning.update(editItem._id, payload);
      else await api.customizeLearning.create(payload);
      setModalOpen(false);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try { await api.customizeLearning.remove(id); await load(); } catch (e) { console.error(e); }
  };

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <i className="mdi mdi-robot text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Beyond School</h1>
            <p className="text-gray-500 text-xs mt-0.5">AI, Financial Literacy, Britannica & Safety Education</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition">
          <MdAdd className="text-lg" /> Add Subject
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-6 py-4 text-left font-semibold w-16">No</th>
              <th className="px-6 py-4 text-left font-semibold">Icon</th>
              <th className="px-6 py-4 text-left font-semibold">Subject Name</th>
              <th className="px-6 py-4 text-left font-semibold">RN Icon</th>
              <th className="px-6 py-4 text-center font-semibold w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-gray-400">
                  <i className="mdi mdi-robot text-5xl text-gray-300 block mx-auto mb-2" />
                  No subjects yet. Add your first one!
                </td>
              </tr>
            ) : paginatedItems.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-gray-500 font-medium">{startIndex + i + 1}</td>
                <td className="px-6 py-4">
                  <div className="w-9 h-9 rounded-lg bg-[#00bf62]/10 flex items-center justify-center">
                    <i className={`mdi mdi-${item.rnIcon || 'book'} text-xl text-[#00bf62]`} />
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                <td className="px-6 py-4">
                  {item.rnIcon
                    ? <code className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded">{item.rnIcon}</code>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => { setEditItem(item); setModalOpen(true); }} title="Edit"
                      className="text-amber-400 hover:text-amber-500 transition">
                      <MdEdit className="text-xl" />
                    </button>
                    <button onClick={() => handleDelete(item._id)} title="Delete"
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

      {/* Pagination */}
      {!loading && items.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl px-5 py-3 border border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, items.length)} of {items.length} subject{items.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <MdArrowBack />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition ${
                  currentPage === page
                    ? 'bg-[#00aa59] text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <MdArrowForward />
            </button>
          </div>
        </div>
      )}

      {modalOpen && <Modal entry={editItem} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} />}
    </div>
  );
};

export default BeyondSchool;
