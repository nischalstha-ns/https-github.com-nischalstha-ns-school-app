import React, { useState, useEffect, useRef } from 'react';
import { Teacher } from '../types';
import { XIcon } from './icons';
import { uploadImage } from '../services/cloudinaryService';

interface TeacherModalProps {
    teacher: Teacher | null;
    onSave: (teacherData: Omit<Teacher, 'id' | 'assignedClasses'> & { id?: string; assignedClasses: string }) => void;
    onClose: () => void;
    isOpen: boolean;
}

const TeacherModal: React.FC<TeacherModalProps> = ({ teacher, onSave, onClose, isOpen }) => {
    const getInitialFormData = () => ({
        teacherId: `T-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name: '',
        avatar: 'https://via.placeholder.com/150',
        email: '',
        phone: '',
        department: '',
        assignedClasses: '',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active' as Teacher['status'],
        yearsOfExperience: 0,
    });

    const [formData, setFormData] = useState(getInitialFormData());
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (teacher) {
            setFormData({
                teacherId: teacher.teacherId,
                name: teacher.name,
                avatar: teacher.avatar,
                email: teacher.email,
                phone: teacher.phone,
                department: teacher.department,
                assignedClasses: teacher.assignedClasses.join(', '),
                joiningDate: teacher.joiningDate,
                status: teacher.status,
                yearsOfExperience: teacher.yearsOfExperience,
            });
        } else {
            setFormData(getInitialFormData());
        }
        setImageFile(null);
    }, [teacher, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({ ...prev, avatar: event.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let finalData = { ...formData };
        
        if (imageFile) {
            setIsUploading(true);
            try {
                const imageUrl = await uploadImage(imageFile);
                finalData.avatar = imageUrl;
            } catch (error) {
                alert("Image upload failed. Please try again.");
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        onSave({ ...finalData, id: teacher?.id });
    };

    const inputStyles = "mt-1 block w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const labelStyles = "block text-sm font-medium text-gray-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">{teacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="flex items-center gap-4">
                        <img src={formData.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover bg-neutral-200" />
                        <div>
                            <label className={labelStyles}>Profile Picture</label>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 text-sm font-semibold text-primary hover:underline">
                                Upload Image
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className={labelStyles}>Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputStyles}/>
                        </div>
                        <div>
                            <label htmlFor="email" className={labelStyles}>Email Address</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputStyles}/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="phone" className={labelStyles}>Phone Number</label>
                           <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className={inputStyles}/>
                        </div>
                        <div>
                            <label htmlFor="department" className={labelStyles}>Department</label>
                            <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} required className={inputStyles}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="assignedClasses" className={labelStyles}>Assigned Classes (comma-separated)</label>
                            <input type="text" name="assignedClasses" id="assignedClasses" value={formData.assignedClasses} onChange={handleChange} className={inputStyles}/>
                        </div>
                         <div>
                            <label htmlFor="yearsOfExperience" className={labelStyles}>Years of Experience</label>
                            <input type="number" name="yearsOfExperience" id="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} min="0" required className={inputStyles}/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="joiningDate" className={labelStyles}>Joining Date</label>
                            <input type="date" name="joiningDate" id="joiningDate" value={formData.joiningDate} onChange={handleChange} required className={inputStyles}/>
                        </div>
                        <div>
                            <label htmlFor="status" className={labelStyles}>Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Retired">Retired</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">Cancel</button>
                    <button type="button" onClick={handleSubmit} disabled={isUploading} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm disabled:bg-neutral-400">
                        {isUploading ? 'Uploading...' : 'Save Teacher'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherModal;