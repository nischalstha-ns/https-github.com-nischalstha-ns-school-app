import React, { useState, useEffect } from 'react';
import { View } from './types';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import TeacherList from './components/TeacherList';
import Attendance from './components/Attendance';
import { 
    DashboardIcon, StudentsIcon, TeachersIcon, AttendanceIcon, FinanceIcon, 
    NoticeIcon, CalendarIcon, LibraryIcon, MessageIcon, ProfileIcon, 
    SettingsIcon, LogoutIcon, SearchIcon, NotificationIcon, MessageCircleIcon, 
    ChevronRightIcon, DownloadIcon, MenuIcon 
} from './components/icons';

const menuItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: DashboardIcon },
    { view: View.Teachers, label: 'Teachers', icon: TeachersIcon },
    { view: View.Students, label: 'Students', icon: StudentsIcon },
    { view: View.Attendance, label: 'Attendance', icon: AttendanceIcon },
    { view: View.Finance, label: 'Finance', icon: FinanceIcon, hasArrow: true },
    { view: View.Notice, label: 'Notice', icon: NoticeIcon },
    { view: View.Calendar, label: 'Calendar', icon: CalendarIcon },
    { view: View.Library, label: 'Library', icon: LibraryIcon },
    { view: View.Message, label: 'Message', icon: MessageIcon },
];

const otherItems = [
    { view: View.Profile, label: 'Profile', icon: ProfileIcon },
    { view: View.Setting, label: 'Setting', icon: SettingsIcon },
    { view: View.Logout, label: 'Log out', icon: LogoutIcon },
]

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
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                isActive 
                ? 'bg-brand-blue-light text-brand-blue' 
                : 'text-brand-text-light hover:bg-gray-100'
            }`}
        >
            <item.icon className={`h-6 w-6 ${isActive ? 'text-brand-blue' : 'text-brand-text-light'}`} />
            <span className={`font-medium ${isActive ? 'text-brand-blue' : 'text-brand-text-dark'}`}>{item.label}</span>
            {item.hasArrow && <ChevronRightIcon className="w-4 h-4 ml-auto" />}
        </button>
    );
};

const DownloadAppCard = () => (
    <div className="my-6 p-4 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-center">
        <h3 className="font-bold">Let's Manage Your Data Better In Your Hand</h3>
        <button className="mt-4 bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg flex items-center justify-center w-full">
            <DownloadIcon className="w-5 h-5 mr-2" />
            Download the App
        </button>
    </div>
);

const Sidebar: React.FC<{ currentView: View; setView: (view: View) => void; isOpen: boolean; }> = ({ currentView, setView, isOpen }) => (
    <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-brand-sidebar border-r border-brand-border p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:inset-0`}>
        <div className="flex items-center space-x-3 p-3 mb-6">
            <h1 className="text-2xl font-bold text-brand-text-dark">SchoolHub</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
            <h2 className="px-3 text-sm font-semibold text-brand-text-light uppercase tracking-wider mb-2">Menu</h2>
            <nav className="space-y-2">
                {menuItems.map(item => (
                    <NavButton key={item.view} item={item} currentView={currentView} setView={setView} />
                ))}
            </nav>
            <DownloadAppCard />
            <h2 className="px-3 text-sm font-semibold text-brand-text-light uppercase tracking-wider mb-2">Other</h2>
             <nav className="space-y-2">
                {otherItems.map(item => (
                    <NavButton key={item.view} item={item} currentView={currentView} setView={setView} />
                ))}
            </nav>
        </div>
    </aside>
);

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
    <header className="bg-brand-sidebar h-20 flex items-center justify-between px-4 sm:px-8 border-b border-brand-border sticky top-0 z-10">
        <div className="flex items-center">
            <button onClick={onMenuClick} className="lg:hidden mr-4 text-brand-text-dark">
                <MenuIcon className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="bg-brand-bg rounded-lg pl-10 pr-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
            </div>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-6">
            <button className="sm:hidden text-brand-text-light"><SearchIcon className="w-6 h-6"/></button>
            <button className="relative text-brand-text-light hover:text-brand-text-dark">
                <MessageCircleIcon className="w-6 h-6" />
            </button>
             <button className="relative text-brand-text-light hover:text-brand-text-dark">
                <NotificationIcon className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-brand-red rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
                <img src="https://i.pravatar.cc/150?img=5" alt="Linda Adora" className="w-10 h-10 rounded-full" />
                <div className="hidden md:block">
                    <p className="font-semibold text-sm">Linda Adora</p>
                    <p className="text-xs text-brand-text-light">Admin</p>
                </div>
            </div>
        </div>
    </header>
);

const Footer = () => (
    <footer className="px-4 sm:px-8 py-4 border-t border-brand-border text-xs sm:text-sm text-brand-text-light flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>📧 emailaddress@gmail.com</span>
            <span>📞 +62 123 456 78</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <a href="#" className="hover:text-brand-text-dark">Terms of Use</a>
            <a href="#" className="hover:text-brand-text-dark">Privacy Policy</a>
            <span>Copyright © Peterdraw</span>
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
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border flex justify-around p-2 z-20">
            {navItems.map(item => {
                const isActive = item.view === currentView;
                return (
                    <button key={item.view} onClick={() => setView(item.view)} className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${isActive ? 'text-brand-blue bg-brand-blue-light' : 'text-brand-text-light'}`}>
                        <item.icon className="w-6 h-6 mb-1" />
                    </button>
                )
            })}
        </nav>
    );
}

const Placeholder: React.FC<{title: string}> = ({title}) => (
    <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-dark">{title}</h1>
            <p className="text-brand-text-light mt-2">This page is under construction.</p>
        </div>
    </div>
);

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>(View.Dashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Close sidebar when view changes on mobile
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [currentView]);

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
                return <Placeholder title="Finance" />;
            case View.Notice:
                return <Placeholder title="Notice" />;
            case View.Calendar:
                 return <Placeholder title="Calendar" />;
            case View.Library:
                return <Placeholder title="Library" />;
            case View.Message:
                return <Placeholder title="Message" />;
            case View.Profile:
                return <Placeholder title="Profile" />;
            case View.Setting:
                return <Placeholder title="Settings" />;
            case View.Logout:
                return <Placeholder title="Logged Out" />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-brand-bg">
            <Sidebar currentView={currentView} setView={handleSetView} isOpen={isSidebarOpen} />
            
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