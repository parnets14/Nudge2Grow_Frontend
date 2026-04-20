import { useState, useEffect, useCallback } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdInbox, MdMenuBook, MdLock, MdTrendingUp,
  MdClose, MdSave, MdExpandMore, MdExpandLess, MdPlayCircle, MdImage,
  MdArrowBack, MdArrowForward, MdCheck, MdVisibility, MdBook, MdTopic,
  MdStyle, MdSchool,
} from "react-icons/md";
import { api } from "../../api";

// ── Constants ─────────────────────────────────────────────────────────────────
const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";

const SUBJECT_NAMES = [
  { name: "Math", icon: "🔢" }, { name: "Science / EVS", icon: "🌿" },
  { name: "English", icon: "📖" }, { name: "Social Studies", icon: "🌍" },
  { name: "Artificial Intelligence", icon: "🧠" },
  { name: "Financial Literacy", icon: "💰" }, { name: "Sex & Safety", icon: "❤️" },
];

const SUBJECT_CONFIG = {
  "Math": { icon: "🔢", color: "#3B82F6", bg: "#EFF6FF" },
  "Science / EVS": { icon: "🌿", color: "#10B981", bg: "#ECFDF5" },
  "English": { icon: "📖", color: "#F59E0B", bg: "#FFFBEB" },
  "Social Studies": { icon: "🌍", color: "#EC4899", bg: "#FDF2F8" },
  "Artificial Intelligence": { icon: "🧠", color: "#8B5CF6", bg: "#F5F3FF" },
  "Financial Literacy": { icon: "💰", color: "#10B981", bg: "#ECFDF5" },
  "Sex & Safety": { icon: "❤️", color: "#EF4444", bg: "#FEF2F2" },
};

const TOPIC_TYPES = ["Activity", "Reading", "Video", "Quiz", "Game"];

const STEPS = [
  { key: "info",   label: "Subject Info", icon: <MdInbox /> },
  { key: "topics", label: "Topics",       icon: <MdBook /> },
];

const GRADES = ["Grade 1", "Grade 2", "Grade 3", "Grade 4"];

const TABS = [
  { key: "subjects",     label: "Subjects",      icon: <MdBook /> },
  { key: "topics",       label: "Topics",        icon: <MdTopic /> },
  { key: "flashcards",   label: "Flashcards",    icon: <MdStyle /> },
  { key: "learndetails", label: "Learn Details", icon: <MdSchool /> },
];

const makeEmptyTopic     = () => ({ title: "", type: "Activity", description: "", videoUrl: "" });
const makeEmptyFlashcard = () => ({ id: "", title: "", concept: "", parentOutcome: "", section2Title: "", section2: "" });
const makeEmptyQA        = () => ({ id: "", question: "", answer: "" });
const makeEmptyPrompt    = () => ({ id: "", prompt: "", hint: "" });

// ── Shared UI ─────────────────────────────────────────────────────────────────
const CircularProgress = ({ percentage, color = "#10B981", size = 44 }) => {
  const stroke = 4, r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color }}>{percentage}%</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ value, color = "#10B981" }) => (
  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
    <div className="h-full rounded-full transition-all" style={{ width: `${value || 0}%`, backgroundColor: color }} />
  </div>
);

