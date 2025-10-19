import React, { useState, useEffect } from 'react';
import { View, UserRole } from '../types';
import Dashboard from './Dashboard';
import StudentList from './StudentList';
import TeacherList from './TeacherList';
import Attendance from './Attendance';
import Finance from './Finance';
import LessonPlanHelper from './LessonPlanHelper';
import AccountManagement from './AccountManagement';
import Profile from './Profile';
import Announcements from './Announcements';
import Calendar from './Calendar';
import Library from './Library';
import Message from './Message';
import Settings from './Settings';
import Result from './Result';
import { useAuth } from '../state/AuthContext';
import { useAppContext } from '../state/AppContext';
import { 
    DashboardIcon, StudentsIcon, TeachersIcon, AttendanceIcon, FinanceIcon, ResultIcon,
    NoticeIcon, CalendarIcon, LibraryIcon, MessageIcon, ProfileIcon, 
    SettingsIcon, LogoutIcon, SearchIcon, NotificationIcon, MessageCircleIcon, 
    DownloadIcon, MenuIcon, SparklesIcon, UsersIcon, XCircleIcon
} from './icons';

const allMenuItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: DashboardIcon },
    { view: View.Teachers, label: 'Teachers', icon: TeachersIcon },
    { view: View.Students, label: 'Students', icon: StudentsIcon },
    { view: View.Attendance, label: 'Attendance', icon: AttendanceIcon },
    { view: View.Finance, label: 'Finance', icon: FinanceIcon },
    { view: View.Result, label: 'Result', icon: ResultIcon },
    { view: View.Notice, label: 'Notice', icon: NoticeIcon },
    { view: View.Calendar, label: 'Calendar', icon: CalendarIcon },
    { view: View.Library, label: 'Library', icon: LibraryIcon },
    { view: View.Message, label: 'Message', icon: MessageIcon },
    { view: View.LessonPlan, label: 'Lesson Helper', icon: SparklesIcon },
];

const NavButton: React.FC<{ item: typeof allMenuItems[0]; currentView: View; setView: (view: View) => void; }> = ({ item, currentView, setView }) => {
    const isActive = item.view === currentView;
    return (
        <button
            onClick={() => setView(item.view)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 relative ${
                isActive 
                ? 'bg-primary-light text-primary' 
                : 'text-neutral-500 hover:bg-neutral-100'
            }`}
        >
            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full"></div>}
            <item.icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-neutral-500'}`} />
            <span className={`font-semibold ${isActive ? 'text-primary' : 'text-neutral-700'}`}>{item.label}</span>
        </button>
    );
};

const DownloadAppCard = () => (
    <div className="my-6 p-4 rounded-lg bg-gradient-to-br from-primary to-accent-blue text-white text-center">
        <h3 className="font-bold">Manage Better in Your Hand</h3>
        <button className="mt-4 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center w-full transition-colors">
            <DownloadIcon className="w-5 h-5 mr-2" />
            Download App
        </button>
    </div>
);

