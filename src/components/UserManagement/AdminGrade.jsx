import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdSave, MdClose, MdSchool } from "react-icons/md";
import { api } from "../../api";

const AdminGrade = () => {
  const [grades, setGrades] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

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
            ) : grades.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-400">
                  <MdSchool className="text-5xl text-gray-300 mx-auto mb-2" />
                  No grades yet. Add one above.
                </td>
              </tr>
            ) : grades.map((grade, i) => (
              <tr key={grade._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-gray-500 font-medium">{i + 1}</td>
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
    </div>
  );
};

export default AdminGrade;