// ── Subject Card ──────────────────────────────────────────────────────────────
const SubjectCard = ({ s, onEdit, onDelete }) => {
  const cfg = SUBJECT_CONFIG[s.name] || { icon: "📚", color: "#6B7280", bg: "#F9FAFB" };
  const progress = s.progress || 0;
  const status = progress >= 80 ? "On Track" : progress >= 50 ? "In Progress" : s.status || "Started";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {s.imageUrl
            ? <img src={s.imageUrl} alt={s.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
            : <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: cfg.bg }}>{cfg.icon}</div>}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-bold text-gray-800 text-sm">{s.name}</span>
              {s.type === "premium" && (
                <span className="flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                  <MdLock className="text-xs" /> Premium
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">{s.description || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CircularProgress percentage={progress} color={s.type === "premium" ? "#F59E0B" : cfg.color} size={44} />
          <div className="flex flex-col gap-1">
            <button onClick={() => onEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition"><MdEdit className="text-base" /></button>
            <button onClick={() => onDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><MdDelete className="text-base" /></button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ProgressBar value={progress} color={s.type === "premium" ? "#F59E0B" : cfg.color} />
        <span className="text-xs font-semibold text-gray-500 shrink-0">{s.completed || 0}/{s.topics || 0}</span>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="flex items-center gap-1 text-xs text-gray-400"><MdMenuBook className="text-sm" /> {s.topics || 0} topics</span>
        {s.type === "premium"
          ? <span className="flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-500 border border-amber-200 px-2.5 py-1 rounded-lg"><MdLock className="text-xs" /> Locked</span>
          : <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${progress >= 80 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>{status} ✓</span>}
      </div>
    </div>
  );
};

// ── Add/Edit Subject Modal (multi-step) ───────────────────────────────────────
const makeForm = (editing) => ({
  name:        editing?.name        || "",
  imageUrl:    editing?.imageUrl    || "",
  isPremium:   editing?.type === "premium" || false,
  description: editing?.description || "",
  grade:       editing?.grade       || "",
  title:       editing?.title       || "",
  topics:      Array.isArray(editing?.topicsList) ? editing.topicsList : [],
  flashcards:  editing?.flashcards  || [],
  qaCards:     editing?.qaCards     || [],
  prompts:     editing?.prompts     || [],
  greatJobTitle:   editing?.greatJobTitle   || "Great Job! 🎉",
  greatJobMessage: editing?.greatJobMessage || "You've completed this topic. Keep up the amazing work!",
});

// Step: Subject Info
const StepInfo = ({ form, set }) => {
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => set("imageUrl", ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-5">
      {/* Image */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Subject Image</label>
        <label className="flex items-center gap-4 cursor-pointer group">
          <div className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center shrink-0 overflow-hidden transition ${form.imageUrl ? "border-[#00aa59]" : "border-gray-300 group-hover:border-[#00aa59]"}`}>
            {form.imageUrl ? <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" /> : <MdImage className="text-3xl text-gray-300 group-hover:text-[#00aa59] transition" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 group-hover:text-[#00aa59] transition">{form.imageUrl ? "Change Image" : "Select Image"}</p>
            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP · max 5MB</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </label>
        {form.imageUrl && <button type="button" onClick={() => set("imageUrl", "")} className="mt-2 text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1"><MdDelete className="text-xs" /> Remove</button>}
      </div>
      {/* Subject Name */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Subject Name *</label>
        <input className={inp} placeholder="e.g. Math, English…" value={form.name} onChange={e => set("name", e.target.value)} />
        <div className="flex flex-wrap gap-2 mt-2">
          {SUBJECT_NAMES.map(s => (
            <button key={s.name} type="button" onClick={() => set("name", s.name)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${form.name === s.name ? "bg-[#00aa59] text-white border-[#00aa59]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#00aa59] hover:text-[#00aa59]"}`}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      </div>
      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Title</label>
        <input className={inp} placeholder="e.g. Introduction to Math…" value={form.title} onChange={e => set("title", e.target.value)} />
      </div>
      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Description</label>
        <textarea className={`${inp} resize-none`} rows={3} placeholder="Short description…" value={form.description} onChange={e => set("description", e.target.value)} />
      </div>
      {/* Grade */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Grade</label>
        <div className="flex flex-wrap gap-2">
          {GRADES.map(g => (
            <button key={g} type="button" onClick={() => set("grade", form.grade === g ? "" : g)}
              className={`text-xs px-4 py-2 rounded-full border font-semibold transition ${form.grade === g ? "bg-[#00aa59] text-white border-[#00aa59]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#00aa59] hover:text-[#00aa59]"}`}>
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Step: Topics
const StepTopics = ({ form, setForm }) => {
  const [expanded, setExpanded] = useState(null);
  const add = () => { const u = [...form.topics, makeEmptyTopic()]; setForm(f => ({ ...f, topics: u })); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const t = [...form.topics]; t[i] = { ...t[i], [k]: v }; setForm(f => ({ ...f, topics: t })); };
  const remove = (i) => { setForm(f => ({ ...f, topics: f.topics.filter((_, idx) => idx !== i) })); setExpanded(null); };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Topics <span className="text-gray-400 font-normal">({form.topics.length})</span></p>
        <button type="button" onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-[#00aa59] text-white px-3 py-1.5 rounded-lg hover:bg-[#008f4a] transition"><MdAdd /> Add Topic</button>
      </div>
      {form.topics.length === 0 && <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">No topics yet</div>}
      <div className="space-y-2">
        {form.topics.map((t, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#00aa59] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-gray-700 truncate">{t.title || t.type || "Topic"}</span>
                {t.videoUrl && <MdPlayCircle className="text-blue-400 shrink-0" />}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>
                {expanded === i ? <MdExpandLess className="text-gray-400" /> : <MdExpandMore className="text-gray-400" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 py-4 space-y-3 bg-white">
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Title</label><input className={inp} placeholder="Topic title…" value={t.title} onChange={e => setField(i, "title", e.target.value)} /></div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Type</label>
                  <div className="flex flex-wrap gap-2">{TOPIC_TYPES.map(tp => <button key={tp} type="button" onClick={() => setField(i, "type", tp)} className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition ${t.type === tp ? "bg-[#00aa59] text-white border-[#00aa59]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#00aa59] hover:text-[#00aa59]"}`}>{tp}</button>)}</div>
                </div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Description</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Describe this topic…" value={t.description} onChange={e => setField(i, "description", e.target.value)} /></div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Video URL (optional)</label>
                  <div className="relative"><MdPlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" /><input className={`${inp} pl-9`} placeholder="https://youtube.com/…" value={t.videoUrl} onChange={e => setField(i, "videoUrl", e.target.value)} /></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step: Flashcards
const StepFlashcards = ({ form, setForm }) => {
  const [expanded, setExpanded] = useState(null);
  const add = () => { const u = [...form.flashcards, makeEmptyFlashcard()]; setForm(f => ({ ...f, flashcards: u })); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const c = [...form.flashcards]; c[i] = { ...c[i], [k]: v }; setForm(f => ({ ...f, flashcards: c })); };
  const remove = (i) => { setForm(f => ({ ...f, flashcards: f.flashcards.filter((_, idx) => idx !== i) })); setExpanded(null); };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Flashcards <span className="text-gray-400 font-normal">({form.flashcards.length})</span></p>
        <button type="button" onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition"><MdAdd /> Add Card</button>
      </div>
      {form.flashcards.length === 0 && <div className="text-center py-10 border-2 border-dashed border-indigo-100 rounded-xl text-gray-400 text-xs">No flashcards yet</div>}
      <div className="space-y-2">
        {form.flashcards.map((fc, i) => (
          <div key={i} className="border border-indigo-100 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-gray-700 truncate">{fc.title || "Untitled"}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>
                {expanded === i ? <MdExpandLess className="text-indigo-400" /> : <MdExpandMore className="text-indigo-400" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 py-4 space-y-3 bg-white">
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Title</label><input className={inp} value={fc.title} onChange={e => setField(i, "title", e.target.value)} placeholder="Card title…" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Concept</label><textarea className={`${inp} resize-none`} rows={4} value={fc.concept} onChange={e => setField(i, "concept", e.target.value)} placeholder="Main concept…" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Parent Outcome</label><textarea className={`${inp} resize-none`} rows={2} value={fc.parentOutcome} onChange={e => setField(i, "parentOutcome", e.target.value)} placeholder="What parent should do…" /></div>
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <p className="text-xs text-gray-400">Optional second section</p>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Section 2 Title</label><input className={inp} value={fc.section2Title} onChange={e => setField(i, "section2Title", e.target.value)} placeholder="e.g. Helpful Way to Explain" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Section 2 Content</label><textarea className={`${inp} resize-none`} rows={2} value={fc.section2} onChange={e => setField(i, "section2", e.target.value)} placeholder="Additional explanation…" /></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step: Q&A
const StepQA = ({ form, setForm }) => {
  const [expanded, setExpanded] = useState(null);
  const add = () => { const u = [...form.qaCards, makeEmptyQA()]; setForm(f => ({ ...f, qaCards: u })); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const c = [...form.qaCards]; c[i] = { ...c[i], [k]: v }; setForm(f => ({ ...f, qaCards: c })); };
  const remove = (i) => { setForm(f => ({ ...f, qaCards: f.qaCards.filter((_, idx) => idx !== i) })); setExpanded(null); };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Q&A Cards <span className="text-gray-400 font-normal">({form.qaCards.length})</span></p>
        <button type="button" onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-teal-500 text-white px-3 py-1.5 rounded-lg hover:bg-teal-600 transition"><MdAdd /> Add Q&A</button>
      </div>
      {form.qaCards.length === 0 && <div className="text-center py-10 border-2 border-dashed border-teal-100 rounded-xl text-gray-400 text-xs">No Q&A cards yet</div>}
      <div className="space-y-2">
        {form.qaCards.map((qa, i) => (
          <div key={i} className="border border-teal-100 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-teal-50 hover:bg-teal-100 transition">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-gray-700 truncate">{qa.question || "Question…"}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>
                {expanded === i ? <MdExpandLess className="text-teal-400" /> : <MdExpandMore className="text-teal-400" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 py-4 space-y-3 bg-white">
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Question</label><textarea className={`${inp} resize-none`} rows={2} value={qa.question} onChange={e => setField(i, "question", e.target.value)} placeholder="Enter question…" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Answer</label><textarea className={`${inp} resize-none`} rows={3} value={qa.answer} onChange={e => setField(i, "answer", e.target.value)} placeholder="Enter answer…" /></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step: Prompts
const StepPrompts = ({ form, setForm }) => {
  const [expanded, setExpanded] = useState(null);
  const add = () => { const u = [...form.prompts, makeEmptyPrompt()]; setForm(f => ({ ...f, prompts: u })); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const p = [...form.prompts]; p[i] = { ...p[i], [k]: v }; setForm(f => ({ ...f, prompts: p })); };
  const remove = (i) => { setForm(f => ({ ...f, prompts: f.prompts.filter((_, idx) => idx !== i) })); setExpanded(null); };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Prompts <span className="text-gray-400 font-normal">({form.prompts.length})</span></p>
        <button type="button" onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition"><MdAdd /> Add Prompt</button>
      </div>
      {form.prompts.length === 0 && <div className="text-center py-10 border-2 border-dashed border-amber-100 rounded-xl text-gray-400 text-xs">No prompts yet</div>}
      <div className="space-y-2">
        {form.prompts.map((pr, i) => (
          <div key={i} className="border border-amber-100 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-gray-700 truncate">{pr.prompt || "Prompt…"}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>
                {expanded === i ? <MdExpandLess className="text-amber-400" /> : <MdExpandMore className="text-amber-400" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 py-4 space-y-3 bg-white">
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Prompt / Activity</label><textarea className={`${inp} resize-none`} rows={4} value={pr.prompt} onChange={e => setField(i, "prompt", e.target.value)} placeholder="Enter prompt or activity…" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Hint</label><textarea className={`${inp} resize-none`} rows={2} value={pr.hint} onChange={e => setField(i, "hint", e.target.value)} placeholder="Hint for the parent…" /></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step: Great Job
const StepGreatJob = ({ form, set }) => (
  <div className="space-y-5">
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 text-center">
      <div className="text-5xl mb-3">🎉</div>
      <p className="text-lg font-extrabold text-gray-800">{form.greatJobTitle || "Great Job!"}</p>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{form.greatJobMessage || "You've completed this topic!"}</p>
    </div>
    <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Title</label><input className={inp} placeholder="Great Job! 🎉" value={form.greatJobTitle} onChange={e => set("greatJobTitle", e.target.value)} /></div>
    <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Message</label><textarea className={`${inp} resize-none`} rows={3} placeholder="You've completed this topic. Keep up the amazing work!" value={form.greatJobMessage} onChange={e => set("greatJobMessage", e.target.value)} /></div>
  </div>
);

// ── Add/Edit Modal — Subject Name + Image only ────────────────────────────────
const AddSubjectModal = ({ editing, saving, onClose, onSave }) => {
  const [form, setForm] = useState(() => makeForm(editing));
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim();

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const res = await fetch('/api/upload/image', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      set("imageUrl", data.url);
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#00aa59] px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white">{editing ? `Edit: ${editing.name}` : "Add Subject"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition"><MdClose className="text-lg" /></button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Subject Image</label>
            <label className={`flex items-center gap-3 cursor-pointer group ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
              <div className={`w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center shrink-0 overflow-hidden transition ${form.imageUrl ? "border-[#00aa59]" : "border-gray-300 group-hover:border-[#00aa59]"}`}>
                {uploading
                  ? <div className="w-5 h-5 border-2 border-[#00aa59] border-t-transparent rounded-full animate-spin" />
                  : form.imageUrl
                    ? <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    : <MdImage className="text-2xl text-gray-300 group-hover:text-[#00aa59] transition" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#00aa59]">{uploading ? "Uploading…" : form.imageUrl ? "Change Image" : "Select Image"}</p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP · max 5MB</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            {form.imageUrl && !uploading && (
              <button type="button" onClick={() => set("imageUrl", "")} className="mt-1 text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1">
                <MdDelete className="text-xs" /> Remove
              </button>
            )}
          </div>

          {/* Subject Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Subject Name *</label>
            <input className={inp} placeholder="e.g. Math, English…" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea className={`${inp} resize-none`} rows={2} placeholder="Short description…" value={form.description} onChange={e => set("description", e.target.value)} />
          </div>

          {/* Premium Toggle */}
          <div className="flex items-center justify-between p-3 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <MdLock className="text-amber-500 text-base" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Premium Subject</p>
                <p className="text-xs text-gray-500">Only accessible to premium users</p>
              </div>
            </div>
            <button type="button" onClick={() => set("isPremium", !form.isPremium)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.isPremium ? 'bg-amber-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPremium ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button onClick={onClose} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
            Cancel
          </button>
          <button disabled={!valid || saving || uploading} onClick={() => onSave(form)}
            className={`flex items-center gap-2 px-7 py-2.5 rounded-xl text-white text-sm font-bold transition shadow ${valid && !saving && !uploading ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving…" : editing ? "Save Changes" : "Add Subject"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Tab: Subjects list ────────────────────────────────────────────────────────
const TabSubjects = ({ subjects, onEdit, onDelete, onAdd, refreshing }) => {
  const regular = subjects;
  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      {refreshing && <div className="fixed top-4 right-4 z-50 bg-[#00aa59] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">Saving…</div>}
      <div className="flex justify-end">
        <button onClick={onAdd} className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md"><MdAdd className="text-lg" /> Add Subject</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-5 py-3.5 text-left font-semibold w-12">No</th>
              <th className="px-5 py-3.5 text-left font-semibold w-20">Image</th>
              <th className="px-5 py-3.5 text-left font-semibold">Subject Name</th>
              <th className="px-5 py-3.5 text-left font-semibold">Description</th>
              <th className="px-5 py-3.5 text-center font-semibold w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {regular.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                <MdInbox className="text-5xl text-gray-200 mx-auto mb-2" />
                <p className="text-sm font-medium mb-3">No subjects yet</p>
                <button onClick={onAdd} className="flex items-center gap-2 bg-[#00aa59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#008f4a] transition mx-auto"><MdAdd /> Add Subject</button>
              </td></tr>
            ) : regular.map((s, i) => (
              <tr key={s._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-5 py-3.5 text-gray-400 font-medium">{i + 1}</td>
                <td className="px-5 py-3.5">
                  {s.imageUrl
                    ? <img src={s.imageUrl} alt={s.name} className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
                    : <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400"><MdImage className="text-xl" /></div>}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{s.name}</span>
                    {s.type === 'premium' && <span className="flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full"><MdLock className="text-xs" /> Premium</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-sm max-w-xs truncate">{s.description || '—'}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => onEdit(s)} title="Edit" className="text-blue-500 hover:text-blue-700 transition"><MdEdit className="text-xl" /></button>
                    <button onClick={() => onDelete(s._id)} title="Delete" className="text-red-400 hover:text-red-600 transition"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Tab: Topics / Flashcards / QA / Prompts / GreatJob (per-subject edit) ─────
const SubjectGrid = ({ subjects, onSelect, emptyIcon, countFn, btnColor }) => (
  <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
    {subjects.length === 0
      ? <div className="flex flex-col items-center justify-center py-20 text-gray-400"><MdInbox className="text-5xl mb-3" /><p className="text-sm">No subjects yet — add one from the Subjects tab first.</p></div>
      : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {subjects.map(s => (
            <div key={s._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-3">
                {s.imageUrl ? <img src={s.imageUrl} alt={s.name} className="w-10 h-10 rounded-xl object-cover" /> : <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl">{emptyIcon}</div>}
                <div><p className="font-bold text-gray-800 text-sm">{s.name}</p><p className="text-xs text-gray-400">{countFn(s)}</p></div>
              </div>
              <button onClick={() => onSelect(s)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition ${btnColor}`}><MdEdit className="text-sm" /> Edit</button>
            </div>
          ))}
        </div>}
  </div>
);

// Per-subject modals for tabs
const TopicsModal = ({ subject, onClose, onSaved }) => {
  const [topics, setTopics] = useState(Array.isArray(subject.topicsList) ? subject.topicsList : []);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const add = () => { const u = [...topics, makeEmptyTopic()]; setTopics(u); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const t = [...topics]; t[i] = { ...t[i], [k]: v }; setTopics(t); };
  const remove = (i) => { setTopics(t => t.filter((_, idx) => idx !== i)); setExpanded(null); };
  const save = async () => { setSaving(true); try { await api.subjects.update(subject._id, { topicsList: topics, topics: topics.length }); onSaved(); } catch (e) { alert("Save failed"); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="bg-[#00aa59] px-6 py-4 flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-extrabold text-white">Topics — {subject.name}</h2><p className="text-white/70 text-xs">{topics.length} topics</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
          {topics.length === 0 && <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">No topics yet</div>}
          {topics.map((t, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center gap-2 min-w-0"><span className="w-6 h-6 rounded-full bg-[#00aa59] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span><span className="text-sm font-semibold text-gray-700 truncate">{t.title || t.type || "Topic"}</span>{t.videoUrl && <MdPlayCircle className="text-blue-400 shrink-0" />}</div>
                <div className="flex items-center gap-2 shrink-0"><button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>{expanded === i ? <MdExpandLess className="text-gray-400" /> : <MdExpandMore className="text-gray-400" />}</div>
              </button>
              {expanded === i && (
                <div className="px-4 py-4 space-y-3 bg-white">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Title</label><input className={inp} placeholder="Topic title…" value={t.title} onChange={e => setField(i, "title", e.target.value)} /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Type</label><div className="flex flex-wrap gap-2">{TOPIC_TYPES.map(tp => <button key={tp} type="button" onClick={() => setField(i, "type", tp)} className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition ${t.type === tp ? "bg-[#00aa59] text-white border-[#00aa59]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#00aa59] hover:text-[#00aa59]"}`}>{tp}</button>)}</div></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Description</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Describe this topic…" value={t.description} onChange={e => setField(i, "description", e.target.value)} /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Video URL (optional)</label><div className="relative"><MdPlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" /><input className={`${inp} pl-9`} placeholder="https://youtube.com/…" value={t.videoUrl} onChange={e => setField(i, "videoUrl", e.target.value)} /></div></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <button onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"><MdAdd /> Add Topic</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#00aa59] text-white text-sm font-bold hover:bg-[#008f4a] transition"><MdSave /> {saving ? "Saving…" : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardsModal = ({ subject, onClose, onSaved }) => {
  const [cards, setCards] = useState(subject.flashcards || []);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const add = () => { const u = [...cards, makeEmptyFlashcard()]; setCards(u); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const c = [...cards]; c[i] = { ...c[i], [k]: v }; setCards(c); };
  const remove = (i) => { setCards(c => c.filter((_, idx) => idx !== i)); setExpanded(null); };
  const save = async () => { setSaving(true); try { await api.subjects.update(subject._id, { flashcards: cards.map((fc, i) => ({ ...fc, id: fc.id || `fc${i + 1}` })) }); onSaved(); } catch (e) { alert("Save failed"); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-extrabold text-white">Flashcards — {subject.name}</h2><p className="text-white/70 text-xs">{cards.length} cards</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
          {cards.length === 0 && <div className="text-center py-10 border-2 border-dashed border-indigo-100 rounded-xl text-gray-400 text-xs">No flashcards yet</div>}
          {cards.map((fc, i) => (
            <div key={i} className="border border-indigo-100 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition">
                <div className="flex items-center gap-2 min-w-0"><span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span><span className="text-sm font-semibold text-gray-700 truncate">{fc.title || "Untitled"}</span></div>
                <div className="flex items-center gap-2 shrink-0"><button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>{expanded === i ? <MdExpandLess className="text-indigo-400" /> : <MdExpandMore className="text-indigo-400" />}</div>
              </button>
              {expanded === i && (
                <div className="px-4 py-4 space-y-3 bg-white">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Title</label><input className={inp} value={fc.title} onChange={e => setField(i, "title", e.target.value)} placeholder="Card title…" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Concept</label><textarea className={`${inp} resize-none`} rows={4} value={fc.concept} onChange={e => setField(i, "concept", e.target.value)} placeholder="Main concept…" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Parent Outcome</label><textarea className={`${inp} resize-none`} rows={2} value={fc.parentOutcome} onChange={e => setField(i, "parentOutcome", e.target.value)} placeholder="What parent should do…" /></div>
                  <div className="pt-2 border-t border-gray-100 space-y-3"><p className="text-xs text-gray-400">Optional second section</p><div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Section 2 Title</label><input className={inp} value={fc.section2Title} onChange={e => setField(i, "section2Title", e.target.value)} placeholder="e.g. Helpful Way to Explain" /></div><div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Section 2 Content</label><textarea className={`${inp} resize-none`} rows={2} value={fc.section2} onChange={e => setField(i, "section2", e.target.value)} placeholder="Additional explanation…" /></div></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <button onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"><MdAdd /> Add Card</button>
          <div className="flex gap-2"><button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button><button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition"><MdSave /> {saving ? "Saving…" : "Save"}</button></div>
        </div>
      </div>
    </div>
  );
};

const QAModal = ({ subject, onClose, onSaved }) => {
  const [cards, setCards] = useState(subject.qaCards || []);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const add = () => { const u = [...cards, makeEmptyQA()]; setCards(u); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const c = [...cards]; c[i] = { ...c[i], [k]: v }; setCards(c); };
  const remove = (i) => { setCards(c => c.filter((_, idx) => idx !== i)); setExpanded(null); };
  const save = async () => { setSaving(true); try { await api.subjects.update(subject._id, { qaCards: cards.map((qa, i) => ({ ...qa, id: qa.id || `q${i + 1}` })) }); onSaved(); } catch (e) { alert("Save failed"); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="bg-teal-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-extrabold text-white">Q&A — {subject.name}</h2><p className="text-white/70 text-xs">{cards.length} cards</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
          {cards.length === 0 && <div className="text-center py-10 border-2 border-dashed border-teal-100 rounded-xl text-gray-400 text-xs">No Q&A cards yet</div>}
          {cards.map((qa, i) => (
            <div key={i} className="border border-teal-100 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-teal-50 hover:bg-teal-100 transition">
                <div className="flex items-center gap-2 min-w-0"><span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span><span className="text-sm font-semibold text-gray-700 truncate">{qa.question || "Question…"}</span></div>
                <div className="flex items-center gap-2 shrink-0"><button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>{expanded === i ? <MdExpandLess className="text-teal-400" /> : <MdExpandMore className="text-teal-400" />}</div>
              </button>
              {expanded === i && (
                <div className="px-4 py-4 space-y-3 bg-white">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Question</label><textarea className={`${inp} resize-none`} rows={2} value={qa.question} onChange={e => setField(i, "question", e.target.value)} placeholder="Enter question…" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Answer</label><textarea className={`${inp} resize-none`} rows={3} value={qa.answer} onChange={e => setField(i, "answer", e.target.value)} placeholder="Enter answer…" /></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <button onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-teal-50 text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-100 transition"><MdAdd /> Add Q&A</button>
          <div className="flex gap-2"><button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button><button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition"><MdSave /> {saving ? "Saving…" : "Save"}</button></div>
        </div>
      </div>
    </div>
  );
};

const PromptsModal = ({ subject, onClose, onSaved }) => {
  const [prompts, setPrompts] = useState(subject.prompts || []);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const add = () => { const u = [...prompts, makeEmptyPrompt()]; setPrompts(u); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const p = [...prompts]; p[i] = { ...p[i], [k]: v }; setPrompts(p); };
  const remove = (i) => { setPrompts(p => p.filter((_, idx) => idx !== i)); setExpanded(null); };
  const save = async () => { setSaving(true); try { await api.subjects.update(subject._id, { prompts: prompts.map((pr, i) => ({ ...pr, id: pr.id || `p${i + 1}` })) }); onSaved(); } catch (e) { alert("Save failed"); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="bg-amber-500 px-6 py-4 flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-extrabold text-white">Prompts — {subject.name}</h2><p className="text-white/70 text-xs">{prompts.length} prompts</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
          {prompts.length === 0 && <div className="text-center py-10 border-2 border-dashed border-amber-100 rounded-xl text-gray-400 text-xs">No prompts yet</div>}
          {prompts.map((pr, i) => (
            <div key={i} className="border border-amber-100 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition">
                <div className="flex items-center gap-2 min-w-0"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span><span className="text-sm font-semibold text-gray-700 truncate">{pr.prompt || "Prompt…"}</span></div>
                <div className="flex items-center gap-2 shrink-0"><button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>{expanded === i ? <MdExpandLess className="text-amber-400" /> : <MdExpandMore className="text-amber-400" />}</div>
              </button>
              {expanded === i && (
                <div className="px-4 py-4 space-y-3 bg-white">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Prompt / Activity</label><textarea className={`${inp} resize-none`} rows={4} value={pr.prompt} onChange={e => setField(i, "prompt", e.target.value)} placeholder="Enter prompt or activity…" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Hint</label><textarea className={`${inp} resize-none`} rows={2} value={pr.hint} onChange={e => setField(i, "hint", e.target.value)} placeholder="Hint for the parent…" /></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <button onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-100 transition"><MdAdd /> Add Prompt</button>
          <div className="flex gap-2"><button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button><button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition"><MdSave /> {saving ? "Saving…" : "Save"}</button></div>
        </div>
      </div>
    </div>
  );
};

const GreatJobModal = ({ subject, onClose, onSaved }) => {
  const [title, setTitle]     = useState(subject.greatJobTitle   || "Great Job! 🎉");
  const [message, setMessage] = useState(subject.greatJobMessage || "You've completed this topic. Keep up the amazing work!");
  const [saving, setSaving]   = useState(false);
  const save = async () => { setSaving(true); try { await api.subjects.update(subject._id, { greatJobTitle: title, greatJobMessage: message }); onSaved(); } catch (e) { alert("Save failed"); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="bg-[#00aa59] px-6 py-4 flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-extrabold text-white">Great Job Screen — {subject.name}</h2><p className="text-white/70 text-xs">Shown after all cards are completed</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-base font-extrabold text-gray-800">{title || "Great Job!"}</p>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message || "You've completed this topic!"}</p>
          </div>
          <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Title</label><input className={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="Great Job! 🎉" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Message</label><textarea className={`${inp} resize-none`} rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="You've completed this topic…" /></div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#00aa59] text-white text-sm font-bold hover:bg-[#008f4a] transition"><MdSave /> {saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
};

// ── Add/Edit Topic Modal ──────────────────────────────────────────────────────
const TopicFormModal = ({ editing, subjects, saving, onClose, onSave }) => {
  const [form, setForm] = useState({
    subjectId:   editing?.subjectId   || '',
    title:       editing?.title       || '',
    description: editing?.description || '',
    imageUrl:    editing?.imageUrl    || '',
    level:       editing?.level       || 'Basic',
    grade:       editing?.grade       || '',
  });
  const [uploading, setUploading] = useState(false);
  const [grades, setGrades] = useState([]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.subjectId && form.title.trim();

  useEffect(() => {
    api.grades.getAll()
      .then(data => setGrades(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const res = await fetch('/api/upload/image', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      set('imageUrl', data.url);
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#00aa59] px-7 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-extrabold text-white">{editing ? 'Edit Topic' : 'Add Topic'}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition"><MdClose className="text-xl" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* Subject Name dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Subject Name *</label>
            <select className={inp} value={form.subjectId} onChange={e => set('subjectId', e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>

          {/* Level dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Level *</label>
            <select className={inp} value={form.level} onChange={e => set('level', e.target.value)}>
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Grade */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Grade</label>
            <select className={inp} value={form.grade} onChange={e => set('grade', e.target.value)}>
              <option value="">Select Grade</option>
              {grades.map(g => <option key={g._id} value={g.title}>{g.title}</option>)}
            </select>
          </div>

          {/* Topic Image */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Topic Image</label>
            <label className={`flex items-center gap-4 cursor-pointer group ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
              <div className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center shrink-0 overflow-hidden transition ${form.imageUrl ? 'border-[#00aa59]' : 'border-gray-300 group-hover:border-[#00aa59]'}`}>
                {uploading
                  ? <div className="w-6 h-6 border-2 border-[#00aa59] border-t-transparent rounded-full animate-spin" />
                  : form.imageUrl
                    ? <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    : <MdImage className="text-3xl text-gray-300 group-hover:text-[#00aa59] transition" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#00aa59]">{uploading ? 'Uploading…' : form.imageUrl ? 'Change Image' : 'Select Image'}</p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP · max 5MB</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            {form.imageUrl && !uploading && (
              <button type="button" onClick={() => set('imageUrl', '')} className="mt-2 text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1"><MdDelete className="text-xs" /> Remove</button>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Title *</label>
            <input className={inp} placeholder="e.g. Addition, Photosynthesis…" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Description</label>
            <textarea className={`${inp} resize-none`} rows={3} placeholder="Short description…" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button disabled={!valid || saving || uploading} onClick={() => onSave(form)}
            className={`flex items-center gap-2 px-7 py-2.5 rounded-xl text-white text-sm font-bold transition shadow ${valid && !saving && !uploading ? 'bg-[#00aa59] hover:bg-[#008f4a]' : 'bg-gray-300 cursor-not-allowed'}`}>
            <MdSave /> {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Topic'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Tab: Topics ───────────────────────────────────────────────────────────────
const TabTopics = ({ subjects }) => {
  const [topics, setTopics]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [viewing, setViewing]     = useState(null);
  const [saving, setSaving]       = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.topics.getAll();
      setTopics(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editing) await api.topics.update(editing._id, form);
      else await api.topics.create(form);
      setShowModal(false); setEditing(null);
      await load();
    } catch (e) { alert('Failed to save topic'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this topic?')) return;
    await api.topics.remove(id);
    load();
  };

  const levelColor = (level) => {
    if (level === 'Advanced')    return 'bg-red-100 text-red-600';
    if (level === 'Intermediate') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <div className="flex justify-end">
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md">
          <MdAdd className="text-lg" /> Add Topic
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-5 py-3.5 text-left font-semibold w-12">No</th>
              <th className="px-5 py-3.5 text-left font-semibold w-20">Image</th>
              <th className="px-5 py-3.5 text-left font-semibold">Title</th>
              <th className="px-5 py-3.5 text-left font-semibold">Subject</th>
              <th className="px-5 py-3.5 text-left font-semibold">Level</th>
              <th className="px-5 py-3.5 text-left font-semibold">Grade</th>
              <th className="px-5 py-3.5 text-center font-semibold w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-16 text-gray-400">Loading…</td></tr>
            ) : topics.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16 text-gray-400">
                <MdInbox className="text-5xl text-gray-200 mx-auto mb-2" />
                <p className="text-sm font-medium">No topics yet</p>
              </td></tr>
            ) : topics.map((t, i) => (
              <tr key={t._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-5 py-3.5 text-gray-400 font-medium">{i + 1}</td>
                <td className="px-5 py-3.5">
                  {t.imageUrl
                    ? <img src={t.imageUrl} alt={t.title} className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
                    : <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400"><MdImage className="text-xl" /></div>}
                </td>
                <td className="px-5 py-3.5 font-semibold text-gray-800">{t.title}</td>
                <td className="px-5 py-3.5 text-gray-600">{t.subjectName || '—'}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${levelColor(t.level)}`}>{t.level}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-600">{t.grade || '—'}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => setViewing(t)} title="View" className="text-[#00aa59] hover:text-[#008f4a] transition"><MdVisibility className="text-xl" /></button>
                    <button onClick={() => { setEditing(t); setShowModal(true); }} title="Edit" className="text-blue-500 hover:text-blue-700 transition"><MdEdit className="text-xl" /></button>
                    <button onClick={() => handleDelete(t._id)} title="Delete" className="text-red-400 hover:text-red-600 transition"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <TopicFormModal
          editing={editing}
          subjects={subjects}
          saving={saving}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}

      {viewing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#00aa59] px-7 py-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white">Topic Details</h2>
              <button onClick={() => setViewing(null)} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition"><MdClose className="text-xl" /></button>
            </div>
            <div className="px-7 py-6 space-y-4">
              {viewing.imageUrl && (
                <img src={viewing.imageUrl} alt={viewing.title} className="w-full h-48 object-cover rounded-2xl border border-gray-200" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Title</p><p className="text-sm font-semibold text-gray-800">{viewing.title}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Subject</p><p className="text-sm text-gray-700">{viewing.subjectName || '—'}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Level</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${viewing.level === 'Advanced' ? 'bg-red-100 text-red-600' : viewing.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{viewing.level}</span>
                </div>
                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Grade</p><p className="text-sm text-gray-700">{viewing.grade || '—'}</p></div>
              </div>
              {viewing.description && (
                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Description</p><p className="text-sm text-gray-600 leading-relaxed">{viewing.description}</p></div>
              )}
            </div>
            <div className="px-7 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => { setViewing(null); setEditing(viewing); setShowModal(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition"><MdEdit /> Edit</button>
              <button onClick={() => setViewing(null)} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Reusable: Subject+Topic+Level+Grade selectors ────────────────────────────
const useDropdowns = () => {
  const [subjects, setSubjects] = useState([]);
  const [topics,   setTopics]   = useState([]);
  const [grades,   setGrades]   = useState([]);
  useEffect(() => {
    api.subjects.getAll().then(d => setSubjects(Array.isArray(d) ? d : [])).catch(() => {});
    api.topics.getAll().then(d => setTopics(Array.isArray(d) ? d : [])).catch(() => {});
    api.grades.getAll().then(d => setGrades(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);
  return { subjects, topics, grades };
};

// ── Generic content tab (Flashcards / Q&A / Prompts) ─────────────────────────
const ContentTab = ({ apiKey, columns, renderForm, emptyLabel }) => {
  const { subjects, topics, grades } = useDropdowns();
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [viewing, setViewing]   = useState(null);
  const [saving, setSaving]     = useState(false);

  // Filter topics by selected subject in form
  const [formSubjectId, setFormSubjectId] = useState('');
  const filteredTopics = topics.filter(t => !formSubjectId || String(t.subjectId) === String(formSubjectId));

  const load = async () => {
    setLoading(true);
    try { const d = await api[apiKey].getAll(); setItems(Array.isArray(d) ? d : []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editing) await api[apiKey].update(editing._id, form);
      else await api[apiKey].create(form);
      setShowModal(false); setEditing(null);
      await load();
    } catch (e) { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await api[apiKey].remove(id); load();
  };

  const levelColor = (l) => l === 'Advanced' ? 'bg-red-100 text-red-600' : l === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';

  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <div className="flex justify-end">
        <button onClick={() => { setEditing(null); setFormSubjectId(''); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md">
          <MdAdd className="text-lg" /> Add {emptyLabel}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-4 py-3.5 text-left font-semibold w-10">No</th>
              <th className="px-4 py-3.5 text-left font-semibold">Subject</th>
              <th className="px-4 py-3.5 text-left font-semibold">Topic</th>
              <th className="px-4 py-3.5 text-left font-semibold">Level</th>
              <th className="px-4 py-3.5 text-left font-semibold">Grade</th>
              {columns.map(c => <th key={c.key} className="px-4 py-3.5 text-left font-semibold">{c.label}</th>)}
              <th className="px-4 py-3.5 text-center font-semibold w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6 + columns.length} className="text-center py-16 text-gray-400">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6 + columns.length} className="text-center py-16 text-gray-400">
                <MdInbox className="text-5xl text-gray-200 mx-auto mb-2" />
                <p className="text-sm">No {emptyLabel.toLowerCase()}s yet</p>
              </td></tr>
            ) : items.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3 text-gray-700">{item.subjectName || '—'}</td>
                <td className="px-4 py-3 text-gray-700">{item.topicTitle || '—'}</td>
                <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${levelColor(item.level)}`}>{item.level}</span></td>
                <td className="px-4 py-3 text-gray-600">{item.grade || '—'}</td>
                {columns.map(c => <td key={c.key} className="px-4 py-3 text-gray-700 max-w-xs truncate">{item[c.key] || '—'}</td>)}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewing(item)} title="View" className="text-[#00aa59] hover:text-[#008f4a]"><MdVisibility className="text-xl" /></button>
                    <button onClick={() => { setEditing(item); setFormSubjectId(item.subjectId); setShowModal(true); }} title="Edit" className="text-blue-500 hover:text-blue-700"><MdEdit className="text-xl" /></button>
                    <button onClick={() => handleDelete(item._id)} title="Delete" className="text-red-400 hover:text-red-600"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && renderForm({
        editing, saving, subjects, grades,
        filteredTopics, formSubjectId, setFormSubjectId,
        onClose: () => { setShowModal(false); setEditing(null); },
        onSave: handleSave,
      })}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#00aa59] px-7 py-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white">{emptyLabel} Details</h2>
              <button onClick={() => setViewing(null)} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose className="text-xl" /></button>
            </div>
            <div className="px-7 py-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Subject</p><p className="text-sm text-gray-800">{viewing.subjectName || '—'}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Topic</p><p className="text-sm text-gray-800">{viewing.topicTitle || '—'}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Level</p><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${levelColor(viewing.level)}`}>{viewing.level}</span></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Grade</p><p className="text-sm text-gray-800">{viewing.grade || '—'}</p></div>
              </div>
              {columns.map(c => viewing[c.key] && (
                <div key={c.key}><p className="text-xs font-bold text-gray-400 uppercase mb-1">{c.label}</p><p className="text-sm text-gray-700 leading-relaxed">{viewing[c.key]}</p></div>
              ))}
            </div>
            <div className="px-7 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button onClick={() => { setViewing(null); setEditing(viewing); setFormSubjectId(viewing.subjectId); setShowModal(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600"><MdEdit /> Edit</button>
              <button onClick={() => setViewing(null)} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Shared form fields (Subject, Topic, Level, Grade) ─────────────────────────
const SharedFields = ({ form, set, subjects, grades, filteredTopics, formSubjectId, setFormSubjectId }) => (
  <>
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Subject Name *</label>
      <select className={inp} value={form.subjectId} onChange={e => { set('subjectId', e.target.value); setFormSubjectId(e.target.value); set('topicId', ''); }}>
        <option value="">Select Subject</option>
        {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Topic *</label>
      <select className={inp} value={form.topicId} onChange={e => set('topicId', e.target.value)}>
        <option value="">Select Topic</option>
        {filteredTopics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Level *</label>
      <select className={inp} value={form.level} onChange={e => set('level', e.target.value)}>
        <option value="Basic">Basic</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Grade</label>
      <select className={inp} value={form.grade} onChange={e => set('grade', e.target.value)}>
        <option value="">Select Grade</option>
        {grades.map(g => <option key={g._id} value={g.title}>{g.title}</option>)}
      </select>
    </div>
  </>
);

// ── Flashcard Form ────────────────────────────────────────────────────────────
// ── Combined Flashcards + Q&A + Prompts Tab ───────────────────────────────────
const FlashcardsQAPromptsTab = () => {
  const { subjects: subjectList, topics, grades } = useDropdowns();
  const [sets, setSets]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [viewing, setViewing]   = useState(null);
  const [formSubjectId, setFormSubjectId] = useState('');
  const filteredTopics = topics.filter(t => !formSubjectId || String(t.subjectId) === String(formSubjectId));

  const [form, setForm]         = useState({ subjectId: '', topicId: '', level: 'Basic', grade: '' });
  const [fcCards, setFcCards]   = useState([{ title: '', description: '', subtitle: '', subdescription: '' }]);
  const [qaList, setQaList]     = useState([{ question: '', answer: '' }]);
  const [promptList, setPromptList] = useState([{ prompt: '', hint: '' }]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const load = async () => {
    setLoading(true);
    try { const d = await api.contentSets.getAll(); setSets(Array.isArray(d) ? d : []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ subjectId: '', topicId: '', level: 'Basic', grade: '' });
    setFcCards([{ title: '', description: '', subtitle: '', subdescription: '' }]);
    setQaList([{ question: '', answer: '' }]);
    setPromptList([{ prompt: '', hint: '' }]);
    setFormSubjectId('');
    setEditing(null);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ subjectId: s.subjectId, topicId: s.topicId, level: s.level, grade: s.grade || '' });
    setFormSubjectId(s.subjectId);
    setFcCards(s.flashcards?.length ? s.flashcards : [{ title: '', description: '', subtitle: '', subdescription: '' }]);
    setQaList(s.qaCards?.length ? s.qaCards : [{ question: '', answer: '' }]);
    setPromptList(s.prompts?.length ? s.prompts : [{ prompt: '', hint: '' }]);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.subjectId || !form.topicId) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        flashcards: fcCards.filter(c => c.title?.trim()),
        qaCards:    qaList.filter(q => q.question?.trim()),
        prompts:    promptList.filter(p => p.prompt?.trim()),
      };
      if (editing) await api.contentSets.update(editing._id, payload);
      else await api.contentSets.create(payload);
      setShowModal(false); resetForm(); await load();
    } catch (e) { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this content set?')) return;
    await api.contentSets.remove(id); load();
  };

  const levelColor = l => l === 'Advanced' ? 'bg-red-100 text-red-600' : l === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-5">
      <div className="flex justify-end">
        <button onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md">
          <MdAdd className="text-lg" /> Add
        </button>
      </div>

      {/* One row per content set */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-4 py-3.5 text-left w-10">No</th>
              <th className="px-4 py-3.5 text-left">Subject</th>
              <th className="px-4 py-3.5 text-left">Topic</th>
              <th className="px-4 py-3.5 text-left">Level</th>
              <th className="px-4 py-3.5 text-left">Grade</th>
              <th className="px-4 py-3.5 text-center">🃏 Flashcards</th>
              <th className="px-4 py-3.5 text-center">❓ Q&A</th>
              <th className="px-4 py-3.5 text-center">💬 Prompts</th>
              <th className="px-4 py-3.5 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-16 text-gray-400">Loading…</td></tr>
            ) : sets.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-16 text-gray-400">
                <MdInbox className="text-5xl text-gray-200 mx-auto mb-2" />
                <p className="text-sm">No content added yet</p>
              </td></tr>
            ) : sets.map((s, i) => (
              <tr key={s._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{s.subjectName || '—'}</td>
                <td className="px-4 py-3 text-gray-700">{s.topicTitle || '—'}</td>
                <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor(s.level)}`}>{s.level}</span></td>
                <td className="px-4 py-3 text-gray-600">{s.grade || '—'}</td>
                <td className="px-4 py-3 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{s.flashcards?.length || 0}</span></td>
                <td className="px-4 py-3 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{s.qaCards?.length || 0}</span></td>
                <td className="px-4 py-3 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{s.prompts?.length || 0}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewing(s)} title="View" className="text-[#00aa59] hover:text-[#008f4a]"><MdVisibility className="text-xl" /></button>
                    <button onClick={() => openEdit(s)} title="Edit" className="text-blue-500 hover:text-blue-700"><MdEdit className="text-xl" /></button>
                    <button onClick={() => handleDelete(s._id)} title="Delete" className="text-red-400 hover:text-red-600"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">
            <div className="bg-[#00aa59] px-7 py-5 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-extrabold text-white">Content Details</h2>
              <button onClick={() => setViewing(null)} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose className="text-xl" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Subject</p><p className="text-sm font-semibold text-gray-800">{viewing.subjectName}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Topic</p><p className="text-sm font-semibold text-gray-800">{viewing.topicTitle}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Level</p><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor(viewing.level)}`}>{viewing.level}</span></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Grade</p><p className="text-sm text-gray-700">{viewing.grade || '—'}</p></div>
              </div>
              {viewing.flashcards?.length > 0 && <div>
                <p className="text-sm font-extrabold text-indigo-700 mb-3">🃏 Flashcards ({viewing.flashcards.length})</p>
                <div className="space-y-2">{viewing.flashcards.map((fc, i) => (
                  <div key={i} className="border border-indigo-100 rounded-xl p-3 bg-indigo-50/30 space-y-1">
                    <p className="text-xs font-bold text-gray-500">#{i+1} {fc.title}</p>
                    {fc.description && <p className="text-xs text-gray-600">{fc.description}</p>}
                    {fc.subtitle && <p className="text-xs font-semibold text-gray-700 mt-1">{fc.subtitle}</p>}
                    {fc.subdescription && <p className="text-xs text-gray-600">{fc.subdescription}</p>}
                  </div>
                ))}</div>
              </div>}
              {viewing.qaCards?.length > 0 && <div>
                <p className="text-sm font-extrabold text-blue-700 mb-3">❓ Q&A ({viewing.qaCards.length})</p>
                <div className="space-y-2">{viewing.qaCards.map((qa, i) => (
                  <div key={i} className="border border-blue-100 rounded-xl p-3 bg-blue-50/30 space-y-1">
                    <p className="text-xs font-bold text-gray-700">Q: {qa.question}</p>
                    {qa.answer && <p className="text-xs text-gray-600">A: {qa.answer}</p>}
                  </div>
                ))}</div>
              </div>}
              {viewing.prompts?.length > 0 && <div>
                <p className="text-sm font-extrabold text-amber-700 mb-3">💬 Prompts ({viewing.prompts.length})</p>
                <div className="space-y-2">{viewing.prompts.map((pr, i) => (
                  <div key={i} className="border border-amber-100 rounded-xl p-3 bg-amber-50/30 space-y-1">
                    <p className="text-xs text-gray-700">{pr.prompt}</p>
                    {pr.hint && <p className="text-xs text-gray-500 italic">Hint: {pr.hint}</p>}
                  </div>
                ))}</div>
              </div>}
            </div>
            <div className="px-7 py-4 bg-gray-50 border-t flex justify-between shrink-0">
              <button onClick={() => { setViewing(null); openEdit(viewing); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600"><MdEdit /> Edit</button>
              <button onClick={() => setViewing(null)} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">
            <div className="bg-[#00aa59] px-8 py-5 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-extrabold text-white">{editing ? 'Edit Content' : 'Add Content'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose className="text-xl" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <SharedFields form={form} set={set} subjects={subjectList} grades={grades} filteredTopics={filteredTopics} formSubjectId={formSubjectId} setFormSubjectId={setFormSubjectId} />
              {/* Flashcards */}
              <div className="border-2 border-indigo-100 rounded-2xl p-5 space-y-4 bg-indigo-50/30">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-indigo-700">🃏 Flashcards ({fcCards.length})</p>
                  <button type="button" onClick={() => setFcCards(l => [...l, { title: '', description: '', subtitle: '', subdescription: '' }])} className="flex items-center gap-1 text-xs font-bold bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600"><MdAdd /> Add</button>
                </div>
                {fcCards.map((card, i) => (
                  <div key={i} className="space-y-3 border border-indigo-200 rounded-xl p-3 relative">
                    {fcCards.length > 1 && <button type="button" onClick={() => setFcCards(l => l.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><MdDelete className="text-sm" /></button>}
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Title</label><input className={inp} placeholder="Title…" value={card.title} onChange={e => setFcCards(l => l.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Description</label><textarea className={`${inp} resize-none`} rows={2} placeholder="Description…" value={card.description} onChange={e => setFcCards(l => l.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Subtitle</label><input className={inp} placeholder="Subtitle…" value={card.subtitle} onChange={e => setFcCards(l => l.map((x, idx) => idx === i ? { ...x, subtitle: e.target.value } : x))} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Sub Description</label><textarea className={`${inp} resize-none`} rows={2} placeholder="Sub description…" value={card.subdescription} onChange={e => setFcCards(l => l.map((x, idx) => idx === i ? { ...x, subdescription: e.target.value } : x))} /></div>
                  </div>
                ))}
              </div>
              {/* Q&A */}
              <div className="border-2 border-blue-100 rounded-2xl p-5 space-y-4 bg-blue-50/30">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-blue-700">❓ Q&A ({qaList.length})</p>
                  <button type="button" onClick={() => setQaList(l => [...l, { question: '', answer: '' }])} className="flex items-center gap-1 text-xs font-bold bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600"><MdAdd /> Add</button>
                </div>
                {qaList.map((it, i) => (
                  <div key={i} className="space-y-3 border border-blue-200 rounded-xl p-3 relative">
                    {qaList.length > 1 && <button type="button" onClick={() => setQaList(l => l.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><MdDelete className="text-sm" /></button>}
                    <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Question</label><textarea className={`${inp} resize-none`} rows={2} placeholder="Question…" value={it.question} onChange={e => setQaList(l => l.map((x, idx) => idx === i ? { ...x, question: e.target.value } : x))} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Answer</label><textarea className={`${inp} resize-none`} rows={2} placeholder="Answer…" value={it.answer} onChange={e => setQaList(l => l.map((x, idx) => idx === i ? { ...x, answer: e.target.value } : x))} /></div>
                  </div>
                ))}
              </div>
              {/* Prompts */}
              <div className="border-2 border-amber-100 rounded-2xl p-5 space-y-4 bg-amber-50/30">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-amber-700">💬 Prompts ({promptList.length})</p>
                  <button type="button" onClick={() => setPromptList(l => [...l, { prompt: '', hint: '' }])} className="flex items-center gap-1 text-xs font-bold bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600"><MdAdd /> Add</button>
                </div>
                {promptList.map((it, i) => (
                  <div key={i} className="space-y-3 border border-amber-200 rounded-xl p-3 relative">
                    {promptList.length > 1 && <button type="button" onClick={() => setPromptList(l => l.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><MdDelete className="text-sm" /></button>}
                    <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Prompt</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Prompt…" value={it.prompt} onChange={e => setPromptList(l => l.map((x, idx) => idx === i ? { ...x, prompt: e.target.value } : x))} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Hint</label><textarea className={`${inp} resize-none`} rows={2} placeholder="Hint…" value={it.hint} onChange={e => setPromptList(l => l.map((x, idx) => idx === i ? { ...x, hint: e.target.value } : x))} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t flex items-center justify-between shrink-0">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
              <button disabled={!form.subjectId || !form.topicId || saving} onClick={handleSave}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow ${form.subjectId && form.topicId && !saving ? 'bg-[#00aa59] hover:bg-[#008f4a]' : 'bg-gray-300 cursor-not-allowed'}`}>
                <MdSave /> {saving ? 'Saving…' : editing ? 'Save Changes' : 'Save All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Video Uploader ────────────────────────────────────────────────────────────
const VideoUploader = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024 * 1024) { alert('Video must be under 200MB'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('video', file);
      const res = await fetch('/api/upload/video', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      onChange(data.url);
    } catch (err) {
      alert('Video upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload button */}
      <label className={`flex items-center gap-3 cursor-pointer border-2 border-dashed rounded-xl p-4 transition ${uploading ? 'opacity-60 pointer-events-none border-gray-200' : 'border-blue-200 hover:border-blue-400 bg-blue-50/30'}`}>
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          {uploading
            ? <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            : <MdPlayCircle className="text-2xl text-blue-500" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-600">{uploading ? 'Uploading…' : value ? 'Change Video' : 'Upload Video'}</p>
          <p className="text-xs text-gray-400 mt-0.5">MP4, MOV, AVI · max 200MB</p>
        </div>
        <input type="file" accept="video/*" className="hidden" onChange={handleFile} />
      </label>

      {/* Preview / URL */}
      {value && !uploading && (
        <div className="border border-blue-200 rounded-xl p-3 bg-blue-50/20 space-y-2">
          <video src={value} controls className="w-full rounded-lg max-h-48" />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 truncate flex-1 mr-2">{value}</p>
            <button type="button" onClick={() => onChange('')} className="text-xs text-red-400 hover:text-red-600 font-semibold shrink-0">Remove</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Learn Details Tab ─────────────────────────────────────────────────────────
const LearnDetailsTab = () => {
  const { subjects, topics, grades } = useDropdowns();
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [viewing, setViewing]   = useState(null);
  const [formSubjectId, setFormSubjectId] = useState('');
  const filteredTopics = topics.filter(t => !formSubjectId || String(t.subjectId) === String(formSubjectId));

  const emptyForm = { subjectId: '', topicId: '', level: 'Basic', grade: '', overview: '', keyConcepts: '', practicalApplication: '', supportingLearning: '', videoUrl: '' };
  const [form, setForm] = useState(emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const load = async () => {
    setLoading(true);
    try { const d = await api.learnDetails.getAll(); setItems(Array.isArray(d) ? d : []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setFormSubjectId(''); setShowModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ subjectId: item.subjectId, topicId: item.topicId, level: item.level || 'Basic', grade: item.grade || '', overview: item.overview || '', keyConcepts: item.keyConcepts || '', practicalApplication: item.practicalApplication || '', supportingLearning: item.supportingLearning || '', videoUrl: item.videoUrl || '' });
    setFormSubjectId(item.subjectId);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.subjectId || !form.topicId) return;
    setSaving(true);
    try {
      if (editing) await api.learnDetails.update(editing._id, form);
      else await api.learnDetails.create(form);
      setShowModal(false); await load();
    } catch (e) { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this learn detail?')) return;
    await api.learnDetails.remove(id); load();
  };

  const levelColor = l => l === 'Advanced' ? 'bg-red-100 text-red-600' : l === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-5">
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md">
          <MdAdd className="text-lg" /> Add Learn Detail
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-4 py-3.5 text-left w-10">No</th>
              <th className="px-4 py-3.5 text-left">Subject</th>
              <th className="px-4 py-3.5 text-left">Topic</th>
              <th className="px-4 py-3.5 text-left">Level</th>
              <th className="px-4 py-3.5 text-left">Grade</th>
              <th className="px-4 py-3.5 text-left">Overview</th>
              <th className="px-4 py-3.5 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-16 text-gray-400">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16 text-gray-400">
                <MdInbox className="text-5xl text-gray-200 mx-auto mb-2" />
                <p className="text-sm">No learn details yet</p>
              </td></tr>
            ) : items.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{item.subjectName || '—'}</td>
                <td className="px-4 py-3 text-gray-700">{item.topicTitle || '—'}</td>
                <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor(item.level)}`}>{item.level}</span></td>
                <td className="px-4 py-3 text-gray-600">{item.grade || '—'}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{item.overview || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewing(item)} title="View" className="text-[#00aa59] hover:text-[#008f4a]"><MdVisibility className="text-xl" /></button>
                    <button onClick={() => openEdit(item)} title="Edit" className="text-blue-500 hover:text-blue-700"><MdEdit className="text-xl" /></button>
                    <button onClick={() => handleDelete(item._id)} title="Delete" className="text-red-400 hover:text-red-600"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">
            <div className="bg-[#00aa59] px-7 py-5 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-extrabold text-white">🎓 Learn Detail</h2>
              <button onClick={() => setViewing(null)} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose className="text-xl" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Subject</p><p className="text-sm font-semibold text-gray-800">{viewing.subjectName}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Topic</p><p className="text-sm font-semibold text-gray-800">{viewing.topicTitle}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Level</p><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor(viewing.level)}`}>{viewing.level}</span></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Grade</p><p className="text-sm text-gray-700">{viewing.grade || '—'}</p></div>
              </div>
              {[['Overview', 'overview'], ['Key Concepts', 'keyConcepts'], ['Practical Application', 'practicalApplication'], ['Supporting Learning', 'supportingLearning']].map(([label, key]) => viewing[key] && (
                <div key={key}><p className="text-xs font-bold text-gray-400 uppercase mb-1">{label}</p><p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{viewing[key]}</p></div>
              ))}
              {viewing.videoUrl && (
                <div><p className="text-xs font-bold text-gray-400 uppercase mb-2">Video</p>
                  <a href={viewing.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline"><MdPlayCircle className="text-xl text-blue-500" />{viewing.videoUrl}</a>
                </div>
              )}
            </div>
            <div className="px-7 py-4 bg-gray-50 border-t flex justify-between shrink-0">
              <button onClick={() => { setViewing(null); openEdit(viewing); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600"><MdEdit /> Edit</button>
              <button onClick={() => setViewing(null)} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">
            <div className="bg-[#00aa59] px-8 py-5 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-extrabold text-white">{editing ? 'Edit Learn Detail' : 'Add Learn Detail'}</h2>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose className="text-xl" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
              {/* Dropdowns */}
              <SharedFields form={form} set={set} subjects={subjects} grades={grades} filteredTopics={filteredTopics} formSubjectId={formSubjectId} setFormSubjectId={setFormSubjectId} />

              {/* Content fields */}
              <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Overview</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Overview of the topic…" value={form.overview} onChange={e => set('overview', e.target.value)} /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Key Concepts</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Key concepts to understand…" value={form.keyConcepts} onChange={e => set('keyConcepts', e.target.value)} /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Practical Application</label><textarea className={`${inp} resize-none`} rows={3} placeholder="How to apply in real life…" value={form.practicalApplication} onChange={e => set('practicalApplication', e.target.value)} /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Supporting Learning</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Additional resources or tips…" value={form.supportingLearning} onChange={e => set('supportingLearning', e.target.value)} /></div>

              {/* Video Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Video</label>
                <VideoUploader value={form.videoUrl} onChange={v => set('videoUrl', v)} />
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t flex items-center justify-between shrink-0">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
              <button disabled={!form.subjectId || !form.topicId || saving} onClick={handleSave}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow ${form.subjectId && form.topicId && !saving ? 'bg-[#00aa59] hover:bg-[#008f4a]' : 'bg-gray-300 cursor-not-allowed'}`}>
                <MdSave /> {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminLearningSubjects = () => {
  const [subjects, setSubjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [activeTab, setActiveTab]   = useState("subjects");
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [selected, setSelected]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.subjects.getAll();
      setSubjects(Array.isArray(res) ? res : (res.data || res || []));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.subjects.getAll();
      setSubjects(Array.isArray(res) ? res : (res.data || res || []));
    } catch (e) { console.error(e); }
    finally { setRefreshing(false); }
  };

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setShowModal(true); };
  const remove   = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    await api.subjects.remove(id);
    refresh();
  };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const payload = {
        name:        form.name,
        imageUrl:    form.imageUrl    || '',
        description: form.description || '',
        type:        form.isPremium ? 'premium' : 'regular',
        enabled:     true,
      };
      if (editing) await api.subjects.update(editing._id, payload);
      else await api.subjects.create(payload);
      setShowModal(false); setEditing(null);
      await refresh();
    } catch (e) { console.error(e); alert('Failed to save.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading...</div>;

  const renderTab = () => {
    switch (activeTab) {
      case "subjects":
        return <TabSubjects subjects={subjects} onEdit={openEdit} onDelete={remove} onAdd={openAdd} refreshing={refreshing} />;
      case "topics":
        return <TabTopics subjects={subjects} />;
      case "flashcards":
        return <FlashcardsQAPromptsTab subjects={subjects} />;
      case "learndetails":
        return <LearnDetailsTab />;
      default: return null;
    }
  };

  return (
    <div>
      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelected(null); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${activeTab === tab.key ? "border-[#00aa59] text-[#00aa59] bg-green-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
              <span className="text-lg">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {renderTab()}

      {/* Add/Edit Modal */}
      {showModal && (
        <AddSubjectModal editing={editing} saving={saving}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave} />
      )}
    </div>
  );
};

export default AdminLearningSubjects;