const Sidebar: React.FC<{ currentView: View; setView: (view: View) => void; isOpen: boolean; }> = ({ currentView, setView, isOpen }) => {
    const { user, logout } = useAuth();
    
    const rolePermissions: Record<UserRole, View[]> = {
        [UserRole.Admin]: Object.values(View),
        [UserRole.Teacher]: [View.Dashboard, View.Students, View.Attendance, View.Result, View.Notice, View.Calendar, View.Library, View.Message, View.LessonPlan, View.Profile, View.Setting],
        [UserRole.Finance]: [View.Dashboard, View.Finance, View.Notice, View.Calendar, View.Message, View.Profile, View.Setting],
        [UserRole.Student]: [View.Dashboard, View.Attendance, View.Result, View.Notice, View.Calendar, View.Library, View.Message, View.Profile, View.Setting],
        [UserRole.Parent]: [View.Dashboard, View.Attendance, View.Result, View.Notice, View.Calendar, View.Message, View.Profile, View.Setting],
        [UserRole.Staff]: [View.Dashboard, View.Notice, View.Calendar, View.Message, View.Profile, View.Setting],
        [UserRole.Other]: [View.Dashboard, View.Profile, View.Setting],
    };

    const menuItems = user?.role ? allMenuItems.filter(item => rolePermissions[user.role]?.includes(item.view)) : [];

    const baseOtherItems = [
        { view: View.Profile, label: 'Profile', icon: ProfileIcon },
        { view: View.Setting, label: 'Setting', icon: SettingsIcon },
    ];

    const otherItems = (user?.role === UserRole.Admin)
        ? [...baseOtherItems, { view: View.AccountManagement, label: 'Account Section', icon: UsersIcon }]
        : baseOtherItems;

    return (
    <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-brand-sidebar border-r border-neutral-200 p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:inset-0`}>
        <div className="flex items-center space-x-3 p-3 mb-6">
            <h1 className="text-2xl font-bold text-neutral-800">SchoolHub</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
            <h2 className="px-3 text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Menu</h2>
            <nav className="space-y-2">
                {menuItems.map(item => <NavButton key={item.view} item={item} currentView={currentView} setView={setView} />)}
            </nav>
            <DownloadAppCard />
            <h2 className="px-3 text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Other</h2>
             <nav className="space-y-2">
                {otherItems.map(item => <NavButton key={item.view} item={item} currentView={currentView} setView={setView} />)}
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 text-neutral-500 hover:bg-neutral-100"
                >
                    <LogoutIcon className="h-6 w-6 text-neutral-500" />
                    <span className="font-semibold text-neutral-700">Log out</span>
                </button>
            </nav>
        </div>
    </aside>
);
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { user } = useAuth();
    
    return (
    <header className="bg-brand-sidebar h-20 flex items-center justify-between px-4 sm:px-8 border-b border-neutral-200 sticky top-0 z-10">
        <div className="flex items-center">
            <button onClick={onMenuClick} className="lg:hidden mr-4 text-neutral-600">
                <MenuIcon className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="bg-brand-bg rounded-lg pl-10 pr-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-6">
            <button className="sm:hidden text-neutral-500"><SearchIcon className="w-6 h-6"/></button>
            <button className="relative text-neutral-500 hover:text-neutral-800">
                <MessageCircleIcon className="w-6 h-6" />
            </button>
             <button className="relative text-neutral-500 hover:text-neutral-800">
                <NotificationIcon className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-accent-red rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
                <img src={user?.avatar || "https://via.placeholder.com/150"} alt={user?.fullName} className="w-10 h-10 rounded-full" />
                <div className="hidden md:block">
                    <p className="font-semibold text-sm">{user?.fullName}</p>
                    <p className="text-xs text-neutral-500">{user?.role}</p>
                </div>
            </div>
        </div>
    </header>
)};

const Footer = () => (
    <footer className="px-4 sm:px-8 py-4 border-t border-neutral-200 text-xs sm:text-sm text-neutral-500 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>📧 emailaddress@gmail.com</span>
            <span>📞 +62 123 456 78</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <a href="#" className="hover:text-neutral-800">Terms of Use</a>
            <a href="#" className="hover:text-neutral-800">Privacy Policy</a>
            <span>Copyright © SchoolHub</span>
        </div>
    </footer>
);

const BottomNav: React.FC<{ currentView: View; setView: (view: View) => void }> = ({ currentView, setView }) => {
    const { user } = useAuth();
    let navItems = [
        { view: View.Dashboard, icon: DashboardIcon },
        { view: View.Students, icon: StudentsIcon },
        { view: View.Teachers, icon: TeachersIcon },
        { view: View.Message, icon: MessageIcon },
        { view: View.Profile, icon: ProfileIcon },
    ];

    if (user?.role === UserRole.Admin || user?.role === UserRole.Teacher) {
        navItems = [
            { view: View.Dashboard, icon: DashboardIcon },
            { view: View.Students, icon: StudentsIcon },
            { view: View.Result, icon: ResultIcon },
            { view: View.Message, icon: MessageIcon },
            { view: View.Profile, icon: ProfileIcon },
        ];
    } else if (user?.role === UserRole.Finance) {
        navItems = [
            { view: View.Finance, icon: FinanceIcon },
            { view: View.Notice, icon: NoticeIcon },
            { view: View.Calendar, icon: CalendarIcon },
            { view: View.Message, icon: MessageIcon },
            { view: View.Profile, icon: ProfileIcon },
        ];
    }


    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around p-2 z-20">
            {navItems.map(item => {
                const isActive = item.view === currentView;
                return (
                    <button key={item.view} onClick={() => setView(item.view)} className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${isActive ? 'text-primary bg-primary-light' : 'text-neutral-500'}`}>
                        <item.icon className="w-6 h-6 mb-1" />
                    </button>
                )
            })}
        </nav>
    );
}

