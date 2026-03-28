import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdAccountCircle } from "react-icons/md";
import { api } from "../../api";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { image: "" });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const canvas = document.createElement("canvas");
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 400;
      let { width, height } = img;
      if (width > height) {
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
      } else {
        if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX; }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      setForm(p => ({ ...p, image: canvas.toDataURL("image/jpeg", 0.7) }));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-[#45a578] px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Avatar</> : <><MdAdd /> Add Avatar</>}
          </h2>
          <button onClick={onClose}><MdClose className="text-white text-2xl" /></button>
        </div>

        <div className="px-8 py-6">
          <label className="flex flex-col items-center gap-4 cursor-pointer group">
            <div className={`w-36 h-36 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition
              ${form.image ? "border-[#45a578]" : "border-gray-300 group-hover:border-[#45a578]"}`}>
              {form.image ? (
                <img src={form.image} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <MdAccountCircle className="text-gray-300 text-6xl group-hover:text-[#45a578] transition" />
              )}
            </div>
            <span className="text-sm font-semibold text-gray-500 group-hover:text-[#45a578] transition">
              {form.image ? "Change Image" : "Select Image"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
          {form.image && (
            <button type="button" onClick={() => setForm(p => ({ ...p, image: "" }))}
              className="mt-3 w-full text-sm text-red-400 hover:text-red-600 font-semibold text-center">
              Remove
            </button>
          )}
        </div>

        <div className="px-8 py-5 bg-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 text-base border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => form.image && onSave(form)} disabled={!form.image || saving}
            className={`px-8 py-3 rounded-xl text-white text-base font-bold flex items-center gap-2 transition ${form.image && !saving ? "bg-[#45a578] hover:bg-[#3a9068]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminSelectAvatar = () => {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAvatar, setEditAvatar] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.avatars.getAll();
      setAvatars(res.data || res || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editAvatar) await api.avatars.update(editAvatar._id, form);
      else await api.avatars.create(form);
      setModalOpen(false);
      setEditAvatar(null);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this avatar?")) return;
    try { await api.avatars.remove(id); await load(); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#45a578] flex items-center justify-center shadow shrink-0">
            <MdAccountCircle className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Select Avatar</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage avatars available for children</p>
          </div>
        </div>
        <button onClick={() => { setEditAvatar(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#45a578] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-[#3a9068] transition">
          <MdAdd className="text-lg" /> Add Avatar
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-6 py-4 text-left font-semibold w-16">No</th>
              <th className="px-6 py-4 text-left font-semibold">Avatar</th>
              <th className="px-6 py-4 text-left font-semibold">Created At</th>
              <th className="px-6 py-4 text-center font-semibold w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-16 text-gray-400">Loading...</td></tr>
            ) : avatars.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-400">
                  <MdAccountCircle className="text-5xl text-gray-300 mx-auto mb-2" />
                  No avatars yet. Add your first one!
                </td>
              </tr>
            ) : avatars.map((av, i) => (
              <tr key={av._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-gray-500 font-medium">{i + 1}</td>
                <td className="px-6 py-4">
                  <img src={av.image} alt="avatar" className="w-14 h-14 rounded-xl object-cover border border-gray-200" />
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {av.createdAt ? new Date(av.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setEditAvatar(av); setModalOpen(true); }} title="Edit"
                      className="text-amber-400 hover:text-amber-500 transition">
                      <MdEdit className="text-xl" />
                    </button>
                    <button onClick={() => handleDelete(av._id)} title="Delete"
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

      {modalOpen && (
        <Modal entry={editAvatar} onSave={handleSave} onClose={() => { setModalOpen(false); setEditAvatar(null); }} saving={saving} />
      )}
    </div>
  );
};

export default AdminSelectAvatar;
