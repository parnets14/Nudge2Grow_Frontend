import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdLightbulb, MdVisibility, MdArrowBack, MdArrowForward } from "react-icons/md";
import { api } from "../../api";

const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00bf62] transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { fact: "", prompt: "", source: "Britannica Kids", isActive: true });
  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const valid = form.fact.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#00bf62] px-5 py-3 flex justify-between items-center">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MdLightbulb /> {entry ? "Edit Fact" : "Add Did You Know"}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">
            <MdClose />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Fact <span className="text-red-500">*</span></label>
            <textarea rows={3} className={`${inp} resize-none`} placeholder="Enter an interesting fact..." value={form.fact} onChange={f("fact")} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Conversation Prompt</label>
            <textarea rows={2} className={`${inp} resize-none`} placeholder="e.g. Can you think of other foods..." value={form.prompt} onChange={f("prompt")} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Source</label>
            <input className={inp} placeholder="e.g. Britannica Kids" value={form.source} onChange={f("source")} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-[#00bf62]" />
            <span className="text-xs font-semibold text-gray-700">Active (show in app)</span>
          </label>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-5 py-2 rounded-lg text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#00bf62] hover:bg-[#00a055]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add Fact"}
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
        <h2 className="text-base font-bold text-white flex items-center gap-2"><MdLightbulb /> View Fact</h2>
        <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"><MdClose /></button>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Fact</p>
          <p className="text-sm text-gray-800">{item.fact}</p>
        </div>
        {item.prompt && <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Conversation Prompt</p>
          <p className="text-sm text-gray-600">{item.prompt}</p>
        </div>}
        {item.source && <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Source</p>
          <p className="text-sm text-gray-500 italic">{item.source}</p>
        </div>}
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t flex justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
      </div>
    </div>
  </div>
);

const AdminDidYouKnow = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const load = async () => {
    setLoading(true);
    try { 
      const res = await api.didYouKnow.getAll(); 
      setItems(res.data || res || []);
    }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.didYouKnow.update(editItem._id, form);
      else await api.didYouKnow.create(form);
      setModalOpen(false); setEditItem(null); await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fact?")) return;
    try { await api.didYouKnow.remove(id); await load(); } catch (e) { console.error(e); }
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.fact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <MdLightbulb className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Did You Know</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage facts shown on the home screen — {items.length} facts</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition">
          <MdAdd className="text-lg" /> Add Fact
        </button>
      </div>

      {/* Search Field */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search facts by content, prompt, or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-[#00bf62] focus:ring-4 focus:ring-[#00bf62]/10 transition bg-white"
          />
          <MdLightbulb className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <MdClose className="text-lg" />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="text-xs text-gray-600 mt-2">
            Found <span className="font-semibold text-[#00bf62]">{filteredItems.length}</span> fact{filteredItems.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-5 py-3.5 text-left font-semibold w-10">No</th>
              <th className="px-5 py-3.5 text-left font-semibold">Fact</th>
              <th className="px-5 py-3.5 text-left font-semibold">Conversation Prompt</th>
              <th className="px-5 py-3.5 text-left font-semibold">Source</th>
              <th className="px-5 py-3.5 text-left font-semibold w-24">Status</th>
              <th className="px-5 py-3.5 text-center font-semibold w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">Loading...</td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">
                <MdLightbulb className="text-5xl text-gray-200 mx-auto mb-2" />
                {searchTerm ? "No facts found matching your search" : "No facts yet. Add your first one!"}
              </td></tr>
            ) : paginatedItems.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-5 py-3.5 text-gray-400 font-medium">{startIndex + i + 1}</td>
                <td className="px-5 py-3.5 text-gray-800 max-w-xs">
                  <p className="truncate font-medium">{item.fact}</p>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-xs max-w-xs">
                  <p className="truncate">{item.prompt || "—"}</p>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-xs italic">{item.source || "—"}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={async () => {
                      try {
                        await api.didYouKnow.update(item._id, { ...item, isActive: !item.isActive });
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
                    <button onClick={() => setViewItem(item)} title="View" className="text-[#00bf62] hover:text-[#00a055] transition"><MdVisibility className="text-xl" /></button>
                    <button onClick={() => { setEditItem(item); setModalOpen(true); }} title="Edit" className="text-amber-400 hover:text-amber-500 transition"><MdEdit className="text-xl" /></button>
                    <button onClick={() => handleDelete(item._id)} title="Delete" className="text-red-500 hover:text-red-600 transition"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredItems.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl px-5 py-3 border border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} fact{filteredItems.length !== 1 ? 's' : ''}
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

      {modalOpen && <Modal entry={editItem} onSave={handleSave} onClose={() => { setModalOpen(false); setEditItem(null); }} saving={saving} />}
      {viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)} />}
    </div>
  );
};

export default AdminDidYouKnow;
