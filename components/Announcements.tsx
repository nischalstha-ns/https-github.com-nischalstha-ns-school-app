import React, { useState } from 'react';
import { Announcement } from '../types';
import { PlusIcon, DeleteIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import { useAppContext } from '../state/AppContext';

const AnnouncementModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (data: Omit<Announcement, 'id'>) => void; }> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, content, date: new Date().toISOString().split('T')[0] });
        setTitle('');
        setContent('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-lg font-bold text-neutral-800">New Announcement</h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-neutral-700">Content</label>
                        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={4} className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md"></textarea>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Post</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AnnouncementCard: React.FC<{ announcement: Announcement; onDelete: (id: string) => void }> = ({ announcement, onDelete }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary relative group">
        <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-neutral-800">{announcement.title}</h2>
            <span className="text-sm text-neutral-500 whitespace-nowrap">{new Date(announcement.date).toLocaleDateString()}</span>
        </div>
        <p className="mt-2 text-neutral-600">
            {announcement.content}
        </p>
         <button onClick={() => onDelete(announcement.id)} className="absolute top-2 right-2 p-1 bg-white rounded-full text-neutral-400 hover:text-accent-red hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
            <DeleteIcon className="w-5 h-5" />
        </button>
    </div>
);

const Announcements: React.FC = () => {
    const { announcements, isLoading, addAnnouncement, deleteAnnouncement, seedAllData } = useAppContext();
    const [isSeeding, setIsSeeding] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);

    const handleSave = async (data: Omit<Announcement, 'id'>) => {
        await addAnnouncement(data);
    };
    
    const handleDelete = (id: string) => {
        setAnnouncementToDelete(id);
        setIsConfirmModalOpen(true);
    };
    
    const confirmDelete = async () => {
        if(announcementToDelete) {
            await deleteAnnouncement(announcementToDelete);
        }
        setIsConfirmModalOpen(false);
        setAnnouncementToDelete(null);
    };

    const handleSeedDatabase = async () => {
        setIsSeeding(true);
        try {
            await seedAllData();
        } catch (e) {
            console.error("Failed to seed database:", e);
        } finally {
            setIsSeeding(false);
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-neutral-800">Announcements</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">
                    <PlusIcon className="w-5 h-5" />
                    New Announcement
                </button>
            </div>
             {!isLoading && announcements.length === 0 && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1">
                            <p className="font-bold">Database is Empty</p>
                            <p className="text-sm">Click the seed button to populate your database with initial announcements.</p>
                        </div>
                        <div className="ml-auto pl-3">
                             <button onClick={handleSeedDatabase} disabled={isSeeding} className="px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg hover:bg-yellow-500 disabled:bg-neutral-400 disabled:cursor-not-allowed">
                                {isSeeding ? 'Seeding...' : 'Seed Data'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isLoading ? (
                <div className="text-center p-8">Loading announcements...</div>
            ) : announcements.length === 0 && !isLoading ? (
                <div className="text-center p-8 bg-white rounded-lg">
                    <p className="text-neutral-500">No announcements posted yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {announcements.map(announcement => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} onDelete={handleDelete} />
                    ))}
                </div>
            )}
            <AnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
            <ConfirmationModal 
                isOpen={isConfirmModalOpen}
                title="Delete Announcement"
                message="Are you sure you want to delete this announcement?"
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmModalOpen(false)}
            />
        </div>
    );
};

export default Announcements;