import { useState, useEffect } from 'react';
import {
  MdAdd, MdEdit, MdDelete, MdInbox, MdClose, MdSave, MdVisibility,
  MdCheckBox, MdRadioButtonChecked, MdShortText, MdSubject,
  MdViewList, MdDragIndicator, MdImage, MdAudiotrack,
  MdVideoLibrary, MdCode, MdCalculate, MdSpellcheck,
  MdFormatListNumbered, MdFormatListBulleted, MdTextFields,
  MdTitle, MdDescription, MdQuestionAnswer, MdQuiz,
  MdAssignment, MdGrade, MdCheckCircle, MdRadioButtonUnchecked,
  MdToggleOn, MdStar, MdThumbUp, MdFavorite,
  MdLightbulb, MdPsychology, MdSchool, MdMenuBook,
  MdCreate, MdSearch, MdHelp, MdInfo, MdLink,
  MdAttachFile, MdCloudUpload, MdFolder, MdInsertDriveFile,
  MdPictureAsPdf, MdTableChart, MdBarChart, MdPieChart,
  MdTimeline, MdMap, MdPlace, MdEvent, MdAccessTime,
  MdPerson, MdGroup, MdChat, MdComment, MdForum,
  MdThumbsUpDown, MdCompare, MdSwapHoriz, MdShuffle,
  MdFilterList, MdSort, MdArrowForward, MdPlayArrow,
} from 'react-icons/md';
import { api } from '../../api';

// ── Constants ─────────────────────────────────────────────────────────────────
const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";

// React Native Vector Icons (MaterialCommunityIcons) with React Icons preview
const AVAILABLE_ICONS = [
  // Basic Actions
  { name: 'pencil', icon: <MdCreate />, label: 'Pencil/Edit' },
  { name: 'magnify', icon: <MdSearch />, label: 'Search' },
  { name: 'help-circle', icon: <MdHelp />, label: 'Help' },
  { name: 'information', icon: <MdInfo />, label: 'Information' },
  
  // Question Types
  { name: 'checkbox-marked-circle', icon: <MdCheckBox />, label: 'Multiple Choice' },
  { name: 'radiobox-marked', icon: <MdRadioButtonChecked />, label: 'Single Choice' },
  { name: 'check-circle', icon: <MdCheckCircle />, label: 'True/False' },
  { name: 'radiobox-blank', icon: <MdRadioButtonUnchecked />, label: 'Yes/No' },
  
  // Text Input
  { name: 'text-box', icon: <MdShortText />, label: 'Short Answer' },
  { name: 'text-box-multiple', icon: <MdSubject />, label: 'Long Answer' },
  { name: 'text-short', icon: <MdTextFields />, label: 'Fill Blank' },
  { name: 'file-document-edit', icon: <MdDescription />, label: 'Essay' },
  
  // Lists & Ordering
  { name: 'format-list-checks', icon: <MdViewList />, label: 'Checklist' },
  { name: 'format-list-bulleted', icon: <MdFormatListBulleted />, label: 'Bullet List' },
  { name: 'order-numeric-ascending', icon: <MdFormatListNumbered />, label: 'Numbered List' },
  { name: 'drag-vertical', icon: <MdDragIndicator />, label: 'Drag & Drop' },
  { name: 'sort', icon: <MdSort />, label: 'Sort/Order' },
  { name: 'shuffle', icon: <MdShuffle />, label: 'Shuffle' },
  
  // Media
  { name: 'image', icon: <MdImage />, label: 'Image' },
  { name: 'music', icon: <MdAudiotrack />, label: 'Audio' },
  { name: 'video', icon: <MdVideoLibrary />, label: 'Video' },
  { name: 'file-upload', icon: <MdCloudUpload />, label: 'Upload' },
  { name: 'attachment', icon: <MdAttachFile />, label: 'Attachment' },
  { name: 'link', icon: <MdLink />, label: 'Link' },
  
  // Documents & Files
  { name: 'file-document', icon: <MdInsertDriveFile />, label: 'Document' },
  { name: 'file-pdf-box', icon: <MdPictureAsPdf />, label: 'PDF' },
  { name: 'folder', icon: <MdFolder />, label: 'Folder' },
  
  // Academic
  { name: 'calculator', icon: <MdCalculate />, label: 'Math' },
  { name: 'code-tags', icon: <MdCode />, label: 'Code' },
  { name: 'spellcheck', icon: <MdSpellcheck />, label: 'Spelling' },
  { name: 'school', icon: <MdSchool />, label: 'Learning' },
  { name: 'book-open-variant', icon: <MdMenuBook />, label: 'Reading' },
  
  // Assessment
  { name: 'comment-question', icon: <MdQuestionAnswer />, label: 'Q&A' },
  { name: 'quiz', icon: <MdQuiz />, label: 'Quiz' },
  { name: 'clipboard-check', icon: <MdAssignment />, label: 'Assignment' },
  { name: 'star-circle', icon: <MdGrade />, label: 'Grade' },
  
  // Rating & Feedback
  { name: 'star', icon: <MdStar />, label: 'Star Rating' },
  { name: 'thumb-up', icon: <MdThumbUp />, label: 'Like' },
  { name: 'thumbs-up-down', icon: <MdThumbsUpDown />, label: 'Like/Dislike' },
  { name: 'heart', icon: <MdFavorite />, label: 'Favorite' },
  
  // Interactive
  { name: 'toggle-switch', icon: <MdToggleOn />, label: 'Toggle' },
  { name: 'compare', icon: <MdCompare />, label: 'Compare' },
  { name: 'swap-horizontal', icon: <MdSwapHoriz />, label: 'Match/Swap' },
  { name: 'filter', icon: <MdFilterList />, label: 'Filter' },
  
  // Charts & Data
  { name: 'table', icon: <MdTableChart />, label: 'Table' },
  { name: 'chart-bar', icon: <MdBarChart />, label: 'Bar Chart' },
  { name: 'chart-pie', icon: <MdPieChart />, label: 'Pie Chart' },
  { name: 'chart-timeline', icon: <MdTimeline />, label: 'Timeline' },
  
  // Location & Time
  { name: 'map', icon: <MdMap />, label: 'Map' },
  { name: 'map-marker', icon: <MdPlace />, label: 'Location' },
  { name: 'calendar', icon: <MdEvent />, label: 'Calendar' },
  { name: 'clock', icon: <MdAccessTime />, label: 'Time' },
  
  // Social & Communication
  { name: 'account', icon: <MdPerson />, label: 'Person' },
  { name: 'account-group', icon: <MdGroup />, label: 'Group' },
  { name: 'chat', icon: <MdChat />, label: 'Chat' },
  { name: 'comment', icon: <MdComment />, label: 'Comment' },
  { name: 'forum', icon: <MdForum />, label: 'Forum' },
  
  // Thinking & Learning
  { name: 'lightbulb', icon: <MdLightbulb />, label: 'Idea' },
  { name: 'brain', icon: <MdPsychology />, label: 'Critical Think' },
  { name: 'arrow-right', icon: <MdArrowForward />, label: 'Next/Continue' },
  { name: 'play', icon: <MdPlayArrow />, label: 'Play/Start' },
];

