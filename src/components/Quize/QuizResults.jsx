import { useState, useEffect } from "react";
import {
  MdQuiz, MdSearch, MdRefresh, MdClose, MdDelete, MdVisibility,
  MdDownload, MdArrowBack, MdArrowForward, MdEmail, MdPerson,
  MdFilterList, MdCheckCircle,
} from "react-icons/md";

const API_BASE_URL = "https://nudge2grow.com/api";

const getAdminToken = () =>
  localStorage.getItem("adminToken") || localStorage.getItem("token");

// ─── Detail Modal ────────────────────────────────────────────────────────────
const DetailModal = ({ entry, onClose, onDelete }) => {
  if (!entry) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#00bf62] px-6 py-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <MdQuiz /> Quiz Details
            </h2>
            <p className="text-white/70 text-xs mt-0.5">
              {entry.subject} · {new Date(entry.sentAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onDelete(entry._id)}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
              <MdDelete /> Delete
            </button>
            <button onClick={onClose}
              className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">
              <MdClose />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Student Name", value: entry.childName || "—" },
              { label: "Email", value: entry.userEmail },
              { label: "Subject", value: entry.subject },
              { label: "Questions", value: entry.questionCount },
              { label: "Status", value: entry.status },
              { label: "Sent At", value: new Date(entry.sentAt).toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-700 break-all">{value}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Topics</p>
            <div className="flex flex-wrap gap-2">
              {(entry.topics || "").split(",").map((t, i) => (
                <span key={i} className="text-xs bg-[#00bf62]/10 text-[#00bf62] font-semibold px-3 py-1 rounded-full border border-[#00bf62]/20">
                  {t.trim()}
                </span>
              ))}
            </div>
          </div>
          {entry.questionTypes?.length > 0 && (
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Question Types</p>
              <div className="flex flex-wrap gap-2">
                {entry.questionTypes.map((t, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full border border-blue-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const QuizResults = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewEntry, setViewEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_BASE_URL}/quiz-questions/admin/all-history?limit=500`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setHistory(data.history || []);
    } catch (e) {
      setLoadError(e.message || "Failed to load quiz history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz record?")) return;
    try {
      const token = getAdminToken();
      await fetch(`${API_BASE_URL}/quiz-questions/admin/history/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setViewEntry(null);
      await load();
    } catch {
      alert("Delete failed.");
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ["#", "Student Name", "Email", "Subject", "Topics", "Questions", "Question Types", "Status", "Date"],
      ...filtered.map((r, i) => [
        i + 1,
        r.childName || "",
        r.userEmail,
        r.subject,
        `"${r.topics}"`,
        r.questionCount,
        `"${(r.questionTypes || []).join(", ")}"`,
        r.status,
        new Date(r.sentAt).toLocaleString(),
      ]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filtered = history.filter(r => {
    const q = search.toLowerCase();
    const matchSearch =
      r.childName?.toLowerCase().includes(q) ||
      r.userEmail?.toLowerCase().includes(q) ||
      r.subject?.toLowerCase().includes(q) ||
      r.topics?.toLowerCase().includes(q);
    const matchSubject = !filterSubject || r.subject === filterSubject;
    return matchSearch && matchSubject;
  });

  useEffect(() => { setCurrentPage(1); }, [search, filterSubject]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const uniqueSubjects = [...new Set(history.map(r => r.subject).filter(Boolean))];
  const totalQuizzes = history.length;
  const uniqueEmails = new Set(history.map(r => r.userEmail)).size;
  const last7 = history.filter(r => (Date.now() - new Date(r.sentAt).getTime()) < 7 * 24 * 60 * 60 * 1000).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <MdQuiz className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quiz History</h1>
            <p className="text-gray-500 text-xs mt-0.5">All quizzes sent to users</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={handleExportCSV} disabled={filtered.length === 0} title="Export CSV"
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#00bf62] hover:bg-green-50 transition shadow-sm disabled:opacity-30">
            <MdDownload className="text-xl" />
          </button>
          <button onClick={load} title="Refresh"
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#00bf62] hover:bg-green-50 transition shadow-sm">
            <MdRefresh className={`text-xl ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100 text-center min-w-[70px]">
            <p className="text-xl font-bold text-[#00bf62]">{totalQuizzes}</p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">Total</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Quizzes Sent", value: totalQuizzes },
          { label: "Unique Users", value: uniqueEmails },
          { label: "Last 7 Days", value: last7 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-bold text-[#00bf62]">{value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#00bf62] transition"
            placeholder="Search by name, email, subject or topic..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
            showFilters || filterSubject ? "bg-[#00bf62] text-white border-[#00bf62]" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}>
          <MdFilterList /> Filter
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-4 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Subject</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#00bf62]"
              value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
              <option value="">All Subjects</option>
              {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={() => setFilterSubject("")}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            Reset
          </button>
        </div>
      )}

      {search && (
        <p className="text-xs text-gray-500 mb-3">Found {filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-10">#</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Topics</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Questions</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Q. Types</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-gray-400">Loading...</td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-red-400">{loadError}</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-gray-400">
                    <MdQuiz className="text-5xl text-gray-200 mx-auto mb-2" />
                    {search || filterSubject ? "No results match your filters." : "No quiz history yet."}
                  </td>
                </tr>
              ) : paginated.map((r, i) => {
                const topicsArr = (r.topics || "").split(",").map(t => t.trim()).filter(Boolean);
                return (
                  <tr key={r._id} className="hover:bg-gray-50/60 transition">
                    {/* # */}
                    <td className="px-4 py-3 text-xs font-bold text-gray-300">{startIndex + i + 1}</td>

                    {/* Student */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#00bf62]/10 flex items-center justify-center shrink-0">
                          <span className="text-[#00bf62] font-bold text-sm">
                            {(r.childName || r.userEmail || "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-800 whitespace-nowrap">
                          {r.childName || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <MdEmail className="text-[#00bf62] shrink-0" />
                        <span className="truncate max-w-[160px]">{r.userEmail}</span>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-4 py-3">
                      <span className="text-xs bg-[#00bf62]/10 text-[#00bf62] font-semibold px-2.5 py-1 rounded-full border border-[#00bf62]/20 whitespace-nowrap">
                        {r.subject}
                      </span>
                    </td>

                    {/* Topics */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {topicsArr.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                            {t}
                          </span>
                        ))}
                        {topicsArr.length > 2 && (
                          <span className="text-xs text-gray-400 font-medium">+{topicsArr.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Questions */}
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-full border border-blue-100">
                        {r.questionCount}
                      </span>
                    </td>

                    {/* Q. Types */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(r.questionTypes || []).slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-xs bg-purple-50 text-purple-600 font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                            {t}
                          </span>
                        ))}
                        {(r.questionTypes || []).length > 2 && (
                          <span className="text-xs text-gray-400">+{r.questionTypes.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                        r.status === "Sent" ? "bg-green-100 text-[#00bf62]" : "bg-red-100 text-red-500"
                      }`}>
                        <MdCheckCircle className="text-sm" />{r.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(r.sentAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewEntry(r)} title="View details"
                          className="w-8 h-8 rounded-lg bg-[#00bf62]/10 flex items-center justify-center text-[#00bf62] hover:bg-[#00bf62]/20 transition">
                          <MdVisibility className="text-lg" />
                        </button>
                        <button onClick={() => handleDelete(r._id)} title="Delete"
                          className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition">
                          <MdDelete className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !loadError && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <MdArrowBack />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition ${
                    currentPage === page ? "bg-[#00aa59] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <MdArrowForward />
              </button>
            </div>
          </div>
        )}
      </div>

      {viewEntry && (
        <DetailModal entry={viewEntry} onClose={() => setViewEntry(null)} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default QuizResults;
