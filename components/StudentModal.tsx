import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types';
import { XIcon, UploadIcon } from './icons';
import { uploadImage } from '../services/cloudinaryService';

interface StudentModalProps {
    student: Student | null;
    onSave: (studentData: Omit<Student, 'id'> & { id?: string }) => void;
    onClose: () => void;
    isOpen: boolean;
    selectedClass: number | 'all';
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onSave, onClose, isOpen, selectedClass }) => {
    const getInitialFormData = (): Omit<Student, 'id'> => ({
        studentId: '',
        rollNo: 0,
        name: '',
        avatar: 'https://via.placeholder.com/150',
        class: selectedClass !== 'all' ? selectedClass : 1,
        section: 'A',
        gender: 'Male',
        dob: '',
        address: '',
        parentName: '',
        contact: '',
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        email: '',
        attendance: 100,
    });
    
    const [formData, setFormData] = useState<Omit<Student, 'id'>>(getInitialFormData());
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (student) {
            setFormData({
                studentId: student.studentId,
                rollNo: student.rollNo,
                name: student.name,
                avatar: student.avatar,
                class: student.class,
                section: student.section,
                gender: student.gender,
                dob: student.dob,
                address: student.address,
                parentName: student.parentName,
                contact: student.contact,
                admissionDate: student.admissionDate,
                status: student.status,
                email: student.email,
                attendance: student.attendance,
            });
        } else {
             setFormData({
                ...getInitialFormData(),
                studentId: `S-${Math.floor(1000 + Math.random() * 9000)}`,
            });
        }
        setImageFile(null); // Reset file on open
    }, [student, isOpen, selectedClass]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({
            ...prev,
            [name]: isNumber ? parseInt(value, 10) || 0 : value,
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
        
        onSave({ ...finalData, id: student?.id });
    };

    const inputStyles = "mt-1 block w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
    const labelStyles = "block text-sm font-medium text-neutral-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl relative max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-neutral-900">{student ? 'Edit Student' : 'Add New Student'}</h2>
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
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                           <label htmlFor="class" className={labelStyles}>Class</label>
                           <input type="number" name="class" id="class" value={formData.class} onChange={handleChange} min="-2" max="12" required className={inputStyles}/>
                        </div>
                         <div>
                           <label htmlFor="section" className={labelStyles}>Section</label>
                           <select name="section" id="section" value={formData.section} onChange={handleChange} className={inputStyles}>
                               <option value="A">A</option>
                               <option value="B">B</option>
                               <option value="C">C</option>
                           </select>
                        </div>
                        <div>
                            <label htmlFor="rollNo" className={labelStyles}>Roll No.</label>
                            <input type="number" name="rollNo" id="rollNo" value={formData.rollNo} onChange={handleChange} required className={inputStyles}/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="parentName" className={labelStyles}>Parent/Guardian Name</label>
                            <input type="text" name="parentName" id="parentName" value={formData.parentName} onChange={handleChange} required className={inputStyles}/>
                        </div>
                         <div>
                            <label htmlFor="contact" className={labelStyles}>Parent Contact</label>
                            <input type="tel" name="contact" id="contact" value={formData.contact} onChange={handleChange} required className={inputStyles}/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="gender" className={labelStyles}>Gender</label>
                            <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={inputStyles}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dob" className={labelStyles}>Date of Birth</label>
                            <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} required className={inputStyles}/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="address" className={labelStyles}>Address</label>
                        <textarea name="address" id="address" value={formData.address} onChange={handleChange} required className={inputStyles} rows={2}></textarea>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div>
                            <label htmlFor="admissionDate" className={labelStyles}>Admission Date</label>
                            <input type="date" name="admissionDate" id="admissionDate" value={formData.admissionDate} onChange={handleChange} required className={inputStyles}/>
                        </div>
                         <div>
                            <label htmlFor="status" className={labelStyles}>Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Graduated">Graduated</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="attendance" className={labelStyles}>Attendance (%)</label>
                            <input type="number" name="attendance" id="attendance" value={formData.attendance} onChange={handleChange} min="0" max="100" required className={inputStyles}/>
                        </div>
                    </div>
                </form>
                <div className="p-6 border-t bg-neutral-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-100 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-200">Cancel</button>
                    <button type="submit" onClick={handleSubmit} disabled={isUploading} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-sm disabled:bg-neutral-400">
                        {isUploading ? 'Uploading...' : 'Save Student'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentModal;