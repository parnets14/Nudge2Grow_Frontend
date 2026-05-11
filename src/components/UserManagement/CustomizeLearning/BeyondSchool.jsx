import { useState, useEffect, useCallback } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdSearch,
  MdArrowBack, MdArrowForward, MdBook, MdStyle, MdSchool,
  MdTopic, MdVisibility, MdImage,
} from "react-icons/md";
import { api } from "../../../api";
import { MDI_ICONS } from "../../../data/mdiIconNames";
import { getImageUrl } from "../../../utils/imageUrl";

// ─── Shared helpers ────────────────────────────────────────────────────────────
const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";
const selCls = "border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-2 focus:ring-[#00aa59]/10 bg-white text-gray-700 cursor-pointer";

const RN_ICONS = [
  { name: "brain" }, { name: "wallet" }, { name: "palette" }, { name: "shield-check" },
  { name: "calculator" }, { name: "flask" }, { name: "book-open-page-variant" },
  { name: "earth" }, { name: "robot" }, { name: "lightbulb-on" }, { name: "star" },
  { name: "heart" }, { name: "music" }, { name: "run" }, { name: "leaf" },
  { name: "code-tags" }, { name: "chart-bar" }, { name: "camera" },
  { name: "microphone" }, { name: "chess-knight" },
];

const TABS = [
  { key: "subjects",     label: "Subjects",      icon: <MdBook /> },
  { key: "topics",       label: "Topics",        icon: <MdTopic /> },
  { key: "flashcards",   label: "Flashcards",    icon: <MdStyle /> },
  { key: "learndetails", label: "Learn Details", icon: <MdSchool /> },
];

// ─── useDropdowns hook ─────────────────────────────────────────────────────────
const useDropdowns = () => {
  const [subjects, setSubjects] = useState([]);
  const [grades,   setGrades]   = useState([]);

  useEffect(() => {
    api.customizeLearning.getAll()
      .then(r => setSubjects((r.data || r || []).filter(i => i.type === "life_skill")))
      .catch(() => {});
    api.grades.getAll()
      .then(r => setGrades(Array.isArray(r) ? r : []))
      .catch(() => {});
  }, []);

  return { subjects, grades };
};

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1 — Subjects
// ═══════════════════════════════════════════════════════════════════════════════
const SubjectModal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { name: "", type: "life_skill" });
  const valid = form.name.trim() !== "";
  const searchResults = form._iconSearch
    ? MDI_ICONS.filter(n => n.includes(form._iconSearch.toLowerCase())).slice(0, 60)
    : RN_ICONS.map(ic => ic.name);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#00aa59] px-5 py-3 flex justify-between items-center">
          <h2 className="text-base font-bold text-white">{entry ? "Edit Subject" : "Add Subject"}</h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><MdClose className="text-lg" /></button>
        </div>
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Subject Name <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Financial Literacy" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">React Native Icon</label>
            <div className="relative mb-2">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#00aa59] transition"
                placeholder="Search icons..." value={form._iconSearch || ""} onChange={e => setForm(p => ({ ...p, _iconSearch: e.target.value }))} />
            </div>
            <div className="grid grid-cols-5 gap-1.5 max-h-52 overflow-y-auto pr-1">
              {searchResults.map(name => (
                <button key={name} type="button" onClick={() => setForm(p => ({ ...p, rnIcon: name }))} title={name}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border-2 transition ${form.rnIcon === name ? "border-[#00aa59] bg-green-50 text-[#00aa59]" : "border-gray-100 bg-gray-50 text-gray-400 hover:border-[#00aa59]"}`}>
                  <i className={`mdi mdi-${name} text-xl`} />
                  <span className="text-[8px] font-medium text-center leading-tight truncate w-full">{name}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input className="flex-1 border border-dashed border-gray-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#00aa59] transition text-gray-600"
                placeholder="Or type icon name directly..." value={form.rnIcon || ""} onChange={e => setForm(p => ({ ...p, rnIcon: e.target.value }))} />
              {form.rnIcon && <i className={`mdi mdi-${form.rnIcon} text-xl text-[#00aa59] shrink-0`} />}
            </div>
          </div>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-5 py-2 rounded-lg text-white text-sm font-bold flex items-center gap-2 ${valid && !saving ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add Subject"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TabSubjects = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await api.customizeLearning.getAll(); setItems((res.data || res || []).filter(i => i.type === "life_skill")); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const { _iconSearch, ...rest } = form;
      if (editItem) await api.customizeLearning.update(editItem._id, { ...rest, type: "life_skill" });
      else await api.customizeLearning.create({ ...rest, type: "life_skill" });
      setModalOpen(false); await load();
    } catch (e) { alert("Save failed."); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try { await api.customizeLearning.remove(id); await load(); } catch (e) { console.error(e); }
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-700">Beyond School Subjects</h2>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md">
          <MdAdd className="text-lg" /> Add Subject
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-6 py-4 text-left font-semibold w-16">No</th>
              <th className="px-6 py-4 text-left font-semibold">Icon</th>
              <th className="px-6 py-4 text-left font-semibold">Subject Name</th>
              <th className="px-6 py-4 text-left font-semibold">RN Icon</th>
              <th className="px-6 py-4 text-center font-semibold w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-gray-400">No subjects yet.</td></tr>
            ) : paginatedItems.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-gray-500 font-medium">{startIndex + i + 1}</td>
                <td className="px-6 py-4"><div className="w-9 h-9 rounded-lg bg-[#00aa59]/10 flex items-center justify-center"><i className={`mdi mdi-${item.rnIcon || "book"} text-xl text-[#00aa59]`} /></div></td>
                <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                <td className="px-6 py-4">{item.rnIcon ? <code className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded">{item.rnIcon}</code> : <span className="text-gray-300">—</span>}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-amber-400 hover:text-amber-500"><MdEdit className="text-xl" /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-600"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length > itemsPerPage && (
        <div className="flex items-center justify-between bg-white rounded-xl px-5 py-3 border border-gray-200">
          <p className="text-sm text-gray-600">Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, items.length)} of {items.length}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"><MdArrowBack /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${currentPage === page ? "bg-[#00aa59] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"><MdArrowForward /></button>
          </div>
        </div>
      )}
      {modalOpen && <SubjectModal entry={editItem} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2 — Topics
// ═══════════════════════════════════════════════════════════════════════════════
const TopicModal = ({ entry, onSave, onClose, saving, subjects, grades }) => {
  // Format ISO date string to YYYY-MM-DD for the date input
  const toDateInput = (val) => {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
  };

  const [form, setForm] = useState(entry
    ? { ...entry, scheduledDate: toDateInput(entry.scheduledDate) }
    : { subjectId: "", topic: "", title: "", description: "", imageUrl: "", grade: "", scheduledDate: "" }
  );
  const [uploading, setUploading] = useState(false);
  const valid = form.subjectId && form.topic && form.scheduledDate && form.grade;

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("photo", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      // Store the full URL so it works regardless of environment
      setForm(p => ({ ...p, imageUrl: data.url }));
    } catch (err) { alert("Image upload failed: " + err.message); } finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#00aa59] px-5 py-3 flex justify-between items-center">
          <h2 className="text-base font-bold text-white">{entry ? "Edit Topic" : "Add Topic"}</h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><MdClose /></button>
        </div>
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
            <select className={selCls} value={form.subjectId} onChange={e => setForm(p => ({ ...p, subjectId: e.target.value }))}>
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Topic <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="Topic name" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
            <input className={inp} placeholder="Title" value={form.title || ""} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
            <textarea className={`${inp} resize-none`} rows={3} placeholder="Description" value={form.description || ""} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Topic Image</label>
            <label className={`flex items-center gap-3 cursor-pointer group ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
              <div className={`w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center shrink-0 overflow-hidden transition ${form.imageUrl ? "border-[#00aa59]" : "border-gray-300 group-hover:border-[#00aa59]"}`}>
                {uploading ? <div className="w-5 h-5 border-2 border-[#00aa59] border-t-transparent rounded-full animate-spin" />
                  : form.imageUrl ? <img src={getImageUrl(form.imageUrl)} alt="preview" className="w-full h-full object-cover" />
                  : <MdImage className="text-2xl text-gray-300 group-hover:text-[#00aa59] transition" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#00aa59]">{uploading ? "Uploading..." : form.imageUrl ? "Change Image" : "Select Image"}</p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP · max 5MB</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            {form.imageUrl && !uploading && (
              <button type="button" onClick={() => setForm(p => ({ ...p, imageUrl: "" }))} className="mt-1 text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1">
                <MdDelete className="text-xs" /> Remove
              </button>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Grade <span className="text-red-500">*</span></label>
            <select className={selCls} value={form.grade || ""} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}>
              <option value="">Select Grade</option>
              {grades.map(g => <option key={g._id} value={g.title}>{g.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Scheduled Date <span className="text-red-500">*</span></label>
            <input type="date" className={inp} value={form.scheduledDate || ""} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))} />
          </div>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving || uploading}
            className={`px-5 py-2 rounded-lg text-white text-sm font-bold flex items-center gap-2 ${valid && !saving && !uploading ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TabTopics = () => {
  const { subjects, grades } = useDropdowns();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try { const data = await api.beyondSchoolTopics.getAll(); setItems(Array.isArray(data) ? data : []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.beyondSchoolTopics.update(editItem._id, form);
      else await api.beyondSchoolTopics.create(form);
      setModalOpen(false); await load();
    } catch (e) { alert(e.response?.data?.message || "Failed to save topic"); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this topic?")) return;
    await api.beyondSchoolTopics.remove(id); load();
  };

  const filteredItems = items.filter(t => {
    const matchSearch = t.topic?.toLowerCase().includes(searchTerm.toLowerCase()) || t.subjectName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch && (!filterGrade || t.grade === filterGrade) && (!filterSubject || t.subjectName === filterSubject);
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterGrade, filterSubject]);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <input type="text" placeholder="Search topics..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white" />
          <MdBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><MdClose /></button>}
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md">
          <MdAdd className="text-lg" /> Add Topic
        </button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className={selCls}>
          <option value="">All Grades</option>
          {grades.map(g => <option key={g._id} value={g.title}>{g.title}</option>)}
        </select>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className={selCls}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
        </select>
        {(filterGrade || filterSubject) && (
          <button onClick={() => { setFilterGrade(""); setFilterSubject(""); }} className="flex items-center gap-1 px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm text-gray-500 hover:bg-gray-100"><MdClose /> Clear</button>
        )}
        <span className="text-sm text-gray-500 ml-auto"><span className="font-semibold text-[#00aa59]">{filteredItems.length}</span> topic{filteredItems.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-4 py-3.5 text-left w-10">No</th>
              <th className="px-4 py-3.5 text-left w-16">Image</th>
              <th className="px-4 py-3.5 text-left">Topic</th>
              <th className="px-4 py-3.5 text-left">Subject</th>
              <th className="px-4 py-3.5 text-left">Grade</th>
              <th className="px-4 py-3.5 text-left">Scheduled Date</th>
              <th className="px-4 py-3.5 text-left">Description</th>
              <th className="px-4 py-3.5 text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16 text-gray-400">No topics yet.</td></tr>
            ) : paginatedItems.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 text-gray-400">{startIndex + i + 1}</td>
                <td className="px-4 py-3">
                  {item.imageUrl
                    ? <img src={getImageUrl(item.imageUrl)} alt={item.topic} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                    : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"><MdImage className="text-gray-300 text-xl" /></div>}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">{item.topic}</td>
                <td className="px-4 py-3 text-gray-600">{item.subjectName || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{item.grade || "—"}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs"><span className="line-clamp-2 text-xs">{item.description || "—"}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewItem(item)} title="View" className="text-[#00aa59] hover:text-[#008f4a]"><MdVisibility className="text-xl" /></button>
                    <button onClick={() => { setEditItem(item); setModalOpen(true); }} title="Edit" className="text-amber-400 hover:text-amber-500"><MdEdit className="text-xl" /></button>
                    <button onClick={() => handleDelete(item._id)} title="Delete" className="text-red-500 hover:text-red-600"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredItems.length > itemsPerPage && (
        <div className="flex items-center justify-between bg-white rounded-xl px-5 py-3 border border-gray-200">
          <p className="text-sm text-gray-600">Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"><MdArrowBack /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${currentPage === page ? "bg-[#00aa59] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"><MdArrowForward /></button>
          </div>
        </div>
      )}
      {viewItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[92vh]">
            <div className="bg-[#00aa59] px-7 py-5 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-extrabold text-white">Topic Details</h2>
              <button onClick={() => setViewItem(null)} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose className="text-xl" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-4">
              {viewItem.imageUrl && <img src={getImageUrl(viewItem.imageUrl)} alt={viewItem.topic} className="w-full h-48 object-cover rounded-2xl border border-gray-200" />}
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Topic</p><p className="text-sm font-semibold text-gray-800">{viewItem.topic}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Subject</p><p className="text-sm font-semibold text-gray-800">{viewItem.subjectName || "—"}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Grade</p><p className="text-sm text-gray-700">{viewItem.grade || "—"}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Scheduled Date</p><p className="text-sm text-gray-700">{viewItem.scheduledDate ? new Date(viewItem.scheduledDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}</p></div>
              </div>
              {viewItem.description && <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Description</p><p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{viewItem.description}</p></div>}
            </div>
            <div className="px-7 py-4 bg-gray-50 border-t flex justify-between shrink-0">
              <button onClick={() => { setViewItem(null); setEditItem(viewItem); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600"><MdEdit /> Edit</button>
              <button onClick={() => setViewItem(null)} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}
      {modalOpen && <TopicModal entry={editItem} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} subjects={subjects} grades={grades} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3 — Flashcards (Beyond School Content Sets)
// ═══════════════════════════════════════════════════════════════════════════════
const BeyondSchoolContentSetModal = ({ entry, onSave, onClose, saving, subjects, grades }) => {
  const emptyFC     = () => ({ content: "", title: "", description: "", subtitle: "", subdescription: "" });
  const emptyQA     = () => ({ content: "", question: "", answer: "" });
  const emptyPrompt = () => ({ content: "", prompt: "", hint: "" });

  const [form, setForm] = useState({
    subjectId:  entry?.subjectId  || "",
    topicId:    entry?.topicId    || "",
    grade:      entry?.grade      || "",
    flashcards: entry?.flashcards?.length
      ? entry.flashcards.map(f => ({
          content:        f.content        || "",
          title:          f.title          || "",
          description:    f.description    || "",
          subtitle:       f.subtitle       || "",
          subdescription: f.subdescription || "",
        }))
      : [],
    qaCards: entry?.qaCards?.length
      ? entry.qaCards.map(q => ({
          content:  q.content  || "",
          question: q.question || "",
          answer:   q.answer   || "",
        }))
      : [],
    prompts: entry?.prompts?.length
      ? entry.prompts.map(p => ({
          content: p.content || "",
          prompt:  p.prompt  || "",
          hint:    p.hint    || "",
        }))
      : [],
  });
  const [topics, setTopics] = useState([]);
  const [existingTopicIds, setExistingTopicIds] = useState(new Set());

  useEffect(() => {
    if (form.subjectId) {
      Promise.all([
        api.beyondSchoolTopics.getAll().catch(() => []),
        api.beyondSchoolContentSets.getAll().catch(() => []),
      ]).then(([allTopics, allSets]) => {
        const subjectTopics = (Array.isArray(allTopics) ? allTopics : [])
          .filter(t => String(t.subjectId) === String(form.subjectId));
        setTopics(subjectTopics);

        // Topics that already have a content set — exclude current entry when editing
        const usedIds = new Set(
          (Array.isArray(allSets) ? allSets : [])
            .filter(s => !entry || String(s.topicId) !== String(entry.topicId))
            .map(s => String(s.topicId))
        );
        setExistingTopicIds(usedIds);
      });
    } else {
      setTopics([]);
      setExistingTopicIds(new Set());
    }
  }, [form.subjectId]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const valid = form.subjectId && form.topicId;
  const updateItem = (key, idx, field, val) => { const arr = [...form[key]]; arr[idx] = { ...arr[idx], [field]: val }; set(key, arr); };
  const addItem    = (key, empty) => set(key, [...form[key], empty()]);
  const removeItem = (key, idx)   => set(key, form[key].filter((_, i) => i !== idx));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">
        <div className="bg-[#00aa59] px-6 py-4 flex justify-between items-center shrink-0">
          <h2 className="text-base font-bold text-white">{entry ? "Edit Content Set" : "Add Content Set"}</h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><MdClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
              <select className={selCls} value={form.subjectId} onChange={e => { set("subjectId", e.target.value); set("topicId", ""); }}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Topic <span className="text-red-500">*</span></label>
              <select className={selCls} value={form.topicId} onChange={e => set("topicId", e.target.value)}
                disabled={!form.subjectId || !form.grade}>
                <option value="">Select Topic</option>
                {topics
                  .filter(t => !existingTopicIds.has(String(t._id)))
                  .filter(t => form.grade && t.grade === form.grade)
                  .map(t => <option key={t._id} value={t._id}>{t.topic || t.title}</option>)}
              </select>
              {!form.subjectId && (
                <p className="mt-1 text-xs text-amber-500 font-medium">⬆ Select a subject first</p>
              )}
              {form.subjectId && !form.grade && (
                <p className="mt-1 text-xs text-amber-500 font-medium">⬆ Select a grade to see available topics</p>
              )}
              {form.subjectId && form.grade && topics.filter(t => !existingTopicIds.has(String(t._id)) && t.grade === form.grade).length === 0 && (
                <p className="mt-1 text-xs text-gray-400 font-medium">No available topics for this subject &amp; grade</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Grade</label>
              <select className={selCls} value={form.grade} onChange={e => { set("grade", e.target.value); set("topicId", ""); }}>
                <option value="">Select Grade</option>
                {grades.map(g => <option key={g._id} value={g.title}>{g.title}</option>)}
              </select>
            </div>
          </div>
          {/* Flashcards */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Flashcards</label>
              <button type="button" onClick={() => addItem("flashcards", emptyFC)} className="text-xs text-[#00aa59] font-bold hover:underline">+ Add</button>
            </div>
            {form.flashcards.length === 0 && (
              <p className="text-xs text-gray-400 italic px-1 mb-2">No flashcards added. Click + Add to create one.</p>
            )}
            {form.flashcards.map((fc, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-3 mb-2 space-y-2 bg-gray-50">
                <div className="flex justify-between items-center"><span className="text-xs font-semibold text-gray-500">Card {i + 1}</span><button type="button" onClick={() => removeItem("flashcards", i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button></div>
                <input className={inp} placeholder="Badge Text (e.g. ABOUT, TIP)" value={fc.content || ""} onChange={e => updateItem("flashcards", i, "content", e.target.value)} />
                <input className={inp} placeholder="Title" value={fc.title} onChange={e => updateItem("flashcards", i, "title", e.target.value)} />
                <textarea className={`${inp} resize-none`} rows={2} placeholder="Description" value={fc.description} onChange={e => updateItem("flashcards", i, "description", e.target.value)} />
                <input className={inp} placeholder="Subtitle (optional)" value={fc.subtitle || ""} onChange={e => updateItem("flashcards", i, "subtitle", e.target.value)} />
                <textarea className={`${inp} resize-none`} rows={2} placeholder="Sub-description (optional)" value={fc.subdescription || ""} onChange={e => updateItem("flashcards", i, "subdescription", e.target.value)} />
              </div>
            ))}
          </div>
          {/* Q&A */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Q&A Cards</label>
              <button type="button" onClick={() => addItem("qaCards", emptyQA)} className="text-xs text-[#00aa59] font-bold hover:underline">+ Add</button>
            </div>
            {form.qaCards.length === 0 && (
              <p className="text-xs text-gray-400 italic px-1 mb-2">No Q&A cards added. Click + Add to create one.</p>
            )}
            {form.qaCards.map((qa, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-3 mb-2 space-y-2 bg-gray-50">
                <div className="flex justify-between items-center"><span className="text-xs font-semibold text-gray-500">Q&A {i + 1}</span><button type="button" onClick={() => removeItem("qaCards", i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button></div>
                <input className={inp} placeholder="Badge Text (e.g. QUESTION, QUIZ)" value={qa.content || ""} onChange={e => updateItem("qaCards", i, "content", e.target.value)} />
                <input className={inp} placeholder="Question" value={qa.question} onChange={e => updateItem("qaCards", i, "question", e.target.value)} />
                <textarea className={`${inp} resize-none`} rows={2} placeholder="Answer" value={qa.answer} onChange={e => updateItem("qaCards", i, "answer", e.target.value)} />
              </div>
            ))}
          </div>
          {/* Prompts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Prompts</label>
              <button type="button" onClick={() => addItem("prompts", emptyPrompt)} className="text-xs text-[#00aa59] font-bold hover:underline">+ Add</button>
            </div>
            {form.prompts.length === 0 && (
              <p className="text-xs text-gray-400 italic px-1 mb-2">No prompts added. Click + Add to create one.</p>
            )}
            {form.prompts.map((p, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-3 mb-2 space-y-2 bg-gray-50">
                <div className="flex justify-between items-center"><span className="text-xs font-semibold text-gray-500">Prompt {i + 1}</span><button type="button" onClick={() => removeItem("prompts", i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button></div>
                <input className={inp} placeholder="Badge Text (e.g. PROMPT, TRY THIS)" value={p.content || ""} onChange={e => updateItem("prompts", i, "content", e.target.value)} />
                <textarea className={`${inp} resize-none`} rows={2} placeholder="Prompt text" value={p.prompt} onChange={e => updateItem("prompts", i, "prompt", e.target.value)} />
                <input className={inp} placeholder="Hint (optional)" value={p.hint || ""} onChange={e => updateItem("prompts", i, "hint", e.target.value)} />
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-5 py-2 rounded-lg text-white text-sm font-bold flex items-center gap-2 ${valid && !saving ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TabFlashcards = () => {
  const { subjects, grades } = useDropdowns();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterGrade, setFilterGrade] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await api.beyondSchoolContentSets.getAll(); setItems(Array.isArray(d) ? d : []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.beyondSchoolContentSets.update(editItem._id, form);
      else await api.beyondSchoolContentSets.create(form);
      setModalOpen(false); await load();
    } catch (e) { alert("Save failed."); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this content set?")) return;
    await api.beyondSchoolContentSets.remove(id); load();
  };

  const filtered = items.filter(i => (!filterSubject || i.subjectName === filterSubject) && (!filterGrade || i.grade === filterGrade));

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3 flex-wrap">
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className={selCls}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
          </select>
          <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className={selCls}>
            <option value="">All Grades</option>
            {grades.map(g => <option key={g._id} value={g.title}>{g.title}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500"><span className="font-semibold text-[#00aa59]">{filtered.length}</span> content set{filtered.length !== 1 ? "s" : ""}</span>
          <button onClick={() => { setEditItem(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md">
            <MdAdd className="text-lg" /> Add
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-4 py-3.5 text-left w-10">No</th>
              <th className="px-4 py-3.5 text-left">Subject</th>
              <th className="px-4 py-3.5 text-left">Topic</th>
              <th className="px-4 py-3.5 text-left">Grade</th>
              <th className="px-4 py-3.5 text-center">Flashcards</th>
              <th className="px-4 py-3.5 text-center">Q&A</th>
              <th className="px-4 py-3.5 text-center">Prompts</th>
              <th className="px-4 py-3.5 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-16 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16 text-gray-400">No content sets yet.</td></tr>
            ) : filtered.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{item.subjectName || "—"}</td>
                <td className="px-4 py-3 text-gray-700">{item.topicTitle || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{item.grade || "—"}</td>
                <td className="px-4 py-3 text-center"><span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{item.flashcards?.length || 0}</span></td>
                <td className="px-4 py-3 text-center"><span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{item.qaCards?.length || 0}</span></td>
                <td className="px-4 py-3 text-center"><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{item.prompts?.length || 0}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewItem(item)} className="text-[#00aa59] hover:text-[#008f4a]"><MdVisibility className="text-xl" /></button>
                    <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-amber-400 hover:text-amber-500"><MdEdit className="text-xl" /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-600"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">
            <div className="bg-[#00aa59] px-7 py-5 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-extrabold text-white">Content Set Details</h2>
              <button onClick={() => setViewItem(null)} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose className="text-xl" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Subject</p><p className="text-sm font-semibold">{viewItem.subjectName}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Topic</p><p className="text-sm font-semibold">{viewItem.topicTitle}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Grade</p><p className="text-sm">{viewItem.grade || "—"}</p></div>
              </div>
              {viewItem.flashcards?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Flashcards ({viewItem.flashcards.length})</p>
                  {viewItem.flashcards.map((f, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 mb-2">
                      {f.content && <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full mb-1">{f.content}</span>}
                      <p className="font-semibold text-sm">{f.title}</p>
                      {f.description && <p className="text-xs text-gray-500 mt-1">{f.description}</p>}
                      {f.subtitle && <p className="text-xs font-bold text-gray-700 mt-1">{f.subtitle}</p>}
                      {f.subdescription && <p className="text-xs text-gray-500 mt-0.5">{f.subdescription}</p>}
                    </div>
                  ))}
                </div>
              )}
              {viewItem.qaCards?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Q&A ({viewItem.qaCards.length})</p>
                  {viewItem.qaCards.map((q, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 mb-2">
                      {q.content && <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mb-1">{q.content}</span>}
                      <p className="font-semibold text-sm">Q: {q.question}</p>
                      <p className="text-xs text-gray-500 mt-1">A: {q.answer}</p>
                    </div>
                  ))}
                </div>
              )}
              {viewItem.prompts?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Prompts ({viewItem.prompts.length})</p>
                  {viewItem.prompts.map((p, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 mb-2">
                      {p.content && <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full mb-1">{p.content}</span>}
                      <p className="text-sm">{p.prompt}</p>
                      {p.hint && <p className="text-xs text-gray-400 mt-1">Hint: {p.hint}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-7 py-4 bg-gray-50 border-t flex justify-between shrink-0">
              <button onClick={() => { setViewItem(null); setEditItem(viewItem); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600"><MdEdit /> Edit</button>
              <button onClick={() => setViewItem(null)} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}
      {modalOpen && <BeyondSchoolContentSetModal entry={editItem} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} subjects={subjects} grades={grades} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 4 — Learn Details
// ═══════════════════════════════════════════════════════════════════════════════
const BeyondSchoolLearnDetailModal = ({ entry, onSave, onClose, saving, subjects, grades }) => {
  const emptySection = () => ({ title: "", subtitle: "", description: "", points: [""] });

  const [form, setForm] = useState({
    subjectId: entry?.subjectId || "",
    topicId:   entry?.topicId   || "",
    grade:     entry?.grade     || "",
    level:     entry?.level     || "Basic",
    sections:  entry?.sections?.length ? entry.sections : [emptySection()],
    videoUrls: entry?.videoUrls?.length ? entry.videoUrls : (entry?.videoUrl ? [entry.videoUrl] : []),
  });
  const [topics, setTopics] = useState([]);
  const [existingTopicIds, setExistingTopicIds] = useState(new Set());

  useEffect(() => {
    if (form.subjectId) {
      Promise.all([
        api.beyondSchoolTopics.getAll().catch(() => []),
        api.beyondSchoolLearnDetails.getAll().catch(() => []),
      ]).then(([allTopics, allDetails]) => {
        const subjectTopics = (Array.isArray(allTopics) ? allTopics : [])
          .filter(t => String(t.subjectId) === String(form.subjectId));
        setTopics(subjectTopics);

        // Topics that already have a learn detail — exclude current entry when editing
        const usedIds = new Set(
          (Array.isArray(allDetails) ? allDetails : [])
            .filter(d => !entry || String(d.topicId) !== String(entry.topicId))
            .map(d => String(d.topicId))
        );
        setExistingTopicIds(usedIds);
      });
    } else {
      setTopics([]);
      setExistingTopicIds(new Set());
    }
  }, [form.subjectId]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const valid = form.subjectId && form.topicId;

  const updateSection = (idx, field, val) => { const arr = [...form.sections]; arr[idx] = { ...arr[idx], [field]: val }; set("sections", arr); };
  const updatePoint = (si, pi, val) => { const arr = [...form.sections]; const pts = [...(arr[si].points || [])]; pts[pi] = val; arr[si] = { ...arr[si], points: pts }; set("sections", arr); };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">
        <div className="bg-[#00aa59] px-6 py-4 flex justify-between items-center shrink-0">
          <h2 className="text-base font-bold text-white">{entry ? "Edit Learn Detail" : "Add Learn Detail"}</h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><MdClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
              <select className={selCls} value={form.subjectId} onChange={e => { set("subjectId", e.target.value); set("topicId", ""); }}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Topic <span className="text-red-500">*</span></label>
              <select className={selCls} value={form.topicId} onChange={e => set("topicId", e.target.value)}
                disabled={!form.subjectId || !form.grade}>
                <option value="">Select Topic</option>
                {topics
                  .filter(t => !existingTopicIds.has(String(t._id)))
                  .filter(t => form.grade && t.grade === form.grade)
                  .map(t => <option key={t._id} value={t._id}>{t.topic || t.title}</option>)}
              </select>
              {!form.subjectId && (
                <p className="mt-1 text-xs text-amber-500 font-medium">⬆ Select a subject first</p>
              )}
              {form.subjectId && !form.grade && (
                <p className="mt-1 text-xs text-amber-500 font-medium">⬆ Select a grade to see available topics</p>
              )}
              {form.subjectId && form.grade && topics.filter(t => !existingTopicIds.has(String(t._id)) && t.grade === form.grade).length === 0 && (
                <p className="mt-1 text-xs text-gray-400 font-medium">No available topics for this subject &amp; grade</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Grade</label>
              <select className={selCls} value={form.grade} onChange={e => { set("grade", e.target.value); set("topicId", ""); }}>
                <option value="">Select Grade</option>
                {grades.map(g => <option key={g._id} value={g.title}>{g.title}</option>)}
              </select>
            </div>
          </div>
          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Sections</label>
              <button type="button" onClick={() => set("sections", [...form.sections, emptySection()])} className="text-xs text-[#00aa59] font-bold hover:underline">+ Add Section</button>
            </div>
            {form.sections.map((sec, si) => (
              <div key={si} className="border border-gray-200 rounded-xl p-3 mb-3 space-y-2 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Section {si + 1}</span>
                  {form.sections.length > 1 && <button type="button" onClick={() => set("sections", form.sections.filter((_, i) => i !== si))} className="text-red-400 hover:text-red-600 text-xs">Remove</button>}
                </div>
                <input className={inp} placeholder="Title" value={sec.title || ""} onChange={e => updateSection(si, "title", e.target.value)} />
                <input className={inp} placeholder="Subtitle (optional)" value={sec.subtitle || ""} onChange={e => updateSection(si, "subtitle", e.target.value)} />
                <textarea className={`${inp} resize-none`} rows={2} placeholder="Description" value={sec.description || ""} onChange={e => updateSection(si, "description", e.target.value)} />
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-semibold">Points</span>
                    <button type="button" onClick={() => { const arr=[...form.sections]; arr[si]={...arr[si],points:[...(arr[si].points||[]),""]};set("sections",arr); }} className="text-xs text-[#00aa59] hover:underline">+ Point</button>
                  </div>
                  {(sec.points || []).map((pt, pi) => (
                    <div key={pi} className="flex gap-2 mb-1">
                      <input className={`${inp} flex-1`} placeholder={`Point ${pi+1}`} value={pt} onChange={e => updatePoint(si, pi, e.target.value)} />
                      {(sec.points||[]).length > 1 && <button type="button" onClick={() => { const arr=[...form.sections]; arr[si]={...arr[si],points:arr[si].points.filter((_,i)=>i!==pi)};set("sections",arr); }} className="text-red-400 hover:text-red-600"><MdClose /></button>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Video URLs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase">YouTube Videos</label>
              <button type="button" onClick={() => set("videoUrls", [...form.videoUrls, ""])} className="text-xs text-[#00aa59] font-bold hover:underline">+ Add URL</button>
            </div>
            {form.videoUrls.map((url, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className={`${inp} flex-1`} placeholder="https://youtube.com/..." value={url} onChange={e => { const arr=[...form.videoUrls]; arr[i]=e.target.value; set("videoUrls",arr); }} />
                <button type="button" onClick={() => set("videoUrls", form.videoUrls.filter((_,j)=>j!==i))} className="text-red-400 hover:text-red-600"><MdClose /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-5 py-2 rounded-lg text-white text-sm font-bold flex items-center gap-2 ${valid && !saving ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TabLearnDetails = () => {
  const { subjects, grades } = useDropdowns();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterGrade, setFilterGrade] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await api.beyondSchoolLearnDetails.getAll(); setItems(Array.isArray(d) ? d : []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.beyondSchoolLearnDetails.update(editItem._id, form);
      else await api.beyondSchoolLearnDetails.create(form);
      setModalOpen(false); await load();
    } catch (e) { alert("Save failed."); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this learn detail?")) return;
    await api.beyondSchoolLearnDetails.remove(id); load();
  };

  const filtered = items.filter(i => (!filterSubject || i.subjectName === filterSubject) && (!filterGrade || i.grade === filterGrade));
  const levelColor = l => l === "Advanced" ? "bg-red-100 text-red-600" : l === "Intermediate" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700";

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3 flex-wrap">
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className={selCls}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
          </select>
          <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className={selCls}>
            <option value="">All Grades</option>
            {grades.map(g => <option key={g._id} value={g.title}>{g.title}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500"><span className="font-semibold text-[#00aa59]">{filtered.length}</span> learn detail{filtered.length !== 1 ? "s" : ""}</span>
          <button onClick={() => { setEditItem(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md">
            <MdAdd className="text-lg" /> Add
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-4 py-3.5 text-left w-10">No</th>
              <th className="px-4 py-3.5 text-left">Subject</th>
              <th className="px-4 py-3.5 text-left">Topic</th>
              <th className="px-4 py-3.5 text-left">Grade</th>
              <th className="px-4 py-3.5 text-left">Sections</th>
              <th className="px-4 py-3.5 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">No learn details yet.</td></tr>
            ) : filtered.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{item.subjectName || "—"}</td>
                <td className="px-4 py-3 text-gray-700">{item.topicTitle || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{item.grade || "—"}</td>
                <td className="px-4 py-3 text-center"><span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">{item.sections?.length || 0}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewItem(item)} className="text-[#00aa59] hover:text-[#008f4a]"><MdVisibility className="text-xl" /></button>
                    <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-amber-400 hover:text-amber-500"><MdEdit className="text-xl" /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-600"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">
            <div className="bg-[#00aa59] px-7 py-5 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-extrabold text-white">Learn Detail</h2>
              <button onClick={() => setViewItem(null)} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose className="text-xl" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Subject</p><p className="text-sm font-semibold">{viewItem.subjectName}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Topic</p><p className="text-sm font-semibold">{viewItem.topicTitle}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Grade</p><p className="text-sm text-gray-700">{viewItem.grade || "—"}</p></div>
              </div>
              {viewItem.sections?.length > 0 && viewItem.sections.map((sec, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <p className="font-bold text-sm text-gray-800 mb-1">{sec.title}</p>
                  {sec.subtitle && <p className="text-xs text-gray-500 mb-1">{sec.subtitle}</p>}
                  {sec.description && <p className="text-sm text-gray-700 mb-2">{sec.description}</p>}
                  {sec.points?.filter(Boolean).length > 0 && <ul className="list-disc list-inside space-y-1">{sec.points.filter(Boolean).map((pt, pi) => <li key={pi} className="text-sm text-gray-600">{pt}</li>)}</ul>}
                </div>
              ))}
              {viewItem.videoUrls?.length > 0 && (
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-2">Videos</p>
                  {viewItem.videoUrls.map((url, i) => <a key={i} href={url} target="_blank" rel="noreferrer" className="block text-sm text-blue-600 hover:underline truncate mb-1">{url}</a>)}
                </div>
              )}
            </div>
            <div className="px-7 py-4 bg-gray-50 border-t flex justify-between shrink-0">
              <button onClick={() => { setViewItem(null); setEditItem(viewItem); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600"><MdEdit /> Edit</button>
              <button onClick={() => setViewItem(null)} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}
      {modalOpen && <BeyondSchoolLearnDetailModal entry={editItem} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} subjects={subjects} grades={grades} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN BeyondSchool Component
// ═══════════════════════════════════════════════════════════════════════════════
const BeyondSchool = () => {
  const [activeTab, setActiveTab] = useState("subjects");

  const renderTab = () => {
    switch (activeTab) {
      case "subjects":     return <TabSubjects />;
      case "topics":       return <TabTopics />;
      case "flashcards":   return <TabFlashcards />;
      case "learndetails": return <TabLearnDetails />;
      default:             return null;
    }
  };

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-6 pt-4">
        <div className="flex items-center gap-1">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl border-b-2 transition-all ${
                activeTab === tab.key
                  ? "border-[#00aa59] text-[#00aa59] bg-[#00aa59]/5"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div>{renderTab()}</div>
    </div>
  );
};

export default BeyondSchool;

