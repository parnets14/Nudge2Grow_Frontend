import { useState, useEffect } from "react";
import { MdPeople, MdPhone, MdEmail, MdSearch, MdRefresh, MdClose, MdDelete, MdVisibility, MdChildCare, MdSchool, MdCake, MdMenuBook } from "react-icons/md";
import { api } from "../../api";

const StudentModal = ({ parent, beyondSchoolMap, avatarMap, onClose, onDelete }) => {
  const children = parent.children || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-[#00bf62] px-6 py-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <MdChildCare /> Student Details
            </h2>
            <p className="text-white/70 text-xs mt-0.5">{parent.countryCode} {parent.phone} · {parent.email || "No email"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onDelete(parent._id)}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
              <MdDelete /> Delete
            </button>
            <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">
              <MdClose />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          {children.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MdChildCare className="text-5xl text-gray-200 mx-auto mb-2" />
              <p>No students added yet.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {children.map((child, i) => {
                const subjectLevels = child.subjectLevels || {};
                const levelEntries = Object.entries(subjectLevels);
                const beyondTopics = (child.topics || []).filter(t => !Object.keys(subjectLevels).includes(t));
                const avatarSrc = child.avatar
                  ? (avatarMap[child.avatar] || (child.avatar.startsWith('data:') || child.avatar.startsWith('http') || child.avatar.startsWith('file') ? child.avatar : null))
                  : null;

                return (
                  <div key={child._id || i} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    {/* Student header */}
                    <div className="bg-gradient-to-r from-[#00bf62]/10 to-green-50 px-5 py-4 flex items-center gap-4">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt={child.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#00bf62]/40 shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#00bf62] flex items-center justify-center text-white font-bold text-2xl shrink-0">
                          {child.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{child.name}</h3>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                          {child.grade && <span className="flex items-center gap-1"><MdSchool className="text-[#00bf62]" />{child.grade}</span>}
                          {child.educationBoard && <span className="flex items-center gap-1"><MdMenuBook className="text-[#00bf62]" />{child.educationBoard}</span>}
                          {child.dateOfBirth && <span className="flex items-center gap-1"><MdCake className="text-[#00bf62]" />{child.dateOfBirth}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Subjects & Levels */}
                      {levelEntries.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subjects & Levels</p>
                          <div className="space-y-2">
                            {levelEntries.map(([subject, level]) => (
                              <div key={subject} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5">
                                <span className="text-sm text-gray-700 font-medium capitalize">{subject.replace(/-/g, ' ')}</span>
                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                  level === 'Advanced' ? 'bg-red-100 text-red-600' :
                                  level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>{level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Beyond School */}
                      {beyondTopics.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Beyond School</p>
                          <div className="flex flex-wrap gap-2">
                            {beyondTopics.map(t => (
                              <span key={t} className="text-xs bg-[#00bf62]/10 text-[#00bf62] font-semibold px-3 py-1 rounded-full border border-[#00bf62]/20">
                                {beyondSchoolMap[t] || t.replace(/-/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, totalChildren: 0 });
  const [beyondSchoolMap, setBeyondSchoolMap] = useState({});
  const [avatarMap, setAvatarMap] = useState({});
  const [viewParent, setViewParent] = useState(null);

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [res, bsRes, avRes] = await Promise.all([
        api.users.getAll(),
        api.customizeLearning.getAll(),
        api.avatars.getAll(),
      ]);
      const data = res.parents || res.data || res || [];
      setParents(data);
      setStats({ total: res.total || data.length, totalChildren: res.totalChildren || 0 });
      const map = {};
      (bsRes.data || bsRes || []).forEach(i => { map[i._id] = i.name; });
      setBeyondSchoolMap(map);
      const avMap = {};
      (avRes.data || avRes || []).forEach(a => { avMap[a._id] = a.image; });
      setAvatarMap(avMap);
    } catch (e) {
      console.error(e);
      setLoadError(e?.response?.data?.message || e.message || 'Failed to load users');
    }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user and all their data?")) return;
    try { await api.users.remove(id); setViewParent(null); await load(); }
    catch (e) { alert("Delete failed."); }
  };

  const filtered = parents.filter(p => {
    const q = search.toLowerCase();
    return p.phone?.includes(q) || p.email?.toLowerCase().includes(q) ||
      p.children?.some(c => c.name?.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <MdPeople className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Users</h1>
            <p className="text-gray-500 text-xs mt-0.5">Registered parents and their students</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={load} title="Refresh"
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#00bf62] hover:bg-green-50 transition shadow-sm">
            <MdRefresh className={`text-xl ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100 text-center min-w-[70px]">
            <p className="text-xl font-bold text-[#00bf62]">{stats.totalChildren}</p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">Students</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#00bf62] transition"
          placeholder="Search by phone, email or student name..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table — one row per child */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-5 py-3.5 text-left font-semibold w-10">No</th>
              <th className="px-5 py-3.5 text-left font-semibold">Avatar</th>
              <th className="px-5 py-3.5 text-left font-semibold">Child Name</th>
              <th className="px-5 py-3.5 text-left font-semibold">Grade</th>
              <th className="px-5 py-3.5 text-left font-semibold">Phone</th>
              <th className="px-5 py-3.5 text-left font-semibold">Email</th>
              <th className="px-5 py-3.5 text-center font-semibold w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-16 text-gray-400">Loading...</td></tr>
            ) : loadError ? (
              <tr><td colSpan={7} className="text-center py-16 text-red-400 font-medium">{loadError}</td></tr>
            ) : (() => {
              // Flatten: one row per child
              const rows = [];
              filtered.forEach(parent => {
                if (parent.children?.length) {
                  parent.children.forEach(child => rows.push({ parent, child }));
                } else {
                  rows.push({ parent, child: null });
                }
              });
              if (rows.length === 0) return (
                <tr><td colSpan={7} className="text-center py-16 text-gray-400">
                  <MdPeople className="text-5xl text-gray-200 mx-auto mb-2" />
                  {search ? "No users match your search." : "No users registered yet."}
                </td></tr>
              );
              return rows.map(({ parent, child }, i) => {
                const avSrc = child?.avatar
                  ? (avatarMap[child.avatar] || (child.avatar.startsWith('data:') || child.avatar.startsWith('http') ? child.avatar : null))
                  : null;
                return (
                  <tr key={`${parent._id}-${child?._id || 'none'}`} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      {child ? (
                        avSrc
                          ? <img src={avSrc} className="w-10 h-10 rounded-full object-cover border-2 border-[#00bf62]/20" alt={child.name} />
                          : <div className="w-10 h-10 rounded-full bg-[#00bf62]/10 flex items-center justify-center text-[#00bf62] font-bold text-sm">
                              {child.name?.[0]?.toUpperCase() || "?"}
                            </div>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800">
                      {child?.name || <span className="text-gray-300">No child</span>}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {child?.grade || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <MdPhone className="text-[#00bf62] shrink-0" />
                        <span className="text-gray-700">{parent.countryCode} {parent.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {parent.email
                        ? <div className="flex items-center gap-1.5"><MdEmail className="text-[#00bf62] shrink-0" />{parent.email}</div>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setViewParent(parent)} title="View details"
                          className="text-[#00bf62] hover:text-[#00a055] transition">
                          <MdVisibility className="text-xl" />
                        </button>
                        <button onClick={() => handleDelete(parent._id)} title="Delete"
                          className="text-red-400 hover:text-red-600 transition">
                          <MdDelete className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>

      {viewParent && (
        <StudentModal
          parent={viewParent}
          beyondSchoolMap={beyondSchoolMap}
          avatarMap={avatarMap}
          onClose={() => setViewParent(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminUsers;