const PRESET_COLORS = [
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#FF8C42' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Blue', value: '#3B82F6' },
];

const QuestionTypes = () => {
  const [questionTypes, setQuestionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewType, setViewType] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    icon: '',
    color: '#8B5CF6',
    description: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchQuestionTypes();
  }, []);

  const fetchQuestionTypes = async () => {
    try {
      setLoading(true);
      const data = await api.questionTypes.getAll();
      setQuestionTypes(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching question types:', err);
      setError('Failed to load question types');
      setQuestionTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type = null) => {
    if (type) {
      setEditingType(type);
      setForm({
        name: type.name || '',
        icon: type.icon || '',
        color: type.color || '#8B5CF6',
        description: type.description || '',
        tags: type.tags || [],
      });
    } else {
      setEditingType(null);
      setForm({
        name: '',
        icon: '',
        color: '#8B5CF6',
        description: '',
        tags: [],
      });
    }
    setTagInput('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingType(null);
    setTagInput('');
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      set('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    set('tags', form.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.icon || !form.description) {
        setError('Please fill in all required fields');
        return;
      }

      setSaving(true);
      
      if (editingType) {
        await api.questionTypes.update(editingType._id, form);
      } else {
        await api.questionTypes.create(form);
      }

      setSuccess(editingType ? 'Question type updated!' : 'Question type created!');
      setError('');
      handleCloseModal();
      fetchQuestionTypes();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving question type:', err);
      setError('Failed to save question type');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question type?')) return;

    try {
      await api.questionTypes.remove(id);
      setSuccess('Question type deleted!');
      setError('');
      fetchQuestionTypes();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting question type:', err);
      setError('Failed to delete question type');
    }
  };

  const valid = form.name.trim() && form.icon && form.description.trim();

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
            <MdQuiz className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Question Types</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage quiz question formats and types</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md"
        >
          <MdAdd className="text-lg" /> Add Question Type
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-5 py-3.5 text-left font-semibold w-12">No</th>
              <th className="px-5 py-3.5 text-left font-semibold w-20">Icon</th>
              <th className="px-5 py-3.5 text-left font-semibold">Name</th>
              <th className="px-5 py-3.5 text-left font-semibold">Description</th>
              <th className="px-5 py-3.5 text-left font-semibold w-32">Color</th>
              <th className="px-5 py-3.5 text-left font-semibold">Tags</th>
              <th className="px-5 py-3.5 text-center font-semibold w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questionTypes.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400">
                  <MdInbox className="text-5xl text-gray-200 mx-auto mb-2" />
                  <p className="text-sm font-medium mb-3">No question types yet</p>
                  <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#00aa59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#008f4a] transition mx-auto"
                  >
                    <MdAdd /> Add Question Type
                  </button>
                </td>
              </tr>
            ) : (
              questionTypes.map((type, i) => {
                return (
                  <tr key={type._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${type.color}20` }}
                      >
                        {AVAILABLE_ICONS.find(ic => ic.name === type.icon)?.icon || <MdQuiz />}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-gray-800">{type.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm max-w-xs truncate">
                      {type.description || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-xs text-gray-400 font-mono">{type.color}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {type.tags?.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{
                              backgroundColor: `${type.color}20`,
                              color: type.color,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {type.tags?.length > 2 && (
                          <span className="text-xs text-gray-400">+{type.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setViewType(type)}
                          title="View"
                          className="text-[#00aa59] hover:text-[#008f4a] transition"
                        >
                          <MdVisibility className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(type)}
                          title="Edit"
                          className="text-blue-500 hover:text-blue-700 transition"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(type._id)}
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
                {editingType ? `Edit: ${editingType.name}` : 'Add Question Type'}
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
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Name *
                </label>
                <input
                  className={inp}
                  placeholder="e.g. Multiple Choice"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Icon * (React Native MaterialCommunityIcons)
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50">
                  {AVAILABLE_ICONS.map((iconData) => (
                    <button
                      key={iconData.name}
                      type="button"
                      onClick={() => set('icon', iconData.name)}
                      title={iconData.label}
                      className={`h-20 rounded-xl border-2 flex flex-col items-center justify-center transition ${
                        form.icon === iconData.name
                          ? 'border-[#00aa59] bg-white shadow-md'
                          : 'border-gray-200 bg-white hover:border-[#00aa59] hover:shadow-sm'
                      }`}
                    >
                      <span className="text-2xl text-gray-700">{iconData.icon}</span>
                      <span className="text-[8px] text-gray-500 mt-1 font-semibold truncate w-full px-1 text-center leading-tight">
                        {iconData.label}
                      </span>
                    </button>
                  ))}
                </div>
                {form.icon && (
                  <div className="mt-2 bg-[#00aa59]/10 border border-[#00aa59]/30 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Selected Icon:</span>{' '}
                      <code className="font-mono font-bold text-[#00aa59]">{form.icon}</code>
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Use in React Native: MaterialCommunityIcons name="{form.icon}"
                    </p>
                  </div>
                )}
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

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Description *
                </label>
                <textarea
                  className={`${inp} resize-none`}
                  rows={3}
                  placeholder="e.g. Choose the correct answer from 4 options"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    className={`${inp} flex-1`}
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-[#00aa59] text-white rounded-xl text-sm font-semibold hover:bg-[#008f4a] transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: `${form.color}20`,
                        color: form.color,
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:opacity-70"
                      >
                        <MdClose className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
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
                <MdSave /> {saving ? 'Saving…' : editingType ? 'Save Changes' : 'Add Type'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#00aa59] px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <MdVisibility /> View Question Type
              </h2>
              <button
                onClick={() => setViewType(null)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <MdClose className="text-lg" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">
              {/* Icon & Name */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                  style={{ backgroundColor: `${viewType.color}20` }}
                >
                  {AVAILABLE_ICONS.find(ic => ic.name === viewType.icon)?.icon || <MdQuiz />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{viewType.name}</h3>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-500 mt-1 inline-block">
                    {viewType.icon}
                  </code>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <p className="text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  {viewType.description}
                </p>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: viewType.color }}
                  />
                  <code className="text-sm font-mono font-semibold text-gray-600">
                    {viewType.color}
                  </code>
                </div>
              </div>

              {/* Tags */}
              {viewType.tags && viewType.tags.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {viewType.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${viewType.color}20`,
                          color: viewType.color,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setViewType(null)}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewType(null);
                  handleOpenModal(viewType);
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

export default QuestionTypes;
