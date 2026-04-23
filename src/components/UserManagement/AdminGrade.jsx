import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdSave, MdClose, MdSchool, MdArrowBack, MdArrowForward } from "react-icons/md";
import { api } from "../../api";

const AdminGrade = () => {
  const [grades, setGrades] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.grades.getAll();
      setGrades(res.data || res || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (editId) {
        await api.grades.update(editId, { title });
        setEditId(null);
      } else {
        await api.grades.create({ title });
      }
      setTitle("");
      load();
    } catch (err) { console.error(err); alert("Save failed."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this grade?")) return;
    try { await api.grades.remove(id); load(); }
    catch (err) { console.error(err); }
  };

  const handleEdit = (grade) => { setTitle(grade.title); setEditId(grade._id); };

  // Filter grades based on search term
  const filteredGrades = grades.filter(g =>
    g.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredGrades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGrades = filteredGrades.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00bf62] to-[#00a055] flex items-center justify-center shadow shrink-0">
          <MdSchool className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Grade Management</h1>
          <p className="text-gray-500 text-xs mt-0.5">Add and manage grades for the app</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-base font-semibold text-gray-600 mb-4">{editId ? "Edit Grade" : "Add New Grade"}</h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. Grade 1, Grade 2..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00bf62] transition"
            required
          />
          <button type="submit"
            className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition shadow">
            {editId ? <><MdSave /> Update</> : <><MdAdd /> Add</>}
          </button>
          {editId && (
            <button type="button" onClick={() => { setTitle(""); setEditId(null); }}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold transition">
              <MdClose /> Cancel
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Search Field */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search grades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-[#00bf62] focus:ring-4 focus:ring-[#00bf62]/10 transition bg-white"
            />
            <MdSchool className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
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
              Found <span className="font-semibold text-[#00bf62]">{filteredGrades.length}</span> grade{filteredGrades.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-6 py-4 text-left font-semibold w-16">No</th>
              <th className="px-6 py-4 text-left font-semibold">Grade Title</th>
              <th className="px-6 py-4 text-left font-semibold">Created At</th>
              <th className="px-6 py-4 text-center font-semibold w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-400">Loading...</td>
              </tr>
            ) : filteredGrades.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-400">
                  <MdSchool className="text-5xl text-gray-300 mx-auto mb-2" />
                  {searchTerm ? "No grades found matching your search" : "No grades yet. Add one above."}
                </td>
              </tr>
            ) : paginatedGrades.map((grade, i) => (
              <tr key={grade._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-gray-500 font-medium">{startIndex + i + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00bf62]/10 flex items-center justify-center shrink-0">
                      <MdSchool className="text-[#00bf62] text-lg" />
                    </div>
                    <span className="font-semibold text-gray-800">{grade.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {grade.createdAt ? new Date(grade.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(grade)} title="Edit"
                      className="text-amber-400 hover:text-amber-500 transition">
                      <MdEdit className="text-xl" />
                    </button>
                    <button onClick={() => handleDelete(grade._id)} title="Delete"
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
      {!loading && filteredGrades.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl px-5 py-3 border border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredGrades.length)} of {filteredGrades.length} grade{filteredGrades.length !== 1 ? 's' : ''}
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
    </div>
  );
};

export default AdminGrade;
