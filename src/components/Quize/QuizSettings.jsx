import { useState, useEffect } from 'react';
import {
  MdAdd, MdEdit, MdDelete, MdInbox, MdClose, MdSave, MdVisibility, MdSettings,
  MdFlashOn, MdTimer, MdEmojiEvents,
} from 'react-icons/md';
import { api } from '../../api';

// ── Constants ─────────────────────────────────────────────────────────────────
const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";

const AVAILABLE_ICONS = [
  { name: 'flash', icon: <MdFlashOn />, label: 'Flash' },
  { name: 'timer', icon: <MdTimer />, label: 'Timer' },
  { name: 'trophy', icon: <MdEmojiEvents />, label: 'Trophy' },
 
];

const PRESET_COLORS = [
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#FF8C42' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Blue', value: '#3B82F6' },
];

const QuizSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewSetting, setViewSetting] = useState(null);

  // Form state
  const [form, setForm] = useState({
    label: '',
    questions: '',
    minutes: '',
    icon: 'flash',
    color: '#8B5CF6',
    order: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.quizSettings.getAll();
      setSettings(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching quiz settings:', err);
      setError('Failed to load quiz settings');
      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (setting = null) => {
    if (setting) {
      setEditingSetting(setting);
      setForm({
        label: setting.label || '',
        questions: setting.questions || '',
        minutes: setting.minutes || '',
        icon: setting.icon || 'flash',
        color: setting.color || '#8B5CF6',
        order: setting.order || 0,
      });
    } else {
      setEditingSetting(null);
      setForm({
        label: '',
        questions: '',
        minutes: '',
        icon: 'flash',
        color: '#8B5CF6',
        order: 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSetting(null);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    try {
      if (!form.label || !form.questions || !form.minutes) {
        setError('Please fill in all required fields');
        return;
      }

      if (form.questions < 1 || form.minutes < 1) {
        setError('Questions and minutes must be at least 1');
        return;
      }

      setSaving(true);
      
      // Auto-generate description from questions and minutes
      const description = `${form.questions} questions ~${form.minutes} minutes`;
      
      const dataToSave = {
        ...form,
        description,
      };
      
      if (editingSetting) {
        await api.quizSettings.update(editingSetting._id, dataToSave);
      } else {
        await api.quizSettings.create(dataToSave);
      }

      setSuccess(editingSetting ? 'Quiz setting updated!' : 'Quiz setting created!');
      setError('');
      handleCloseModal();
      fetchSettings();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving quiz setting:', err);
      setError('Failed to save quiz setting');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz setting?')) return;

    try {
      await api.quizSettings.remove(id);
      setSuccess('Quiz setting deleted!');
      setError('');
      fetchSettings();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting quiz setting:', err);
      setError('Failed to delete quiz setting');
    }
  };

  const valid = form.label.trim() && form.questions && form.minutes;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#00aa59] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><MdClose /></button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-2 border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-600"><MdClose /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00aa59] flex items-center justify-center shadow shrink-0">
            <MdSettings className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quiz Settings</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage quiz length and duration options</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md"
        >
          <MdAdd className="text-lg" /> Add Quiz Setting
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-5 py-3.5 text-left font-semibold w-12">No</th>
              <th className="px-5 py-3.5 text-left font-semibold w-20">Icon</th>
              <th className="px-5 py-3.5 text-left font-semibold">Label</th>
              <th className="px-5 py-3.5 text-left font-semibold w-32">Questions</th>
              <th className="px-5 py-3.5 text-left font-semibold w-32">Minutes</th>
              <th className="px-5 py-3.5 text-left font-semibold">Description</th>
              <th className="px-5 py-3.5 text-left font-semibold w-32">Color</th>
              <th className="px-5 py-3.5 text-center font-semibold w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-400">
                  <MdInbox className="text-5xl text-gray-200 mx-auto mb-2" />
                  <p className="text-sm font-medium mb-3">No quiz settings yet</p>
                  <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#00aa59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#008f4a] transition mx-auto"
                  >
                    <MdAdd /> Add Quiz Setting
                  </button>
                </td>
              </tr>
            ) : (
              settings.map((setting, i) => {
                const iconData = AVAILABLE_ICONS.find(ic => ic.name === setting.icon);
                return (
                  <tr key={setting._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${setting.color}20`, color: setting.color }}
                      >
                        {iconData?.icon || <MdSettings />}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-gray-800">{setting.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-gray-700">{setting.questions}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-gray-700">{setting.minutes} min</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm max-w-xs truncate">
                      {setting.description || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: setting.color }}
                        />
                        <span className="text-xs text-gray-400 font-mono">{setting.color}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setViewSetting(setting)}
                          title="View"
                          className="text-[#00aa59] hover:text-[#008f4a] transition"
                        >
                          <MdVisibility className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(setting)}
                          title="Edit"
                          className="text-blue-500 hover:text-blue-700 transition"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(setting._id)}
                          title="Delete"
                          className="text-red-400 hover:text-red-600 transition"
                        >
                          <MdDelete className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: '90vh' }}>
            {/* Header */}
            <div className="bg-[#00aa59] px-5 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-base font-extrabold text-white">
                {editingSetting ? `Edit: ${editingSetting.label}` : 'Add Quiz Setting'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <MdClose className="text-lg" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {/* Label */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Label *
                </label>
                <input
                  className={inp}
                  placeholder="e.g. Quick Quiz"
                  value={form.label}
                  onChange={(e) => set('label', e.target.value)}
                />
              </div>

              {/* Questions & Minutes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Questions *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={inp}
                    placeholder="10"
                    value={form.questions}
                    onChange={(e) => set('questions', parseInt(e.target.value) || '')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Minutes *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={inp}
                    placeholder="20"
                    value={form.minutes}
                    onChange={(e) => set('minutes', parseInt(e.target.value) || '')}
                  />
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Icon *
                </label>
                <div className="flex gap-2">
                  {AVAILABLE_ICONS.map((iconData) => (
                    <button
                      key={iconData.name}
                      type="button"
                      onClick={() => set('icon', iconData.name)}
                      title={iconData.label}
                      className={`flex-1 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition ${
                        form.icon === iconData.name
                          ? 'border-[#00aa59] bg-[#00aa59]/10'
                          : 'border-gray-200 hover:border-[#00aa59]'
                      }`}
                    >
                      <span className="text-2xl text-gray-700">{iconData.icon}</span>
                      <span className="text-[9px] text-gray-500 mt-1 font-semibold">
                        {iconData.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Color *
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((colorData) => (
                    <button
                      key={colorData.value}
                      type="button"
                      onClick={() => set('color', colorData.value)}
                      className={`w-12 h-12 rounded-lg border-3 transition-all ${
                        form.color === colorData.value 
                          ? 'border-gray-800 scale-110 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorData.value }}
                      title={colorData.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => set('color', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition"
                    title="Custom Color"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-50 px-3 py-2 rounded-lg">
                  Selected: <span className="font-bold" style={{ color: form.color }}>{form.color}</span>
                </p>
              </div>

              {/* Auto-generated Description Preview */}
              {form.questions && form.minutes && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3">
                  <label className="block text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide">
                    Description Preview
                  </label>
                  <p className="text-sm font-semibold text-blue-800">
                    {form.questions} questions ~{form.minutes} minutes
                  </p>
                </div>
              )}

              {/* Order */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  className={inp}
                  placeholder="0"
                  value={form.order}
                  onChange={(e) => set('order', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={handleCloseModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                disabled={!valid || saving}
                onClick={handleSubmit}
                className={`flex items-center gap-2 px-7 py-2.5 rounded-xl text-white text-sm font-bold transition shadow ${
                  valid && !saving
                    ? 'bg-[#00aa59] hover:bg-[#008f4a]'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <MdSave /> {saving ? 'Saving…' : editingSetting ? 'Save Changes' : 'Add Setting'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewSetting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#00aa59] px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <MdVisibility /> View Quiz Setting
              </h2>
              <button
                onClick={() => setViewSetting(null)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <MdClose className="text-lg" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">
              {/* Icon & Label */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                  style={{ backgroundColor: `${viewSetting.color}20`, color: viewSetting.color }}
                >
                  {AVAILABLE_ICONS.find(ic => ic.name === viewSetting.icon)?.icon || <MdSettings />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{viewSetting.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{viewSetting.description}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 px-4 py-3 rounded-xl">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                    Questions
                  </label>
                  <p className="text-2xl font-bold text-gray-800">{viewSetting.questions}</p>
                </div>
                <div className="bg-gray-50 px-4 py-3 rounded-xl">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                    Duration
                  </label>
                  <p className="text-2xl font-bold text-gray-800">{viewSetting.minutes} min</p>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: viewSetting.color }}
                  />
                  <code className="text-sm font-mono font-semibold text-gray-600">
                    {viewSetting.color}
                  </code>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setViewSetting(null)}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewSetting(null);
                  handleOpenModal(viewSetting);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00aa59] text-white text-sm font-bold hover:bg-[#008f4a] transition"
              >
                <MdEdit /> Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSettings;
