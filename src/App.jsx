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
import AdminFaqApp from './components/HelpSupport/AdminFaqApp'
import AdminContactMessages from './components/HelpSupport/AdminContactMessages'
import AdminSupportInfo from './components/HelpSupport/AdminSupportInfo'
import AdminCustomerRatings from './components/Settings/AdminCustomerRatings'

// Quiz
import QuestionTypes from './components/Quize/QuestionTypes'
import QuizSettings from './components/Quize/QuizSettings'
import QuizQuestions from './components/Quize/QuizQuestions'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
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

          {/* User Management */}
          <Route path="grade" element={<AdminGrade />} />
          <Route path="educational-board" element={<AdminEducationalBoard />} />
          <Route path="intro-slides" element={<AdminIntroSlides />} />
          <Route path="select-avatar" element={<AdminSelectAvatar />} />
          <Route path="beyond-school" element={<BeyondSchool />} />
          <Route path="users" element={<AdminUsers />} />

          {/* Home Management */}
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
