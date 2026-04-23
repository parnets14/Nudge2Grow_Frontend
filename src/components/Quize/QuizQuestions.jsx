import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdVisibility, MdFileUpload, MdDownload, MdQuiz, MdArrowBack, MdArrowForward } from "react-icons/md";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00bf62] transition";

const QuizQuestions = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    level: 'Basic',
    topic: '',
    questionType: '',
    question: '',
    answer: '',
    options: [],
    marks: 1,
    difficulty: 'Medium',
    tags: '',
    displayOrder: 0,
    matchingPairs: [
      { columnA: '', columnB: '' },
      { columnA: '', columnB: '' },
      { columnA: '', columnB: '' },
      { columnA: '', columnB: '' }
    ]
  });

  const [selectedQuestionTypeName, setSelectedQuestionTypeName] = useState('');

  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [importReference, setImportReference] = useState(null);

  useEffect(() => {
    fetchQuizQuestions();
    fetchGrades();
    fetchSubjects();
    fetchQuestionTypes();
  }, []);

  useEffect(() => {
    if (formData.subject) {
      fetchTopicsBySubject(formData.subject);
    } else {
      setFilteredTopics([]);
    }
  }, [formData.subject, formData.level, formData.grade]);

  const fetchQuizQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz-questions`);
      setQuizQuestions(response.data);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/grade`);
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/learning-subjects/subjects`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTopicsBySubject = async (subjectId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/topics`);
      const selectedGrade = grades.find(g => g._id === formData.grade);
      const selectedGradeTitle = selectedGrade?.title || selectedGrade?.name;
      
      const filtered = response.data.filter(topic => {
        const topicSubjectId = topic.subjectId?._id || topic.subjectId;
        const matchesSubject = topicSubjectId === subjectId;
        const topicGrade = topic.grade;
        const matchesGrade = formData.grade ? topicGrade === selectedGradeTitle : true;
        const topicLevel = topic.level?.toLowerCase();
        const selectedLevel = formData.level?.toLowerCase();
        const matchesLevel = formData.level ? topicLevel === selectedLevel : true;
        
        return matchesSubject && matchesGrade && matchesLevel;
      });
      
      setFilteredTopics(filtered);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setFilteredTopics([]);
    }
  };

  const fetchQuestionTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/question-types`);
      setQuestionTypes(response.data.filter(qt => qt.isActive));
    } catch (error) {
      console.error('Error fetching question types:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle question type change
    if (name === 'questionType') {
      const selectedType = questionTypes.find(qt => qt._id === value);
      const typeName = selectedType?.name?.toLowerCase() || '';
      setSelectedQuestionTypeName(typeName);
      
      // Set default options based on question type
      let defaultOptions = [];
      let defaultMatchingPairs = [
        { columnA: '', columnB: '' },
        { columnA: '', columnB: '' },
        { columnA: '', columnB: '' },
        { columnA: '', columnB: '' }
      ];
      
      if (typeName.includes('mcq') || typeName.includes('multiple choice')) {
        defaultOptions = ['', '', '', ''];
      } else if (typeName.includes('true') || typeName.includes('false')) {
        defaultOptions = ['True', 'False'];
      } else if (typeName.includes('match')) {
        // Keep default matching pairs
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        options: defaultOptions,
        matchingPairs: defaultMatchingPairs
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'grade' || name === 'subject' || name === 'level') {
      setFormData(prev => ({ ...prev, [name]: value, topic: '' }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleMatchingPairChange = (index, column, value) => {
    const newPairs = [...formData.matchingPairs];
    newPairs[index][column] = value;
    setFormData(prev => ({ ...prev, matchingPairs: newPairs }));
  };

  const addMatchingPair = () => {
    setFormData(prev => ({
      ...prev,
      matchingPairs: [...prev.matchingPairs, { columnA: '', columnB: '' }]
    }));
  };

  const removeMatchingPair = (index) => {
    const newPairs = formData.matchingPairs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, matchingPairs: newPairs }));
  };

  const addOption = () => {
    setFormData(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare options based on question type
    let finalOptions = formData.options.filter(opt => opt.trim() !== '');
    
    // For True/False, ensure options are set
    if (selectedQuestionTypeName.includes('true') || selectedQuestionTypeName.includes('false')) {
      finalOptions = ['True', 'False'];
    }
    
    // For Match the Following, convert matching pairs to options format
    if (selectedQuestionTypeName.includes('match')) {
      const validPairs = formData.matchingPairs.filter(
        pair => pair.columnA.trim() !== '' && pair.columnB.trim() !== ''
      );
      
      // Store as JSON string in options or create structured format
      finalOptions = validPairs.map((pair, index) => 
        `${index + 1}. ${pair.columnA} → ${pair.columnB}`
      );
    }

    const data = {
      grade: formData.grade,
      subject: formData.subject,
      level: formData.level,
      topic: formData.topic,
      questionType: formData.questionType,
      question: formData.question,
      answer: formData.answer,
      options: finalOptions,
      marks: formData.marks,
      difficulty: formData.difficulty,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      displayOrder: formData.displayOrder
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/quiz-questions/${editingId}`, data);
      } else {
        await axios.post(`${API_BASE_URL}/quiz-questions`, data);
      }
      
      fetchQuizQuestions();
      resetForm();
      alert(editingId ? 'Question updated successfully!' : 'Question added successfully!');
    } catch (error) {
      console.error('Error saving quiz question:', error);
      alert(error.response?.data?.message || 'Error saving quiz question');
    }
  };

  const handleEdit = (quizQuestion) => {
    setEditingId(quizQuestion._id);
    
    const typeName = quizQuestion.questionType?.name?.toLowerCase() || '';
    setSelectedQuestionTypeName(typeName);
    
    // Parse matching pairs if it's a matching question
    let matchingPairs = [
      { columnA: '', columnB: '' },
      { columnA: '', columnB: '' },
      { columnA: '', columnB: '' },
      { columnA: '', columnB: '' }
    ];
    
    if (typeName.includes('match') && quizQuestion.options && quizQuestion.options.length > 0) {
      matchingPairs = quizQuestion.options.map(opt => {
        const parts = opt.split(' → ');
        if (parts.length === 2) {
          return {
            columnA: parts[0].replace(/^\d+\.\s*/, '').trim(),
            columnB: parts[1].trim()
          };
        }
        return { columnA: '', columnB: '' };
      });
    }
    
    setFormData({
      grade: quizQuestion.grade?._id || '',
      subject: quizQuestion.subject?._id || '',
      level: quizQuestion.level || 'Basic',
      topic: quizQuestion.topic?._id || '',
      questionType: quizQuestion.questionType?._id || '',
      question: quizQuestion.question || '',
      answer: quizQuestion.answer || '',
      options: quizQuestion.options || [],
      marks: quizQuestion.marks || 1,
      difficulty: quizQuestion.difficulty || 'Medium',
      tags: quizQuestion.tags ? quizQuestion.tags.join(', ') : '',
      displayOrder: quizQuestion.displayOrder || 0,
      matchingPairs: matchingPairs
    });
    
    if (quizQuestion.subject?._id) {
      fetchTopicsBySubject(quizQuestion.subject._id);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz question?')) {
      try {
        await axios.delete(`${API_BASE_URL}/quiz-questions/${id}`);
        fetchQuizQuestions();
        alert('Question deleted successfully!');
      } catch (error) {
        console.error('Error deleting quiz question:', error);
        alert('Error deleting quiz question');
      }
    }
  };

  const handleView = (quizQuestion) => {
    setViewingQuestion(quizQuestion);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setViewingQuestion(null);
    setShowViewModal(false);
  };

  const handleImportClick = async () => {
    setShowImportModal(true);
    setImportResults(null);
    setImportFile(null);
    
    // Fetch available names for reference
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz-questions/import-reference`);
      setImportReference(response.data);
    } catch (error) {
      console.error('Error fetching import reference:', error);
    }
  };

  const handleImportFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    
    if (!importFile) {
      alert('Please select an Excel file');
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append('excelFile', importFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/quiz-questions/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setImportResults(response.data);
      fetchQuizQuestions();
      
      if (response.data.errorCount === 0) {
        setTimeout(() => {
          setShowImportModal(false);
          setImportFile(null);
          setImportResults(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error importing quiz questions:', error);
      alert(error.response?.data?.message || 'Error importing quiz questions');
    } finally {
      setImporting(false);
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportFile(null);
    setImportResults(null);
  };

  const downloadTemplate = async () => {
    try {
      // Fetch available names from the API
      const response = await axios.get(`${API_BASE_URL}/quiz-questions/import-reference`);
      const reference = response.data;
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Sample data with first row as example
      const templateData = [
        {
          grade: reference.grades[0] || 'Grade 1',
          subject: reference.subjects[0] || 'Math',
          level: 'Basic',
          topic: reference.topics[0] || 'Addition',
          questionType: reference.questionTypes[0] || 'MCQ',
          question: 'What is 2 + 2?',
          answer: 'C',
          options: '2,3,4,5',
          marks: 1,
          difficulty: 'Easy',
          tags: 'addition,math',
          displayOrder: 0
        },
        {
          grade: '',
          subject: '',
          level: '',
          topic: '',
          questionType: '',
          question: '',
          answer: '',
          options: '',
          marks: '',
          difficulty: '',
          tags: '',
          displayOrder: ''
        },
        {
          grade: '',
          subject: '',
          level: '',
          topic: '',
          questionType: '',
          question: '',
          answer: '',
          options: '',
          marks: '',
          difficulty: '',
          tags: '',
          displayOrder: ''
        }
      ];
      
      // Create main sheet
      const ws = XLSX.utils.json_to_sheet(templateData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 15 }, // grade
        { wch: 20 }, // subject
        { wch: 15 }, // level
        { wch: 25 }, // topic
        { wch: 25 }, // questionType
        { wch: 50 }, // question
        { wch: 40 }, // answer
        { wch: 60 }, // options
        { wch: 8 },  // marks
        { wch: 12 }, // difficulty
        { wch: 30 }, // tags
        { wch: 12 }  // displayOrder
      ];
      
      // Add data validation (dropdowns) - Note: This is limited in browser-generated Excel
      // For full dropdown support, users should open in Excel and it will work
      ws['!dataValidation'] = {
        // Grade dropdown for rows 2-100
        A2: {
          type: 'list',
          formula1: `"${reference.grades.join(',')}"`,
          showDropDown: true
        },
        // Subject dropdown
        B2: {
          type: 'list',
          formula1: `"${reference.subjects.join(',')}"`,
          showDropDown: true
        },
        // Level dropdown
        C2: {
          type: 'list',
          formula1: '"Basic,Intermediate,Advanced"',
          showDropDown: true
        },
        // Topic dropdown (limited to first 50 due to Excel formula length limit)
        D2: {
          type: 'list',
          formula1: `"${reference.topics.slice(0, 50).join(',')}"`,
          showDropDown: true
        },
        // Question Type dropdown
        E2: {
          type: 'list',
          formula1: `"${reference.questionTypes.join(',')}"`,
          showDropDown: true
        },
        // Difficulty dropdown
        J2: {
          type: 'list',
          formula1: '"Easy,Medium,Hard"',
          showDropDown: true
        }
      };
      
      XLSX.utils.book_append_sheet(wb, ws, 'Quiz Questions');
      
      // Create a reference sheet with all available values
      const referenceData = [
        { Category: 'Grades', Values: reference.grades.join(', ') },
        { Category: 'Subjects', Values: reference.subjects.join(', ') },
        { Category: 'Topics', Values: reference.topics.join(', ') },
        { Category: 'Question Types', Values: reference.questionTypes.join(', ') },
        { Category: 'Levels', Values: 'Basic, Intermediate, Advanced' },
        { Category: 'Difficulties', Values: 'Easy, Medium, Hard' },
        { Category: '', Values: '' },
        { Category: 'Options Format Examples', Values: '' },
        { Category: 'MCQ', Values: 'Option A,Option B,Option C,Option D' },
        { Category: 'True/False', Values: 'True,False' },
        { Category: 'Match the Following', Values: 'France → Paris,Japan → Tokyo,India → New Delhi' },
        { Category: 'Fill in Blanks', Values: '(leave empty)' }
      ];
      
      const refSheet = XLSX.utils.json_to_sheet(referenceData);
      refSheet['!cols'] = [
        { wch: 25 },
        { wch: 100 }
      ];
      XLSX.utils.book_append_sheet(wb, refSheet, 'Reference');
      
      // Download the file
      XLSX.writeFile(wb, 'quiz-questions-template-with-dropdowns.xlsx');
      
      alert('Template downloaded! Open in Microsoft Excel or Google Sheets to see dropdown menus.');
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Error downloading template. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      grade: '',
      subject: '',
      level: 'Basic',
      topic: '',
      questionType: '',
      question: '',
      answer: '',
      options: [],
      marks: 1,
      difficulty: 'Medium',
      tags: '',
      displayOrder: 0,
      matchingPairs: [
        { columnA: '', columnB: '' },
        { columnA: '', columnB: '' },
        { columnA: '', columnB: '' },
        { columnA: '', columnB: '' }
      ]
    });
    setSelectedQuestionTypeName('');
    setEditingId(null);
    setShowForm(false);
    setFilteredTopics([]);
  };

  const filteredQuestions = quizQuestions.filter(q =>
    q.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.grade?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.grade?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.topic?.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.topic?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.questionType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00bf62] flex items-center justify-center shadow shrink-0">
            <MdQuiz className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quiz Questions Bank</h1>
            <p className="text-gray-500 text-xs mt-0.5">Add and manage individual quiz questions for quiz generation</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleImportClick}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition disabled:bg-gray-400"
          >
            <MdFileUpload className="text-lg" /> Import Excel
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
            className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition disabled:bg-gray-400"
          >
            <MdAdd className="text-lg" /> {showForm ? 'Cancel' : 'Add Question'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {!showForm && (
        <div className="mb-4 relative">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search by question, answer, grade, subject, topic, type, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00bf62] transition text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <MdClose className="text-xl" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-xs text-gray-500 mt-1.5">Found {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
            {filteredQuestions.length > itemsPerPage && ` (showing ${startIndex + 1}-${Math.min(endIndex, filteredQuestions.length)})`}</p>
          )}
        </div>
      )}

      {/* Form */}
      {showForm && !loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-[#00bf62] flex items-center justify-center">
              <MdQuiz className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Quiz Question' : 'Add New Quiz Question'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Grade */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Grade <span className="text-red-500">*</span>
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                  className={inp}
                >
                  <option value="">Select Grade</option>
                  {grades.map(grade => (
                    <option key={grade._id} value={grade._id}>
                      {grade.title || grade.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={inp}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className={inp}
                >
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Topic <span className="text-red-500">*</span>
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.subject}
                  className={`${inp} disabled:bg-gray-100`}
                >
                  <option value="">Select Topic</option>
                  {filteredTopics.map(topic => (
                    <option key={topic._id} value={topic._id}>
                      {topic.title || topic.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Question Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleInputChange}
                  required
                  className={inp}
                >
                  <option value="">Select Question Type</option>
                  {questionTypes.map(qt => (
                    <option key={qt._id} value={qt._id}>
                      {qt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className={inp}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Marks */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Marks
                </label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleInputChange}
                  min="1"
                  className={inp}
                />
              </div>

              {/* Display Order */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div> */}
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                required
                rows="3"
                placeholder="Enter the question text..."
                className={`${inp} resize-none`}
              />
            </div>

            {/* Answer Text */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                required
                rows="2"
                placeholder="Enter the correct answer..."
                className={`${inp} resize-none`}
              />
            </div>

            {/* Options - Dynamic based on Question Type */}
            {selectedQuestionTypeName && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {selectedQuestionTypeName.includes('mcq') || selectedQuestionTypeName.includes('multiple choice') 
                    ? 'Options (Multiple Choice) *' 
                    : selectedQuestionTypeName.includes('true') || selectedQuestionTypeName.includes('false')
                    ? 'Options (True/False)'
                    : selectedQuestionTypeName.includes('match')
                    ? 'Matching Pairs *'
                    : 'Options (Optional)'}
                </label>
                
                {/* Match the Following - Two Column Layout */}
                {selectedQuestionTypeName.includes('match') && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div className="font-semibold text-sm text-gray-700 bg-blue-50 px-3 py-2 rounded">
                        Column A
                      </div>
                      <div className="font-semibold text-sm text-gray-700 bg-green-50 px-3 py-2 rounded">
                        Column B
                      </div>
                    </div>
                    
                    {formData.matchingPairs.map((pair, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg font-semibold text-sm min-w-[40px] text-center">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={pair.columnA}
                          onChange={(e) => handleMatchingPairChange(index, 'columnA', e.target.value)}
                          placeholder="Item in Column A"
                          required
                          className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                        />
                        <span className="text-gray-400 font-bold">→</span>
                        <input
                          type="text"
                          value={pair.columnB}
                          onChange={(e) => handleMatchingPairChange(index, 'columnB', e.target.value)}
                          placeholder="Matching item in Column B"
                          required
                          className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50"
                        />
                        {formData.matchingPairs.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeMatchingPair(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {formData.matchingPairs.length < 10 && (
                      <button
                        type="button"
                        onClick={addMatchingPair}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        + Add Matching Pair
                      </button>
                    )}
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        ℹ️ <strong>Instructions:</strong> Add items in Column A and their corresponding matches in Column B. 
                        In the Answer field above, enter the correct matching sequence (e.g., "1-B, 2-A, 3-D, 4-C").
                      </p>
                    </div>
                  </div>
                )}
                
                {/* True/False - Fixed Options */}
                {(selectedQuestionTypeName.includes('true') || selectedQuestionTypeName.includes('false')) && 
                 !selectedQuestionTypeName.includes('match') && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        True
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        False
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      True/False options are automatically set. Enter the correct answer (True or False) in the Answer field above.
                    </p>
                  </div>
                )}

                {/* MCQ - Editable Options */}
                {(selectedQuestionTypeName.includes('mcq') || selectedQuestionTypeName.includes('multiple choice')) && 
                 !selectedQuestionTypeName.includes('match') && (
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg font-semibold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          required
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {formData.options.length < 6 && (
                      <button
                        type="button"
                        onClick={addOption}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        + Add Option
                      </button>
                    )}
                    <p className="text-xs text-gray-500">
                      Add 2-6 options. Enter the correct option letter (A, B, C, D) in the Answer field above.
                    </p>
                  </div>
                )}

                {/* Fill in the Blanks / Short Answer - No Options */}
                {(selectedQuestionTypeName.includes('fill') || 
                  selectedQuestionTypeName.includes('blank') || 
                  selectedQuestionTypeName.includes('short') ||
                  selectedQuestionTypeName.includes('descriptive') ||
                  selectedQuestionTypeName.includes('long')) && 
                 !selectedQuestionTypeName.includes('match') && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      ℹ️ This question type doesn't require options. Students will provide their own answer.
                      Enter the expected/correct answer in the Answer field above.
                    </p>
                  </div>
                )}

                {/* Other Question Types - Optional Options */}
                {!(selectedQuestionTypeName.includes('mcq') || 
                   selectedQuestionTypeName.includes('multiple choice') ||
                   selectedQuestionTypeName.includes('true') || 
                   selectedQuestionTypeName.includes('false') ||
                   selectedQuestionTypeName.includes('fill') || 
                   selectedQuestionTypeName.includes('blank') || 
                   selectedQuestionTypeName.includes('short') ||
                   selectedQuestionTypeName.includes('descriptive') ||
                   selectedQuestionTypeName.includes('long') ||
                   selectedQuestionTypeName.includes('match')) && (
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addOption}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      + Add Option
                    </button>
                    <p className="text-xs text-gray-500">
                      Options are optional for this question type.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., addition, basic-math, arithmetic"
                className={inp}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow transition"
              >
                <MdSave /> {editingId ? 'Update Question' : 'Add Question'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00bf62] text-white">
              <th className="px-5 py-3.5 text-left font-semibold w-10">No</th>
              <th className="px-5 py-3.5 text-left font-semibold">Grade</th>
              <th className="px-5 py-3.5 text-left font-semibold">Subject</th>
              <th className="px-5 py-3.5 text-left font-semibold">Level</th>
              <th className="px-5 py-3.5 text-left font-semibold">Topic</th>
              <th className="px-5 py-3.5 text-left font-semibold">Type</th>
              <th className="px-5 py-3.5 text-left font-semibold">Question</th>
              <th className="px-5 py-3.5 text-left font-semibold w-16">Marks</th>
              <th className="px-5 py-3.5 text-center font-semibold w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-16 text-gray-400">
                  <MdQuiz className="text-5xl text-gray-200 mx-auto mb-2" />
                  {searchTerm ? `No questions found matching "${searchTerm}"` : "No quiz questions found. Add your first one!"}
                </td>
              </tr>
            ) : (
              paginatedQuestions.map((q, i) => (
                <tr key={q._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-5 py-3.5 text-gray-400 font-medium">{startIndex + i + 1}</td>
                  <td className="px-5 py-3.5 text-gray-800 text-xs">
                    {q.grade?.title || q.grade?.name || 'N/A'}
                  </td>
                  <td className="px-5 py-3.5 text-gray-800 text-xs">
                    {q.subject?.name || 'N/A'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      q.level === 'Basic' ? 'bg-[#00bf62]/10 text-[#00bf62]' :
                      q.level === 'Intermediate' ? 'bg-amber-100 text-amber-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {q.level}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-800 text-xs max-w-[150px]">
                    <p className="truncate">{q.topic?.topic || q.topic?.title || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">
                    {q.questionType?.name || 'N/A'}
                  </td>
                  <td className="px-5 py-3.5 text-gray-800 text-xs max-w-xs">
                    <p className="truncate font-medium">{q.question}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-800 font-semibold text-center">
                    {q.marks}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(q)}
                        className="text-[#00bf62] hover:text-[#00a055] transition"
                        title="View"
                      >
                        <MdVisibility className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleEdit(q)}
                        className="text-amber-400 hover:text-amber-500 transition"
                        title="Edit"
                      >
                        <MdEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="text-red-500 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredQuestions.length > itemsPerPage && (
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(endIndex, filteredQuestions.length)}</span> of <span className="font-semibold">{filteredQuestions.length}</span> questions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdArrowBack /> Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition ${
                    currentPage === page
                      ? 'bg-[#00bf62] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <MdArrowForward />
            </button>
          </div>
        </div>
      )}
      {/* View Modal */}
      {showViewModal && viewingQuestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#00bf62] px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdVisibility /> Quiz Question Details
              </h2>
              <button
                onClick={closeViewModal}
                className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Grade</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {viewingQuestion.grade?.title || viewingQuestion.grade?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Subject</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {viewingQuestion.subject?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Level</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      viewingQuestion.level === 'Basic' ? 'bg-[#00bf62]/10 text-[#00bf62]' :
                      viewingQuestion.level === 'Intermediate' ? 'bg-amber-100 text-amber-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {viewingQuestion.level}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Topic</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {viewingQuestion.topic?.topic || viewingQuestion.topic?.title || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Question Type</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {viewingQuestion.questionType?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Difficulty</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {viewingQuestion.difficulty}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Marks</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg font-semibold">
                    {viewingQuestion.marks}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Display Order</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {viewingQuestion.displayOrder}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Question</label>
                  <p className="text-sm text-gray-900 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                    {viewingQuestion.question}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Answer</label>
                  <p className="text-sm text-gray-900 bg-[#00bf62]/10 px-4 py-3 rounded-lg border border-[#00bf62]/20 font-medium">
                    {viewingQuestion.answer}
                  </p>
                </div>

                {viewingQuestion.options && viewingQuestion.options.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                      {viewingQuestion.questionType?.name?.toLowerCase().includes('match') 
                        ? 'Matching Pairs' 
                        : 'Options'}
                    </label>
                    
                    {viewingQuestion.questionType?.name?.toLowerCase().includes('match') ? (
                      // Display as matching pairs
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div className="text-xs font-bold text-gray-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                            Column A
                          </div>
                          <div className="text-xs font-bold text-gray-600 bg-[#00bf62]/10 px-3 py-1.5 rounded-lg">
                            Column B
                          </div>
                        </div>
                        {viewingQuestion.options.map((option, index) => {
                          const parts = option.split(' → ');
                          const columnA = parts[0]?.replace(/^\d+\.\s*/, '').trim() || '';
                          const columnB = parts[1]?.trim() || '';
                          
                          return (
                            <div key={index} className="grid grid-cols-2 gap-4">
                              <div className="text-sm text-gray-900 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                                {index + 1}. {columnA}
                              </div>
                              <div className="text-sm text-gray-900 bg-[#00bf62]/10 px-4 py-2 rounded-lg border border-[#00bf62]/20">
                                {columnB}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // Display as regular options
                      <ul className="space-y-2">
                        {viewingQuestion.options.map((option, index) => (
                          <li key={index} className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                            <span className="font-bold text-[#00bf62]">{String.fromCharCode(65 + index)}.</span> {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {viewingQuestion.tags && viewingQuestion.tags.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {viewingQuestion.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button
                onClick={closeViewModal}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdFileUpload className="text-2xl" /> Import Quiz Questions from Excel
              </h2>
              <button
                onClick={closeImportModal}
                disabled={importing}
                className="text-white/80 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition disabled:opacity-50"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Upload an Excel file (.xlsx or .xls) with quiz question data. You can use <strong>names</strong> or <strong>IDs</strong> for grade, subject, topic, and question type.
                </p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1 mb-4 bg-gray-50 p-3 rounded-lg">
                  <li><strong>grade</strong> - Grade name (e.g., "Grade 1") or ID (required)</li>
                  <li><strong>subject</strong> - Subject name (e.g., "Mathematics") or ID (required)</li>
                  <li><strong>level</strong> - Basic, Intermediate, or Advanced (required)</li>
                  <li><strong>topic</strong> - Topic name (e.g., "Addition") or ID (required)</li>
                  <li><strong>questionType</strong> - Question type name (e.g., "MCQ") or ID (required)</li>
                  <li><strong>question</strong> - Question text (required)</li>
                  <li><strong>answer</strong> - Answer text (required)</li>
                  <li><strong>options</strong> - See formats below (optional)</li>
                  <li><strong>marks</strong> - Marks (optional, default: 1)</li>
                  <li><strong>difficulty</strong> - Easy, Medium, or Hard (optional, default: Medium)</li>
                  <li><strong>tags</strong> - Comma-separated tags (optional)</li>
                  <li><strong>displayOrder</strong> - Display order (optional, default: 0)</li>
                </ul>
                
                <div className="bg-[#00bf62]/10 border border-[#00bf62]/20 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-[#00bf62] mb-2 flex items-center gap-2">
                    <span className="text-lg">✨</span> Use Names Instead of IDs!
                  </p>
                  <p className="text-xs text-gray-700 mb-3">
                    You can now use readable names like "Grade 1", "Mathematics", "MCQ" instead of long database IDs. 
                    The system will automatically look up the correct IDs. Names are case-insensitive.
                  </p>
                  
                  {importReference && (
                    <div className="mt-3 space-y-2">
                      <details className="text-xs">
                        <summary className="cursor-pointer font-bold text-gray-700 hover:text-[#00bf62] transition">
                          📋 Available Grades ({importReference.grades.length})
                        </summary>
                        <div className="mt-2 pl-4 text-gray-600 text-xs">
                          {importReference.grades.join(', ')}
                        </div>
                      </details>
                      
                      <details className="text-xs">
                        <summary className="cursor-pointer font-bold text-gray-700 hover:text-[#00bf62] transition">
                          📚 Available Subjects ({importReference.subjects.length})
                        </summary>
                        <div className="mt-2 pl-4 text-gray-600 text-xs">
                          {importReference.subjects.join(', ')}
                        </div>
                      </details>
                      
                      <details className="text-xs">
                        <summary className="cursor-pointer font-bold text-gray-700 hover:text-[#00bf62] transition">
                          📖 Available Topics ({importReference.topics.length})
                        </summary>
                        <div className="mt-2 pl-4 text-gray-600 text-xs max-h-32 overflow-y-auto">
                          {importReference.topics.join(', ')}
                        </div>
                      </details>
                      
                      <details className="text-xs">
                        <summary className="cursor-pointer font-bold text-gray-700 hover:text-[#00bf62] transition">
                          ❓ Available Question Types ({importReference.questionTypes.length})
                        </summary>
                        <div className="mt-2 pl-4 text-gray-600 text-xs">
                          {importReference.questionTypes.join(', ')}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">📝</span> Options Format by Question Type:
                  </p>
                  <ul className="text-xs text-amber-800 space-y-1">
                    <li><strong>MCQ:</strong> Comma-separated options → <code className="bg-white px-1.5 py-0.5 rounded">Option A,Option B,Option C,Option D</code></li>
                    <li><strong>True/False:</strong> <code className="bg-white px-1.5 py-0.5 rounded">True,False</code> (or leave empty, auto-set)</li>
                    <li><strong>Match the Following:</strong> Arrow-separated pairs → <code className="bg-white px-1.5 py-0.5 rounded">Item1 → Match1,Item2 → Match2</code></li>
                    <li><strong>Fill/Short Answer:</strong> Leave empty (no options needed)</li>
                  </ul>
                </div>
                
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-bold underline transition"
                >
                  <MdDownload className="text-lg" /> Download Excel Template with Dropdowns
                </button>
                <p className="text-xs text-gray-500 mt-1.5">
                  Template includes dropdown menus for easy selection. Open in Microsoft Excel or Google Sheets for best experience.
                </p>
              </div>

              <form onSubmit={handleImportSubmit}>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Select Excel File <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleImportFileChange}
                    accept=".xlsx,.xls"
                    required
                    disabled={importing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bf62] transition text-sm disabled:bg-gray-100"
                  />
                  {importFile && (
                    <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
                      📄 {importFile.name}
                    </p>
                  )}
                </div>

                {importResults && (
                  <div className={`mb-4 p-4 rounded-xl ${
                    importResults.errorCount === 0 ? 'bg-[#00bf62]/10 border border-[#00bf62]/20' : 'bg-amber-50 border border-amber-200'
                  }`}>
                    <h3 className="font-bold text-sm mb-2">Import Results:</h3>
                    <p className="text-sm">Total rows: {importResults.total}</p>
                    <p className="text-sm text-[#00bf62] font-semibold">✅ Successfully imported: {importResults.successCount}</p>
                    {importResults.errorCount > 0 && (
                      <>
                        <p className="text-sm text-red-600 font-semibold">❌ Errors: {importResults.errorCount}</p>
                        <div className="mt-3 max-h-60 overflow-y-auto space-y-3">
                          <p className="text-xs font-bold mb-2 text-red-700">Error Details:</p>
                          {importResults.results.errors.map((error, index) => (
                            <div key={index} className="bg-white border border-red-200 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                  Row {error.row}
                                </span>
                                {error.field && (
                                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">
                                    {error.field}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-red-700 mt-2 whitespace-pre-line leading-relaxed">
                                {error.message}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800">
                            <strong>💡 Quick Fix:</strong> Check the error details above, correct the values in your Excel file, and re-upload.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={importing || !importFile}
                    className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <MdFileUpload /> {importing ? 'Importing...' : 'Import'}
                  </button>
                  <button
                    type="button"
                    onClick={closeImportModal}
                    disabled={importing}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestions;
