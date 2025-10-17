import React, { useState } from 'react';

const Toggle: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void; }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <span className="text-neutral-700">{label}</span>
        <button onClick={() => setEnabled(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-primary' : 'bg-neutral-300'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}/>
        </button>
    </div>
);


const Settings: React.FC = () => {
    const [emailNotifications, setEmailNotifications] = useState({
        announcements: true,
        summary: false,
        mentions: true,
    });
    
    const [pushNotifications, setPushNotifications] = useState({
        everything: true,
        messages: true,
        mentions: false,
    });
    
    const [theme, setTheme] = useState('light');

    const handleEmailToggle = (key: keyof typeof emailNotifications) => {
        setEmailNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePushToggle = (key: keyof typeof pushNotifications) => {
        setPushNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-neutral-800">Settings</h1>
            
            {/* Profile Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-neutral-800 border-b pb-4 mb-4">Profile</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">First Name</label>
                            <input type="text" defaultValue="Linda" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Last Name</label>
                            <input type="text" defaultValue="Adora" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Email Address</label>
                        <input type="email" defaultValue="linda.adora@school.edu" disabled className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md bg-neutral-100 cursor-not-allowed"/>
                    </div>
                     <div className="flex justify-end">
                        <button className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">Save Profile</button>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-neutral-800 border-b pb-4 mb-4">Notifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-neutral-800 mb-2">Email Notifications</h4>
                        <div className="space-y-3">
                            <Toggle label="New Announcements" enabled={emailNotifications.announcements} setEnabled={() => handleEmailToggle('announcements')} />
                            <Toggle label="Weekly Summary" enabled={emailNotifications.summary} setEnabled={() => handleEmailToggle('summary')} />
                            <Toggle label="Mentions" enabled={emailNotifications.mentions} setEnabled={() => handleEmailToggle('mentions')} />
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-neutral-800 mb-2">Push Notifications</h4>
                         <div className="space-y-3">
                            <Toggle label="Everything" enabled={pushNotifications.everything} setEnabled={() => handlePushToggle('everything')} />
                            <Toggle label="Direct Messages" enabled={pushNotifications.messages} setEnabled={() => handlePushToggle('messages')} />
                            <Toggle label="Mentions" enabled={pushNotifications.mentions} setEnabled={() => handlePushToggle('mentions')} />
                        </div>
                    </div>
                </div>
            </div>
            
             {/* Theme Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-neutral-800 border-b pb-4 mb-4">Appearance</h3>
                <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">Theme</h4>
                    <div className="flex gap-4">
                        <button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-lg border-2 ${theme === 'light' ? 'border-primary bg-primary-light' : 'border-transparent bg-neutral-100'}`}>Light</button>
                        <button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-lg border-2 ${theme === 'dark' ? 'border-primary bg-primary-light' : 'border-transparent bg-neutral-100'}`}>Dark</button>
                    </div>
                    <p className="text-sm text-neutral-500 mt-2">Dark mode is currently a UI demonstration and not fully implemented.</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
