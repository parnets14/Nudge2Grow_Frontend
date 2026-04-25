import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  MdCreditCard, MdQuiz, MdBook, MdNotifications, MdLogout,
  MdPeople, MdSchool, MdExpandMore, MdExpandLess, MdLightbulb,
  MdPsychology, MdFavorite, MdDashboard, MdGrade, MdSlideshow,
  MdChildCare, MdAccountCircle, MdSelfImprovement,
  MdList, MdTune, MdStar, MdQuestionAnswer, MdChat, MdEmojiEvents,
  MdVideoLibrary, MdDarkMode, MdLightMode, MdLayers, MdMessage, MdInfo,
} from "react-icons/md";
import logo from "../../assets/logo.jpeg";

const AdminDashboard = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [userMgmtOpen,setUserMgmtOpen] = useState(true);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [homeMgmtOpen, setHomeMgmtOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [darkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };



  const subscriptionItems = [
    { path: "/admin/subscription/plans",        label: "Plans",        icon: <MdCreditCard /> },
    { path: "/admin/subscription/testimonials", label: "Testimonials", icon: <MdStar /> },
    { path: "/admin/subscription/faq",          label: "FAQ",          icon: <MdQuiz /> },
  ];

  const quizItems = [
    { path: "/admin/question-types", label: "Question Types", icon: <MdQuiz /> },
    { path: "/admin/quiz-settings", label: "Quiz Settings", icon: <MdTune /> },
    { path: "/admin/quiz-questions", label: "Quiz Questions", icon: <MdQuiz /> },
  ];

  const userMgmtItems = [
    { path: "/admin/intro-slides",label: "Intro Slides",icon: <MdSlideshow /> },
    { path: "/admin/grade",label: "Grade",             icon: <MdGrade /> },
    { path: "/admin/educational-board",label: "Educational Board", icon: <MdSchool /> },
    { path: "/admin/select-avatar",label: "Select Avatar",     icon: <MdAccountCircle /> },
    { path: "/admin/beyond-school",label: "Beyond School",     icon: <MdSelfImprovement /> },
    { path: "/admin/users",        label: "Users",             icon: <MdPeople /> },
  ];

  const homeMgmtItems = [
    { path: "/admin/featured-content",  label: "Featured Content",   icon: <MdStar /> },
    { path: "/admin/did-you-know",      label: "Did You Know",       icon: <MdLightbulb /> },
    { path: "/admin/todays-riddle",     label: "Today's Riddles",    icon: <MdPsychology /> },
    { path: "/admin/parenting-insight", label: "Parenting Insights", icon: <MdFavorite /> },
    { path: "/admin/phase-cards",       label: "For This Phase",     icon: <MdLayers /> },
  ];



  // ── Sub-components ──────────────────────────────────────────────────────────
  const NavItem = ({ item }) => (
    <NavLink to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
          isActive
            ? "bg-green-500 text-white shadow-md shadow-green-500/30"
            : "text-black hover:bg-gray-100"
        }`}>
      <span className="text-base shrink-0">{item.icon}</span>
      {item.label}
    </NavLink>
  );

  const GroupHeader = ({ label, icon, isOpen, onToggle, accent = "#10b981" }) => (
    <button onClick={onToggle}
      className="w-full flex items-center justify-between px-3 py-2.5 mt-1 rounded-xl hover:bg-gray-100 transition group">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base shrink-0"
          style={{ backgroundColor: `${accent}20`, color: accent }}>
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-black">{label}</span>
      </div>
      <span className="text-gray-400 group-hover:text-gray-600 transition">
        {isOpen ? <MdExpandLess /> : <MdExpandMore />}
      </span>
    </button>
  );

  const SubGroupHeader = ({ label, icon, isOpen, onToggle }) => (
    <button onClick={onToggle}
      className="w-full flex items-center justify-between px-3 py-2 mt-0.5 rounded-lg hover:bg-gray-100 transition">
      <div className="flex items-center gap-2">
        <span className="text-green-500 text-base">{icon}</span>
        <span className="text-xs font-semibold text-black">{label}</span>
      </div>
      <span className="text-gray-400 text-sm">{isOpen ? <MdExpandLess /> : <MdExpandMore />}</span>
    </button>
  );

  const Divider = () => <div className="my-2 border-t border-gray-200 mx-2" />;

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes("intro-slides"))                return "Intro Slides";
    if (p.includes("grade"))                       return "Grade";
    if (p.includes("educational-board"))           return "Educational Board";
    if (p.includes("select-avatar"))               return "Select Avatar";
    if (p.includes("beyond-school"))               return "Beyond School";
    if (p.includes("beyond-school"))               return "Beyond School";
    if (p.includes("users"))                        return "Users";
    if (p.includes("featured-content"))            return "Featured Content";
    if (p.includes("did-you-know"))                return "Did You Know";
    if (p.includes("todays-riddle"))               return "Today's Riddles";
    if (p.includes("parenting-insight"))           return "Parenting Insights";
    if (p.includes("phase-cards"))                 return "For This Phase";
    if (p.includes("help/faqs"))                   return "FAQs";
    if (p.includes("help/messages"))               return "User Messages";
    if (p.includes("help/support-info"))           return "Support Info";
    if (p.includes("settings/ratings"))            return "Customer Ratings";
    if (p.includes("subscription/plans"))          return "Subscription Plans";
    if (p.includes("subscription/testimonials"))   return "Testimonials";
    if (p.includes("subscription/faq"))            return "FAQ";
    if (p.includes("Learning-Subjects"))           return "Learning Subjects";
    if (p.includes("question-types"))              return "Question Types";
    if (p.includes("quiz-settings"))               return "Quiz Settings";
    if (p.includes("quiz-questions"))              return "Quiz Questions";
    return "Dashboard";
  };

  const bg   = "bg-[#f0f4f8]";
  const hBg  = "bg-white border-gray-200";
  const hTxt = "text-gray-800";
  const hSub = "text-gray-400";

  return (
    <div className={`flex h-screen ${bg} transition-colors duration-300 overflow-hidden`}>

      {/* ── Sidebar ── */}
      <aside className="w-[260px] bg-white text-black flex flex-col shadow-2xl shrink-0 rounded-r-3xl border-r border-gray-200 h-full">

        {/* Logo */}
        <div className="px-5 pt-6 pb-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-gray-100 p-0.5 shadow-lg shrink-0">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-black leading-tight">
                Nudge2Grow
              </h2>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">

          {/* User Management */}
          <GroupHeader label="User Management" icon={<MdPeople />} isOpen={userMgmtOpen} onToggle={() => setUserMgmtOpen(p => !p)} />
          {userMgmtOpen && (
            <div className="pl-2 space-y-0.5 border-l border-green-200 ml-3">
              {userMgmtItems.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          )}

          <Divider />

          {/* Learning Subjects */}
          <NavItem item={{ path: "/admin/Learning-Subjects", label: "Learning Subjects", icon: <MdBook /> }} />

          <Divider />

          {/* Quiz */}
          <GroupHeader label="Quiz" icon={<MdQuiz />} isOpen={quizOpen} onToggle={() => setQuizOpen(p => !p)} accent="#10b981" />
          {quizOpen && (
            <div className="pl-2 space-y-0.5 border-l border-green-200 ml-3">
              {quizItems.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          )}

          <Divider />

          {/* Subscription */}
          {/* <GroupHeader label="Subscription" icon={<MdCreditCard />} isOpen={subscriptionOpen} onToggle={() => setSubscriptionOpen(p => !p)} accent="#10b981" />
          {subscriptionOpen && (
            <div className="pl-2 space-y-0.5 border-l border-green-200 ml-3">
              {subscriptionItems.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          )} */}

          <Divider />

          {/* Home Management */}
          <GroupHeader label="Home Management" icon={<MdDashboard />} isOpen={homeMgmtOpen} onToggle={() => setHomeMgmtOpen(p => !p)} accent="#10b981" />
          {homeMgmtOpen && (
            <div className="pl-2 space-y-0.5 border-l border-green-200 ml-3">
              {homeMgmtItems.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          )}

          <Divider />

          {/* Help & Support */}
          <GroupHeader label="Help & Support" icon={<MdQuestionAnswer />} isOpen={helpOpen} onToggle={() => setHelpOpen(p => !p)} accent="#10b981" />
          {helpOpen && (
            <div className="pl-2 space-y-0.5 border-l border-green-200 ml-3">
              <NavItem item={{ path: "/admin/help/faqs",         label: "FAQs",         icon: <MdQuestionAnswer /> }} />
              <NavItem item={{ path: "/admin/help/messages",     label: "Messages",     icon: <MdMessage /> }} />
              <NavItem item={{ path: "/admin/help/support-info", label: "Support Info", icon: <MdInfo /> }} />
            </div>
          )}

          <Divider />

          {/* Settings */}
          <GroupHeader label="Settings" icon={<MdStar />} isOpen={settingsOpen} onToggle={() => setSettingsOpen(p => !p)} accent="#10b981" />
          {settingsOpen && (
            <div className="pl-2 space-y-0.5 border-l border-green-200 ml-3">
              <NavItem item={{ path: "/admin/settings/ratings", label: "Customer Ratings", icon: <MdStar /> }} />
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="px-2.5 py-3 border-t border-gray-200 shrink-0">
          <button onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 rounded-xl transition font-bold text-sm flex items-center justify-center gap-2">
            <MdLogout className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top Header */}
        <header className={`${hBg} border-b px-8 py-4 flex items-center justify-between shadow-sm shrink-0 transition-colors duration-300`}>
          <div>
            <h1 className={`text-2xl font-extrabold ${hTxt}`}>{getPageTitle()}</h1>
            <p className={`text-xs mt-0.5 ${hSub}`}>Nudge2Grow Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
