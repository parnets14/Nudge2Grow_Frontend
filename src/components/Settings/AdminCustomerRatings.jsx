import { useState, useEffect } from "react";
import { MdStar, MdDelete, MdClose, MdRefresh, MdVisibility, MdPeople, MdArrowBack, MdArrowForward } from "react-icons/md";
import { api } from "../../api";

const STARS = [1, 2, 3, 4, 5];
const LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {STARS.map(s => (
      <MdStar key={s} className={`text-lg ${s <= rating ? "text-amber-400" : "text-gray-200"}`} />
    ))}
  </div>
);

const ViewModal = ({ item, onClose, onDelete }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="bg-[#00bf62] px-5 py-3 flex justify-between items-center">
        <h2 className="text-base font-bold text-white flex items-center gap-2"><MdStar /> Rating Details</h2>
        <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"><MdClose /></button>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <StarDisplay rating={item.rating} />
          <span className="text-sm font-bold text-amber-500">{LABELS[item.rating]}</span>
        </div>
        {item.childName && <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Child Name</p><p className="text-sm text-gray-800">{item.childName}</p></div>}
        {item.phone && <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Phone</p><p className="text-sm text-gray-800">{item.phone}</p></div>}
        {item.feedback && <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Feedback</p><p className="text-sm text-gray-600 leading-relaxed">{item.feedback}</p></div>}
        <p className="text-[10px] text-gray-400">Submitted: {new Date(item.createdAt).toLocaleString()}</p>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t flex justify-between">
        <button onClick={() => onDelete(item._id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">
          <MdDelete /> Delete
        </button>
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
      </div>
    </div>
  </div>
);

const AdminCustomerRatings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const load = async () => {
    setLoading(true);
    try { 
      const res = await api.customerRatings.getAll(); 
      setItems(res.data || res || []);
    }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rating?")) return;
    try { await api.customerRatings.remove(id); setViewItem(null); await load(); }
    catch (e) { console.error(e); }
  };

  const avg = items.length ? (items.reduce((s, i) => s + i.rating, 0) / items.length).toFixed(1) : '—';

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <MdStar className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Customer Ratings</h1>
            <p className="text-gray-500 text-xs mt-0.5">{items.length} ratings · Avg: {avg} ⭐</p>
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
              <th className="px-5 py-3.5 text-left font-semibold">Child Name</th>
              <th className="px-5 py-3.5 text-left font-semibold">Phone</th>
              <th className="px-5 py-3.5 text-left font-semibold">Rating</th>
              <th className="px-5 py-3.5 text-left font-semibold">Message</th>
              <th className="px-5 py-3.5 text-center font-semibold w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">
                <MdPeople className="text-5xl text-gray-200 mx-auto mb-2" />
                No ratings yet.
              </td></tr>
            ) : paginatedItems.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-5 py-3.5 text-gray-400">{startIndex + i + 1}</td>
                <td className="px-5 py-3.5 font-semibold text-gray-800">{item.childName || "—"}</td>
                <td className="px-5 py-3.5 text-gray-600">{item.phone || "—"}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <StarDisplay rating={item.rating} />
                    <span className="text-xs text-amber-500 font-semibold">{LABELS[item.rating]}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-xs max-w-xs">
                  <p className="truncate">{item.feedback || "—"}</p>
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

      {/* Pagination */}
      {!loading && items.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl px-5 py-3 border border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, items.length)} of {items.length} rating{items.length !== 1 ? 's' : ''}
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

      {viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)} onDelete={handleDelete} />}
    </div>
  );
};

export default AdminCustomerRatings;
