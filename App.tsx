import React, { useState, useEffect } from 'react';
import { View } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import TeacherList from './components/TeacherList';
import Attendance from './components/Attendance';
import Finance from './components/Finance';
import LessonPlanHelper from './components/LessonPlanHelper';
import AccountManagement from './components/AccountManagement';
import Profile from './components/Profile';
import Announcements from './components/Announcements';
import Calendar from './components/Calendar';
import Library from './components/Library';
import Message from './components/Message';
import Settings from './components/Settings';
import { 
    DashboardIcon, StudentsIcon, TeachersIcon, AttendanceIcon, FinanceIcon, 
    NoticeIcon, CalendarIcon, LibraryIcon, MessageIcon, ProfileIcon, 
    SettingsIcon, LogoutIcon, SearchIcon, NotificationIcon, MessageCircleIcon, 
    DownloadIcon, MenuIcon, SparklesIcon, UsersIcon
} from './components/icons';

const menuItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: DashboardIcon },
    { view: View.Teachers, label: 'Teachers', icon: TeachersIcon },
    { view: View.Students, label: 'Students', icon: StudentsIcon },
    { view: View.Attendance, label: 'Attendance', icon: AttendanceIcon },
    { view: View.Finance, label: 'Finance', icon: FinanceIcon },
    { view: View.Notice, label: 'Notice', icon: NoticeIcon },
    { view: View.Calendar, label: 'Calendar', icon: CalendarIcon },
    { view: View.Library, label: 'Library', icon: LibraryIcon },
    { view: View.Message, label: 'Message', icon: MessageIcon },
    { view: View.LessonPlan, label: 'Lesson Helper', icon: SparklesIcon },
];

const otherItems = [
    { view: View.Profile, label: 'Profile', icon: ProfileIcon },
    { view: View.Setting, label: 'Setting', icon: SettingsIcon },
    { view: View.AccountManagement, label: 'Accounts', icon: UsersIcon },
];

interface NavButtonProps {
    item: typeof menuItems[0];
    currentView: View;
    setView: (view: View) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ item, currentView, setView }) => {
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

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
    isOpen: boolean;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, onLogout }) => (
    <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-brand-sidebar border-r border-neutral-200 p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:inset-0`}>
        <div className="flex items-center space-x-3 p-3 mb-6">
            <h1 className="text-2xl font-bold text-neutral-800">SchoolHub</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
            <h2 className="px-3 text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Menu</h2>
            <nav className="space-y-2">
                {menuItems.map(item => (
                    <NavButton key={item.view} item={item} currentView={currentView} setView={setView} />
                ))}
            </nav>
            <DownloadAppCard />
            <h2 className="px-3 text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Other</h2>
             <nav className="space-y-2">
                {otherItems.map(item => (
                    <NavButton key={item.view} item={item} currentView={currentView} setView={setView} />
                ))}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 text-neutral-500 hover:bg-neutral-100"
                >
                    <LogoutIcon className="h-6 w-6 text-neutral-500" />
                    <span className="font-semibold text-neutral-700">Log out</span>
                </button>
            </nav>
        </div>
    </aside>
);

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
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
                <img src="https://i.pravatar.cc/150?img=5" alt="Linda Adora" className="w-10 h-10 rounded-full" />
                <div className="hidden md:block">
                    <p className="font-semibold text-sm">Linda Adora</p>
                    <p className="text-xs text-neutral-500">Admin</p>
                </div>
            </div>
        </div>
    </header>
);

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
    const navItems = [
        { view: View.Dashboard, icon: DashboardIcon },
        { view: View.Students, icon: StudentsIcon },
        { view: View.Teachers, icon: TeachersIcon },
        { view: View.Message, icon: MessageIcon },
        { view: View.Profile, icon: ProfileIcon },
    ];

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

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState<View>(View.Dashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Close sidebar when view changes on mobile
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [currentView]);
    
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setCurrentView(View.Dashboard);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const handleSetView = (view: View) => {
        setCurrentView(view);
    };

    const renderContent = () => {
        switch (currentView) {
            case View.Dashboard:
                return <Dashboard />;
            case View.Students:
                return <StudentList />;
            case View.Teachers:
                return <TeacherList />;
            case View.Attendance:
                return <Attendance />;
            case View.Finance:
                return <Finance />;
            case View.LessonPlan:
                return <LessonPlanHelper />;
            case View.AccountManagement:
                return <AccountManagement />;
            case View.Profile:
                return <Profile />;
            case View.Notice:
                return <Announcements />;
            case View.Calendar:
                 return <Calendar />;
            case View.Library:
                return <Library />;
            case View.Message:
                return <Message />;
            case View.Setting:
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen flex w-full bg-brand-bg">
            <Sidebar currentView={currentView} setView={handleSetView} isOpen={isSidebarOpen} onLogout={handleLogout} />
            
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-20 lg:hidden"></div>}

            <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
                    {renderContent()}
                </main>
                <Footer />
            </div>
            
            <BottomNav currentView={currentView} setView={handleSetView} />
        </div>
    );
};

export default App;