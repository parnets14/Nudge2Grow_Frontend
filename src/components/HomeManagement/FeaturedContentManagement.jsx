import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdStar, MdArrowBack, MdArrowForward, MdVisibility, MdSearch } from "react-icons/md";
import axios from "axios";
import { api } from "../../api";
import { MDI_ICONS } from "../../data/mdiIconNames";

const API_URL = "http://localhost:5000/api/featured-content";
const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00bf62] transition";

// Popular React Native Icons for Featured Content (Educational & Learning themed)
const RN_ICONS = [
  { name: "telescope", label: "Telescope" },
  { name: "rocket", label: "Rocket" },
  { name: "star", label: "Star" },
  { name: "lightbulb", label: "Lightbulb" },
  { name: "book-open-variant", label: "Book" },
  { name: "brain", label: "Brain" },
  { name: "school", label: "School" },
  { name: "flask", label: "Science Flask" },
  { name: "atom", label: "Atom" },
  { name: "earth", label: "Earth" },
  { name: "moon-waning-crescent", label: "Moon" },
  { name: "weather-sunny", label: "Sun" },
  { name: "leaf", label: "Nature" },
  { name: "flower", label: "Flower" },
  { name: "tree", label: "Tree" },
  { name: "water", label: "Water" },
  { name: "fire", label: "Fire" },
  { name: "puzzle", label: "Puzzle" },
  { name: "palette", label: "Arts" },
  { name: "music", label: "Music" },
  { name: "pencil", label: "Pencil" },
  { name: "calculator", label: "Math" },
  { name: "heart", label: "Heart" },
  { name: "hand-heart", label: "Kindness" },
  { name: "account-group", label: "Community" },
  { name: "basketball", label: "Sports" },
  { name: "run", label: "Activity" },
  { name: "bike", label: "Bike" },
  { name: "food-apple", label: "Healthy Food" },
  { name: "sprout", label: "Growth" },
  { name: "butterfly", label: "Butterfly" },
  { name: "paw", label: "Animals" },
  { name: "fish", label: "Fish" },
  { name: "bird", label: "Bird" },
  { name: "robot", label: "Technology" },
  { name: "code-tags", label: "Coding" },
  { name: "chart-bar", label: "Data" },
  { name: "map", label: "Geography" },
  { name: "compass", label: "Exploration" },
  { name: "magnify", label: "Discovery" },
];

