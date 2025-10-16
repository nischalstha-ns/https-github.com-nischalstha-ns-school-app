import React from 'react';
import { ANNOUNCEMENTS } from '../constants';
import { Announcement } from '../types';

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-sky-500">
        <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-slate-800">{announcement.title}</h2>
            <span className="text-sm text-slate-500 whitespace-nowrap">{new Date(announcement.date).toLocaleDateString()}</span>
        </div>
        <p className="mt-2 text-slate-600">
            {announcement.content}
        </p>
    </div>
);

const Announcements: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Announcements</h1>
            <div className="space-y-6">
                {ANNOUNCEMENTS.map(announcement => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
            </div>
        </div>
    );
};

export default Announcements;
