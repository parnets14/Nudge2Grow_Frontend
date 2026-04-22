import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const QuizQuestions = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quiz Questions Bank</h1>
        <p className="text-sm text-gray-600">Add and manage individual quiz questions for quiz generation</p>
      </div>

      {/* Add Button */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          disabled={loading}
        >
          {showForm ? 'Cancel' : '+ Add Quiz Question'}
        </button>
        <button
          onClick={handleImportClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          disabled={loading}
        >
          📥 Import from Excel
        </button>
      </div>

      {/* Form */}
      {showForm && !loading && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId ? 'Edit Quiz Question' : 'Add New Quiz Question'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade *
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic *
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.subject}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type *
                </label>
                <select
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Marks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks
                </label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                required
                rows="3"
                placeholder="Enter the question text..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Answer Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer *
              </label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                required
                rows="2"
                placeholder="Enter the correct answer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Options - Dynamic based on Question Type */}
            {selectedQuestionTypeName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., addition, basic-math, arithmetic"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update Question' : 'Add Question'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizQuestions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No quiz questions found. Add your first one!
                  </td>
                </tr>
              ) : (
                quizQuestions.map((q) => (
                  <tr key={q._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {q.grade?.title || q.grade?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {q.subject?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        q.level === 'Basic' ? 'bg-green-100 text-green-800' :
                        q.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {q.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {q.topic?.title || q.topic?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {q.questionType?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {q.question}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {q.marks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleView(q)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(q)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && viewingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-green-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-semibold">Quiz Question Details</h2>
              <button
                onClick={closeViewModal}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Grade</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {viewingQuestion.grade?.title || viewingQuestion.grade?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {viewingQuestion.subject?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Level</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      viewingQuestion.level === 'Basic' ? 'bg-green-100 text-green-800' :
                      viewingQuestion.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {viewingQuestion.level}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Topic</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {viewingQuestion.topic?.title || viewingQuestion.topic?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Question Type</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {viewingQuestion.questionType?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {viewingQuestion.difficulty}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Marks</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {viewingQuestion.marks}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {viewingQuestion.displayOrder}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Question</label>
                  <p className="text-gray-900 bg-blue-50 px-4 py-3 rounded border border-blue-200">
                    {viewingQuestion.question}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Answer</label>
                  <p className="text-gray-900 bg-green-50 px-4 py-3 rounded border border-green-200">
                    {viewingQuestion.answer}
                  </p>
                </div>

                {viewingQuestion.options && viewingQuestion.options.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {viewingQuestion.questionType?.name?.toLowerCase().includes('match') 
                        ? 'Matching Pairs' 
                        : 'Options'}
                    </label>
                    
                    {viewingQuestion.questionType?.name?.toLowerCase().includes('match') ? (
                      // Display as matching pairs
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div className="font-semibold text-xs text-gray-600 bg-blue-50 px-3 py-1 rounded">
                            Column A
                          </div>
                          <div className="font-semibold text-xs text-gray-600 bg-green-50 px-3 py-1 rounded">
                            Column B
                          </div>
                        </div>
                        {viewingQuestion.options.map((option, index) => {
                          const parts = option.split(' → ');
                          const columnA = parts[0]?.replace(/^\d+\.\s*/, '').trim() || '';
                          const columnB = parts[1]?.trim() || '';
                          
                          return (
                            <div key={index} className="grid grid-cols-2 gap-4">
                              <div className="text-gray-900 bg-blue-50 px-4 py-2 rounded border border-blue-200">
                                {index + 1}. {columnA}
                              </div>
                              <div className="text-gray-900 bg-green-50 px-4 py-2 rounded border border-green-200">
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
                          <li key={index} className="text-gray-900 bg-gray-50 px-4 py-2 rounded border">
                            {String.fromCharCode(65 + index)}. {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {viewingQuestion.tags && viewingQuestion.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {viewingQuestion.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
              <button
                onClick={closeViewModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-semibold">Import Quiz Questions from Excel</h2>
              <button
                onClick={closeImportModal}
                className="text-white hover:text-gray-200 text-2xl font-bold"
                disabled={importing}
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Upload an Excel file (.xlsx or .xls) with quiz question data. You can use <strong>names</strong> or <strong>IDs</strong> for grade, subject, topic, and question type.
                </p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1 mb-4">
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
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-green-800 mb-2">✨ Use Names Instead of IDs!</p>
                  <p className="text-xs text-green-800 mb-3">
                    You can now use readable names like "Grade 1", "Mathematics", "MCQ" instead of long database IDs. 
                    The system will automatically look up the correct IDs. Names are case-insensitive.
                  </p>
                  
                  {importReference && (
                    <div className="mt-3 space-y-2">
                      <details className="text-xs">
                        <summary className="cursor-pointer font-semibold text-green-900 hover:text-green-700">
                          📋 Available Grades ({importReference.grades.length})
                        </summary>
                        <div className="mt-2 pl-4 text-green-800">
                          {importReference.grades.join(', ')}
                        </div>
                      </details>
                      
                      <details className="text-xs">
                        <summary className="cursor-pointer font-semibold text-green-900 hover:text-green-700">
                          📚 Available Subjects ({importReference.subjects.length})
                        </summary>
                        <div className="mt-2 pl-4 text-green-800">
                          {importReference.subjects.join(', ')}
                        </div>
                      </details>
                      
                      <details className="text-xs">
                        <summary className="cursor-pointer font-semibold text-green-900 hover:text-green-700">
                          📖 Available Topics ({importReference.topics.length})
                        </summary>
                        <div className="mt-2 pl-4 text-green-800 max-h-32 overflow-y-auto">
                          {importReference.topics.join(', ')}
                        </div>
                      </details>
                      
                      <details className="text-xs">
                        <summary className="cursor-pointer font-semibold text-green-900 hover:text-green-700">
                          ❓ Available Question Types ({importReference.questionTypes.length})
                        </summary>
                        <div className="mt-2 pl-4 text-green-800">
                          {importReference.questionTypes.join(', ')}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-yellow-800 mb-2">📝 Options Format by Question Type:</p>
                  <ul className="text-xs text-yellow-800 space-y-1">
                    <li><strong>MCQ:</strong> Comma-separated options → <code>Option A,Option B,Option C,Option D</code></li>
                    <li><strong>True/False:</strong> <code>True,False</code> (or leave empty, auto-set)</li>
                    <li><strong>Match the Following:</strong> Arrow-separated pairs → <code>Item1 → Match1,Item2 → Match2,Item3 → Match3</code></li>
                    <li><strong>Fill/Short Answer:</strong> Leave empty (no options needed)</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-blue-800 mb-2">💡 Example - Match the Following:</p>
                  <div className="text-xs text-blue-800 space-y-1">
                    <p><strong>Grade:</strong> Grade 2</p>
                    <p><strong>Subject:</strong> Geography</p>
                    <p><strong>Topic:</strong> World Capitals</p>
                    <p><strong>Question Type:</strong> Match the Following</p>
                    <p><strong>Question:</strong> Match countries with capitals</p>
                    <p><strong>Answer:</strong> 1-Paris, 2-Tokyo, 3-New Delhi</p>
                    <p><strong>Options:</strong> <code>France → Paris,Japan → Tokyo,India → New Delhi</code></p>
                  </div>
                </div>
                
                <button
                  onClick={downloadTemplate}
                  className="text-blue-600 hover:text-blue-800 text-sm underline font-semibold"
                >
                  📥 Download Excel Template with Dropdowns
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Template includes dropdown menus for easy selection. Open in Microsoft Excel or Google Sheets for best experience.
                </p>
              </div>

              <form onSubmit={handleImportSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Excel File *
                  </label>
                  <input
                    type="file"
                    onChange={handleImportFileChange}
                    accept=".xlsx,.xls"
                    required
                    disabled={importing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {importFile && (
                    <p className="text-xs text-gray-600 mt-1">
                      📄 {importFile.name}
                    </p>
                  )}
                </div>

                {importResults && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    importResults.errorCount === 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <h3 className="font-semibold text-sm mb-2">Import Results:</h3>
                    <p className="text-sm">Total rows: {importResults.total}</p>
                    <p className="text-sm text-green-600">✅ Successfully imported: {importResults.successCount}</p>
                    {importResults.errorCount > 0 && (
                      <>
                        <p className="text-sm text-red-600">❌ Errors: {importResults.errorCount}</p>
                        <div className="mt-3 max-h-60 overflow-y-auto space-y-3">
                          <p className="text-xs font-semibold mb-2 text-red-700">Error Details:</p>
                          {importResults.results.errors.map((error, index) => (
                            <div key={index} className="bg-white border border-red-200 rounded p-3">
                              <div className="flex items-start gap-2">
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                  Row {error.row}
                                </span>
                                {error.field && (
                                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
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
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {importing ? 'Importing...' : 'Import'}
                  </button>
                  <button
                    type="button"
                    onClick={closeImportModal}
                    disabled={importing}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
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
