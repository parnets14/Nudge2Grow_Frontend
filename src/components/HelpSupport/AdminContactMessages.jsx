import { useState, useEffect } from "react";
import { MdMessage, MdDelete, MdClose, MdMarkEmailRead, MdRefresh, MdVisibility } from "react-icons/md";
import { api } from "../../api";

const ViewModal = ({ item, onClose, onMarkRead }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="bg-[#00bf62] px-5 py-3 flex justify-between items-center">
        <h2 className="text-base font-bold text-white flex items-center gap-2"><MdMessage /> Message</h2>
        <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"><MdClose /></button>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm text-gray-800 leading-relaxed">{item.message}</p>
        <div className="flex gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
          <span>Received: {new Date(item.createdAt).toLocaleString()}</span>
          <span className={`font-semibold ${item.isRead ? "text-[#00bf62]" : "text-amber-500"}`}>
            {item.isRead ? "Read" : "Unread"}
          </span>
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-3">
        {!item.isRead && (
          <button onClick={() => onMarkRead(item._id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00bf62] text-white text-sm font-semibold hover:bg-[#00a055] transition">
            <MdMarkEmailRead /> Mark as Read
          </button>
        )}
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
      </div>
    </div>
  </div>
);

const AdminContactMessages = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const res = await api.contactMessages.getAll(); setItems(res.data || res || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id) => {
    try { await api.contactMessages.markRead(id); setViewItem(null); await load(); }
    catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try { await api.contactMessages.remove(id); setViewItem(null); await load(); }
    catch (e) { console.error(e); }
  };

  const unread = items.filter(i => !i.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0 relative">
            <MdMessage className="text-white text-xl" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Messages</h1>
            <p className="text-gray-500 text-xs mt-0.5">{items.length} messages · {unread} unread</p>
          </div>
        </div>
        <button onClick={load} className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#00bf62] hover:bg-green-50 transition shadow-sm">
          <MdRefresh className={`text-xl ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-5 py-3.5 text-left font-semibold w-10">No</th>
              <th className="px-5 py-3.5 text-left font-semibold">Message</th>
              <th className="px-5 py-3.5 text-center font-semibold w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-16 text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-16 text-gray-400">
                <MdMessage className="text-5xl text-gray-200 mx-auto mb-2" />
                No messages yet.
              </td></tr>
            ) : items.map((item, i) => (
              <tr key={item._id} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} ${!item.isRead ? "font-semibold" : ""}`}>
                <td className="px-5 py-3.5 text-gray-400">{i + 1}</td>
                <td className="px-5 py-3.5 text-gray-800 max-w-sm">
                  <p className="truncate">{item.message}</p>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewItem(item)} className="text-[#00bf62] hover:text-[#00a055] transition"><MdVisibility className="text-xl" /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-600 transition"><MdDelete className="text-xl" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)} onMarkRead={handleMarkRead} />}
    </div>
  );
};

export default AdminContactMessages;