// View Modal - Simple view of content details
const ViewModal = ({ item, onClose }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch detail data
    if (item && item._id) {
      axios.get(`http://localhost:5000/api/featured-content-detail/${item._id}`)
        .then(response => {
          if (response.data && !response.data.message) {
            setDetailData(response.data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [item]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-[#00bf62] px-5 py-3 flex justify-between items-center">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MdVisibility /> View Featured Content
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">
            <MdClose />
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Basic Information */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Basic Information</h3>
            
            {/* Title */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
              <p className="text-base font-semibold text-gray-800">{item.title}</p>
            </div>

            {/* Subtitle */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle</label>
              <p className="text-sm text-gray-700">{item.subtitle}</p>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
              <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
            </div>

            {/* Icon & Color */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Icon</label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.iconColor}20` }}
                  >
                    <span className="text-xl" style={{ color: item.iconColor }}>
                      {item.icon === 'telescope' && '🔭'}
                      {item.icon === 'rocket' && '🚀'}
                      {item.icon === 'star' && '⭐'}
                      {item.icon === 'lightbulb' && '💡'}
                      {item.icon === 'book-open-variant' && '📖'}
                      {item.icon === 'palette' && '🎨'}
                      {item.icon === 'music' && '🎵'}
                      {item.icon === 'flask' && '🧪'}
                      {item.icon === 'atom' && '⚛️'}
                      {item.icon === 'earth' && '🌍'}
                      {item.icon === 'weather-sunny' && '☀️'}
                      {item.icon === 'moon-waning-crescent' && '🌙'}
                      {item.icon === 'heart' && '❤️'}
                      {item.icon === 'puzzle' && '🧩'}
                      {item.icon === 'brain' && '🧠'}
                      {item.icon === 'school' && '🏫'}
                      {item.icon === 'pencil' && '✏️'}
                      {item.icon === 'calculator' && '🔢'}
                      {item.icon === 'basketball' && '🏀'}
                      {item.icon === 'flower' && '🌸'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{item.icon}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Icon Color</label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-lg border border-gray-200"
                    style={{ backgroundColor: item.iconColor }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.iconColor}</span>
                </div>
              </div>
            </div>

            {/* Grade */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Grade</label>
              <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                {item.grade}
              </span>
            </div>

            {/* Created/Updated */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Created</label>
                <p className="text-xs text-gray-600">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Updated</label>
                <p className="text-xs text-gray-600">{new Date(item.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Detail Content */}
          <div className="pt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Detail Content</h3>
            
            {loading ? (
              <p className="text-sm text-gray-500 text-center py-4">Loading detail content...</p>
            ) : detailData && detailData.sections && detailData.sections.length > 0 ? (
              <div className="space-y-4">
                {detailData.sections.map((section, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-800 mb-3">Section {index + 1}</h4>
                    
                    {section.title && (
                      <div className="mb-2">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Title</label>
                        <p className="text-sm text-gray-800">{section.title}</p>
                      </div>
                    )}
                    
                    {section.subtitle && (
                      <div className="mb-2">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Subtitle</label>
                        <p className="text-sm text-gray-700">{section.subtitle}</p>
                      </div>
                    )}
                    
                    {section.description && (
                      <div className="mb-2">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
                        <p className="text-sm text-gray-700">{section.description}</p>
                      </div>
                    )}
                    
                    {section.heading && (
                      <div className="mb-2">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Heading</label>
                        <p className="text-sm text-gray-800 font-semibold">{section.heading}</p>
                      </div>
                    )}
                    
                    {section.points && section.points.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Points</label>
                        <ul className="list-disc list-inside space-y-1">
                          {section.points.map((point, pointIndex) => (
                            point && <li key={pointIndex} className="text-sm text-gray-700">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No detail content available</p>
            )}
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-lg bg-[#00bf62] hover:bg-[#00a055] text-white text-sm font-bold transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ entry, onSave, onClose, saving, grades }) => {
  const [form, setForm] = useState(entry ? { ...entry } : {
    title: "",
    subtitle: "",
    description: "",
    icon: "telescope",
    iconColor: "#4A90E2",
    grade: "All Grades",
    isPopular: false,
    isActive: true,
    buttonText: "Start This Nudge",
    buttonGradient: ["#00CED1", "#45a578", "#90EE90"],
    order: 0,
    // Detail sections - array of sections
    detailSections: [
      {
        title: "",
        subtitle: "",
        description: "",
        heading: "",
        points: ["", "", "", "", ""]
      }
    ]
  });

  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  
  // Detail section management
  const addDetailSection = () => {
    setForm({
      ...form,
      detailSections: [
        ...form.detailSections,
        {
          title: "",
          subtitle: "",
          description: "",
          heading: "",
          points: ["", "", "", "", ""]
        }
      ]
    });
  };

  const removeDetailSection = (sectionIndex) => {
    const updated = form.detailSections.filter((_, i) => i !== sectionIndex);
    setForm({ ...form, detailSections: updated });
  };

  const updateDetailSection = (sectionIndex, field, value) => {
    const updated = [...form.detailSections];
    updated[sectionIndex] = { ...updated[sectionIndex], [field]: value };
    setForm({ ...form, detailSections: updated });
  };

  const updatePoint = (sectionIndex, pointIndex, value) => {
    const updated = [...form.detailSections];
    const updatedPoints = [...updated[sectionIndex].points];
    updatedPoints[pointIndex] = value;
    updated[sectionIndex] = { ...updated[sectionIndex], points: updatedPoints };
    setForm({ ...form, detailSections: updated });
  };

  const addPoint = (sectionIndex) => {
    const updated = [...form.detailSections];
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      points: [...updated[sectionIndex].points, '']
    };
    setForm({ ...form, detailSections: updated });
  };

  const removePoint = (sectionIndex, pointIndex) => {
    const updated = [...form.detailSections];
    const updatedPoints = updated[sectionIndex].points.filter((_, i) => i !== pointIndex);
    updated[sectionIndex] = { ...updated[sectionIndex], points: updatedPoints };
    setForm({ ...form, detailSections: updated });
  };

  const valid = form.title.trim() !== "" && form.subtitle.trim() !== "" && form.description.trim() !== "";

  // Icon search results
  const searchResults = form._iconSearch
    ? MDI_ICONS.filter(n => n.includes(form._iconSearch.toLowerCase())).slice(0, 60)
    : RN_ICONS.map(ic => ic.name);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="bg-[#00bf62] px-5 py-3 flex justify-between items-center">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MdStar /> {entry ? "Edit Featured Content" : "Add Featured Content"}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">
            <MdClose />
          </button>
        </div>
        
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Basic Info Section */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Basic Information</h3>
            
            {/* Row 1: Title and Subtitle */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input className={inp} placeholder="e.g. The Moon's Secret Phases" value={form.title} onChange={f("title")} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle <span className="text-red-500">*</span></label>
                <input className={inp} placeholder="e.g. Perfect for tonight's bedtime routine" value={form.subtitle} onChange={f("subtitle")} />
              </div>
            </div>

            {/* Row 2: Description */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea rows={3} className={`${inp} resize-none`} placeholder="Enter detailed description..." value={form.description} onChange={f("description")} />
            </div>

            {/* Row 3: Icon, Icon Color, Grade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Icon Color</label>
                <input type="color" className="w-full h-10 border border-gray-200 rounded-lg cursor-pointer" value={form.iconColor} onChange={f("iconColor")} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Grade</label>
                <select className={inp} value={form.grade} onChange={f("grade")}>
                  <option value="All Grades">All Grades</option>
                  {grades.map(grade => (
                    <option key={grade._id} value={grade.title}>{grade.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* React Native Icon Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                React Native Icon <span className="text-gray-400 font-normal">(MaterialCommunityIcons — {MDI_ICONS.length.toLocaleString()} icons)</span>
              </label>
              <div className="relative mb-2">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#00bf62] transition"
                  placeholder="Search icons... e.g. tennis, fire, soccer, account"
                  value={form._iconSearch || ""}
                  onChange={e => setForm({ ...form, _iconSearch: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-5 gap-1.5 max-h-52 overflow-y-auto pr-1 border border-gray-200 rounded-lg p-2">
                {searchResults.map(name => (
                  <button key={name} type="button"
                    onClick={() => setForm({ ...form, icon: name })}
                    title={name}
                    className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border-2 transition ${form.icon === name ? "border-[#00bf62] bg-green-50 text-[#00bf62]" : "border-gray-100 bg-gray-50 text-gray-400 hover:border-[#00bf62]"}`}>
                    <i className={`mdi mdi-${name} text-xl`} />
                    <span className="text-[8px] font-medium text-center leading-tight truncate w-full">{name}</span>
                  </button>
                ))}
                {form._iconSearch && searchResults.length === 0 && (
                  <div className="col-span-5 text-center py-4 text-xs text-gray-400">No icons found.</div>
                )}
              </div>

              {/* Manual input fallback */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  className="flex-1 border border-dashed border-gray-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#00bf62] transition text-gray-600"
                  placeholder="Or type icon name directly: e.g. tennis, soccer-field..."
                  value={form.icon || ""}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                />
                {form.icon && <i className={`mdi mdi-${form.icon} text-xl text-[#00bf62] shrink-0`} />}
              </div>

              {form.icon && (
                <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <i className={`mdi mdi-${form.icon} text-xl text-[#00bf62]`} />
                  <code className="text-xs font-mono text-[#00a055] bg-green-100 px-2 py-0.5 rounded">{form.icon}</code>
                  <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noreferrer"
                    className="ml-auto text-[10px] text-[#00bf62] underline">Browse all</a>
                  <button type="button" onClick={() => setForm({ ...form, icon: "" })}
                    className="text-gray-400 hover:text-red-400 transition">
                    <MdClose className="text-sm" />
                  </button>
                </div>
              )}
            </div>

            {/* Row 4: Status Toggle */}
            <div className="mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-xs font-bold text-gray-700">Status</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.isActive ? 'bg-[#00bf62]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-xs font-semibold ${form.isActive ? 'text-[#00bf62]' : 'text-gray-500'}`}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>
          </div>

          {/* Detail Content Section */}
          <div className="pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-700 uppercase">Detail Content (Shown in Detail Screen)</h3>
              <button
                type="button"
                onClick={addDetailSection}
                className="text-xs px-4 py-2 rounded-lg bg-[#00bf62] text-white hover:bg-[#00a055] transition font-bold flex items-center gap-1"
              >
                <MdAdd /> Add Detail Section
              </button>
            </div>
            
            {form.detailSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-gray-800">Detail Section {sectionIndex + 1}</h4>
                  {form.detailSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDetailSection(sectionIndex)}
                      className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-semibold flex items-center gap-1"
                    >
                      <MdDelete /> Remove Section
                    </button>
                  )}
                </div>

                {/* Detail Title */}
                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Detail Title</label>
                  <input
                    className={inp}
                    placeholder="e.g. Understanding Moon Phases"
                    value={section.title}
                    onChange={(e) => updateDetailSection(sectionIndex, 'title', e.target.value)}
                  />
                </div>

                {/* Detail Subtitle */}
                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Detail Subtitle</label>
                  <input
                    className={inp}
                    placeholder="e.g. A simple guide for curious minds"
                    value={section.subtitle}
                    onChange={(e) => updateDetailSection(sectionIndex, 'subtitle', e.target.value)}
                  />
                </div>

                {/* Detail Description */}
                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Detail Description</label>
                  <textarea
                    rows={3}
                    className={`${inp} resize-none`}
                    placeholder="Enter detailed content description..."
                    value={section.description}
                    onChange={(e) => updateDetailSection(sectionIndex, 'description', e.target.value)}
                  />
                </div>

                {/* Detail Heading */}
                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Heading (Section Title)</label>
                  <input
                    className={inp}
                    placeholder="e.g. What You'll Learn"
                    value={section.heading}
                    onChange={(e) => updateDetailSection(sectionIndex, 'heading', e.target.value)}
                  />
                </div>

                {/* Detail Points */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-gray-700">Points (Bullet List)</label>
                    <button
                      type="button"
                      onClick={() => addPoint(sectionIndex)}
                      className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      + Add Point
                    </button>
                  </div>
                  {section.points.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex gap-2 mb-2">
                      <input
                        className={inp + " flex-1"}
                        placeholder={`Point ${pointIndex + 1}`}
                        value={point}
                        onChange={(e) => updatePoint(sectionIndex, pointIndex, e.target.value)}
                      />
                      {section.points.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePoint(sectionIndex, pointIndex)}
                          className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <MdDelete />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
            Cancel
          </button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-5 py-2 rounded-lg text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#00bf62] hover:bg-[#00a055]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add Content"}
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedContentManagement = () => {
  const [items, setItems] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const load = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setItems(response.data || []);
    } catch (error) {
      console.error("Error loading featured content:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async () => {
    try {
      const res = await api.grades.getAll();
      setGrades(res.data || res || []);
    } catch (error) {
      console.error("Error loading grades:", error);
    }
  };

  useEffect(() => { 
    load();
    loadGrades();
  }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      let savedItem;
      
      // Strip UI-only fields before sending to backend
      const { _iconSearch, ...rest } = form;
      
      // Save featured content
      if (editItem) {
        const response = await axios.put(`${API_URL}/${editItem._id}`, rest);
        savedItem = response.data;
      } else {
        const response = await axios.post(API_URL, rest);
        savedItem = response.data;
      }

      // Save detail content if any detail sections have content
      const hasDetailContent = rest.detailSections && rest.detailSections.some(section => 
        section.title || section.subtitle || section.description || section.heading || 
        (section.points && section.points.some(p => p.trim()))
      );
      
      if (hasDetailContent && savedItem._id) {
        // Filter out empty sections and clean up points
        const cleanedSections = rest.detailSections
          .filter(section => 
            section.title || section.subtitle || section.description || section.heading || 
            (section.points && section.points.some(p => p.trim()))
          )
          .map(section => ({
            title: section.title || '',
            subtitle: section.subtitle || '',
            description: section.description || '',
            heading: section.heading || '',
            points: section.points ? section.points.filter(p => p.trim()) : []
          }));
        
        const detailData = {
          sections: cleanedSections
        };
        
        await axios.post(`http://localhost:5000/api/featured-content-detail/${savedItem._id}`, detailData);
      }

      setModalOpen(false);
      setEditItem(null);
      await load();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this featured content?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      // Also delete associated detail if exists
      try {
        await axios.delete(`http://localhost:5000/api/featured-content-detail/${id}`);
      } catch (err) {
        // Detail might not exist, ignore error
      }
      await load();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEdit = async (item) => {
    // Load detail data if exists
    try {
      const response = await axios.get(`http://localhost:5000/api/featured-content-detail/${item._id}`);
      if (response.data && !response.data.message && response.data.sections && response.data.sections.length > 0) {
        setEditItem({
          ...item,
          detailSections: response.data.sections.map(section => ({
            title: section.title || '',
            subtitle: section.subtitle || '',
            description: section.description || '',
            heading: section.heading || '',
            points: section.points && section.points.length > 0 ? section.points : ['', '', '', '', '']
          }))
        });
      } else {
        // No detail data, set defaults
        setEditItem({
          ...item,
          detailSections: [
            {
              title: '',
              subtitle: '',
              description: '',
              heading: '',
              points: ['', '', '', '', '']
            }
          ]
        });
      }
    } catch (error) {
      // No detail exists, just edit basic info with default detail section
      setEditItem({
        ...item,
        detailSections: [
          {
            title: '',
            subtitle: '',
            description: '',
            heading: '',
            points: ['', '', '', '', '']
          }
        ]
      });
    }
    setModalOpen(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/${id}/toggle-active`, { isActive: !currentStatus });
      await load();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status.");
    }
  };

  // Filter items
  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <MdStar className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Featured Content</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage featured content shown on the home screen — {items.length} items</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="bg-[#00bf62] hover:bg-[#00a055] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#00bf62]/30 transition flex items-center gap-2">
          <MdAdd className="text-lg" /> Add Featured Content
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title, subtitle, or description..."
          className={inp}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {searchTerm ? "No results found" : "No featured content yet. Click 'Add Featured Content' to get started."}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Subtitle</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Grade</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-500">{item.subtitle}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                        {item.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(item._id, item.isActive)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.isActive ? 'bg-[#00bf62]' : 'bg-gray-300'
                          }`}
                          title={item.isActive ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-semibold ${item.isActive ? 'text-[#00bf62]' : 'text-gray-500'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setViewItem(item); setViewModalOpen(true); }}
                          className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition"
                          title="View Preview"
                        >
                          <MdVisibility />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <MdArrowBack /> Previous
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next <MdArrowForward />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modalOpen && <Modal entry={editItem} onSave={handleSave} onClose={() => { setModalOpen(false); setEditItem(null); }} saving={saving} grades={grades} />}
      
      {/* View Modal */}
      {viewModalOpen && viewItem && <ViewModal item={viewItem} onClose={() => { setViewModalOpen(false); setViewItem(null); }} />}
    </div>
  );
};

export default FeaturedContentManagement;
