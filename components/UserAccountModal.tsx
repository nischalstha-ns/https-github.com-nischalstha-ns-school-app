import React, { useState, useEffect } from 'react';
import { UserAccount, UserRole } from '../types';
import { XIcon } from './icons';

interface UserAccountModalProps {
    user: UserAccount | null;
    onSave: (userData: Omit<UserAccount, 'id'> & { id?: string }) => void;
    onClose: () => void;
    isOpen: boolean;
}

const UserAccountModal: React.FC<UserAccountModalProps> = ({ user, onSave, onClose, isOpen }) => {
    const getInitialFormData = (): Omit<UserAccount, 'id'> => ({
        fullName: '',
        email: '',
        password: '',
        role: UserRole.Student,
        status: 'Active',
        context: '',
    });

    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (user) {
            setFormData({ ...user, password: '', context: user.context || '' }); // Don't pre-fill password
        } else {
            setFormData(getInitialFormData());
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: user?.id });
    };

    const inputStyles = "mt-1 block w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
    const labelStyles = "block text-sm font-medium text-neutral-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-neutral-900">{user ? 'Edit User Account' : 'Create New User Account'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="fullName" className={labelStyles}>Full Name</label>
                        <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelStyles}>Email / Username</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="password" className={labelStyles}>Password</label>
                        <input type="password" name="password" id="password" value={formData.password || ''} onChange={handleChange} placeholder={user ? 'Leave blank to keep unchanged' : ''} required={!user} className={inputStyles} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="role" className={labelStyles}>Role</label>
                            <select name="role" id="role" value={formData.role} onChange={handleChange} className={inputStyles}>
                                {Object.values(UserRole).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className={labelStyles}>Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="context" className={labelStyles}>Class / Department</label>
                        <input type="text" name="context" id="context" value={formData.context || ''} onChange={handleChange} placeholder="e.g., Class 10 A or Mathematics" className={inputStyles} />
                    </div>
                </form>
                <div className="p-6 border-t bg-neutral-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-100 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-200">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-sm">Save User</button>
                </div>
            </div>
        </div>
    );
};

export default UserAccountModal;