const FirestorePermissionError: React.FC<{ message: string; onRetry: () => void; }> = ({ message, onRetry }) => {
    const projectId = "app-making-20c78"; // from firebaseConfig
    const rulesUrl = `https://console.firebase.google.com/project/${projectId}/firestore/rules`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-3xl border-t-8 border-red-500">
                <div className="flex items-start gap-4">
                    <XCircleIcon className="w-12 h-12 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-800">Action Required: Database Permissions</h1>
                        <p className="text-neutral-600 mt-2 text-sm">
                            The application cannot connect to the database. This is a one-time setup step required for your Firebase project.
                        </p>
                        <p className="font-semibold text-red-600 text-sm mt-1">{message}</p>
                    </div>
                </div>
                
                <div className="mt-6 text-sm">
                    <h2 className="font-semibold text-neutral-700 text-base mb-2">How to Fix This in 3 Steps</h2>
                    <ol className="list-decimal list-inside space-y-4 text-neutral-600">
                        <li>
                            Click the button below to go directly to your Firestore Rules editor.
                            <a href={rulesUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                1. Open Firebase Console
                            </a>
                        </li>
                        <li>
                            In the editor, delete all existing text and paste the following code:
                            <pre className="bg-neutral-100 text-neutral-800 p-3 rounded-md mt-2 text-xs overflow-x-auto">
                                <code>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
                                </code>
                            </pre>
                        </li>
                         <li>
                            Click the **"Publish"** button in Firebase, then come back here and click **"Retry Connection"**.
                            <button
                                onClick={onRetry}
                                className="mt-2 w-full text-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                            >
                                3. Retry Connection
                            </button>
                         </li>
                    </ol>
                    <p className="text-xs text-neutral-500 mt-4">
                        <strong>Why this is needed:</strong> By default, Firebase locks down your database. The code above grants access to any user who is logged in, which is safe for this development environment.
                    </p>
                </div>
            </div>
        </div>
    );
};


const AppContent: React.FC = () => {
    const { user } = useAuth();
    const { error, retryConnection } = useAppContext();
    const [currentView, setCurrentView] = useState<View>(user?.role === UserRole.Finance ? View.Finance : View.Dashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
    }, [currentView]);

    const renderContent = () => {
        switch (currentView) {
            case View.Dashboard: return <Dashboard />;
            case View.Students: return <StudentList />;
            case View.Teachers: return <TeacherList />;
            case View.Attendance: return <Attendance />;
            case View.Finance: return <Finance />;
            case View.Result: return <Result />;
            case View.LessonPlan: return <LessonPlanHelper />;
            case View.AccountManagement: return <AccountManagement />;
            case View.Profile: return <Profile />;
            case View.Notice: return <Announcements />;
            case View.Calendar: return <Calendar />;
            case View.Library: return <Library />;
            case View.Message: return <Message />;
            case View.Setting: return <Settings />;
            default: return user?.role === UserRole.Finance ? <Finance /> : <Dashboard />;
        }
    };

    if (error) {
        return <FirestorePermissionError message={error} onRetry={retryConnection} />;
    }

    return (
        <div className="min-h-screen flex w-full bg-brand-bg">
            <Sidebar currentView={currentView} setView={setCurrentView} isOpen={isSidebarOpen} />
            
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-20 lg:hidden"></div>}

            <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
                    {renderContent()}
                </main>
                <Footer />
            </div>
            
            <BottomNav currentView={currentView} setView={setCurrentView} />
        </div>
    );
};

export default AppContent;