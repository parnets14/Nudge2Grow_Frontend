import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Admin/Login'
import Dashboard from './components/Admin/Dashboard'
import AdminLearningSubjects from './components/Admin/AdminLearningSubjects'
import AdminSubscriptionPlan from './components/Admin/AdminSubscriptionPlan'
import AdminPlans from './components/Admin/Subscription/AdminPlans'
import AdminTestimonials from './components/Admin/Subscription/AdminTestimonials'
import AdminFAQ from './components/Admin/Subscription/AdminFAQ'

// User Management
import AdminGrade from './components/UserManagement/AdminGrade'
import AdminEducationalBoard from './components/UserManagement/AdminEducationalBoard'
import AdminIntroSlides from './components/UserManagement/AdminIntroSlides'
import AdminSelectAvatar from './components/UserManagement/AdminSelectAvatar'
import BeyondSchool from './components/UserManagement/CustomizeLearning/BeyondSchool'
import AdminUsers from './components/UserManagement/AdminUsers'

// Home Management
import AdminDidYouKnow from './components/HomeManagement/AdminDidYouKnow'
import AdminTodaysRiddle from './components/HomeManagement/AdminTodaysRiddle'
import AdminParentingInsight from './components/HomeManagement/AdminParentingInsight'
import AdminPhaseCards from './components/HomeManagement/AdminPhaseCards'
import FeaturedContentManagement from './components/HomeManagement/FeaturedContentManagement'
import AdminFaqApp from './components/HelpSupport/AdminFaqApp'
import AdminContactMessages from './components/HelpSupport/AdminContactMessages'
import AdminSupportInfo from './components/HelpSupport/AdminSupportInfo'
import AdminCustomerRatings from './components/Settings/AdminCustomerRatings'

// Public Pages
import PrivacyPolicy from './components/Public/PrivacyPolicy'
import TermsCondition from './components/Public/TermsCondition'

// Quiz
import QuestionTypes from './components/Quize/QuestionTypes'
import QuizSettings from './components/Quize/QuizSettings'
import QuizQuestions from './components/Quize/QuizQuestions'
import QuizResults from './components/Quize/QuizResults'

// Verifies the stored token against the backend on every page load.
// Shows a blank screen while checking, then redirects to /login if invalid.
const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'denied'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('denied');
      return;
    }

    // Hit a protected endpoint — if the token is expired/invalid the backend
    // returns 401 and the axios interceptor (api.js) clears localStorage.
    // We do a plain fetch here so we don't depend on the axios instance.
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    fetch(`${apiUrl}/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setStatus('ok');
        } else {
          // Token invalid or expired — clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('adminToken');
          setStatus('denied');
        }
      })
      .catch(() => {
        // Network error — still allow access if token exists locally
        // (avoids locking out admin when backend is temporarily unreachable)
        setStatus('ok');
      });
  }, []);

  if (status === 'checking') {
    // Blank loading screen while verifying — no flash of protected content
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#00bf62] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Verifying session…</p>
        </div>
      </div>
    );
  }

  return status === 'ok' ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages — no auth required */}
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/terms&condition" element={<TermsCondition />} />

        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<Navigate to="grade" replace />} />

          {/* Main Pages */}
          <Route path="Subscription-Plan" element={<AdminSubscriptionPlan />} />
          <Route path="subscription/plans" element={<AdminPlans />} />
          <Route path="subscription/testimonials" element={<AdminTestimonials />} />
          <Route path="subscription/faq" element={<AdminFAQ />} />
          <Route path="Learning-Subjects" element={<AdminLearningSubjects />} />
          <Route path="question-types" element={<QuestionTypes />} />
          <Route path="quiz-settings" element={<QuizSettings />} />
          <Route path="quiz-questions" element={<QuizQuestions />} />
          <Route path="quiz-results" element={<QuizResults />} />

          {/* User Management */}
          <Route path="grade" element={<AdminGrade />} />
          <Route path="educational-board" element={<AdminEducationalBoard />} />
          <Route path="intro-slides" element={<AdminIntroSlides />} />
          <Route path="select-avatar" element={<AdminSelectAvatar />} />
          <Route path="beyond-school" element={<BeyondSchool />} />
          <Route path="users" element={<AdminUsers />} />

          {/* Home Management */}
          <Route path="featured-content" element={<FeaturedContentManagement />} />
          <Route path="did-you-know" element={<AdminDidYouKnow />} />
          <Route path="todays-riddle" element={<AdminTodaysRiddle />} />
          <Route path="parenting-insight" element={<AdminParentingInsight />} />
          <Route path="phase-cards" element={<AdminPhaseCards />} />
          <Route path="help/faqs" element={<AdminFaqApp />} />
          <Route path="help/messages" element={<AdminContactMessages />} />
          <Route path="help/support-info" element={<AdminSupportInfo />} />
          <Route path="settings/ratings" element={<AdminCustomerRatings />} />

          <Route path="*" element={<Navigate to="/admin/grade" replace />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App;
