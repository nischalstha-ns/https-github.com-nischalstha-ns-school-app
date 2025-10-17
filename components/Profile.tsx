import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserAccount } from '../types';
import { getAdminProfile, updateUser } from '../services/firestoreService';
import { uploadImage } from '../services/cloudinaryService';
import { EditIcon } from './icons';

const Profile: React.FC = () => {
    // For now, we are simulating that 'Linda Adora' is the logged-in admin.
    // In a real app, you would get the user's email or ID from your authentication state.
    const ADMIN_EMAIL = 'linda.adora@school.edu';

    const [profile, setProfile] = useState<UserAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [fullName, setFullName] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const adminProfile = await getAdminProfile(ADMIN_EMAIL);
            setProfile(adminProfile);
            if (adminProfile) {
                setFullName(adminProfile.fullName);
            }
        } catch (error) {
            console.error("Error fetching admin profile:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(e.target.value);
    };

    const handleNameSave = async () => {
        if (!profile || fullName === profile.fullName) return;
        setIsSaving(true);
        try {
            await updateUser(profile.id, { fullName });
            // Optimistically update UI or re-fetch
            setProfile(prev => prev ? { ...prev, fullName } : null);
            alert("Profile name updated successfully!");
        } catch (error) {
            console.error("Error updating name:", error);
            alert("Failed to update name.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handlePasswordChange = () => {
        // This is a placeholder. Real password changes require Firebase Authentication.
        // For example: `const auth = getAuth(); updatePassword(auth.currentUser, newPassword);`
        alert("Password updated successfully! (Simulation)");
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && profile) {
            const file = e.target.files[0];
            setIsUploading(true);
            try {
                const downloadURL = await uploadImage(file);
                await updateUser(profile.id, { avatar: downloadURL });
                setProfile(prev => prev ? { ...prev, avatar: downloadURL } : null);
                alert("Profile picture updated successfully!");
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Failed to upload image.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="text-center p-8 text-red-500">Could not load admin profile. Ensure the user '{ADMIN_EMAIL}' exists in the 'users' collection.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-neutral-800">My Profile</h1>
            
            {/* Profile Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <img 
                            src={profile.avatar || `https://via.placeholder.com/150`} 
                            alt={profile.fullName} 
                            className="w-28 h-28 rounded-full object-cover border-4 border-primary-light"
                        />
                         <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-transform transform hover:scale-110"
                            aria-label="Change profile picture"
                         >
                            {isUploading ? 
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                : <EditIcon className="w-5 h-5"/>
                            }
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden"/>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-bold text-neutral-900">{profile.fullName}</h2>
                        <p className="text-neutral-500">{profile.role}</p>
                    </div>
                </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-neutral-800 border-b pb-4 mb-4">Personal Information</h3>
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700">Full Name</label>
                        <input type="text" id="fullName" value={fullName} onChange={handleNameChange} className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
                        <input type="email" id="email" value={profile.email} disabled className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm bg-neutral-100 text-neutral-500 cursor-not-allowed"/>
                    </div>
                     <div className="flex justify-end">
                        <button onClick={handleNameSave} disabled={isSaving || fullName === profile.fullName} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:bg-neutral-400">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h3 className="text-xl font-semibold text-neutral-800 border-b pb-4 mb-4">Change Password</h3>
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Current Password</label>
                        <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700">New Password</label>
                        <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div className="flex justify-end">
                        <button onClick={handlePasswordChange} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">
                            Update Password
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Profile;