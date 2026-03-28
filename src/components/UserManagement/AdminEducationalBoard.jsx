import { useEffect, useState, useRef } from "react";
import { MdAdd, MdEdit, MdDelete, MdSave, MdClose, MdSchool } from "react-icons/md";
import { api } from "../../api";

const PRESET_BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];

const AdminEducationalBoard = () => {
  const [boards, setBoards] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.educationalBoards.getAll();
      setBoards(res.data || res || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setNameInput(val);
    if (!val.trim()) { setSuggestions([]); setShowDropdown(false); return; }
    const added = boards.map(b => b.name?.toLowerCase());
    const filtered = PRESET_BOARDS.filter(b =>
      b.toLowerCase().includes(val.toLowerCase()) && !added.includes(b.toLowerCase())
    );
    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleSuggestionClick = (s) => { setNameInput(s); setShowDropdown(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const finalName = nameInput.trim();
    if (!finalName) return;
    try {
      if (editId) {
        await api.educationalBoards.update(editId, { name: finalName });
        setEditId(null);
      } else {
        await api.educationalBoards.create({ name: finalName });
      }
      setNameInput("");
      load();
    } catch (err) { setError(err.response?.data?.message || "Something went wrong"); }
  };

  const handleEdit = (board) => { setEditId(board._id); setNameInput(board.name); setShowDropdown(false); };
  const handleCancel = () => { setEditId(null); setNameInput(""); setError(""); setShowDropdown(false); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this board?")) return;
    try { await api.educationalBoards.remove(id); load(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00bf62] to-[#00a055] flex items-center justify-center shadow shrink-0">
          <MdSchool className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Educational Boards</h1>
          <p className="text-gray-500 text-xs mt-0.5">Add and manage educational boards for the app</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-base font-semibold text-gray-600 mb-4">{editId ? "Edit Board" : "Add New Board"}</h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Type board name (e.g. CBSE, ICSE...)"
              value={nameInput}
              onChange={handleNameChange}
              onFocus={() => nameInput.trim() && setShowDropdown(suggestions.length > 0)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00bf62] transition"
            />
            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                {suggestions.map(s => (
                  <li key={s} onMouseDown={() => handleSuggestionClick(s)}
                    className="px-4 py-2.5 text-sm cursor-pointer hover:bg-[#00bf62] hover:text-white transition-colors">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" disabled={!nameInput.trim()}
            className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-40 shadow">
            {editId ? <><MdSave /> Update</> : <><MdAdd /> Add Board</>}
          </button>
          {(editId || nameInput) && (
            <button type="button" onClick={handleCancel}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold transition">
              <MdClose /> Cancel
            </button>
          )}
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-6 py-4 text-left font-semibold w-16">No</th>
              <th className="px-6 py-4 text-left font-semibold">Board Name</th>
              <th className="px-6 py-4 text-left font-semibold">Created At</th>
              <th className="px-6 py-4 text-center font-semibold w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-400">Loading...</td>
              </tr>
            ) : boards.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-400">
                  <MdSchool className="text-5xl text-gray-300 mx-auto mb-2" />
                  No boards added yet.
                </td>
              </tr>
            ) : boards.map((board, i) => (
              <tr key={board._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-gray-500 font-medium">{i + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00bf62]/10 flex items-center justify-center shrink-0">
                      <MdSchool className="text-[#00bf62] text-lg" />
                    </div>
                    <span className="font-semibold text-gray-800">{board.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {board.createdAt ? new Date(board.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(board)} title="Edit"
                      className="text-amber-400 hover:text-amber-500 transition">
                      <MdEdit className="text-xl" />
                    </button>
                    <button onClick={() => handleDelete(board._id)} title="Delete"
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

export default AdminEducationalBoard;
