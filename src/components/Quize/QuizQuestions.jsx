import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nudgebackend.onrender.com/api';

const QuizQuestions = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [quizSettings, setQuizSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    level: 'Basic',
    topic: '',
    questionType: '',
    questionNumber: '',
    questionPaper: null,
    answerKey: null,
    displayOrder: 0
  });

  const [questionPaperPreview, setQuestionPaperPreview] = useState('');
  const [answerKeyPreview, setAnswerKeyPreview] = useState('');
  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    console.log('[QuizQuestions] Component mounted, fetching data...');
    fetchQuizQuestions();
    fetchGrades();
    fetchSubjects();
    fetchQuestionTypes();
    fetchQuizSettings();
  }, []);

  useEffect(() => {
    console.log('[QuizQuestions] Grades state updated:', grades);
  }, [grades]);

  useEffect(() => {
    console.log('[QuizQuestions] Subjects state updated:', subjects);
  }, [subjects]);

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
      console.log('[QuizQuestions] Fetching grades from:', `${API_BASE_URL}/grade`);
      const response = await axios.get(`${API_BASE_URL}/grade`);
      console.log('[QuizQuestions] Grades response:', response.data);
      console.log('[QuizQuestions] First grade object:', response.data[0]);
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchSubjects = async () => {
    try {
      console.log('[QuizQuestions] Fetching subjects from:', `${API_BASE_URL}/learning-subjects/subjects`);
      const response = await axios.get(`${API_BASE_URL}/learning-subjects/subjects`);
      console.log('[QuizQuestions] Subjects response:', response.data);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchTopicsBySubject = async (subjectId) => {
    try {
      console.log('[QuizQuestions] Fetching topics for subject:', subjectId);
      console.log('[QuizQuestions] Current formData:', formData);
      const response = await axios.get(`${API_BASE_URL}/topics`);
      console.log('[QuizQuestions] All topics response:', response.data);
      
      // Get the selected grade title for comparison
      const selectedGrade = grades.find(g => g._id === formData.grade);
      const selectedGradeTitle = selectedGrade?.title || selectedGrade?.name;
      
      console.log('[QuizQuestions] Selected Grade Title:', selectedGradeTitle);
      
      // Filter topics by grade, subject, and level
      const filtered = response.data.filter(topic => {
        // Check subject match - Topic model uses subjectId field
        const topicSubjectId = topic.subjectId?._id || topic.subjectId;
        const matchesSubject = topicSubjectId === subjectId;
        
        // Check grade match - Topic model stores grade as STRING (grade title)
        const topicGrade = topic.grade;
        const matchesGrade = formData.grade ? topicGrade === selectedGradeTitle : true;
        
        // Check level match - Case insensitive comparison
        const topicLevel = topic.level?.toLowerCase();
        const selectedLevel = formData.level?.toLowerCase();
        const matchesLevel = formData.level ? topicLevel === selectedLevel : true;
        
        console.log('[QuizQuestions] Topic:', topic.title || topic.name);
        console.log('  - Topic Subject ID:', topicSubjectId, '| Selected:', subjectId, '| Match:', matchesSubject);
        console.log('  - Topic Grade:', topicGrade, '| Selected:', selectedGradeTitle, '| Match:', matchesGrade);
        console.log('  - Topic Level:', topicLevel, '| Selected:', selectedLevel, '| Match:', matchesLevel);
        console.log('  - Overall Match:', matchesSubject && matchesGrade && matchesLevel);
        
        return matchesSubject && matchesGrade && matchesLevel;
      });
      
      console.log('[QuizQuestions] Filtered topics count:', filtered.length);
      console.log('[QuizQuestions] Filtered topics:', filtered);
      setTopics(response.data);
      setFilteredTopics(filtered);
    } catch (error) {
      console.error('Error fetching topics:', error);
      console.error('Error details:', error.response?.data);
      setTopics([]);
      setFilteredTopics([]);
    }
  };

  const fetchQuestionTypes = async () => {
    try {
      console.log('[QuizQuestions] Fetching question types from:', `${API_BASE_URL}/question-types`);
      const response = await axios.get(`${API_BASE_URL}/question-types`);
      console.log('[QuizQuestions] Question types response:', response.data);
      setQuestionTypes(response.data.filter(qt => qt.isActive));
    } catch (error) {
      console.error('Error fetching question types:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchQuizSettings = async () => {
    try {
      console.log('[QuizQuestions] Fetching quiz settings from:', `${API_BASE_URL}/quiz-settings`);
      const response = await axios.get(`${API_BASE_URL}/quiz-settings`);
      console.log('[QuizQuestions] Quiz settings response:', response.data);
      setQuizSettings(response.data.filter(qs => qs.isActive).sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching quiz settings:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset topic when grade, subject, or level changes
    if (name === 'grade' || name === 'subject' || name === 'level') {
      setFormData(prev => ({ ...prev, [name]: value, topic: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'questionPaper') {
          setQuestionPaperPreview(files[0].name);
        } else if (name === 'answerKey') {
          setAnswerKeyPreview(files[0].name);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('grade', formData.grade);
    data.append('subject', formData.subject);
    data.append('level', formData.level);
    data.append('topic', formData.topic);
    data.append('questionType', formData.questionType);
    data.append('questionNumber', formData.questionNumber);
    data.append('displayOrder', formData.displayOrder);
    
    if (formData.questionPaper) {
      data.append('questionPaper', formData.questionPaper);
    }
    if (formData.answerKey) {
      data.append('answerKey', formData.answerKey);
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/quiz-questions/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${API_BASE_URL}/quiz-questions`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      fetchQuizQuestions();
      resetForm();
    } catch (error) {
      console.error('Error saving quiz question:', error);
      alert(error.response?.data?.message || 'Error saving quiz question');
    }
  };

  const handleEdit = (quizQuestion) => {
    setEditingId(quizQuestion._id);
    setFormData({
      grade: quizQuestion.grade?._id || '',
      subject: quizQuestion.subject?._id || '',
      level: quizQuestion.level || 'Basic',
      topic: quizQuestion.topic?._id || '',
      questionType: quizQuestion.questionType?._id || '',
      questionNumber: quizQuestion.questionNumber?._id || '',
      questionPaper: null,
      answerKey: null,
      displayOrder: quizQuestion.displayOrder || 0
    });
    setQuestionPaperPreview(quizQuestion.questionPaper || '');
    setAnswerKeyPreview(quizQuestion.answerKey || '');
    
    // Fetch topics for the selected subject when editing
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

  const resetForm = () => {
    setFormData({
      grade: '',
      subject: '',
      level: 'Basic',
      topic: '',
      questionType: '',
      questionNumber: '',
      questionPaper: null,
      answerKey: null,
      displayOrder: 0
    });
    setQuestionPaperPreview('');
    setAnswerKeyPreview('');
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quiz Questions</h1>
        <p className="text-sm text-gray-600">Upload and manage quiz question papers and answer keys</p>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          disabled={loading}
        >
          {showForm ? 'Cancel' : '+ Add Quiz Question'}
        </button>
        {loading && (
          <span className="ml-3 text-sm text-gray-600">Loading data...</span>
        )}
      </div>

      {/* Form */}
      {showForm && !loading && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId ? 'Edit Quiz Question' : 'Add New Quiz Question'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Grade Dropdown */}
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
                  {grades.length === 0 ? (
                    <option disabled>No grades available - Add grades in Grade Management</option>
                  ) : (
                    grades.map(grade => (
                      <option key={grade._id} value={grade._id}>
                        {grade.title || grade.name}
                      </option>
                    ))
                  )}
                </select>
                {grades.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Please add grades in Grade Management first
                  </p>
                )}
              </div>

              {/* Subject Dropdown */}
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
                  {subjects.length === 0 ? (
                    <option disabled>No subjects available - Add subjects in Learning Subjects</option>
                  ) : (
                    subjects.map(subject => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))
                  )}
                </select>
                {subjects.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Please add subjects in Learning Subjects first
                  </p>
                )}
              </div>

              {/* Level Dropdown */}
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

              {/* Topic Dropdown */}
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
                {formData.subject && filteredTopics.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No topics available for selected level
                  </p>
                )}
              </div>

              {/* Question Type Dropdown */}
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
                  {questionTypes.length === 0 ? (
                    <option disabled>No question types available - Add in Question Types</option>
                  ) : (
                    questionTypes.map(qt => (
                      <option key={qt._id} value={qt._id}>
                        {qt.name}
                      </option>
                    ))
                  )}
                </select>
                {questionTypes.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Please add question types in Question Types first
                  </p>
                )}
              </div>

              {/* Question Number Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Number *
                </label>
                <select
                  name="questionNumber"
                  value={formData.questionNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Question Number</option>
                  {quizSettings.length === 0 ? (
                    <option disabled>No quiz settings available - Add in Quiz Settings</option>
                  ) : (
                    quizSettings.map(qs => (
                      <option key={qs._id} value={qs._id}>
                        {qs.label} ({qs.questions} questions)
                      </option>
                    ))
                  )}
                </select>
                {quizSettings.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Please add quiz settings in Quiz Settings first
                  </p>
                )}
              </div>

              {/* Display Order */}
              <div>
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
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Question Paper Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Paper * {editingId && '(Leave empty to keep current)'}
                </label>
                <input
                  type="file"
                  name="questionPaper"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                  required={!editingId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {questionPaperPreview && (
                  <p className="text-xs text-gray-600 mt-1">
                    📄 {questionPaperPreview}
                  </p>
                )}
              </div>

              {/* Answer Key Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Key * {editingId && '(Leave empty to keep current)'}
                </label>
                <input
                  type="file"
                  name="answerKey"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                  required={!editingId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {answerKeyPreview && (
                  <p className="text-xs text-gray-600 mt-1">
                    🔑 {answerKeyPreview}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Create'}
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
                Question Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Files
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizQuestions.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                  No quiz questions found. Add your first one!
                </td>
              </tr>
            ) : (
              quizQuestions.map((quizQuestion) => (
                <tr key={quizQuestion._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quizQuestion.grade?.title || quizQuestion.grade?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quizQuestion.subject?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      quizQuestion.level === 'Basic' ? 'bg-green-100 text-green-800' :
                      quizQuestion.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quizQuestion.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quizQuestion.topic?.title || quizQuestion.topic?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quizQuestion.questionType?.name || (
                      <span className="text-orange-600 text-xs italic">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quizQuestion.questionNumber?.questions || (
                      <span className="text-orange-600 text-xs italic">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-col gap-1">
                      <a
                        href={`${API_BASE_URL.replace('/api', '')}/${quizQuestion.questionPaper}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        📄 Question Paper
                      </a>
                      <a
                        href={`${API_BASE_URL.replace('/api', '')}/${quizQuestion.answerKey}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline text-xs"
                      >
                        🔑 Answer Key
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quizQuestion.displayOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleView(quizQuestion)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(quizQuestion)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(quizQuestion._id)}
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

      {/* View Modal */}
      {showViewModal && viewingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-green-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-semibold">Quiz Question Details</h2>
              <button
                onClick={closeViewModal}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Details Grid */}
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
                    {viewingQuestion.questionType?.name || (
                      <span className="text-orange-600 italic">Not set - Please edit to add</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Questions</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {viewingQuestion.questionNumber?.questions ? (
                      <>
                        {viewingQuestion.questionNumber.questions} questions
                        {viewingQuestion.questionNumber?.minutes && ` (${viewingQuestion.questionNumber.minutes} minutes)`}
                      </>
                    ) : (
                      <span className="text-orange-600 italic">Not set - Please edit to add</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {viewingQuestion.displayOrder}
                  </p>
                </div>
              </div>

              {/* Files Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Files</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Question Paper */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📄 Question Paper
                    </label>
                    <div className="space-y-2">
                      <a
                        href={`${API_BASE_URL.replace('/api', '')}/${viewingQuestion.questionPaper}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                      >
                        Open in New Tab
                      </a>
                      {viewingQuestion.questionPaper?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) && (
                        <div className="mt-3">
                          <img
                            src={`${API_BASE_URL.replace('/api', '')}/${viewingQuestion.questionPaper}`}
                            alt="Question Paper"
                            className="max-w-full h-auto rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Answer Key */}
                  <div className="border rounded-lg p-4 bg-green-50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🔑 Answer Key
                    </label>
                    <div className="space-y-2">
                      <a
                        href={`${API_BASE_URL.replace('/api', '')}/${viewingQuestion.answerKey}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                      >
                        Open in New Tab
                      </a>
                      {viewingQuestion.answerKey?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) && (
                        <div className="mt-3">
                          <img
                            src={`${API_BASE_URL.replace('/api', '')}/${viewingQuestion.answerKey}`}
                            alt="Answer Key"
                            className="max-w-full h-auto rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
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
    </div>
  );
};

export default QuizQuestions;
